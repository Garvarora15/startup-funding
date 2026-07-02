# 🚀 Startup Funding Hub

> AI-powered Grant & Funding Finder for Indian Startups — powered by **IBM Granite on IBM Watsonx.ai**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![IBM Watsonx](https://img.shields.io/badge/IBM_Watsonx.ai-eu--de-052FAD?style=flat-square&logo=ibm&logoColor=white)
![IBM Granite](https://img.shields.io/badge/Model-granite--4--h--small-052FAD?style=flat-square&logo=ibm&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Requirements](#-requirements)
- [Quick Start](#-quick-start-local)
- [Deploy to Vercel](#️-deploy-to-vercel)
- [Environment Variables](#-environment-variables)
- [IBM AI Details](#-ibm-ai-details)
- [Voice: TTS & STT Behavior](#-voice-tts--stt-behavior)
- [Orchestrate & Compliance Modules](#-orchestrate--compliance-modules)
- [UI Design System](#-ui-design-system)
- [Changelog](#-changelog)
- [License](#-license)

---

## 🌟 Overview

**Startup Funding Hub** is a full-stack AI-powered web application that helps Indian startups discover, evaluate, and apply for government grants and seed funding schemes. Built during the **IBM AICTE University Engagement Internship** (Problem Statement #18).

The app connects to **IBM Watsonx.ai** using the `ibm/granite-4-h-small` model to power a multilingual AI funding strategist, eligibility scoring engine, pitch generator, and proposal drafter — all in one place. The UI features a vibrant **indigo/violet** design system for an interactive and modern experience.

🔗 **Live Demo:** [startup-funding-hub.vercel.app](https://startup-funding-hub.vercel.app)
📦 **Repository:** [github.com/Garvarora15/startup-funding](https://github.com/Garvarora15/startup-funding)

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🤖 **AI Chat Agent** | IBM Granite-powered grant strategist — answers funding queries in 7 languages with real-time Watsonx.ai responses |
| 2 | 🔍 **Smart Grant Search** | Browse & filter 66+ live Indian startup grants (SISFS, BIRAC, DST, DPIIT, NASSCOM, and more) |
| 3 | 📊 **Match Score Engine** | Dynamic 0–100% eligibility scoring per grant based on your startup profile (sector, stage, location, funding) |
| 4 | 📝 **Proposal Generator** | AI-drafted 6-section professional grant proposals tailored per scheme with rendered markdown tables |
| 5 | 🎤 **Pitch Generator** | Elevator, one-pager, investor-hook, and Twitter pitches auto-generated in 7 languages |
| 6 | 🔊 **Text to Speech** | Grant details and AI responses read aloud via **Watson TTS** (primary); automatically falls back to the browser's **Web Speech API** if Watson TTS credentials are missing or the request fails |
| 7 | 🎙️ **Speech to Text** | Voice input in the chat agent via the browser's native **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`), language-matched to the active UI language |
| 8 | 🌐 **Multilingual UI** | Full interface in English, Hindi (Devanagari), Punjabi (Gurmukhi), Spanish, French, German, Japanese |
| 9 | ⭐ **Favorites** | Star grants to save them and filter your shortlist |
| 10 | 🔎 **Advanced Filters** | Filter by stage (Idea/Seed/Growth), sector, and funding limit |
| 11 | 🧭 **Watsonx Orchestrate** | Optional alternate backend path that can call a deployed IBM watsonx Orchestrate agent |
| 12 | 🛡️ **Compliance Guardrail** | Blocks AI from auto-submitting applications or handling credentials; stamps drafts with "human validation required" |

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19 | UI framework |
| **Language** | TypeScript | 5 | Type safety |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS |
| **Build Tool** | Vite | 6 | Dev server & bundler |
| **Icons** | Lucide React | 0.546 | Icon set |
| **PDF Export** | jsPDF | 2.5 | Proposal PDF download |
| **AI Model** | IBM Granite | `granite-4-h-small` | Chat, proposals, pitches |
| **AI Platform** | IBM Watsonx.ai | eu-de Frankfurt | LLM inference endpoint |
| **Auth** | IBM IAM | — | Auto-refreshed token (5-min buffer) |
| **Backend** | Vercel Serverless Functions | — | Secure API proxy |
| **Deployment** | Vercel | — | CI/CD + Edge hosting |
| **TTS (primary)** | Watson Text to Speech | — | Multilingual voice synthesis |
| **TTS (fallback)** | Web Speech API | — | Browser-native, zero config |

---

## 📁 Project Structure

```
startup-funding-hub/
├── api/                                  # Vercel Serverless Functions (TypeScript)
│   ├── lib/
│   │   ├── watsonx.ts                    # IBM IAM auth + Granite chat helper
│   │   ├── orchestrate.ts                # Optional IBM watsonx Orchestrate agent client
│   │   └── compliance.ts                 # Legal-boundary guardrail
│   ├── grants/
│   │   ├── index.ts                      # GET  /api/grants
│   │   └── calculate-match.ts            # POST /api/grants/calculate-match
│   ├── agent/
│   │   └── chat.ts                       # POST /api/agent/chat
│   ├── proposals/
│   │   └── generate.ts                   # POST /api/proposals/generate
│   ├── profile/
│   │   └── generate-pitch.ts             # POST /api/profile/generate-pitch
│   └── tts/
│       └── synthesize.ts                 # POST /api/tts/synthesize
├── src/
│   ├── components/
│   │   ├── ChatAssistant.tsx             # AI chat panel + TTS + speech input
│   │   ├── CollapsibleFAQ.tsx            # FAQ accordion
│   │   ├── Footer.tsx                    # Site footer
│   │   ├── GrantCard.tsx                 # Grant card with match score + hover lift
│   │   ├── Navbar.tsx                    # Top nav + language switcher + status pills
│   │   ├── PolicyModal.tsx               # Privacy / terms modal
│   │   ├── ProposalGenerator.tsx         # Draft tab with markdown table rendering
│   │   └── StartupProfileForm.tsx        # Left panel profile form
│   ├── data/
│   │   └── grants.ts                     # 66+ curated Indian startup grants
│   ├── locales/
│   │   └── translations.ts               # 7-language UI translation map
│   ├── types.ts                          # Shared TypeScript interfaces
│   ├── main.tsx                          # React entry point
│   └── index.css                         # Global styles + custom animations
├── requirements.txt                      # Runtime & dependency documentation
├── .env.example                          # Environment variable template
├── vercel.json                           # Vercel routing config
├── vite.config.ts                        # Vite build config
├── tsconfig.json                         # TypeScript config
└── package.json                          # npm dependency manifest
```

---

## 📦 Requirements

> **Note:** This is a **Node.js / TypeScript** project. There is no Python backend.  
> The `requirements.txt` file documents all prerequisites and packages in a human-readable format.

### System Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| **Node.js** | ≥ 18.0.0 | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 9.0.0 | Bundled with Node.js |
| **Vercel CLI** | ≥ 35.0.0 | `npm install -g vercel` |

### Key npm Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.1 | UI framework |
| `react-dom` | ^19.0.1 | React DOM renderer |
| `tailwindcss` | ^4.1.14 | CSS utility framework |
| `@tailwindcss/vite` | ^4.1.14 | Tailwind v4 Vite plugin |
| `lucide-react` | ^0.546.0 | Icon set |
| `jspdf` | ^2.5.2 | PDF proposal export |
| `motion` | ^12.23.24 | Animation utilities |
| `typescript` | ~5.8.2 | TypeScript compiler |
| `vite` | ^6.2.3 | Build tool |
| `@vercel/node` | ^5.0.0 | Serverless function types |

See [`requirements.txt`](./requirements.txt) for the full annotated list and [`package.json`](./package.json) for the authoritative npm manifest.

---

## 🚀 Quick Start (Local)

### 1. Clone the repository

```bash
git clone https://github.com/Garvarova15/startup-funding.git
cd startup-funding
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your IBM credentials:

```env
IBM_API_KEY=your_ibm_cloud_api_key_here
IBM_PROJECT_ID=your_watsonx_project_id_here
```

### 4. Start the development server

```bash
# Full stack (frontend + serverless API routes) — RECOMMENDED
vercel dev

# Frontend only (no API routes)
npm run dev
```

> **Tip:** Use `vercel dev` to run serverless API functions locally. Use `npm run dev` for UI-only changes without IBM credentials.

### 5. Open in browser

```
http://localhost:3000
```

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → **Import repository**
3. Vercel auto-detects Vite — no build config needed
4. Add the following environment variables in the Vercel dashboard:

| Variable | Required | Value |
|----------|----------|-------|
| `IBM_API_KEY` | ✅ Yes | Your IBM Cloud API key |
| `IBM_PROJECT_ID` | ✅ Yes | Your Watsonx.ai Project ID |
| `WATSON_TTS_API_KEY` | ⚡ Optional | Watson Text to Speech key |
| `WATSON_TTS_URL` | ⚡ Optional | Watson TTS service URL |

5. Set **Node.js Version** to `18.x` or `20.x` in Vercel → Settings → General
6. Click **Deploy** ✅

---

## 🔑 Environment Variables

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `IBM_API_KEY` | ✅ Required | IBM Cloud API key for IAM authentication | [cloud.ibm.com/iam/apikeys](https://cloud.ibm.com/iam/apikeys) |
| `IBM_PROJECT_ID` | ✅ Required | Watsonx.ai Project ID (eu-de region) | [eu-de.dataplatform.cloud.ibm.com](https://eu-de.dataplatform.cloud.ibm.com/projects) |
| `WATSON_TTS_API_KEY` | ⚡ Optional | Watson Text to Speech API key | IBM Cloud catalog → Watson TTS |
| `WATSON_TTS_URL` | ⚡ Optional | Watson TTS service endpoint URL | IBM Cloud resource page |
| `ORCHESTRATE_SERVICE_URL` | ⚡ Optional | IBM watsonx Orchestrate instance URL | Orchestrate → Settings → API details |
| `ORCHESTRATE_AGENT_ID` | ⚡ Optional | Orchestrate agent ID | Orchestrate agent settings page |
| `ORCHESTRATE_IAM_APIKEY` | ⚡ Optional | IAM key for Orchestrate service | [cloud.ibm.com/iam/apikeys](https://cloud.ibm.com/iam/apikeys) |

> If Watson TTS credentials are not provided, the app automatically falls back to the browser's **Web Speech API** — speech always works regardless.

Copy `.env.example` → `.env.local` and fill in your values. Never commit real credentials to git.

---

## 🤖 IBM AI Details

| Property | Value |
|----------|-------|
| **Platform** | IBM Watsonx.ai |
| **Region** | eu-de (Frankfurt) |
| **Model ID** | `ibm/granite-4-h-small` |
| **Endpoint** | `https://eu-de.ml.cloud.ibm.com/ml/v1/text/chat?version=2024-05-31` |
| **Auth** | IBM IAM token — auto-refreshed, cached with 5-min safety buffer |
| **Offline Resilience** | Local heuristic fallback activates automatically when Watsonx.ai is unavailable |
| **Languages Supported** | English, Hindi, Punjabi, Spanish, French, German, Japanese |

---

## 🔊 Voice: TTS & STT Behavior

**Text to Speech (`/api/tts/synthesize`)**

1. The serverless function checks for `WATSON_TTS_API_KEY` and `WATSON_TTS_URL`.
2. If both are present, it calls Watson TTS with a language-matched voice:

| Language | Watson Voice |
|----------|-------------|
| Hindi / Punjabi | `hi-IN_AditiVoice` |
| Spanish | `es-ES_LauraV3Voice` |
| French | `fr-FR_ReneeV3Voice` |
| German | `de-DE_BirgitV3Voice` |
| Japanese | `ja-JP_EmiV3Voice` |
| English (default) | `en-US_AllisonV3Voice` |

3. If credentials are missing or the Watson call fails, the function responds with `{ success: false, fallback: true }` — no error thrown.
4. The frontend checks that response: on `fallback: true`, it automatically switches to `window.speechSynthesis` — the 🔊 **Listen** feature never breaks.

**Speech to Text (mic input)**

- Handled entirely client-side via `SpeechRecognition` / `webkitSpeechRecognition` — no IBM STT service involved.
- Recognition language is set to match the active UI language before listening starts.
- If the browser doesn't support speech recognition, the mic button alerts the user gracefully.

---

## 🧭 Orchestrate & Compliance Modules

| Module | File | Purpose |
|--------|------|---------|
| **Orchestrate client** | `api/lib/orchestrate.ts` | Optional alternate backend path calling a deployed IBM watsonx Orchestrate agent. Requires `ORCHESTRATE_SERVICE_URL`, `ORCHESTRATE_AGENT_ID`, and `ORCHESTRATE_IAM_APIKEY`. Falls back to direct Granite if not configured. |
| **Compliance guardrail** | `api/lib/compliance.ts` | Legal-boundary layer (Problem Statement #18). Detects and blocks any request asking the agent to auto-submit forms, auto-login, enter credentials, or bypass CAPTCHA on external portals. Stamps AI-generated proposals with a "human validation required" notice. |

---

## 🎨 UI Design System

The interface was rebuilt in **v3.0.0** from an earthy olive palette to a modern **Indigo / Violet** design system.

### Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| Primary | `indigo-600 → violet-600` | Buttons, active tabs, CTAs |
| Background | `slate-50 / indigo-50` | Page and card backgrounds |
| Navbar / Footer | `indigo-700 → violet-700 → indigo-800` | Header and footer gradients |
| Accent — success | `emerald-400 / emerald-600` | Match score ≥ 80%, active status |
| Accent — warning | `amber-400 / amber-600` | Match score 55–79%, favorites |
| Accent — danger | `rose-400 / rose-600` | Match score < 55%, urgent deadlines |
| Text primary | `slate-800 / slate-900` | Headings and body copy |
| Text muted | `slate-400 / indigo-300` | Labels, timestamps, metadata |
| Border | `indigo-100 / slate-200` | Card and input borders |

### Custom CSS Utilities (`src/index.css`)

| Class | Effect |
|-------|--------|
| `.card-hover` | Smooth lift + indigo shadow on hover (`translateY(-3px)`) |
| `.animate-fadeIn` | Fade + slide-up entrance animation |
| `.animate-glow` | Pulsing glow ring for status indicators |
| `.gradient-text` | Indigo → violet → cyan gradient text fill |

### Component Highlights

- **Navbar** — Frosted-glass status pills with per-service colors (emerald LLM, cyan Orchestrate, violet Guardrail)
- **GrantCard** — Score-colored gradient accent bar (emerald/amber/rose) + `.card-hover` lift
- **ChatAssistant** — Gradient header matching navbar; user bubbles use the primary gradient; reasoning logs styled in indigo
- **StartupProfileForm** — Decorative background blob; indigo labels and focus rings
- **FAQ** — Active item highlighted in indigo with rotating chevron

---

## 📝 Changelog

### v3.0.0 — July 2026
- 🎨 **UI Redesign:** Complete visual overhaul — earthy olive palette replaced with vibrant **Indigo/Violet** design system
- 🎨 **Navbar:** Gradient background (`indigo-700 → violet-700`), frosted-glass status pills with per-service accent colors, glowing status dot
- 🎨 **Tabs & Buttons:** Active state uses `from-indigo-600 to-violet-600` gradient with shadow; hover states use `indigo-50` tint
- 🎨 **GrantCard:** Score-colored top accent bar (emerald/amber/rose), `.card-hover` lift animation, indigo/violet/slate badge system
- 🎨 **ChatAssistant:** Gradient header; user messages render as indigo→violet gradient bubbles; reasoning monitor styled in indigo
- 🎨 **StartupProfileForm:** White card with decorative gradient blob, indigo-labeled fields, gradient generate button, indigo preset tiles
- 🎨 **Footer:** Deep `indigo-900 → violet-900` gradient; color-coded system architecture badges
- 🎨 **FAQ:** Open items highlighted in `indigo-50` with rotating chevron indicator
- 🎨 **Global CSS:** Custom scrollbar (`indigo-400`), `.animate-glow`, `.card-hover`, `.gradient-text`, `.animate-fadeIn` utilities
- 📄 **Docs:** Added `requirements.txt` documenting runtime prerequisites and all npm packages
- 📄 **Docs:** README updated with UI Design System section, requirements table, and v3.0.0 changelog

### v2.1.0 — June 2026
- 📝 README: added `api/lib/orchestrate.ts` and `api/lib/compliance.ts` documentation
- 📝 README: added Speech-to-Text feature entry and full TTS/STT fallback behavior section
- 📝 README: added dedicated Orchestrate and Compliance backend modules section

### v2.0.0 — June 2026
- ✅ **Fix:** TTS voice pre-loading on app mount — eliminates ~60s startup lag
- ✅ **Fix:** TTS language mapping extended to all 7 languages (Spanish, French, German, Japanese previously fell back to English)
- ✅ **Fix:** Proposal Generator now renders markdown pipe tables as proper HTML tables with styled headers and alternating rows
- ✅ **Improvement:** `parseMarkdownToHtml` rewritten with two-pass block-grouping for reliable table detection
- ✅ **Improvement:** README updated with full markdown tables, changelog, and table of contents

### v1.0.0 — June 2026
- 🚀 Initial release — IBM AICTE internship submission
- AI Chat Agent powered by IBM Granite via Watsonx.ai
- 30+ Indian startup grant schemes with eligibility matching
- Multilingual UI (7 languages) with Watson TTS
- Proposal Generator and Pitch Generator
- Deployed on Vercel

---

## 📜 License

MIT — Built as part of the **IBM AICTE University Engagement Internship**.

**Problem Statement #18** — AI Grant and Funding Finder for Startups

---

<div align="center">
  Made with ❤️ by <strong>Garv Arora</strong> using IBM Granite + Watsonx.ai
</div>
