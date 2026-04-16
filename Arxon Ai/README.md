# Arxon AI 🚀

Next-gen AI suite: Chat, API, agentic workflows. Peshawar-built.

## Quick Start

```bash
cd Arxon Ai
npm install  # backend deps
vercel dev   # local: http://localhost:3000
vercel       # deploy live
```

## Structure
- `Frontend/index.html` - Static SPA (Vercel static)
- `backend/api/index.js` - Serverless API (/api/v1/*)
- `vercel.json` - Monorepo routing

## Live Demo
[arxion-ai.vercel.app](https://arxion-ai.vercel.app) (update post-deploy)

## API Endpoints
```
GET    /api/v1/models
POST   /api/v1/chat/completions
POST   /api/v1/generate-key
POST   /api/v1/contact
```

## Deploy
1. `vercel login`
2. `cd Arxon Ai && vercel --prod`

© 2026 ArmanX AI

