## Shoppinator

An AI-powered marketplace listing analyser built with Cloudflare Workers and Llama 3.3.

## What it does

Shoppinator helps you evaluate marketplace listings on sites like eBay before you buy. It works in three stages:

1. **Questioning** — The AI asks you Akinator-style yes/no, numerical, and text questions about the listing to gather information.
2. **Live scoring** — After each answer, various metrics (e.g. condition clarity) are updated in real time.
3. **Seller questions** — When you finish questioning, the AI generates a list of targeted questions to ask the seller, designed to uncover hidden defects and protect you from losing money.

## Tech stack

- Cloudflare Workers — backend API
- Cloudflare Workers AI — Llama 3.3 70B inference
- Cloudflare Pages — static frontend hosting
- Vanilla HTML, CSS, JavaScript — frontend

## Deployed link for running in browser (recommended)
https://shopping-assistant.marlonwen10.workers.dev/

## Instructions for running locally (not recommended)
### Prerequisites

- Node.js installed
- A Cloudflare account
- Wrangler CLI

### Steps

1. Clone the repository:
```
git clone https://github.com/MarlonWenGit/cf_ai_Shoppinator.git
cd cf_ai_Shoppinator
```

2. Install dependencies:
```
npm install
```

3. Log in to Cloudflare:
```
npx wrangler login
```

4. Start the local development server:
```
npx wrangler dev --remote
```

5. Open your browser and go to:
```
http://127.0.0.1:8787
```

## Notes

- The `--remote` flag is required because Cloudflare Workers AI cannot run locally and must connect to Cloudflare's servers.
- Chat history is maintained client-side in the browser for the duration of the session. Refreshing the page will reset the conversation.
