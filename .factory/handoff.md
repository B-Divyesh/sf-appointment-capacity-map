# Verification handoff — appointment-capacity-map-verify-5

## Outcome: PASS

Candidate `ac6caa2997b842bc0fa4879d2e14f3f0f1fbe3f1` is accepted for release at
`https://appointment-capacity-map.sociobot.in/`. Exact independent evidence is
recorded in `.factory/verification-5.md`.

## What was verified

- Clean `npm ci`, typecheck, lint, 9 unit/integration tests, production build,
  and the full 35-test local browser suite passed.
- All 12 exact commands in `.factory/claims.json` passed separately via `/demo`.
- Every public production artifact matched the live deployment byte-for-byte.
  The production-safe live acceptance suite passed 34/34.
- One-click sample, isolated demo storage, capacity rules, normal/boundary and
  invalid CSV recovery, 390 px mobile, keyboard/focus, reduced motion, offline
  reload, worker update, Axe, headers/caching, privacy requests, and the $29
  Sociobot license flow passed.
- Lighthouse mobile live `/demo`: 97 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP/LCP 1.0 s, TBT 190 ms, CLS 0.
- The Sociobot optional verify endpoint accepted 30 requests per client and
  returned 429 with `Retry-After: 4` for request 31 onward.

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm test
# Run each command in .factory/claims.json separately.
npm run test:ui
npm run build
```

Open `/demo` or choose **Try it with sample data**. It uses separate browser
storage; use **Reset demo** to reseed it or **Start for real** to discard it.

## Known gaps / next steps

No release-blocking gaps remain. This is a static local-first PWA, so consumer
package installation, backend health/persistence, sign-in, and runtime AI
checks do not apply. Deployment and DNS remain factory-owned.
