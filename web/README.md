# Neuro Explorer Web

This directory is the typed React/App Router migration track for Neuro Explorer.

## Why it exists

The current production UI in the repository root uses `liquidjs` plus large TypeScript string templates.
That works across Cloudflare Workers and Vercel, but it becomes inefficient to maintain as the site grows.

This `web/` app is the replacement track:

- Move pages from string templates to typed React components.
- Keep the neuroscience models and route logic conceptually separate from the UI.
- Avoid a full-stack rewrite until the frontend migration proves its value.

## Current scope

- Home page describing the migration stance
- `Brain Atlas` as the first migrated module

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Notes

- This app is not the production deployment target yet.
- It was scaffolded with `create-t3-app`, but Prisma/Auth/tRPC are intentionally not part of phase 1.
