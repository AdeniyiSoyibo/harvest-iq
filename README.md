# 🌾 Harvest IQ

**Global agentic farm advisory platform** — delivers expert, RAG-powered agricultural guidance to smallholder farmers over SMS, voice calls, photos, and USSD. No smartphone required.

---

## What it does

- Farmers send a question (text, voice, or photo) from any phone
- An AI agent searches a validated global knowledge base (RAG)
- Replies are sent back in the farmer's language (10 languages supported)
- High-stakes questions are automatically escalated to a human advisor
- Works on feature phones via SMS, voice calls, and USSD (`*XXX#`)

---

## Quick start

### 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | https://nodejs.org |
| pnpm | ≥ 9 | `npm install -g pnpm` |

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up your AI API key

Edit `.env.local` and add your Google Gemini API key:

```env
AI_GATEWAY_API_KEY=your_google_gemini_api_key_here
```

**Get a free key in 30 seconds:**
1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy and paste it into `.env.local`

> **Free tier:** Google Gemini Flash offers a generous free tier with no credit card required — enough for development and small-scale pilots.

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Farmer simulator — test the platform as a farmer |
| `/advisor` | Advisor desk — review and respond to escalated questions |
| `/knowledge` | Knowledge base — view all validated agricultural documents |

---

## API endpoints

All channels accept a question and return an AI-generated reply.

### SMS channel
```
POST /api/channels/sms
Content-Type: application/json

{ "phone": "+265771234567", "text": "How do I treat fall armyworm?", "language": "en" }
```

### Voice channel
```
POST /api/channels/voice
Content-Type: application/json

{ "phone": "+265771234567", "text": "My maize leaves are turning yellow", "language": "ny" }
```

### Photo channel
```
POST /api/channels/photo
Content-Type: application/json

{ "phone": "+265771234567", "imageUrl": "https://...", "caption": "What is wrong with my crop?" }
```

### USSD channel (Africa's Talking format)
```
POST /api/channels/ussd
Content-Type: application/x-www-form-urlencoded

sessionId=ABC&phoneNumber=%2B265771234567&text=1%2Amaize+armyworm
```

### Conversations
```
GET /api/conversations?phone=+265771234567   # get farmer history
GET /api/conversations                       # get all conversations
```

### Escalations
```
GET /api/escalations                         # list open escalations
POST /api/escalations                        # resolve an escalation
```

---

## Changing the AI model

Edit `.env.local`:

```env
# Google Gemini (default — free tier available)
AI_MODEL=google/gemini-3.8-flash

# Higher quality Google model
AI_MODEL=google/gemini-2.5-pro

# Anthropic Claude (needs Anthropic API key)
AI_GATEWAY_API_KEY=your_anthropic_key_here
AI_MODEL=anthropic/claude-sonnet-5-5

# OpenAI GPT (needs OpenAI API key)
AI_GATEWAY_API_KEY=your_openai_key_here
AI_MODEL=openai/gpt-5-mini
```

---

## Languages supported

English · Chichewa · Swahili · Hindi · Bahasa Indonesia · Spanish · French · Portuguese · Filipino · Vietnamese

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Vercel AI SDK v7 — `ToolLoopAgent` + RAG pipeline
- **Knowledge base:** Static validated documents (no external DB needed)
- **Channels:** SMS, Voice, Photo, USSD
- **Language:** TypeScript
