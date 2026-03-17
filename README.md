# DeepShield AI

> Production-ready deepfake detection web application powered by HuggingFace AI models.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- A HuggingFace API key ([get one here](https://huggingface.co/settings/tokens))

### Installation

```bash
git clone https://github.com/RohanExploit/Maya-checks.git
cd Maya-checks
npm install
```

### Environment Variables

Create a `.env.local` file (never commit this):

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
HF_API_KEY=hf_your_huggingface_api_key_here
```

### Running Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI API | HuggingFace Inference API |

### Detection Pipeline

```
Upload File
    │
    ▼
API Route (/api/detect)
    │
    ├─► Primary: dima806/deepfake_vs_real_image_detection
    │       └─ Retry up to 3× (exponential backoff)
    │
    ├─► Fallback 1: haywoodsloan/ai-image-detector-deploy
    │
    └─► Fallback 2: Deterministic heuristic (always returns Suspicious)
```

### Response Format

```json
{
  "result": "Fake" | "Real" | "Suspicious",
  "confidence": 0-100,
  "explanation": ["reason 1", "reason 2"],
  "source": "primary-api" | "fallback-hf" | "fallback-heuristic"
}
```

---

## ☁️ Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add the `HF_API_KEY` environment variable in the Vercel project settings
4. Deploy

### Render

See [deployment.md](./deployment.md) for Render-specific instructions.

---

## 🧠 Models Used

| Role | Model |
|------|-------|
| Primary | [dima806/deepfake_vs_real_image_detection](https://huggingface.co/dima806/deepfake_vs_real_image_detection) |
| Fallback | [haywoodsloan/ai-image-detector-deploy](https://huggingface.co/haywoodsloan/ai-image-detector-deploy) |

---

## 🔒 Fallback Explanation

When both HuggingFace models are unavailable (e.g., network error, cold start, rate limit):

- A **deterministic heuristic** is used as a last resort
- It returns `Suspicious` with a 60% confidence score
- The response will include `"source": "fallback-heuristic"` so the UI can surface a warning

---

## 📚 Attribution

- Deepfake detection approach inspired by [namandhakad712/Deepfake-detector](https://github.com/namandhakad712/Deepfake-detector)
- HuggingFace models by [dima806](https://huggingface.co/dima806) and [haywoodsloan](https://huggingface.co/haywoodsloan)

---

## 📄 License

MIT
