const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");

class VectorService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    // Initialize Pinecone
    this.pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    this.index = this.pc.index('askly-final');
  }

  // Generate embeddings for text using Gemini
  async generateVector(text) {
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error("Vector generation error:", error);
      throw new Error("Failed to generate vector embeddings");
    }
  }

  // Store memory with vectors in Pinecone
  async createMemory({ vectors, messageId, metadata }) {
    try {
      await this.index.upsert([{
        id: messageId.toString(),
        values: vectors,
        metadata
      }]);
    } catch (error) {
      console.error("Memory creation error:", error);
      throw new Error("Failed to create memory");
    }
  }

  // Query similar memories from Pinecone
  async queryMemory({ queryVector, limit = 5, metadata }) {
    try {
      const data = await this.index.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
      });

      return data.matches;
    } catch (error) {
      console.error("Memory query error:", error);
      throw new Error("Failed to query memories");
    }
  }
}

module.exports = new VectorService();
