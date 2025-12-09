# Translation Integration Guide

## Overview
The chatbot now supports multilingual conversations. Users can chat in their native Indian language, and the system will automatically:
1. Detect the language
2. Translate user input to English
3. Process with AI (Gemini)
4. Translate AI response back to user's native language

## Supported Languages
- English (en) - Default
- Hindi (hi)
- Bengali (bn)
- Tamil (ta)
- Telugu (te)
- Marathi (mr)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- And other Indian languages supported by M2M100 model

## Architecture

### 1. Translation API (Flask - Port 5001)
Located in `/translator/api.py`

**Endpoints:**
- `POST /translate/to-english` - Translates user input to English
- `POST /translate/to-native` - Translates AI response to native language
- `POST /detect-language` - Detects language of text
- `GET /health` - Health check

### 2. Translation Service (Node.js)
Located in `/backend/src/services/translationService.js`

**Methods:**
- `detectLanguage(text)` - Detects language
- `translateToEnglish(text)` - Translates to English
- `translateToNative(text, targetLanguage)` - Translates to native language
- `processWithTranslation(userInput, aiResponse)` - Full pipeline

### 3. Integration in Socket Handler
Located in `/backend/src/config/socketHandler.js`

**Flow:**
```
User Input (Native Language)
    ↓
Translate to English
    ↓
Process with Gemini AI
    ↓
Translate Response to Native Language
    ↓
Send to User
```

## Configuration

### Environment Variables
Add to `/backend/.env`:
```
TRANSLATION_API_URL=http://localhost:5001
```

### Starting Services

**1. Start Translation API:**
```bash
cd translator
python3 api.py
```

**2. Start Backend:**
```bash
cd backend
npm run dev
```

## How It Works

### Example Conversation in Hindi:

**User (Hindi):** "कॉलेज की फीस क्या है?"

**Backend Process:**
1. Detects language: `hi` (Hindi)
2. Translates to English: "What is the college fee?"
3. Gemini processes in English
4. Gets response: "The college fee is ₹50,000 per semester..."
5. Translates back to Hindi: "कॉलेज की फीस ₹50,000 प्रति सेमेस्टर है..."

**User sees (Hindi):** "कॉलेज की फीस ₹50,000 प्रति सेमेस्टर है..."

## Database Storage

- **User messages:** Stored in English (translated version)
- **AI responses:** Stored in native language (for user history)
- **Vector embeddings:** Created from English versions (for better search)

## Error Handling

If translation API is unavailable:
- Falls back to English
- Logs error but continues processing
- User gets response in English

## Testing

**Test in Hindi:**
```
नमस्ते, कॉलेज के बारे में जानकारी दें
```

**Test in Tamil:**
```
கல்லூரி பற்றி தகவல் தருங்கள்
```

**Test in Telugu:**
```
కళాశాల గురించి సమాచారం ఇవ్వండి
```

## Monitoring

Check console logs for:
- `User language detected: hi`
- `Translated "..." -> "..."`
- `Translating response to hi`

## Performance

- Translation adds ~200-500ms latency per request
- Model loads on first request (one-time ~10s delay)
- Subsequent requests are fast

## Future Improvements

1. Cache translations for common phrases
2. Add language preference in user profile
3. Support more languages
4. Implement language auto-detection refinement
