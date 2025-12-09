// Test script for Gemini-based translation service
require('dotenv').config();
const translationService = require('./src/services/translationService');

async function testTranslation() {
  console.log('🧪 Testing Gemini Translation Service\n');
  console.log('=' .repeat(60));

  // Test 1: Language Detection
  console.log('\n📝 Test 1: Language Detection');
  console.log('-'.repeat(60));
  
  const testTexts = [
    { text: 'Hello, how are you?', expected: 'en' },
    { text: 'नमस्ते, आप कैसे हैं?', expected: 'hi' },
    { text: 'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?', expected: 'ta' }
  ];

  for (const test of testTexts) {
    try {
      const detected = await translationService.detectLanguage(test.text);
      console.log(`Text: "${test.text}"`);
      console.log(`Detected: ${detected} | Expected: ${test.expected}`);
      console.log(`Status: ${detected === test.expected ? '✅ PASS' : '⚠️  FAIL'}\n`);
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}\n`);
    }
  }

  // Test 2: Translation to English
  console.log('\n📝 Test 2: Translation to English');
  console.log('-'.repeat(60));
  
  const hindiText = 'मुझे प्रवेश के बारे में जानकारी चाहिए';
  try {
    const result = await translationService.translateToEnglish(hindiText);
    console.log(`Original (Hindi): "${result.originalText}"`);
    console.log(`Translated (English): "${result.translatedText}"`);
    console.log(`Detected Language: ${result.detectedLanguage}`);
    console.log(`Is English: ${result.isEnglish}`);
    console.log(`Status: ${result.translatedText ? '✅ PASS' : '❌ FAIL'}\n`);
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  // Test 3: Translation to Native Language
  console.log('\n📝 Test 3: Translation to Native Language (Hindi)');
  console.log('-'.repeat(60));
  
  const englishText = 'Admissions are open from June to August. Please visit our office with required documents.';
  try {
    const result = await translationService.translateToNative(englishText, 'hi');
    console.log(`Original (English): "${result.originalText}"`);
    console.log(`Translated (Hindi): "${result.translatedText}"`);
    console.log(`Target Language: ${result.targetLanguage}`);
    console.log(`Status: ${result.translatedText ? '✅ PASS' : '❌ FAIL'}\n`);
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  // Test 4: Full Pipeline
  console.log('\n📝 Test 4: Full Translation Pipeline');
  console.log('-'.repeat(60));
  
  const userInput = 'கல்லூரி நூலகம் எந்த நேரத்தில் திறக்கப்படுகிறது?'; // Tamil: "What time does college library open?"
  const aiResponse = 'The college library is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends.';
  
  try {
    const result = await translationService.processWithTranslation(userInput, aiResponse);
    console.log(`User Input (Tamil): "${userInput}"`);
    console.log(`Detected Language: ${result.detectedLanguage}`);
    console.log(`AI Response (English): "${result.originalResponse}"`);
    console.log(`Translated Response (Tamil): "${result.translatedResponse}"`);
    console.log(`Status: ${result.translatedResponse ? '✅ PASS' : '❌ FAIL'}\n`);
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  console.log('=' .repeat(60));
  console.log('\n✨ Translation Service Testing Complete!\n');
  console.log('Note: Translation quality depends on Gemini API.');
  console.log('Some variations in detected language codes are normal.\n');
}

// Run tests
testTranslation().catch(console.error);
