# Repair handoff — appointment-capacity-map-repair-1

## Outcome

Repaired every release-blocking, high, and medium product-QA finding in report
commit `75f77ef663dbff649554f489c3ff99b447efe906` for candidate
`e6a9ea4e1295e5854b66662e4de5e0639fc2b058`. The original `pwa-offline`
artifact and static Azure deployment class are unchanged.

The repaired app is deployed at
`https://appointment-capacity-map.sociobot.in/`. Azure deployment ID:
`051c2151-2627-4f54-bbbb-a093bfb6f654`. The shipped PWA content version is
`885b706a55d1`.

## Finding-to-fix map

| Verifier finding | Root-cause repair | Exact regression |
| --- | --- | --- |
| Claims file and claim tests absent | Added eight testable claims and one dedicated browser test per claim. | `src/release-contract.test.ts`; every command in `.factory/claims.json`; 8/8 passed independently. |
| No isolated one-click demo | `/demo` and `?demo=1` seed a realistic current-day plan under IndexedDB key `demo:capacity`. Reset restores it. Start for real deletes it before the real `capacity` key is read. Plus is previewable without a license or API request. | `@claim:demo-isolation`; `@claim:offline-reload`; `.factory/demo.md`. |
| Cold first screen unclear | The visible H1 names the job. The next sentence names two-to-ten-person service businesses. The primary action uses “Try it with sample data,” explains its result, and sits with privacy, offline, and price facts. | `cold first screen states…`; `.factory/copy-audit.md`. |
| CSP, routes, discovery, 404, MIME, and cache policy missing | Added Static Web Apps route rewrites, response CSP/security headers, immutable hashed assets, manifest MIME, a styled 404, robots, sitemap, canonical and social metadata. Privacy and terms now use real history-aware URLs. | `release contracts`; `loads routes…`; SWA emulator and live response checks below. |
| Fixed `capacity-map-v1` / `?v=1` | A SHA-256 digest of shipped source/config drives both the cache name and installed-app start URL. New workers wait and expose the existing refresh notice; activation clears older product caches. | `uses one build version…`; live cache `capacity-map-885b706a55d1`. |
| 390 px navigation clipped | The three planner tabs use an equal-width mobile grid with wrapped labels. | `fits planner navigation at 390px…`; screenshot `.factory/evidence/mobile-390.png`. |
| Vulnerable Vite/Vitest toolchain | Updated to Vite 6.4.3 and Vitest 3.2.7; added a real ESLint 10 TypeScript gate. | `npm audit --audit-level=moderate`: zero vulnerabilities. |
| TBT exceeded 200 ms | Kept the app dependency-light and added a long-task budget regression. | Lighthouse mobile TBT 0 ms; browser blocking-budget test passes below 200 ms. |

The previously passing capacity rules, clear booking, refresh persistence,
explainable conflict, CSV export, invalid-CSV recovery, offline reload, privacy,
keyboard, reduced-motion, accessibility, licensing, and update-notice behavior
remain covered.

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
- TypeScript: pass. ESLint: pass.
- Vitest: 5/5 tests pass across rule and release-contract suites.
- Claims: all eight `.factory/claims.json` commands pass independently from a
  fresh browser context.
- Playwright: desktop and 390 px mobile flows pass, including keyboard, route
  history/focus, reduced motion, 44 px mobile controls, same-origin privacy,
  offline demo reload, service-worker versioning, and Axe on `/`, `/demo`,
  `/privacy`, and `/terms`. No serious or critical Axe findings.
- Production build: `dist/index.html` exists. Initial JS is 29.58 KB / 10.03
  KB gzip; CSS is 12.42 KB / 3.52 KB gzip; the product illustration is 30.64
  KB. These are below the 200 KB JS, 50 KB CSS, and 300 KB image budgets.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- Static Web Apps emulator: `/`, `/demo`, `/privacy`, `/terms` return 200;
  `/does-not-exist` returns the styled page with 404; the manifest returns
  `application/manifest+json`; hashed JS returns
  `Cache-Control: public, max-age=31536000, immutable`.
- `/opt/fleet/lib/verify-url.sh` passes locally on all four routes and live on
  `/`: correct title/lang, one H1, main, alt text, labels, and zero console
  errors. Live load measured 772 ms in that smoke check.

## Live deployment evidence

- `/`, `/demo`, `/privacy`, `/terms`, `/manifest.webmanifest`, `/sw.js`,
  `/robots.txt`, and `/sitemap.xml` return 200 over HTTPS.
- An unknown live path returns 404.
- Live HTML, JavaScript, service worker, and manifest SHA-256 digests match the
  local production build byte-for-byte.
- Live headers include HSTS, CSP, Referrer-Policy, and
  `X-Content-Type-Options`; hashed JS is immutable for one year; the manifest
  is `application/manifest+json` with `no-cache`.
- A fresh live browser visit has an active controller and cache
  `capacity-map-885b706a55d1`. After going offline, `/demo` reloads with its
  sample plan. All requests in that flow remain on the product origin.
- The live Sociobot verify endpoint returns the expected `invalid` verdict for
  a synthetic invalid token. The browser tests prove daily caching and revoked
  license relocking without spending or using a real license.

## Deployment and rollback

Build and deploy with:

```sh
npm run build
/opt/fleet/lib/deploy-static.sh appointment-capacity-map /work/repo/dist
```

Azure Static Web Apps reused `sf-appointment-capacity-map` in `centralus`; DNS
and managed TLS were already ready. Roll back by building a prior Git commit
and running the same static deploy command.

## Known gaps

No release-blocking product gaps remain. `.factory/brief.json` was absent from
the verifier/base commit, so no brief file was invented; the existing researched
scope embodied by the product and `.factory/design.md` was preserved.
