# Independent verification 2 — FAIL

- **Acceptance candidate:** `01081fb0308756442e376a4c98f26e800a296ebc`
- **Deployment:** `https://appointment-capacity-map.sociobot.in/`
- **Date:** 2026-08-29
- **Artifact:** offline/local-first PWA
- **Verdict:** **FAIL — do not release**

The live HTML, JavaScript, CSS, service worker, manifest, illustration, robots,
sitemap, and 404 page match the candidate production build byte-for-byte. The
failures below are product failures, not a stale or failed deployment.

## Mandatory first gates

### Claim tests — FAIL

`.factory/claims.json` exists with eight entries. Before installing packages,
each listed command was invoked from the clean checkout as requested; all
stopped at the build step with `tsc: not found`. After `npm ci` from the locked
dependency tree, every listed command was run independently:

| Claim | Standalone result | Evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | One Playwright test passed. |
| `offline-reload` | PASS | One Playwright test passed. |
| `csv-roundtrip` | PASS | One Playwright test passed. |
| `privacy-local-only` | PASS | One Playwright test passed. |
| `conflict-explanation` | PASS | One Playwright test passed. |
| `two-week-review` | PASS | One Playwright test passed. |
| `daily-license-check` | **FAIL** | Expected one verify request after reload; observed two at `e2e/claims.spec.ts:99`. |
| `plus-price` | PASS | One Playwright test passed. |

The license failure is reproducible but timing-dependent. Repeating only that
claim ten times produced **5 passes and 5 failures**. The full 20-test browser
suite happened to pass once, which does not repair the required standalone
failure. The implementation writes its daily-cache timestamp only after the
verification response completes; a reload before that write aborts the first
fetch and sends another. The privacy-page promise “no more than once a day” is
therefore false.

The claim tests also under-prove two listed promises:

- `conflict-explanation` checks only a service-pair conflict, not the promised
  person and shared-resource explanations in the browser.
- `two-week-review` checks conflicts on the sample's current day but never
  asserts the fourteen-day boundary.

### Cold first-read and one-click demo — PASS

Fresh 1440×900 and 390×844 browser contexts showed:

> Check which service jobs can overlap

> For service businesses with two to ten people who need clear answers before
> adding work to the calendar.

Primary action: **Try it with sample data**, followed by “Loads a separate
notebook with a realistic day plan.” The same first screen shows the local
storage, offline, and price facts. At 390×844 all three facts end by y=642 and
the primary action begins at y=399, so the required content is in the first
viewport. One click opens `/demo` with realistic data and the persistent demo
banner, Reset demo, and Start for real controls.

## Build and automated gates

| Check | Result |
| --- | --- |
| Install | `npm ci` PASS; 140 packages; 0 vulnerabilities. |
| Audit | `npm audit --audit-level=moderate` PASS; 0 vulnerabilities. |
| Typecheck | `npm run typecheck` PASS. |
| Lint | `npm run lint` PASS. |
| Unit/contract tests | `npm test` PASS; 5/5. |
| Full browser suite | `npm run test:ui` PASS in that run; 20/20. The standalone claim failure above remains blocking. |
| Exact production build | `npm run build` PASS; `dist/` produced. |
| URL smoke | Factory `verify-url.sh` PASS on live `/` (723 ms) and `/demo` (557 ms): title, lang, one h1, main, alt text, controls, console. |

## End-to-end product exercise

The normal live flow succeeded from an empty browser: add Maya with a parallel
limit of two, add a one-unit Treatment room, add Consultation and Deep
treatment services, create a no-overlap rule, add a clear treatment job, and
inspect the blocked consultation explanation. The app named the service-pair
rule and its note. A consultation starting exactly when the 60-minute treatment
ended was correctly shown as bookable. Refresh persistence worked.

Invalid form recovery passed for a service without a selected person and for a
pair rule that selected the same service twice. Both gave plain corrective
messages. The shipped malformed-header CSV test also preserves existing data.

### Release-blocking invalid CSV/data-loss defect

A CSV containing the exact expected header plus this plausible unsupported row
was imported into a fresh live demo:

```csv
type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt
unknown,bad,Unsupported row
```

The app showed no error, removed Ava and every sample record, and replaced the
demo with an empty notebook. Unknown row types are silently ignored and the
result is persisted as a successful replacement. This falsifies the listed
claim that import uses a “checked replacement plan” and creates avoidable local
data loss.

## Privacy, network, and licensing endpoint

- A fresh live normal setup flow requested only the document and three
  same-origin static assets. A fresh demo/import flow also stayed entirely on
  `https://appointment-capacity-map.sociobot.in`. No analytics, CDN fonts,
  scripts, calendar service, or other third party was contacted. There were no
  console or page errors.
- Playwright read the live `/demo` response headers: CSP with
  `frame-ancestors 'none'`, HSTS, Permissions-Policy, Referrer-Policy,
  `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` are present.
