# Repair handoff — appointment-capacity-map-repair-2

## Outcome

Repaired every release-blocking and supporting product-QA finding in verifier
report commit `9c5a31d8fcbe867339f91c1730f53dbe6cec6e9b` for candidate
`01081fb0308756442e376a4c98f26e800a296ebc`. The original `pwa-offline`
artifact and static Azure deployment class are unchanged.

The repaired app is deployed at
`https://appointment-capacity-map.sociobot.in/`. Azure deployment ID:
`f6edbaee-2959-45ae-a880-e37aba18d4e1`. The shipped PWA content version is
`c66320a8227f`.

## Finding-to-fix map

| Verifier finding | Root-cause repair | Exact regression |
| --- | --- | --- |
| Reload could start a second license check before the first response was cached | A token-specific, optimistic check record is written synchronously before fetch. Reloads use that daily record even when the original request is interrupted. HTTP failures retain the cached verdict and do not cause request loops. | `@claim:daily-license-check` delays and interrupts the first response with a reload, asserts one request, expires the record, then proves a revoked verdict locks Plus. It passed independently and 20/20 stress runs. |
| Unknown CSV row types silently emptied the notebook | Import now requires the exact schema and an allow-listed row type, validates integers and required fields, rejects duplicate IDs, and validates every reference before replacing or saving data. Any failure preserves the current notebook. | `@claim:csv-roundtrip` and `rejects an unknown CSV row type without replacing the notebook` import the verifier's exact `unknown,bad,Unsupported row` case, assert the announced error, and prove sample data survives reload. |
| A real waiting worker did not show the update notice | The `updatefound` handler captures the installing worker and watches that instance instead of reading `registration.installing` after it becomes null. | `shows and applies an update from a real waiting service worker` builds `qa-old` and `qa-new`, observes the notice, chooses Refresh now, and verifies the new footer version. |
| Conflict and fourteen-day claims were under-proved | Expanded the browser claim tests without changing the claims or product behavior. | `@claim:conflict-explanation` now proves person, shared-resource, and service-pair reasons. `@claim:two-week-review` proves offset 13 is included and offset 14 is excluded. |
| Danger and paid-marker colors missed 4.5:1 | Darkened red-pencil to `#b5483f` and ochre to `#a35614`, preserving the notebook palette. | Unit contract calculates WCAG relative luminance and enforces both tokens at 4.5:1 or higher on paper: 4.66:1 and 4.74:1. |
| Art prompt sidecar path was wrong | Corrected the design provenance path to the committed `src/assets/capacity-notebook.png.json`. | Repository path inspected during handoff. |

Previously passing setup, booking boundaries, persistence, export/import happy
path, isolated demo, offline reload, privacy, routing, mobile, keyboard,
reduced-motion, accessibility, licensing, response policy, performance, and
identity behavior remains covered.

## Clean verification evidence

Run from the committed tree with Node 22 and Playwright 1.58.2:

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

- Clean install: 140 packages; audit found 0 vulnerabilities.
- TypeScript and ESLint: pass.
- Vitest: 6/6 rule and release-contract tests pass.
- Claims: all eight commands in `.factory/claims.json` pass independently from
  fresh browser contexts. The interrupted license-check test also passed 20/20
  repeated runs; the unfixed candidate reproduced 3 failures in 10 runs.
- Playwright: 22/22 tests pass. Coverage includes desktop, 390 px mobile,
  keyboard, 44 px targets, reduced motion, route history/focus, privacy
  requests, invalid CSV recovery, offline reload, and real two-build PWA update.
- Axe: zero violations on `/`, `/demo`, `/privacy`, and `/terms`, both locally
  and on the deployed custom domain.
- Production build: `dist/index.html` exists. Initial JS is 31.94 KB raw /
  10.78 KB gzip; CSS is 12.42 KB raw / 3.52 KB gzip; the illustration is
  30.64 KB. These are below the 200 KB JS, 50 KB CSS, and 300 KB image budgets.
- Lighthouse 13 mobile on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.90 s, LCP 1.13 s, TBT 0 ms, CLS 0.
- Static Web Apps emulator: `/`, `/demo`, `/privacy`, and `/terms` return 200;
  an unknown route returns the styled 404 with status 404. The manifest has
  `application/manifest+json` and `no-cache`; hashed JS is immutable for one
  year. CSP, Permissions-Policy, Referrer-Policy, nosniff, and frame denial are
  present.
- Factory URL smoke checks pass locally and live on all four routes: correct
  title/lang, one H1, main landmark, alt text, labelled buttons, and no console
  errors. Live measured loads were 560–795 ms.
- `.factory/copy-audit.md` remains clean: no first-screen sentence exceeds 22
  words and no banned marketing term is present.

## Live deployment evidence

- `/`, `/demo`, `/privacy`, `/terms`, `/manifest.webmanifest`, `/sw.js`,
  `/robots.txt`, and `/sitemap.xml` return 200 over HTTPS; an unknown path
  returns 404.
- Local and live SHA-256 digests match for `index.html`, `sw.js`, the manifest,
  robots, sitemap, 404 page, hashed JS/CSS, and the WebP illustration.
- Live headers include HSTS, CSP, Permissions-Policy, Referrer-Policy,
  `X-Content-Type-Options`, and `X-Frame-Options`; cache and MIME policies match
  the production configuration.
- A fresh live demo is controlled by the service worker and uses cache
  `capacity-map-c66320a8227f`. It reloads offline with the sample plan and
  correct title. The complete observed flow stays on the product origin and
  emits no console or page errors.
- The live Sociobot endpoint returns `{ valid: false, reason: "invalid" }` for
  a synthetic invalid token. Recorded browser tests cover the daily request
  cap and revoked-license behavior without a real purchase or spend.

## Deployment and rollback

Build and deploy with:

```sh
npm run build
/opt/fleet/lib/deploy-static.sh appointment-capacity-map /work/repo/dist
```

Azure Static Web Apps reused `sf-appointment-capacity-map` in `centralus`; the
custom domain and managed TLS were ready. Roll back by building a prior commit
and running the same static deploy command.

## Known gaps

No release-blocking product gaps remain. Package/consumer, backend health, and
sign-in checks do not apply to this static local-first PWA. The researched
`.factory/brief.json` was absent from the supplied base, so no brief was
invented; the existing product scope and `.factory/design.md` were preserved.
