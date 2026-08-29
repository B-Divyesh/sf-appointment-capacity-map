# Independent product verification 8 — Capacity Map

- **Candidate:** `75d21186a2cb0f6ea0869070a03184ef187a8b34`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Verified:** 2026-08-29 UTC
- **Verdict:** **PASS — release candidate accepted**

## Acceptance result

This is a local-first PWA for two-to-ten-person service businesses. It lets a
small crew model people, services, shared resources, and no-overlap rules, then
see whether a proposed job fits before changing their existing calendar. It is
not a booking system, calendar sync, payment form, or employee-tracking tool.

Fresh cold-read evidence from the deployed home page passed the mandatory
plain-words/demo gate:

- **What it does:** “Check which service jobs can overlap.”
- **For whom:** “For service businesses with two to ten people …”
- **What to click first:** “Try it with sample data,” followed immediately by
  “Loads a separate notebook with a realistic day plan.”

The one click opens `/demo`, which immediately shows Ava, Leo, three services,
two shared resources, three jobs, and the persistent **Demo — sample data,
nothing is saved to your notebook** banner with Reset demo and Start for real.

`.factory/brief.json` is absent from this candidate, so the supplied researched
brief in the work order was used as the scope contract. This is not a product
defect because the delivered product matches that contract.

## Mandatory claims gate — PASS

After `npm ci`, every one of the 14 exact commands in `.factory/claims.json`
was invoked separately against the shipped demo entry point. Each passed.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `capacity-setup` | PASS |
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
| `generated-art-disclosure` | PASS |

The unfiltered clean claim suite also passed 14/14. Landing-page and README
copy was cross-checked against the claim list; no material user-facing claim
was unlisted.

## Clean-checkout quality gates — PASS

| Check | Evidence |
| --- | --- |
| Candidate identity | Clean worktree at exactly `75d21186a2cb0f6ea0869070a03184ef187a8b34` before QA documents were written. |
| Install/audit | `npm ci` installed 140 packages; `npm audit --audit-level=moderate` reported 0 vulnerabilities. |
| Unit/release tests | `npm test`: 13/13 passed. |
| Type/lint | `npm run typecheck` and `npm run lint` passed. |
| Production build | `npm run build` passed and created `dist/`. |
| Browser suite | `npm run test:ui` ran its 43 Chromium checks, including normal, malformed-input, keyboard, mobile, PWA update, and regression coverage, without a failure. |
| Bundle budgets | JS 38.01 kB raw / 12.60 kB gzip; CSS 12.67 kB raw / 3.58 kB gzip; hero WebP 30.64 kB. All are inside the stated PWA budgets. |

## Independent functional evidence — PASS

On a fresh live demo context, the normal flow started with 3 seeded jobs,
opened a bookable Consultation with Leo proposal, and saved it as a fourth job
after the visible “Clear job added” confirmation. A midnight boundary test
saved an Ava consultation from 23:30 for 60 minutes, moved to 00:00 next day,
and then blocked the next Ava proposal before save with:

> Cannot add this job yet — Ava is at capacity — 2 overlapping jobs would use
> Ava; their limit is 1.

The save button was disabled. A malformed `bad.csv` import returned “This does
not look like a Capacity Map CSV.” while Ava and the existing demo plan
remained present. The dedicated claims also cover staff/resource/service-pair
explanations, CSV replacement, demo isolation, day-13/day-14 review limits,
and license revocation.

No sign-in is used, so the Entra tenant requirement is not applicable. This is
not a library, CLI, backend, or server-persistence product; consumer install,
concurrency, health, and persistence-boundary tests are not applicable.

## Live privacy, security, deployment, and PWA — PASS

- A fresh live demo planning/import flow made requests only to
  `https://appointment-capacity-map.sociobot.in`; there were no analytics,
  third-party scripts, fonts, tracking calls, console errors, or page errors.
- The optional license claim test proves the bodyless GET contains only the
  pasted license query parameter. The documented product-side once-per-day
  check passed.
- The live Sociobot verifier allowance was independently probed with one
  invalid-token client: requests 1–30 returned 200; requests 31–40 returned
  **429** with **`Retry-After: 2`**. Observed allowance: **30 requests per
  burst/client window**.
- The registered checkout endpoint returns HTTP 303 to hosted Dodo checkout;
  no payment fields are embedded in the application.
- Live responses include CSP with response-header `frame-ancestors 'none'`,
  HSTS, `nosniff`, `X-Frame-Options: DENY`, strict-origin referrer policy, and
  camera/microphone/geolocation denial. Hashed assets are immutable for one
  year; HTML revalidates after 30 seconds; worker is no-store and manifest is
  no-cache. An unknown URL returns the designed HTTP 404.
- Local and live SHA-256 match byte-for-byte for the deployed JS, CSS, and
  service worker: JS `bf245a2003831c794d4b7fc6bb6b09f88f10c3cb0c3003f8d034da8115584155`,
  CSS `097f4ae90cf4c831062de7d778114c605931124bc0ff73f8f8f6590988ebee08`,
  worker `242ca565271566d6d9e6030f671829fab5bcc95e7e2749b71ecab016b8c47e74`.
  The shared live/local PWA version is `1290c4aced28`.
- A live browser registered and controlled the service worker; after going
  offline, reloading `/demo` retained the sample job and heading with no
  console errors. The local two-build waiting-worker test in the browser suite
  exercises the update notice and Refresh now path (`qa-old` to `qa-new`).

## Accessibility, responsive behavior, and performance — PASS

- Live axe scans on `/`, `/setup`, `/review`, `/demo`, `/demo/setup`,
  `/demo/review`, `/privacy`, `/terms`, and `/404.html` found **zero serious or
  critical violations**. Every route had `lang="en"`, one `<h1>`, a `<main>`,
  a route-specific title, and no console/page errors.
- The repository has no `verify-url.sh`; equivalent live checks for title,
  language, landmarks, image alternatives, errors, and headers were completed
  directly with Playwright and the results above.
- At 390 × 844 the demo had document width 390 with no horizontal overflow.
  All visible interactive controls were at least 44 px high. Keyboard Tab gave
  the skip link a designed 3 px focus outline, Enter moved focus to main, then
  activated the sample-demo link. Reduced-motion animation duration was
  effectively zero (`0.00001s`).
- Mobile Lighthouse on the live home page: **Performance 99**,
  **Accessibility 100**, FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 100 ms.

## Defects

None found. No product source code was modified during this verification.
