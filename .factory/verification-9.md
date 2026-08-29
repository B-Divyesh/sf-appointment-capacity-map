# Independent verification 9 — appointment-capacity-map

**Result: PASS**

Verified on 2026-08-29 from a clean checkout at candidate commit
`b070c3cddecbc458526e8661c3b024c96c6940f1` against
`https://appointment-capacity-map.sociobot.in/`.

## Release decision

The candidate meets the researched brief for a local capacity-planning PWA: a
small service team can model people, services, shared resources and
service-pair rules, then see an explainable answer before adding a job. It
does not masquerade as a booking product.

The live deployment is the candidate product build. Fresh local `dist/` and
the live response matched byte-for-byte for `index.html`, the JavaScript,
CSS, illustration, `sw.js`, and `manifest.webmanifest`. Both service worker
and footer identify build `75c6ab225c95`. The Git candidate's latest commit
only changes factory documentation, which is deliberately outside the build
version inputs.

## First-read, live and cold

PASS. A cold desktop visit returned 200 with no console or page errors. The
first screen says **“Check which service jobs can overlap”**, says it is for
service businesses with two to ten people, and makes **“Try it with sample
data”** the first primary action. Its adjacent text says the click loads a
separate notebook with a realistic day plan. The demo route displayed the
persistent sample-data banner, reset, and start-for-real controls.

`/opt/fleet/lib/verify-url.sh` passed against the live root: 676 ms measured
load, title, `lang=en`, one h1, a main landmark, complete image alternatives,
labelled controls, and no console errors. Its screenshots and JSON are
untracked reproducible evidence under `.factory/evidence/verification-9/`.

## Required claim tests

`npm ci` was run first from this checkout (0 audit vulnerabilities). Every
exact command declared in `.factory/claims.json` was then run from its demo
entry point; all passed.

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

## Local quality gates and product exercise

| Check | Evidence | Result |
| --- | --- | --- |
| Unit/integration tests | `npm test` | PASS, 15/15 |
| Type check | `npm run typecheck` | PASS |
| Lint | `npm run lint` | PASS |
| Production build | `npm run build` | PASS; `dist/` produced |
| Browser suite | `npm run test:ui` | PASS, 43/43 (`test-results/.last-run.json`) |
| Initial bundle | build output | 12.59 kB gzip JS; 3.58 kB gzip CSS; 30.64 kB WebP |

The 43 browser checks exercised normal planning, clear and blocked bookings,
midnight boundary handling, malformed and unknown CSV recovery without data
loss, invalid team/service relationships, demo isolation, CSV export/import,
390 px layout, touch targets, keyboard-only use and focus restoration,
reduced motion, real two-build service-worker update, offline reload, and
serious/critical Axe scans of the key routes. All passed.

The standalone `@axe-core/cli` could not locate a system Chrome in this
container; this is an environment limitation, not a product scan omission:
the passing browser suite uses Axe through Playwright against the production
build and includes the required serious/critical checks.

## Privacy, network, PWA and headers

- Cold live request logging showed only the product origin: document,
  same-origin JavaScript, CSS and illustration. The declared privacy claim
  additionally passed while creating a demo booking and using data tools.
- No analytics, third-party script, font, calendar, public-booking or direct
  payment request was observed. The only external product endpoint is the
  explicit Sociobot checkout/license path. The license-payload claim passed:
  verification is a bodyless GET with only the pasted token.
- Live headers include a self-only CSP with the explicit Sociobot
  `connect-src`, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options:
  DENY`, strict referrer policy, and restrictive permissions policy. Hashed
  JavaScript is `public, max-age=31536000, immutable`; HTML is short-lived.
- The live manifest and service worker byte-match the candidate. The offline
  reload and real waiting-worker update behavior passed in isolated browser
  contexts in the full suite.
- The invalid-token license verify endpoint admitted 30 requests in a
  single-client burst, then returned HTTP **429** on request 31 with
  `Retry-After: 4` and `X-RateLimit-After: 4`. A follow-up burst remained
  limited. This confirms the documented endpoint allowance is enforced.

## Deployment match and defects

The live root and `/demo` returned 200 and use the candidate assets. The
candidate build output matched all six deployed product artifacts listed in
the release decision byte-for-byte.

No release-blocking, high, medium, or low product defects were found.

## Reproduce

```sh
npm ci
npm run test:claims -- --grep @claim:<each-id-from-.factory/claims.json>
npm test
npm run typecheck
npm run lint
npm run build
npm run test:ui
/opt/fleet/lib/verify-url.sh https://appointment-capacity-map.sociobot.in .factory/evidence/verification-9
```
