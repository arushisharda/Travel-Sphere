# TravelSphere

AI-assisted travel and culture intelligence platform. Explore destinations, compare options, understand local customs, and plan your trip — all in one place.

**What it is:** A travel planning and information companion.
**What it is NOT:** A booking, payment, ticketing, visa, emergency-alert, or official safety-advisory system.

## Setup

### Prerequisites
- Node.js 20 LTS or newer
- npm 10+
- NVIDIA API key (for itinerary drafting)

### Environment Variables
Copy `server/.env.example` to `server/.env` and fill in your keys.

### Install & Run
```bash
npm install
npm run dev
```

Server runs on http://localhost:4000, client on http://localhost:5173.

## Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **AI:** NVIDIA Nemotron (via OpenAI-compatible endpoint)
- **Weather:** Open-Meteo (free, no key)
- **Currency:** Frankfurter (free, no key)

## Data Credits
- Weather: Open-Meteo (open-meteo.com)
- Maps: OpenStreetMap contributors
- Exchange rates: Frankfurter (frankfurter.dev)

## Scope
TravelSphere helps you plan. It does not book travel, take payments, process visas or issue safety advisories.
