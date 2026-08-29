# Verification handoff — appointment-capacity-map-verify-2

## Outcome

**FAIL — do not release candidate
`01081fb0308756442e376a4c98f26e800a296ebc`.**

Tested on 2026-08-29 at
`https://appointment-capacity-map.sociobot.in/`. The live deployment matches
the candidate production build byte-for-byte, so this is not a deployment-only
failure. Full evidence is in `.factory/verification-2.md`.

## Release blockers

1. `@claim:daily-license-check` is flaky and the product can call license
   verification twice within one day when reload interrupts the first request.
   Its required standalone run failed; a ten-run stress check failed 5/10.
2. CSV import silently accepts unknown row types and replaces the existing
   notebook with an empty plan. This falsifies the “checked replacement plan”
   claim and risks local data loss.

## Other defects

- **High:** a newly installed waiting service worker does not trigger the
  in-app update notice; the page remains on the old build.
- **High:** the conflict claim test covers only service-pair conflicts, and the
  fourteen-day claim has no range-boundary assertion.
- **Medium:** danger red on paper is 4.36:1 and the ochre paid marker is 4.49:1,
  below the 4.5:1 small-text requirement.
- **Low:** the design document names a nonexistent prompt-sidecar filename;
  provenance exists at `src/assets/capacity-notebook.png.json`.

## Passing evidence

- Cold first-read and one-click isolated demo pass on desktop and 390 px.
- `npm ci`, audit, typecheck, lint, 5 unit/contract tests, exact build, and one
  full 20-test Playwright run pass.
- Seven of eight mandatory claim commands pass independently.
- Normal setup, overlap explanation, adjacent-time boundary, persistence,
  malformed-header recovery, export/import happy path, and demo isolation work.
- Live demo traffic remains same-origin; no analytics, external fonts, or
  console/page errors were observed.
- Offline reload works from cache `capacity-map-885b706a55d1`.
- Live Axe scans found zero violations; keyboard focus, reduced motion, mobile
  layout, and 44 px targets pass.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.1 s, TBT 110 ms, CLS 0.
- Bundles pass: JS 29.58 KB raw / 10.03 KB gzip, CSS 12.42 KB raw / 3.52 KB
  gzip, illustration 30.64 KB.
- Headers, immutable hashed-asset caching, manifest MIME, routes, discovery,
  and real 404 behavior pass.
- License endpoint rate limit observed: 30 accepted requests in a 40-request
  burst, then 10 HTTP 429 responses with `Retry-After: 4`.

## Verification commands

```sh
npm ci
npm audit --audit-level=moderate
npm run typecheck
npm run lint
npm test
npm run test:claims
npm run test:ui
npm run build
```

No product code was changed. Only this handoff and the second independent
verification report were added/updated. Repair the blockers, add regressions
for invalid CSV and a real two-build worker update, correct contrast, then rerun
every claim independently from a fresh installed checkout.
