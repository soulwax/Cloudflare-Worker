# Neuro Explorer

Interactive neuroscience demos with AI-assisted endpoints and a server-rendered Liquid UI.

## Purpose

This project is built to share programming skills with students in neurology while creating tools that are genuinely useful to them.
The goal is not just to teach code in the abstract, but to turn code into concrete, valuable learning instruments for neuroscience, physiology, and clinical intuition.

## Runtime targets

- Cloudflare Workers (`src/index.ts`)
- Vercel Functions (`api/index.ts`)

Both targets share the same route logic in [`src/app.ts`](src/app.ts).

## Local development

```bash
npm install
npm run dev
```

## Cloudflare deploy

```bash
npm run deploy
```

## Vercel deploy

1. Import this repository in Vercel.
2. Set environment variables:
   - `CLOUDFLARE_ACCOUNT_ID` (or `CF_ACCOUNT_ID`)
   - `CLOUDFLARE_API_TOKEN` (or `CF_API_TOKEN`)
3. Deploy.

`vercel.json` rewrites all public routes to a single function and restores the original pathname so existing route paths (`/`, `/neuron`, `/ask`, etc.) continue to work unchanged.

## Type checks and tests

```bash
npm run typecheck
npm test
```

## Template engine note

The UI uses `liquidjs` with in-memory template strings in `src/templates/*`. No filesystem-based Liquid loaders are used, which keeps rendering behavior consistent across Workers and Vercel.
