# HerPath — Career Comeback

A Phase 1 front-end foundation for a women-focused career empowerment platform.

## Run locally

```bash
npm install
npm run dev
```

Browse `/style-guide` to see the reusable UI primitives. Product routes are scaffolded at `/`, `/onboarding`, `/dashboard`, `/career-discovery`, `/career/:careerId`, `/roadmap`, `/skills`, `/resume`, and `/ai-coach`.

## Architecture

- `src/components/ui`: reusable accessible base components
- `src/pages`: route-level placeholders and the style guide
- `src/store`: UI-facing Zustand state contract
- `src/types`: shared domain types
- `src/mock-data`: local initial data, ready to replace with a repository/API implementation
- `src/lib`: small framework-agnostic helpers
