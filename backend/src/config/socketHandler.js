const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Message = require("../models/Message");
const collegeService = require("../services/collegeService");
const geminiService = require("../services/geminiService");
const vectorService = require("../services/vectorService");
const piiMask = require("../middlewares/piiMask");
const translationService = require("../services/translationService");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("student-message", async (messagePayload) => {
      let parsedPayload;

      try {
        // Parse payload
        if (typeof messagePayload === "string") {
          parsedPayload = JSON.parse(messagePayload);
        } else {
          parsedPayload = messagePayload;
        }

        const { content, chat, token, fileData, mimeType, fileName } = parsedPayload;

        // Step 1: Translate user input to English (if not already English)
        const translationResult = await translationService.translateToEnglish(content);
        const englishContent = translationResult.translatedText;
        const detectedLanguage = translationResult.detectedLanguage;
        
        console.log(`User language detected: ${detectedLanguage}`);
        if (detectedLanguage !== 'en') {
          console.log(`Translated "${content}" -> "${englishContent}"`);
        }

        // Mask PII in user message before processing
        const maskedContent = piiMask(englishContent);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.student.id);

        if (!student) {
          socket.emit("chat-response", {
            error: true,
            message: "Authentication failed"
          });
          return;
        }

        // Create user message and generate vectors in parallel
        const userMessage = fileData 
          ? `${maskedContent}\n[Attached file: ${fileName}]`
          : maskedContent;

        const [message, vectors] = await Promise.all([
          Message.create({
            user: student._id,
            chat: chat,
            content: userMessage,
            role: "user",
          }),
          vectorService.generateVector(maskedContent),
        ]);

        // Store message in vector memory
        vectorService.createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: chat,
            user: student._id.toString(),
            text: maskedContent,
          },
        });

        // If file is attached, analyze it first
        let fileAnalysis = "";
        if (fileData && mimeType) {
          try {
            console.log(`Processing file upload: ${mimeType}, Size: ${fileData.length} bytes`);
            
            // Validate base64 data
            if (!fileData || fileData.length === 0) {
              throw new Error("File data is empty");
            }

            // Check if it's valid base64
            const base64Regex = /^[A-Za-z0-9+/=]+$/;
            if (!base64Regex.test(fileData)) {
              throw new Error("Invalid file data format");
            }
            
            // Enhanced prompt based on file type
            let analysisPrompt;
            if (mimeType.includes('pdf')) {
              analysisPrompt = `You are analyzing a PDF document. Please:
1. Extract and summarize the main content
2. Identify key points, headings, and sections
3. Note any important data, figures, or tables
4. Provide a comprehensive but concise summary
5. If there are specific questions in the user's message, focus on answering those

Provide the analysis in a clear, structured format.`;
            } else if (mimeType.includes('image')) {
              analysisPrompt = `You are analyzing an image. Please:
1. Describe what you see in the image
2. Identify any text, diagrams, or charts
3. Extract key information if it's a document/screenshot
4. If there are specific questions in the user's message, focus on answering those

Provide the analysis in a clear format.`;
            } else {
              analysisPrompt = `Analyze this file and provide a comprehensive summary of its content. Focus on key information and important details.`;
            }
            
            fileAnalysis = await geminiService.analyzeFile(fileData, mimeType, analysisPrompt);
            console.log("File analysis completed successfully");
          } catch (error) {
            console.error("File analysis error:", error.message);
            fileAnalysis = `⚠️ File Analysis Error: ${error.message}`;
          }
        }

        // Query similar memories and get chat history in parallel
        const [longTermMemory, shortTermMemory] = await Promise.all([
          // Long-term memory: Retrieve ALL relevant past conversations from Pinecone
          vectorService.queryMemory({
            queryVector: vectors,
            limit: 10,
            metadata: {
              user: { $eq: student._id.toString() }
            },
          }),
          // Short-term memory: Last 5 messages from current chat session in MongoDB
          Message
            .find({ chat: chat, user: student._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
            .then((messages) => messages.reverse()),
        ]);

        console.log("Long-term memory (Pinecone):", longTermMemory.length, "messages");
        console.log("Short-term memory (MongoDB):", shortTermMemory.length, "messages");

        // Build short-term memory from recent 5 chat messages
        const shortTermContext = shortTermMemory.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        // Build long-term memory from all relevant past conversations (Pinecone vectors)
        const longTermContext = longTermMemory.length > 0 ? [
          {
            role: "user",
            parts: [
              {
                text: `LONG-TERM MEMORY (Previous conversations from vector database):
${longTermMemory.map((item, idx) => `${idx + 1}. ${item.metadata.text}`).join("\n")}

Use this complete conversation history to provide context-aware responses and remember what the user discussed before.
`,
              },
            ],
          },
        ] : [];

        // Get college data for context
        const college = await collegeService.getCollegeByCode(student.collegeCode, Admin);

        if (!college) {
          socket.emit("chat-response", {
            error: false,
            message: "I apologize, but the college information is not available yet. Please contact your administrator."
          });
          return;
        }

        // Build college context
        const collegeContext = geminiService.buildCollegeContext(college);
        
        // Add file analysis to context if available
        const fileContext = fileAnalysis ? `\n\nFile Analysis Result:\n${fileAnalysis}\n\nUse this file analysis to answer the user's question about the document.` : "";
        
        // System instruction
        const systemInstruction = [
          {
            role: "user",
            parts: [{ text: collegeContext + fileContext }],
          },
        ];

        // Combine all context: system instruction + long-term memory + short-term memory
        const fullHistory = [
          ...systemInstruction,
          ...longTermContext,
          ...shortTermContext,
        ];

        // Generate AI response
        const result = await geminiService.generateContentWithHistory(fullHistory);
        
        // Step 2: Translate AI response back to user's native language
        const translatedResponse = await translationService.translateToNative(result, detectedLanguage);
        const finalResponse = translatedResponse.translatedText;
        
        if (detectedLanguage !== 'en') {
          console.log(`Translating response to ${detectedLanguage}`);
        }
        
        // Don't mask AI responses - they contain college contact info that should be visible
        // Only mask if the response contains user-shared PII that was echoed back

        // Send response to client
        socket.emit("chat-response", {
          error: false,
          message: finalResponse,
          chat: chat,
          detectedLanguage: detectedLanguage,
          originalMessage: detectedLanguage !== 'en' ? result : undefined
        });

        // Save AI response and generate vectors
        // Store the English version for vector search, but include translated version for user history
        const [responseMessage, responseVectors] = await Promise.all([
          Message.create({
            user: student._id,
            chat: chat,
            content: finalResponse, // Store translated response for user
            role: "model",
          }),
          vectorService.generateVector(result), // Use English version for vectors
        ]);

        // Store AI response in vector memory
        await vectorService.createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: chat,
            user: student._id.toString(),
            text: result,
          },
        });

      } catch (error) {
        console.error("Error processing AI message:", error);
        
        // Determine appropriate error message
        let errorMessage = "I'm sorry, I cannot help with this right now. Please contact support for assistance.";
        
        if (error.message?.includes('QUOTA_EXCEEDED')) {
          errorMessage = error.message.replace('QUOTA_EXCEEDED: ', '');
        } else if (error.message?.includes('API_KEY_ERROR')) {
          errorMessage = error.message.replace('API_KEY_ERROR: ', '');
        } else if (error.message?.includes('AI_ERROR')) {
          errorMessage = error.message.replace('AI_ERROR: ', '');
        }
        
        socket.emit("chat-response", {
          error: true,
          message: errorMessage,
          chat: parsedPayload?.chat || messagePayload?.chat,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
