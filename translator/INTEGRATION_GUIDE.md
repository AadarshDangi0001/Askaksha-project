# Multilingual Translation Integration

This integration enables the chatbot to support multiple Indian languages by automatically translating user inputs and bot responses.

## Architecture

```
User Input (Hindi/Tamil/etc.) 
    ↓
Translation Service (Python) - Translate to English
    ↓
LLM Processing (English)
    ↓
Translation Service (Python) - Translate back to User's Language
    ↓
Bot Response (Hindi/Tamil/etc.)
```

## Supported Languages

- Hindi (hi)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Gujarati (gu)
- Bengali (bn)
- Oriya (or)
- Assamese (as)
- English (en)

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd translator
pip3 install -r requirements.txt
```

### 2. Start Translation API Server

```bash
cd translator
chmod +x start-translation-api.sh
./start-translation-api.sh
```

Or manually:
```bash
cd translator
python3 api.py
```

The translation API will start on `http://localhost:5001`

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Add to your `backend/.env` file:
```
TRANSLATION_API_URL=http://localhost:5001
```

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

## API Endpoints

### Translation API (Python - Port 5001)

1. **POST /translate/to-english**
   - Translates user input to English
   - Request: `{ "text": "मुझे मदद चाहिए" }`
   - Response: `{ "detected_language": "hi", "original_text": "...", "translated_text": "I need help", "is_english": false }`

2. **POST /translate/to-native**
   - Translates English response back to user's language
   - Request: `{ "text": "How can I help you?", "target_language": "hi" }`
   - Response: `{ "original_text": "...", "translated_text": "मैं आपकी कैसे मदद कर सकता हूं?", "target_language": "hi" }`

3. **POST /translate/full-pipeline**
   - Complete translation pipeline
   - Request: `{ "user_input": "...", "llm_response": "..." }`

4. **POST /detect-language**
   - Detects language of given text
   - Request: `{ "text": "नमस्ते" }`
   - Response: `{ "text": "...", "detected_language": "hi" }`

5. **GET /health**
   - Health check endpoint
   - Response: `{ "status": "ok", "message": "..." }`

## How It Works

1. **User sends message** in their native language (e.g., Hindi)
2. **Translation service detects** the language automatically
3. **Message is translated** to English for LLM processing
4. **LLM processes** the English message and generates response
5. **Response is translated back** to user's original language
6. **User receives** response in their native language

## Frontend Integration

The frontend automatically receives translated responses. No changes needed on frontend side.

Socket events remain the same:
- Emit: `student-message`, `guest-message`, or `external-message`
- Receive: `chat-response` (now includes `detectedLanguage` field)

Response format:
```javascript
{
  message: "translated response in user's language",
  originalMessage: "original English response",
  detectedLanguage: "hi",
  chat: "...",
  userName: "...",
  // ... other fields
}
```

## Fallback Behavior

If the translation service is unavailable:
- System automatically falls back to English-only mode
- No errors thrown to user
- Chatbot continues to work normally in English

## Testing

Test the translation service:

```bash
# Check if service is running
curl http://localhost:5001/health

# Test translation to English
curl -X POST http://localhost:5001/translate/to-english \
  -H "Content-Type: application/json" \
  -d '{"text": "मुझे स्कॉलरशिप की जानकारी चाहिए"}'

# Test translation to Hindi
curl -X POST http://localhost:5001/translate/to-native \
  -H "Content-Type: application/json" \
  -d '{"text": "You can apply for scholarship through the portal", "target_language": "hi"}'
```

## Performance Notes

- First translation may take 2-3 seconds (model loading)
- Subsequent translations are faster (~1-2 seconds)
- Model is cached in memory for better performance
- Uses Facebook's M2M100 (418M parameters) model

## Troubleshooting

### Translation API not starting
- Check Python version: `python3 --version` (needs 3.8+)
- Install dependencies: `pip3 install -r requirements.txt`
- Check port 5001 is available: `lsof -i :5001`

### Backend can't connect to translation service
- Ensure translation API is running
- Check `TRANSLATION_API_URL` in `.env`
- Verify firewall settings

### Poor translation quality
- First translation downloads model (~1.6GB)
- Ensure stable internet for initial download
- Model improves with context

## Production Deployment

For production:
1. Deploy translation API as separate service
2. Use process manager (PM2, systemd) to keep it running
3. Set up proper logging
4. Consider using GPU for faster translations
5. Implement caching for common translations

## Model Information

- **Model**: Facebook M2M100 (Many-to-Many 100 languages)
- **Size**: 418M parameters (~1.6GB download)
- **License**: MIT
- **Source**: Hugging Face Transformers
