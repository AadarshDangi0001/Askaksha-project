require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const QRCode = require("qrcode");
const geminiService = require("../services/geminiService");
const translationService = require("../services/translationService");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Generate message using Gemini API with translation support
async function generateMessage(userMessage, retries = 0) {
  const maxRetries = 3;
  
  try {
    // Step 1: Translate user input to English if needed
    const translationResult = await translationService.translateToEnglish(userMessage);
    const englishMessage = translationResult.translatedText;
    const detectedLanguage = translationResult.detectedLanguage;
    
    console.log(`[WhatsApp Bot] Detected language: ${detectedLanguage}`);
    if (detectedLanguage !== 'en') {
      console.log(`[WhatsApp Bot] Translated: "${userMessage}" -> "${englishMessage}"`);
    }

    // Step 2: Generate AI response in English
    const prompt =
      `You are AskKaksha, an intelligent educational AI assistant for WhatsApp.\n` +
      `User message: """${englishMessage}"""\n\n` +
      `Provide a helpful, clear, and friendly response. Keep it concise (2-3 sentences).\n` +
      `If it's about education, studies, or learning - give detailed help.\n` +
      `Be supportive and encouraging.`;

    const result = await model.generateContent(prompt);
    const englishResponse = result.response.text() || "Sorry, I'm having some technical issues right now 😅";
    
    // Step 3: Translate response back to user's language
    const translatedResponse = await translationService.translateToNative(englishResponse.trim(), detectedLanguage);
    
    if (detectedLanguage !== 'en') {
      console.log(`[WhatsApp Bot] Response translated to ${detectedLanguage}`);
    }
    
    return translatedResponse.translatedText;
  } catch (err) {
    console.error("[WhatsApp Bot] Error:", err.message);
    
    // Handle quota exceeded errors 
    if (err.status === 429 || err.code === 429) {
      if (retries < maxRetries) {
        const retryDelay = 35000; // 35 seconds
        console.log(`[WhatsApp Bot] Quota exceeded, retrying in ${retryDelay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return generateMessage(userMessage, retries + 1);
      }
      // After max retries, throw the error so the caller can handle it
      throw err;
    }
    
    // For other errors, throw immediately
    throw err;
  }
}

// Generate QR Code with error handling
async function generateQRCode(data) {
  try {
    if (!data || typeof data !== "string") {
      throw new Error("Invalid QR data");
    }
    
    const qrCode = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    
    return qrCode;
  } catch (err) {
    throw new Error(`QR Code generation failed: ${err.message}`);
  }
}

module.exports = {
  generateMessage,
  generateQRCode,
};