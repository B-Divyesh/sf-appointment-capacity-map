# Polish round 1 — adversarial review closure

- **Reviewed candidate:** `fcb98a86cabfebaadebb8188e8e5fb05337394b1`
- **Review report:** `663da75d567a3b598bf528f412c6d50626c81af0`
- **Repair code commit:** `87befbd3f7a744331a62bd293e74b12b02ef1c02`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Deployment:** Azure Static Web Apps deployment `2626d8a9-084b-4fd9-8a17-a47b1d5c1cb1`
- **Result:** PASS — every finding and copy-audit flag is closed.

Only `.factory/review-1.md` existed when this round began. There were no older
`.factory/review-*.md` or `.factory/polish-*.md` files to merge. The earlier
verification reports named by review 1 were also read and their regressions
remain covered by the 32-test browser suite.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rebuilt `404.html` with the notebook wordmark, skip link, site navigation, main landmark, return action, product footer, Privacy, Terms, factory attribution, and version. The page retains the product's ruled-paper identity at mobile and desktop sizes. | `e2e/planner.spec.ts` — “keeps demo subroutes isolated and gives legal and 404 pages complete metadata”; `src/release-contract.test.ts` 404 contract; live `GET /not-a-real-route` returned HTTP 404; screenshot `.factory/evidence/polish-1-404-390.webp`. |
| F-1-2 | Added route-specific descriptions and matching Open Graph/Twitter descriptions for Privacy, Terms, setup, review, demo, and demo subroutes. Added canonical, description, social image metadata, favicon, and touch icon to the static 404. | `e2e/planner.spec.ts` — “loads routes with one heading, history navigation, and no console errors” and the 404 metadata test; live URL smoke returned correct titles with no console errors on `/privacy` and `/terms`; live 404 source contains every required metadata field. |
| F-1-3 | Added the `core-free` claim and a real normal-mode test that imports a plan, adds a clear job, exports CSV, proves no license exists, and records no external request or checkout. | `npm run test:claims -- --grep @claim:core-free`; passed independently in the clean clone and in the 12/12 live claim run. |
| F-1-4 | Added the `no-calendar-booking-payment` claim. Its test completes a planner flow, proves requests stay on the product origin, finds no calendar/public-booking link or payment form, and verifies that purchase is an external Sociobot checkout link. | `npm run test:claims -- --grep @claim:no-calendar-booking-payment`; passed independently in the clean clone and live. |
| F-1-5 | Added the `availability-check` claim. Its test adds one clear sample job, then opens a staff-capacity conflict, checks the named reason, and proves the save action is disabled before the conflicting job reaches storage. | `npm run test:claims -- --grep @claim:availability-check`; passed independently in the clean clone and live. |
| F-1-6 | Added the `license-request-data` claim. Its intercepted request test asserts the exact Sociobot origin/path, one `license` query parameter containing the pasted token, GET, and no request body. | `npm run test:claims -- --grep @claim:license-request-data`; passed independently in the clean clone and live. |

## Required copy flags

- Replaced the README's IndexedDB/key wording with “separate browser storage.”
- Replaced “static PWA” with “offline web app.”
- Kept the accepted first screen: a six-word job headline, named audience,
  sample action with its result, and local/offline/price facts. At 390 × 844 it
  has no horizontal overflow and all required facts are visible. Evidence:
  `.factory/evidence/polish-1-home-390.webp` and the browser test “cold first
  screen states the job, audience, action outcome, and three facts.”
- Updated `.factory/copy-audit.md`; no audited sentence is over 22 words or
  contains a banned marketing word.
- Updated `.factory/catalog-description.txt` to the 65-character, verb-first
  sentence “Check which service jobs can overlap before changing your calendar.”

## Additional acceptance work

- Planner setup and review are now real, reloadable routes: `/setup`, `/review`,
  `/demo/setup`, and `/demo/review`. Link navigation uses history, back/forward
  restores the route, and route changes focus and announce the new h1.
- `/?demo=1` enters `/demo` directly. The expanded `demo-isolation` test adds a
  job, resets to the three shipped jobs, proves `demo:capacity` is the only
  notebook key, leaves without retaining sample data, then cold-enters through
  `?demo=1` again.
- The service worker precaches every real app route, while the deployment config
  rewrites those routes and keeps unknown paths on the branded HTTP 404.

## Verification evidence

- Clean clone `/tmp/capacity-map-clean-crEGY5`: `npm ci` (140 packages), audit
  (0 vulnerabilities), typecheck, lint, 6/6 unit/contract tests, every one of
  the 12 claim commands independently, 32/32 browser tests, and production build
  all passed.
- Local factory URL smoke passed `/`, `/demo`, `/privacy`, and `/terms` with one
  h1, one main, `lang=en`, labelled controls, alt text, and zero console errors.
- Live cold URL smoke passed `/`, `/?demo=1`, `/privacy`, and `/terms`; the
  unknown route returned HTTP 404 with the full security CSP.
- Live claims passed 12/12. Live public browser/accessibility/privacy/routing
  specs passed 31/31; the separate local-only two-build service-worker update
  harness passed within the clean-clone 32/32 suite.
- Playwright Axe covered `/`, `/setup`, `/review`, `/demo`, `/demo/setup`,
  `/demo/review`, `/privacy`, `/terms`, and `/404.html` with zero serious or
  critical violations.
- Live Lighthouse mobile on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, interactive
  1.1 s.
- Built output: JavaScript 33.11 kB raw / 11.07 kB gzip; CSS 12.53 kB raw /
  3.53 kB gzip; hero WebP 30.64 kB. All budgets pass.
- The committed mobile screenshots hash-match screenshots recaptured from the
  cold live site after deployment.

No finding of any severity remains unresolved.
