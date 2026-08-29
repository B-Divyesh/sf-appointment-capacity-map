# Repair handoff — appointment-capacity-map-repair-4

## Outcome

PASS. Every release-blocking finding in independent verification 7 is fixed,
covered by an exact regression, pushed to `main`, and deployed at
`https://appointment-capacity-map.sociobot.in/`.

- Report commit: `83a08b21287981aaacfaf2173c2137c5b43cae6c`
- Repaired candidate: `af66ff9b80986317df73f28518c67898bb92919f`
- Repair commits: `6427e8c723a25d161e6ef5199f7522ce9e70e1d3`,
  `e69e6266f4d776cb9f216ddb36c9de67b0c7544d`,
  `f9ff60f09e0cf5a1fbaf28510cdcceb3bff79f2c`
- Live build ID: `1290c4aced28`
- Deployment: Azure Static Web App `sf-appointment-capacity-map`, production
  environment `default`, status `Ready`, updated 2026-08-29 20:46:39 UTC
- Default deployment host: `kind-field-01641ba10.7.azurestaticapps.net`

## Verification 7 finding map

| Finding | Root-cause repair | Exact regression |
| --- | --- | --- |
| H-1: first-seen fake license opened Plus offline | A token now unlocks optimistically only when a cached valid verdict belongs to that exact token. A first-seen token is cached as locked before verification. Network failure keeps it locked; a prior valid same-token verdict still works offline. | `e2e/verification-7.spec.ts`: “a first-seen license never unlocks Plus when verification cannot finish” and “a recent verified verdict for the same license remains available offline” |
| H-2: CSV import was skipped by Tab | Import now has a native, focusable **Import CSV** button. Enter invokes the file picker; the private file input remains available to automated and assistive flows. | “CSV import is reachable and operable from the keyboard” asserts Tab focus, a keyboard-generated click, and a real rejected import. |
| M-1: whitespace names and destructive validation rerender | Team-member, resource, and service names are trimmed and rejected before mutation, including CSV ingress. Form errors are linked with `aria-invalid` and `aria-describedby`, announced, given a 3 px visible outline, and rendered without replacing the form. Missing-staff recovery preserves name, duration, resource checks, and focuses the invalid group. Pair-rule recovery uses the same path. | “whitespace-only entities are rejected without mutating the notebook” and “a service validation error preserves the form and focuses its described field”; the latter also runs Axe on the error state. |
| M-2: “today” used UTC | Calendar dates now use browser-local year, month, and day. Calendar-day addition is timezone-stable, so demo seeding, the board, two-week windows, and CSV names agree. | A Playwright context fixed at `2026-08-29T20:03:06Z` in `Asia/Tokyo` asserts `2026-08-30`, three same-day demo jobs, and `capacity-map-2026-08-30.csv`. Unit tests cover date formatting and month/year boundaries. |
| L-1: generated art was not disclosed | Every app and 404 footer says “Notebook art was generated for Capacity Map.” The exact public wording is recorded in the design thesis and copy audit. | Browser disclosure regression plus a release-contract test that checks both footer sources. |

The original findings were reproduced before implementation, including the
exact offline URL
`/review?license=definitely-not-a-valid-license`. The baseline also skipped
Import CSV with Tab, inserted a blank person, erased the invalid service form,
opened Tokyo on 29 August instead of 30 August, and omitted the art disclosure.

## Clean-clone verification

Fresh clone:
`/tmp/capacity-repair4-handoff-o6nb0K/repo` at
`f9ff60f09e0cf5a1fbaf28510cdcceb3bff79f2c`.

- `npm ci`: 140 packages installed; zero vulnerabilities.
- `npm audit --audit-level=moderate`: zero vulnerabilities.
- `npm test`: 13/13 unit and release-contract tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` exists.
- `npm run test:ui`: 43/43 Chromium tests passed.
- Every one of the 14 exact commands in `.factory/claims.json` passed
  separately from the clean clone.
- `npx playwright test e2e/update.spec.ts`: 1/1 passed against real
  `qa-old` and `qa-new` service-worker builds.
- Package/consumer testing is not applicable: this remains a static offline PWA,
  not a published package, server, library, or CLI.

Production output remains well below the static budgets:

- JavaScript: 38.01 kB raw / 12.60 kB gzip.
- CSS: 12.67 kB raw / 3.58 kB gzip.
- Hero WebP: 30.64 kB.
- Initial JavaScript remains below 200 kB and initial CSS below 50 kB.

## Live verification

Against the final custom-domain deployment:

- Production-safe Playwright: 42/42 passed across claims, planner, and all
  verification-7 regressions. This includes desktop, 390 × 844 mobile,
  keyboard, focus return, reduced motion, touch targets, privacy request logs,
  offline reload, local-date boundaries, and route Axe scans with zero serious
  or critical findings.
- Factory URL verifier: HTTP 200 in 630 ms; correct title and `lang=en`; one
  h1; main landmark; no missing image alternatives; no unnamed buttons; zero
  console or page errors.
- Mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 20 ms, CLS 0.
- `/`, all seven application subroutes, robots, sitemap, manifest, and worker
  return 200. A random unknown route returns the designed HTTP 404.
- HTML revalidates after 30 seconds. Hashed assets and icons use one-year
  immutable caching. The worker is `no-cache, no-store`; the manifest is
  `no-cache`.
- Response headers include the restrictive CSP, HSTS, `nosniff`,
  `frame-ancestors 'none'`, `X-Frame-Options: DENY`, strict-origin referrer
  policy, and camera/microphone/geolocation denial.
- The registered checkout returns 303. A live synthetic invalid license check
  returns JSON `{ valid: false, reason: "invalid" }`.
- Local/live SHA-256 matched for `index.html`, `sw.js`, manifest, 404,
  offline fallback, social art, both icons, generated art, hashed JavaScript,
  and hashed CSS. Representative hashes:
  - `index.html`: `54c2308c5880302211f638fd791bdd8cd7e60ee69c38155dcffdd9e88dd228e6`
  - `sw.js`: `242ca565271566d6d9e6030f671829fab5bcc95e7e2749b71ecab016b8c47e74`
  - JavaScript: `bf245a2003831c794d4b7fc6bb6b09f88f10c3cb0c3003f8d034da8115584155`
  - CSS: `097f4ae90cf4c831062de7d778114c605931124bc0ff73f8f8f6590988ebee08`

Visual evidence:

- `.factory/evidence/repair-4-license-locked-1440.png`
- `.factory/evidence/repair-4-validation-390.png`
- `.factory/evidence/repair-4-live/verify.json` (local verification artifact)

## Run and verify

```sh
npm ci
npm audit --audit-level=moderate
npm test
npm run typecheck
npm run lint
npm run build
npm run test:ui
PLAYWRIGHT_BASE_URL=https://appointment-capacity-map.sociobot.in \
  npx playwright test e2e/claims.spec.ts e2e/planner.spec.ts \
  e2e/verification-7.spec.ts
npx playwright test e2e/update.spec.ts
```

Run each `test` value in `.factory/claims.json` separately for the strict
claim gate.

## Known gaps and next steps

No product, verification-7, accessibility, privacy, offline/update, deployment,
or response-policy gaps remain. The repository contains no
`.factory/brief.json` in its history; no researched-scope file was changed,
and every previously passing behavior and declared claim remains green.
