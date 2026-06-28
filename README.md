# 🚀 Startup Funding Hub

> AI-powered Grant & Funding Finder for Indian Startups — powered by **IBM Granite on IBM Watsonx.ai**

![React](https://img.shields.io/badge/Built%20with-React%2019%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![IBM Watsonx](https://img.shields.io/badge/AI-IBM%20Watsonx.ai-052FAD?style=flat-square&logo=ibm)
![IBM Granite](https://img.shields.io/badge/Model-IBM%20Granite%203.3%208B-052FAD?style=flat-square&logo=ibm)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Chat Agent | IBM Granite-powered grant strategist — answers funding queries in 7 languages |
| 🔍 Smart Grant Search | Browse & filter 30+ live Indian startup grants (SISFS, BIRAC, DST, DPIIT) |
| 📊 Match Score Engine | Dynamic 0-100 eligibility scoring per grant based on your startup profile |
| 📝 Proposal Generator | AI-drafted 6-section professional grant proposals tailored per scheme |
| 🎤 Pitch Generator | Elevator, one-pager, investor-hook, and Twitter pitches in 7 languages |
| 🔊 Text to Speech | Grant details read aloud (Watson TTS or browser Web Speech API fallback) |
| 🌐 Multilingual UI | Full interface in English, Hindi (Devanagari), Punjabi (Gurmukhi), Spanish, French, German , Japanese |

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Build Tool | Vite 6 |
| AI Model | IBM Granite 3.3 8B Instruct (`ibm/granite-3-3-8b-instruct`) |
| AI Platform | IBM Watsonx.ai — eu-de Frankfurt region |
| Backend | Vercel Serverless Functions |
| Deployment | Vercel |

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repo
git clone https://github.com/Garvarover15/startup-funding-hub.git
cd startup-funding-hub

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env.local
# Fill in IBM_API_KEY and IBM_PROJECT_ID

# 4. Run locally (use Vercel CLI to test API routes)
npm i -g vercel
vercel dev
```

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import repo
3. Add environment variables:
   - `IBM_API_KEY` → Your IBM Cloud API key
   - `IBM_PROJECT_ID` → Your Watsonx.ai Project ID
4. Click **Deploy** ✅

## 📁 Project Structure

```
├── api/                              # Vercel Serverless Functions
│   ├── lib/
│   │   └── watsonx.ts                # IBM IAM auth + Granite chat helper
│   ├── grants/
│   │   ├── index.ts                  # GET  /api/grants
│   │   └── calculate-match.ts        # POST /api/grants/calculate-match
│   ├── agent/
│   │   └── chat.ts                   # POST /api/agent/chat
│   ├── proposals/
│   │   └── generate.ts               # POST /api/proposals/generate
│   ├── profile/
│   │   └── generate-pitch.ts         # POST /api/profile/generate-pitch
│   └── tts/
│       └── synthesize.ts             # POST /api/tts/synthesize
├── src/
│   ├── components/
│   │   ├── ChatAssistant.tsx
│   │   ├── CollapsibleFAQ.tsx
│   │   ├── Footer.tsx
│   │   ├── GrantCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── PolicyModal.tsx
│   │   └── ProposalGenerator.tsx
│   ├── data/grants.ts                # 30 curated Indian startup grants
│   ├── locales/translations.ts       # 7-language UI translations
│   └── App.tsx
├── vercel.json
└── vite.config.ts
```

## 🔑 Environment Variables

| Variable | Required | Description | Where to get |
|---|---|---|---|
| `IBM_API_KEY` | ✅ | IBM Cloud API key | [cloud.ibm.com/iam/apikeys](https://cloud.ibm.com/iam/apikeys) |
| `IBM_PROJECT_ID` | ✅ | Watsonx.ai Project ID | [eu-de.dataplatform.cloud.ibm.com](https://eu-de.dataplatform.cloud.ibm.com/projects) |
| `WATSON_TTS_API_KEY` | ⚡ Optional | Watson Text to Speech key | IBM Cloud catalog |
| `WATSON_TTS_URL` | ⚡ Optional | Watson TTS service URL | IBM Cloud resource page |

> **Note:** If Watson TTS credentials are not set, the app automatically falls back to the browser's built-in Web Speech API — the app always works!

## 🤖 IBM AI Details

- **Platform:** IBM Watsonx.ai (eu-de Frankfurt region)
- **Model:** `ibm/granite-3-3-8b-instruct`
- **Auth:** IBM IAM token (auto-refreshed, cached with 5-min safety buffer)
- **Endpoint:** `https://eu-de.ml.cloud.ibm.com/ml/v1/text/chat?version=2024-05-31`
- **Offline Resilience:** Local heuristic fallback activates automatically when Watsonx.ai is unavailable

## 📜 License

MIT — Built as part of an IBM AICTE University Engagement internship project.

---

**Problem Statement #18** — AI Grant and Funding Finder for Startups