- The only product server endpoint is Sociobot license verification; no sign-in
  is required. Forty simultaneous synthetic-invalid verification requests
  returned **30 × 200** and **10 × 429**. Every 429 had `Retry-After: 4`.
  Observed burst allowance: **30 requests**.

## PWA and offline behavior

- Manifest name, 192/512 icons, maskable purpose, standalone display, palette,
  and build-versioned start URL are present.
- A fresh live `/demo` visit registered `/sw.js`, controlled the page, and
  created cache `capacity-map-885b706a55d1`. With the browser offline, `/demo`
  reloaded with the sample plan, correct title, and no console error.
- **Update behavior FAIL:** a controlled local test loaded build `qa-old`, then
  served build `qa-new` at the same origin and called `registration.update()`.
  The new worker reached `waiting: installed` and cache
  `capacity-map-qa-new` existed, but the promised “A new version is ready”
  notice never appeared. The controlled page remained on footer `vqa-old`.
  The state-change listener reads `registration.installing` after it has become
  null, so `updateWaiting` is not set reliably.

## Accessibility, responsive behavior, and motion

- Axe Playwright scans on live `/`, `/demo`, `/privacy`, and `/terms` found
  zero violations of any impact (and therefore zero serious/critical issues).
- There is one h1 and one main on every tested route; `lang=en`; headings,
  labels, image alt text, and route titles are present.
- Keyboard traversal reached the skip link, header links, all three planner
  tabs, primary demo action, setup action, Plus action, and footer links with a
  visible 3 px focus outline. The skip link moves focus to main. No trap was
  found.
- At 390×844 the document and tab bar were both exactly 390 px wide; no
  horizontal clipping occurred. No visible control was below 44×44 CSS px.
- With `prefers-reduced-motion: reduce`, the largest observed animation or
  transition duration was 0.01 ms.
- **Manual contrast miss:** `#b94e45` danger text on the `#f7f0df` paper is
  4.36:1, below the required 4.5:1 for its 13–14 px text. The `#a75a18` paid
  mark on paper is 4.49:1. Axe cannot reliably resolve the page's gradient
  background, so its clean automated result does not negate these token-level
  measurements.

## Performance, caching, routes, and identity

- Lighthouse 12.5.1 against live `/demo`, mobile defaults: Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.1 s, TBT
  110 ms, CLS 0.
- Production output: JS 29.58 KB raw / 10.03 KB gzip; CSS 12.42 KB raw / 3.52
  KB gzip; hero WebP 30.64 KB; no web-font payload. All budgets pass.
- Hashed JS, CSS, and image responses use
  `Cache-Control: public, max-age=31536000, immutable`; HTML uses 30-second
  revalidation; the service worker is no-store; the manifest is no-cache and
  served as `application/manifest+json`.
- `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`, offline/manifest/icon/social
  assets, robots, and sitemap return 200. A random unknown route returns the
  styled page with HTTP 404. Internal discovery URLs and the Sociobot
  attribution link are live. The checkout URL was inspected but not invoked.
- SHA-256 comparison matched local and live bytes for `index.html`, `sw.js`,
  `manifest.webmanifest`, hashed JS/CSS/WebP, `robots.txt`, `sitemap.xml`, and
  `404.html`.

Library/CLI consumer installation, backend health/concurrency, and Entra sign-in
checks are not applicable to this static PWA. `.factory/brief.json` is absent;
the researched brief supplied in the work order was used as the acceptance
contract.

## Defects by severity

### Blocker

1. **Required `daily-license-check` claim fails intermittently and the privacy
   promise is false.** Standalone first run observed 2 requests instead of 1;
   stress run failed 5/10.
2. **CSV “checked replacement” claim is false and permits destructive data
   loss.** An unknown row type is silently accepted and replaces the notebook
   with an empty plan.

### High

1. **The service-worker update notice does not appear with a real waiting
   worker.** Users can remain on an old installed build despite the documented
   update path.
2. **Two claim regressions do not cover their full promises.** Conflict UI is
   tested only for service pairs, and the fourteen-day review has no day-13 /
   day-14 boundary assertion.

### Medium

1. **Danger and paid-marker text tokens miss 4.5:1 contrast** on the paper
   surface (4.36:1 and 4.49:1 respectively).

### Low

1. `.factory/design.md` says the exact art prompt is in
   `capacity-notebook.prompt.json`; the committed sidecar is actually
   `src/assets/capacity-notebook.png.json`. Provenance content itself exists.

## Reproduction

```sh
npm ci
npm audit --audit-level=moderate
npm run typecheck
npm run lint
npm test
npm run test:claims -- --grep @claim:daily-license-check
npm run test:claims -- --grep @claim:daily-license-check --repeat-each=10
npm run test:ui
npm run build
/opt/fleet/lib/verify-url.sh https://appointment-capacity-map.sociobot.in/ /tmp/capacity-map-verify
```
