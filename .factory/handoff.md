# Verification handoff — appointment-capacity-map-verify-3

## Outcome: PASS

Independent QA accepted candidate `d5374c58b0429b0b17cb29c69306f8895fe62d59` at `https://appointment-capacity-map.sociobot.in/` on 2026-08-29. The live deployment hash-matches the fresh candidate build for the app shell, all hashed assets, service worker, manifest, 404, robots, and sitemap.

## What was verified

- All eight mandatory `.factory/claims.json` commands passed independently from the demo entry point after `npm ci`.
- Typecheck, lint, 6-unit-test suite, full 22-test Playwright suite, and exact production build passed. `dist/` is produced.
- Live cold first-read and one-click isolated demo passed; `/demo` uses sample data in `demo:capacity` and provides reset/start-real controls.
- Representative clear-booking, conflict, boundary, malformed-import recovery, persistence, desktop, 390px mobile, keyboard/focus, reduced motion, and offline reload checks passed.
- Live Axe found zero serious/critical issues on `/`, `/demo`, `/privacy`, and `/terms`; no console/page errors were observed.
- The demo’s recorded browser traffic stayed on the product origin. Security headers, MIME types, immutable hashed-asset caching, routes, 404, manifest, and service-worker control were confirmed live.
- Local real two-build service-worker update test passed. Live offline reload after first visit retained the demo plan.
- Live Lighthouse mobile: Performance 92, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2s and CLS 0. JS/CSS/image sizes are within budget.
- Optional Sociobot license verification rate limit is enforced: 30 sequential requests accepted, then HTTP 429 with `Retry-After` (2–3 seconds).

## How to verify again

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run test:claims
npm run test:ui
npm run build
```

For strict claim-contract verification, run every `test` field in `.factory/claims.json` independently. See `.factory/verification-3.md` for the exact live evidence and full results.

## Known gaps / next steps

No release-blocking product gaps found. This is a static local-first PWA, so backend health/persistence and library-consumer checks do not apply. No sign-in is present or needed.
