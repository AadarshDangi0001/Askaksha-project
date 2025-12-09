# RAG (Retrieval-Augmented Generation) Implementation

## Overview
This project implements RAG for the college chatbot, allowing students to have context-aware conversations with memory of past interactions.

## Architecture

### 1. **Vector Embeddings**
- Uses Google's `text-embedding-004` model via Gemini API
- Generates 768-dimensional vector embeddings for text
- **Stored in Pinecone** for fast similarity search at scale

### 2. **Memory System**
- **Short-term Memory**: Last 4 messages from current chat session (MongoDB)
- **Long-term Memory**: Top 3 most relevant past messages based on vector similarity (Pinecone)

### 3. **Models**

#### Message Model (`models/Message.js`)
```javascript
{
  user: ObjectId,        // Student who sent the message
  chat: String,          // Chat session ID
  content: String,       // Message text
  role: "user" | "model", // Who sent it
  createdAt: Date
}
```

#### Memory Model (`models/Memory.js`)
```javascript
// Messages stored in MongoDB
{
  user: ObjectId,        // Student who sent the message
  chat: String,          // Chat session ID
  content: String,       // Message text
  role: "user" | "model", // Who sent it
  createdAt: Date
}

// Vectors stored in Pinecone
{
  id: messageId,         // Message reference
  values: [Number],      // 768-dim embedding
  metadata: {
    chat: String,        // Chat session ID
    user: String,        // Student ID (as string)
    text: String         // Original text
  }
}
```

### 4. **Services**

#### VectorService (`services/vectorService.js`)
- `generateVector(text)` - Creates embeddings using Gemini
- `createMemory({ vectors, messageId, metadata })` - Stores in Pinecone
- `queryMemory({ queryVector, limit, metadata })` - Finds similar messages from Pinecone
- Uses Pinecone index: `askly-final`

#### GeminiService (`services/geminiService.js`)
- `generateResponse(prompt)` - Simple text generation
- `generateContentWithHistory(history)` - Chat with conversation history
- `buildCollegeContext(college)` - Creates system instruction

## Flow

### When Student Sends Message:

1. **Parse & Authenticate**
   - Verify JWT token
   - Extract student info

2. **Store User Message**
   - Save to Message collection (MongoDB)
   - Generate vector embedding (Gemini)
   - Store in Pinecone with metadata

3. **Retrieve Context**
   - Query similar past messages from Pinecone (long-term memory)
   - Fetch recent chat history from MongoDB (short-term memory)
   - Get college data

4. **Build Prompt**
   ```
   System Instruction (College Context)
   + Long-term Memory (Similar past conversations)
   + Short-term Memory (Recent 4 messages)
   + Current User Message
   ```

5. **Generate Response**
   - Send to Gemini with full context
   - Get AI response

6. **Store AI Response**
   - Save to Message collection (MongoDB)
   - Generate vector embedding (Gemini)
   - Store in Pinecone with metadata

7. **Send to Client**
   - Emit via Socket.io

## Benefits

✅ **Contextual Understanding**: Bot remembers past conversations
✅ **Relevant Responses**: Uses similar past interactions for better answers
✅ **Blazing Fast**: Pinecone vector search is optimized for scale
✅ **Persistent Memory**: Messages in MongoDB, vectors in Pinecone
✅ **Privacy**: Each student only accesses their own chat history
✅ **Scalable**: Pinecone handles millions of vectors efficiently

## Usage

### Frontend (StudentDashboard.jsx)
```javascript
socketRef.current.emit("student-message", {
  content: "What scholarships are available?",
  chat: "student-CLG123456-1732396800000",
  token: "jwt-token-here"
});
```

### Backend Response
```javascript
socket.emit("chat-response", {
  error: false,
  message: "Based on our records...",
  chat: "student-CLG123456-1732396800000"
});
```

## Configuration

Ensure `.env` has:
```env
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
MONGO_URI=mongodb://localhost:27017/college-demo
JWT_SECRET=your_jwt_secret
PORT=5050
```

### Pinecone Setup
1. Create account at [pinecone.io](https://www.pinecone.io)
2. Create index named `askly-final`
3. Set dimension to 768 (matches Gemini embeddings)
4. Use cosine similarity metric

## Testing

1. Start backend: `npm run dev`
2. Login as student
3. Open chatbot
4. Ask questions - bot will remember context!
5. Try asking follow-up questions to see memory in action

## Future Enhancements

- [x] Add Pinecone for faster vector search at scale ✅
- [ ] Implement chat session management UI
- [ ] Add message deletion with vector cleanup
- [ ] Support multi-modal inputs (images, files)
- [ ] Add conversation summarization
- [ ] Implement vector namespace isolation per college
