const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateResponse(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return response;
    } catch (error) {
      console.error("Gemini AI error:", error);
      
      // Check for specific error types
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw new Error("QUOTA_EXCEEDED: Sorry, I've reached my daily limit. Please contact support for immediate assistance.");
      } else if (error.message?.includes('API key')) {
        throw new Error("API_KEY_ERROR: Sorry, I'm unable to process your request. Please contact support.");
      } else {
        throw new Error("AI_ERROR: Sorry, I cannot help with this right now. Please reach out to our support team.");
      }
    }
  }

  async generateContentWithHistory(history) {
    try {
      const result = await this.model.generateContent({
        contents: history
      });
      const response = result.response.text();
      return response;
    } catch (error) {
      console.error("Gemini AI error:", error);
      
      // Check for specific error types
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw new Error("QUOTA_EXCEEDED: Sorry, I've reached my daily limit. Please contact support for immediate assistance.");
      } else if (error.message?.includes('API key')) {
        throw new Error("API_KEY_ERROR: Sorry, I'm unable to process your request. Please contact support.");
      } else {
        throw new Error("AI_ERROR: Sorry, I cannot help with this right now. Please reach out to our support team.");
      }
    }
  }

  async analyzeFile(fileData, mimeType, prompt) {
    try {
      console.log(`Analyzing file with mimeType: ${mimeType}`);
      
      // Gemini 1.5 Flash supports PDFs and images
      const visionModel = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash"
      });
      
      // Prepare the file part
      const filePart = {
        inlineData: {
          data: fileData,
          mimeType: mimeType
        }
      };

      // Generate content with file and prompt
      const result = await visionModel.generateContent([prompt, filePart]);
      
      // Check if response is blocked
      if (result.response.promptFeedback?.blockReason) {
        console.error("Content blocked:", result.response.promptFeedback.blockReason);
        throw new Error(`Content blocked: ${result.response.promptFeedback.blockReason}`);
      }

      const response = await result.response.text();
      console.log("File analysis successful");
      return response;
    } catch (error) {
      console.error("Gemini file analysis error:", error.message);
      console.error("Error details:", error);
      
      // Provide more specific error messages
      if (error.message?.includes('API key')) {
        throw new Error("Invalid or expired API key. Please check your Gemini API key.");
      } else if (error.message?.includes('quota')) {
        throw new Error("API quota exceeded. Please try again later.");
      } else if (error.message?.includes('RECITATION') || error.message?.includes('SAFETY')) {
        throw new Error("Content was blocked by safety filters. Please try a different file.");
      } else if (mimeType === 'application/pdf') {
        throw new Error("Failed to analyze PDF. The file might be too large, corrupted, or contain unsupported content.");
      } else {
        throw new Error(`Failed to analyze file: ${error.message || 'Unknown error'}`);
      }
    }
  }

  buildCollegeContext(college) {
    const contactInfo = college.contactInfo?.phone || college.contactInfo?.email || college.contactInfo?.admissionOffice;
    const fallbackContact = contactInfo 
      ? `\n\n📞 For more information, contact us at: ${college.contactInfo?.phone ? `Phone: ${college.contactInfo.phone}` : ''}${college.contactInfo?.email ? `, Email: ${college.contactInfo.email}` : ''}`
      : '';

    return `
You are a helpful college assistant chatbot for ${college.name || "our college"}. 

IMPORTANT INSTRUCTIONS:
1. You have access to the conversation history - USE IT to remember what the user asked before
2. When user asks "what was my last question?" or "what did I ask before?", refer to the previous conversation context provided
3. Be conversational and remember the context throughout the chat
4. You can only answer questions about this specific college
5. If you don't have information about something, politely say you don't have that information and provide the contact details below

College Information:
- Name: ${college.name || "Not specified"}
- Address: ${college.address || "Not specified"}
- About: ${college.about || "Not specified"}
- Website: ${college.website || "Not specified"}
- Established: ${college.establishedYear || "Not specified"}
- Accreditation: ${college.accreditation || "Not specified"}

Courses Offered:
${
  college.courses
    ?.map((c) => `- ${c.name} (${c.duration}): ${c.description}`)
    .join("\n") || "Not specified"
}

Departments:
${college.departments?.join(", ") || "Not specified"}

Fees Structure:
- Tuition Fee: ${college.fees?.tuitionFee || "Not specified"}
- Hostel Fee: ${college.fees?.hostelFee || "Not specified"}
- Exam Fee: ${college.fees?.examFee || "Not specified"}
- Other Fees: ${college.fees?.otherFees || "Not specified"}

Scholarships:
${
  college.scholarships
    ?.map(
      (s) =>
        `- ${s.name}: ${s.amount} (Eligibility: ${s.eligibility}, Deadline: ${s.deadline})`
    )
    .join("\n") || "No scholarships listed"
}

Important Deadlines:
${
  college.deadlines
    ?.map((d) => `- ${d.event} on ${d.date}: ${d.description}`)
    .join("\n") || "No deadlines listed"
}

Facilities:
${college.facilities?.join(", ") || "Not specified"}

Contact Information:
- Email: ${college.contactInfo?.email || "Not specified"}
- Phone: ${college.contactInfo?.phone || "Not specified"}
- Admission Office: ${college.contactInfo?.admissionOffice || "Not specified"}

Placement Details:
- Average Package: ${college.placement?.averagePackage || "Not specified"}
- Placement Rate: ${college.placement?.placementRate || "Not specified"}
- Top Recruiters: ${
      college.placement?.topRecruiters?.join(", ") || "Not specified"
    }

FALLBACK INSTRUCTION:
When you don't have specific information to answer a question, use this exact format:
"I don't have specific information about that at the moment. ${fallbackContact || 'Please contact the college administration for more details.'}"

Answer questions based on this information and the conversation history. Be friendly, concise, and remember previous interactions.
    `;
  }
}

module.exports = new GeminiService();
