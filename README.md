# AI UX Copilot

An AI-powered Next.js application that converts UX research (interviews, notes, surveys) into structured personas, user flows, sitemaps, and wireframes using Google Gemini.

## Features

- **Research Input** — Paste or upload transcripts; AI extracts pain points, goals, behaviors, and insights
- **Persona Generator** — Evidence-based user personas with goals, frustrations, and motivations
- **User Flow Generator** — Interactive node graph (React Flow) with up to 8 screens
- **Sitemap Generator** — Hierarchical information architecture tree view
- **Wireframe Generator** — Component-based UI preview (navbar, cards, forms, tables, CTAs)

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Google Gemini API (gemini-2.0-flash)
- React Flow, Framer Motion, Zod

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Workflow

1. Click **Start New Project**
2. Paste research or click **Load sample data**
3. Click **Extract Insights** → **Generate Persona** → **Generate Flow** → **Generate Sitemap** → **Generate Wireframes**
4. Export all artifacts as JSON

## API Routes

| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /api/research` | `{ transcript }` | Research insights JSON |
| `POST /api/persona` | `{ research, productContext? }` | Persona JSON |
| `POST /api/flow` | `{ persona, research, productContext? }` | User flow graph JSON |
| `POST /api/sitemap` | `{ flow, persona, productContext? }` | Sitemap tree JSON |
| `POST /api/wireframe` | `{ sitemap, flow, persona, productContext? }` | Wireframe schema JSON |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## License

MIT
