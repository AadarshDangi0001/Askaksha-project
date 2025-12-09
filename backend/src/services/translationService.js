const axios = require('axios');

class TranslationService {
  constructor() {
    this.baseURL = process.env.TRANSLATION_API_URL || 'http://localhost:5001';
  }

  /**
   * Detect language of the text
   */
  async detectLanguage(text) {
    try {
      const response = await axios.post(`${this.baseURL}/detect-language`, {
        text: text
      });
      return response.data.detected_language || 'en';
    } catch (error) {
      console.error('Language detection error:', error.message);
      return 'en'; // Default to English on error
    }
  }

  /**
   * Translate user input from native language to English
   */
  async translateToEnglish(text) {
    try {
      // First detect if translation is needed
      const response = await axios.post(`${this.baseURL}/translate/to-english`, {
        text: text
      });

      return {
        originalText: response.data.original_text,
        translatedText: response.data.translated_text,
        detectedLanguage: response.data.detected_language,
        isEnglish: response.data.is_english
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
   * Translate AI response from English to user's native language
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

      const response = await axios.post(`${this.baseURL}/translate/to-native`, {
        text: text,
        target_language: targetLanguage
      });

      return {
        originalText: response.data.original_text,
        translatedText: response.data.translated_text,
        targetLanguage: response.data.target_language
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
        targetLang = await this.detectLanguage(userInput);
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
