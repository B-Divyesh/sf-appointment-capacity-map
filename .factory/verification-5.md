# Independent verification 5 — PASS

- **Candidate:** `ac6caa2997b842bc0fa4879d2e14f3f0f1fbe3f1`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Date:** 2026-08-29
- **Artifact:** local-first offline PWA
- **Verdict:** **PASS — release candidate accepted**

Fresh independent verification after the prior failure. The live public build
artifacts match this commit. The previously found staff/service eligibility,
cross-midnight, destructive cascade, proposal feedback, and focus defects are
covered by passing regressions and did not reproduce.

## Mandatory first gates

### Claims — PASS

`.factory/claims.json` exists with twelve entries. After clean locked `npm ci`
(140 packages; audit: 0 vulnerabilities), every exact listed command was run
separately through the demo entry point and passed:

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `offline-reload` | PASS |
| `csv-roundtrip` | PASS |
| `privacy-local-only` | PASS |
| `conflict-explanation` | PASS |
| `two-week-review` | PASS |
| `daily-license-check` | PASS |
| `plus-price` | PASS |
| `core-free` | PASS |
| `no-calendar-booking-payment` | PASS |
| `availability-check` | PASS |
| `license-request-data` | PASS |

### Cold first-read and demo — PASS

In a fresh live browser context the first screen said **“Check which service
jobs can overlap”** and “For service businesses with two to ten people who need
clear answers before adding work to the calendar.” The one-click primary action
is **Try it with sample data**, with immediate outcome “Loads a separate
notebook with a realistic day plan.” The same screen gives three plain facts:
browser-local data, offline after first visit, and free core/$29 once Plus.
One click opens the realistic isolated `/demo` notebook and its persistent
**Reset demo** and **Start for real** controls.

## Local candidate verification

| Check | Evidence |
| --- | --- |
| Exact checkout | `HEAD` was `ac6caa2997b842bc0fa4879d2e14f3f0f1fbe3f1`; tree clean before verification. |
| Static checks | `npm run typecheck` and `npm run lint` passed. |
| Unit/integration | `npm test` passed: 9 tests in 2 files. |
| Claims | All 12 exact per-claim commands passed independently. |
| Browser suite | `npm run test:ui` passed 35/35, including 390 px, keyboard, Axe, offline, and two-build service-worker update coverage. |
| Production build | `npm run build` passed and produced `dist/`. |
| Budget | JS 36.59 kB raw / 12.07 kB gzip; CSS 12.53 kB raw / 3.53 kB gzip; hero WebP 30.64 kB. All pass the 200/50/300 kB budgets. |

The regression suite verifies form/import staff-service eligibility,
cross-midnight conflicts while allowing exact endpoints, confirmed setup
cascades, retained live proposal feedback, and sheet focus restoration.

## Live acceptance verification

- Production-safe Playwright claims and planner coverage passed **34/34**
  against the custom domain: normal/boundary/invalid CSV paths, eligibility,
  cross-midnight, fourteen-day boundaries, routing, desktop, 390 px mobile,
  keyboard, and licensing.
- Live Axe scans found zero serious/critical issues on `/`, `/demo`,
  `/demo/setup`, `/demo/review`, `/setup`, `/review`, `/privacy`, `/terms`, and
  `/404.html`. Each had one h1, main, `lang="en"`, and a route-specific title.
  Offline mobile demo: 0 px horizontal overflow; reduced-motion maximum was
  0.00001 s; no console/page errors.
- Request logs from fresh demo load, worker install/reload, and offline reload
  made no external requests. There are no analytics, third-party scripts, or
  external fonts. License verification is the only declared external connection
  and the claim test proved its bodyless GET has only the license parameter.
- After one live visit, the service worker controlled `/demo`; offline reload
  returned HTTP 200 with the sample job and banner. The independent local
  two-build worker update test passed with the visible **Refresh now** path.
- Headers: CSP including `frame-ancestors 'none'`, HSTS, Referrer-Policy,
  Permissions-Policy, nosniff, and frame denial. Hashed JS/CSS are one-year
  immutable; manifest is typed/no-cache; worker is no-store; unknown route is
  styled HTTP 404.
- Lighthouse 12.8.2 mobile `/demo`: Performance **97**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP **1.0 s**, LCP **1.0 s**, TBT
  **190 ms**, CLS **0**.
- License allowance: one client received 200 for requests 1–30 and 429 for
  requests 31–40 with `Retry-After: 4`. Observed allowance: **30/burst window**.
  No sign-in exists, so external identity requirements do not apply.

## Deployment identity

SHA-256 comparison showed every public local `dist/` artifact matches live:
HTML, hashed JS/CSS/WebP, worker, manifest, offline/404 pages, icons, social
image, robots, sitemap, and fallback CSS. `staticwebapp.config.json` is
correctly not public deployment configuration. Live uses `index-BYcxnMl_.js`,
`index-BBVmBia4.css`, and footer build ID `0a2618594d7c`.

## Defects and conclusion

No release-blocking, high, medium, or low severity defects were found.
**PASS.** The local-first PWA meets the researched small-team capacity-planning
job without calendar sync, public booking, direct payments, or employee
tracking.
