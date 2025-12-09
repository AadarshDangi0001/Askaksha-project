const { GoogleGenerativeAI } = require("@google/generative-ai");

class TranslationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  /**
   * Detect language using Gemini
   */
  async detectLanguage(text) {
    try {
      const prompt = `Detect the language of this text and respond with ONLY the ISO 639-1 language code (e.g., 'en', 'hi', 'ta', 'bn', etc.):

Text: "${text}"

Respond with ONLY the 2-letter language code, nothing else.`;

      const result = await this.model.generateContent(prompt);
      const detectedLang = result.response.text().trim().toLowerCase();
      
      // Validate it's a 2-letter code
      if (detectedLang.length === 2) {
        return detectedLang;
      }
      
      return 'en'; // Default to English if invalid
    } catch (error) {
      console.error('Language detection error:', error.message);
      return 'en'; // Default to English on error
    }
  }

  /**
   * Translate user input from native language to English using Gemini
   */
  async translateToEnglish(text) {
    try {
      // First detect language
      const detectedLanguage = await this.detectLanguage(text);
      
      // If already English, return as is
      if (detectedLanguage === 'en') {
        return {
          originalText: text,
          translatedText: text,
          detectedLanguage: 'en',
          isEnglish: true
        };
      }

      // Translate to English
      const prompt = `Translate this text to English. Respond with ONLY the translated text, no explanations:

"${text}"`;

      const result = await this.model.generateContent(prompt);
      const translatedText = result.response.text().trim();

      return {
        originalText: text,
        translatedText: translatedText,
        detectedLanguage: detectedLanguage,
        isEnglish: false
      };
    } catch (error) {
      console.error('Translation to English error:', error.message);
      // Return original text on error
      return {
        originalText: text,
        translatedText: text,
        detectedLanguage: 'en',
        isEnglish: true
      };
    }
  }

  /**
   * Translate AI response from English to user's native language using Gemini
   */
  async translateToNative(text, targetLanguage) {
    try {
      // If target is English, no translation needed
      if (targetLanguage === 'en') {
        return {
          originalText: text,
          translatedText: text,
          targetLanguage: 'en'
        };
      }

      // Map common language codes to full names
      const languageMap = {
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'bn': 'Bengali',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'or': 'Odia',
        'as': 'Assamese',
        'ur': 'Urdu'
      };

      const languageName = languageMap[targetLanguage] || targetLanguage;

      const prompt = `Translate this English text to ${languageName}. Respond with ONLY the translated text, maintain the same tone and meaning:

"${text}"`;

      const result = await this.model.generateContent(prompt);
      const translatedText = result.response.text().trim();

      return {
        originalText: text,
        translatedText: translatedText,
        targetLanguage: targetLanguage
      };
    } catch (error) {
      console.error('Translation to native error:', error.message);
      // Return original text on error
      return {
        originalText: text,
        translatedText: text,
        targetLanguage: targetLanguage
      };
    }
  }

  /**
   * Full translation pipeline
   * 1. User input (native) -> English
   * 2. Process with AI
   * 3. AI response (English) -> Native
   */
  async processWithTranslation(userInput, aiResponse, detectedLanguage = null) {
    try {
      let targetLang = detectedLanguage;

      // If language not provided, detect it
      if (!targetLang) {
        const result = await this.translateToEnglish(userInput);
        targetLang = result.detectedLanguage;
      }

      // Translate AI response to native language
      const translatedResponse = await this.translateToNative(aiResponse, targetLang);

      return {
        detectedLanguage: targetLang,
        originalResponse: aiResponse,
        translatedResponse: translatedResponse.translatedText
      };
    } catch (error) {
      console.error('Translation pipeline error:', error.message);
      return {
        detectedLanguage: 'en',
        originalResponse: aiResponse,
        translatedResponse: aiResponse
      };
    }
  }
}

module.exports = new TranslationService();
