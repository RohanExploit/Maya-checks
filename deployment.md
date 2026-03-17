# Deployment Guide — DeepShield AI

## Vercel (Recommended)

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project
3. In **Settings → Environment Variables**, add:
   - `HF_API_KEY` = your HuggingFace API key
4. Click **Deploy**

Vercel automatically handles the Next.js build and serverless API routes.

---

## Render

### Prerequisites

- A [Render](https://render.com) account
- Your Render API key: available in Account Settings → API Keys

### Steps

1. Push to GitHub
2. In Render dashboard, click **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 20
5. Under **Environment Variables**, add:
   - `HF_API_KEY` = your HuggingFace API key
   - `NODE_ENV` = `production`
6. Click **Create Web Service**

### Using Render API (CI/CD)

```bash
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "deepshield-ai",
    "repo": "https://github.com/your-org/deepshield-ai",
    "branch": "main",
    "buildCommand": "npm install && npm run build",
    "startCommand": "npm start",
    "envVars": [
      { "key": "HF_API_KEY", "value": "YOUR_HF_KEY" }
    ]
  }'
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_API_KEY` | Yes | HuggingFace Inference API key |
| `NODE_ENV` | No | Set to `production` in production |
