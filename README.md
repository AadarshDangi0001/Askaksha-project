# AskAksha

AskAksha is an assistant platform built for educational institutions — combining a web chatbot, WhatsApp bot, translation utilities, and an admin/student dashboard. This repository contains the backend APIs, frontend web app, and a translator microservice used in the project.

**Key features**
- Web chatbot (React + Vite)
- WhatsApp chatbot integration (whatsapp-web.js)
- Semantic memory & retrieval via Pinecone + Gemini embeddings
- Document translation microservice (Python)
- Admin and Student dashboards for management and logs

**Repository layout**
- [backend](backend): Node.js/Express server, bots, services, and APIs
- [frontend](frontend): React + Vite single-page app with student/admin UI
- [translator](translator): Python translation API and models

**Architecture overview**
The backend hosts APIs, a Socket.IO signaling layer for the webchat, a WhatsApp bot service, and integrations with Google Gemini (for embeddings/LLM) and Pinecone (vector DB) for memory and retrieval. The frontend communicates with the backend via REST and websockets.

Prerequisites
- Node.js (v18+ recommended)
- npm
- Python 3.9+ for the translator service
- MongoDB instance (cloud or local)

Environment variables
Create a `.env` file in `backend/` with at least the following variables:

```
PORT=5050
MONGO_URI=mongodb://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

Quick start - Backend
1. Open a terminal and navigate to `backend`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run the server (development):

```bash
npm run dev
```

Or start production server:

```bash
npm start
```

Quick start - Frontend
1. Open a terminal and navigate to `frontend`.
2. Install dependencies and run dev server:

```bash
cd frontend
npm install
npm run dev
```

Translator service
- The `translator` folder contains a Python-based translation API. See `translator/README.md` and `translator/requirements.txt` for setup and run instructions.

Testing and development notes
- Backend scripts: `npm run dev` uses `nodemon` and runs `src/server.js`.
- Frontend uses Vite; preview with `npm run preview` after `npm run build`.

Where to look next
- Backend entry: [backend/src/server.js](backend/src/server.js#L1)
- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx#L1)
- Vector service (embeddings & Pinecone): [backend/src/services/vectorService.js](backend/src/services/vectorService.js#L1)

Contributing
- Feel free to open issues or PRs. Follow conventional commits and include tests where appropriate.

License
- This project does not include a license file. Add one if you plan to open-source the repository.

Maintainers
- Project: AskAksha

