# Independent verification 3 — PASS

- **Candidate:** `d5374c58b0429b0b17cb29c69306f8895fe62d59`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Date:** 2026-08-29
- **Artifact:** local-first offline PWA
- **Verdict:** **PASS — release candidate accepted**

The live deployment is this candidate, not a deployment-only variant. Fresh production output SHA-256 hashes matched the live `index.html`, service worker, manifest, 404 page, robots file, sitemap, JavaScript, CSS, and illustration.

## Mandatory first checks

### Claims — PASS

`.factory/claims.json` exists and contains eight runnable claims. After a clean `npm ci`, I ran every listed command independently, each against its shipped demo entry point. All passed (one Playwright test each):

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

The tests prove the isolated `demo:capacity` namespace, online-first then offline reload, full CSV export plus validated replacement import, same-origin demo traffic, person/resource/service-pair explanations, the day-13/day-14 fourteen-day boundary, one license verification per local day with revocation, and the exact $29 registered checkout URL.

### Cold first-read and demo — PASS

A fresh live desktop context displayed: **“Check which service jobs can overlap.”** It says this is for **“service businesses with two to ten people”** and the primary action is **“Try it with sample data”**, immediately followed by **“Loads a separate notebook with a realistic day plan.”** It also shows the three required local-storage, offline, and price facts. One click opens `/demo` with Ava, Leo, three services, shared resources, jobs, and the persistent “Demo — sample data, nothing is saved to your notebook” banner with Reset demo and Start for real. This satisfies what it does, who it is for, and what to do first in plain words.

## Local candidate checks

| Check | Result and evidence |
| --- | --- |
| Clean install/audit | `npm ci` installed 140 packages; `npm audit --audit-level=moderate` reported 0 vulnerabilities. |
| Type/lint/unit | `npm run typecheck`, `npm run lint`, and `npm test` passed; Vitest 6/6. |
| Browser suite | `npm run test:ui` passed; `test-results/.last-run.json` records `status: passed` and no failed tests (22 tests). Includes a two-build real service-worker-update test. |
| Production build | `npm run build` passed and created `dist/`. Initial JS is 31.94 kB raw / 10.78 kB gzip; CSS 12.42 kB raw / 3.52 kB gzip; hero illustration 30.64 kB. All are under the static-PWA budgets. |
| Live Lighthouse mobile | Performance 92, Accessibility 100, Best Practices 100, SEO 100. FCP 1.1 s, LCP 1.2 s, CLS 0, interactive 1.6 s. |

## Independent live exercise

- Normal flow: in a clean `/demo` context, proposed **Consultation with Leo** at 09:00 was accepted, produced “Clear job added,” and appeared in the board.
- Boundary/conflict behavior: the supplied claim test independently proves staff-capacity, shared-chair, and service-pair explanations, as well as the fourteen-day inclusion boundary. The full UI suite covers booking persistence.
- Invalid/recovery: uploading malformed CSV produced “This does not look like a Capacity Map CSV.” without replacing the sample; the claim and UI tests also prove rejection of an unknown row type and preservation of existing data.
- PWA: live `/demo` became service-worker controlled after first visit and retained its sample plan/title on an offline reload. The local two-build browser test observed the update notice and successful refresh to a waiting worker.
- Privacy: a fresh live demo planning/import flow made requests only to `https://appointment-capacity-map.sociobot.in`; no analytics, CDN font, or third-party script request occurred. No console errors or page errors were observed. The optional license path was not activated in that privacy flow.
- Accessibility: independent Axe runs on `/`, `/demo`, `/privacy`, and `/terms` returned zero serious or critical violations. On both desktop and 390 px, first Tab reached the visible 3 px skip-link outline. At 390 px the tab row and page had `scrollWidth === clientWidth === 390`; reduced motion reduced animation duration to 0.00001 s. The complete suite also verifies 44 px control heights and route/history focus behavior.
- Headers/caching: live routes returned HTTPS 200 (unknown route 404), CSP with `frame-ancestors 'none'`, HSTS, Permissions-Policy, Referrer-Policy, `X-Content-Type-Options: nosniff`, and X-Frame-Options. The manifest is `application/manifest+json` with `no-cache`; worker is no-store; hashed assets are `public, max-age=31536000, immutable`.

## License endpoint allowance

No sign-in is required. The only server-side product call is optional Sociobot license verification. In a fresh sequential one-client synthetic-invalid-token probe, requests 1–30 returned HTTP 200; request 31 and requests 32–40 returned HTTP 429 with `Retry-After: 2` or `3`. Observed allowance: **30 verification requests per burst/client window**. The product-side once-per-day check claim also passed.

## Defects by severity

None found. There are no release-blocking, high, medium, or low defects from this verification.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
# run each exact test string in .factory/claims.json independently
npm run test:ui
npm run build
```

