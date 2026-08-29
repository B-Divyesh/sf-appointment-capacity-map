# Polish round 3 — adversarial review closure

- **Reviewed release candidate:** `2235a5ad01fe95140907dfe99cdfe1fc21e070c3`
- **Review report:** `71d2ad800a7d4a03dbc28076bb17e2372123d148`
- **Repair commits:** `3726b5918e5e3c2b7bd3bac9185b9638134eee1d`,
  `5c4a88cb46b232299fa346a84238c2eeb8de7d10`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Deployment:** Azure Static Web Apps `434ade3a-1496-4641-8f4b-82ff34d4d28e`
- **Result:** PASS — no review finding remains open.

All `review-*.md`, `polish-*.md`, and verification records in `.factory/` were
read before repair. The current work changes the two remaining review-three
defects and re-verifies every earlier finding in a fresh clone and live browser.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the branded 404 header, skip link, main, footer, legal links, and return action. | `e2e/planner.spec.ts` metadata/404 coverage; live HTTP 404; [390 px screenshot](evidence/polish-3-live-404-390.png). |
| F-1-2 | Preserved route-specific legal and 404 titles, descriptions, canonical, OG/Twitter metadata, and icons. | `e2e/planner.spec.ts` route test; live 42-test production-safe run; `verify-url.sh` live output. |
| F-1-3 | Preserved the `core-free` claim and free planner/CSV proof. | Clean-clone `@claim:core-free` command passed; live claim flow passed. |
| F-1-4 | Preserved `no-calendar-booking-payment` and its DOM/request proof. | Clean-clone `@claim:no-calendar-booking-payment` command passed; live claim flow passed. |
| F-1-5 | Preserved `availability-check`, including clear booking and pre-save rejection. | Clean-clone `@claim:availability-check` command passed; live claim flow passed. |
| F-1-6 | Preserved `license-request-data`; made its direct request observation reliable. | Clean-clone `@claim:license-request-data` command passed; it checks the Sociobot origin, exact sole token query, GET, and no body. |
| F-2-1 | Preserved both demo deep links in the sitemap. | `src/release-contract.test.ts` sitemap contract; live `/demo/setup` and `/demo/review` route coverage. |
| F-2-2 | Preserved the `capacity-setup` claim for team members, shared resources, services, and service-pair rules. | Clean-clone `@claim:capacity-setup` command passed; live claim flow passed. |
| F-2-3 | Preserved exact demo composition assertions before and after reset. | Clean-clone `@claim:demo-isolation` command passed; [live demo screenshot](evidence/polish-3-live-demo-390.png). |
| F-2-4 | Preserved the plain footer sentence “Plans stay in this browser.” | `privacy-local-only` passed; visible in all three live screenshots. |
| F-2-5 | Kept the rejected slogan removed and retained only the useful, tested generated-art disclosure. | `@claim:generated-art-disclosure` passed; disclosure visible in the live screenshots and documented in `design.md`. |
| F-3-1 | Rewrote all four flagged landing/README sentences to use **team member**, **shared resource**, and **service-pair rule** consistently. Added a release contract that locks those exact phrases. | `src/release-contract.test.ts` — “uses one public term…”; [live 390 px landing screenshot](evidence/polish-3-live-home-390.png); live `/`. |
| F-3-2 | Expanded `privacy-local-only` to declare no third-party fonts or scripts. Its browser test now records each request and asserts every script, stylesheet, and font resource is same-origin. | Clean-clone `@claim:privacy-local-only` command passed; live claim flow passed; live CSP and request check passed. |

## Earlier verification finding regression map

| Earlier report area | Current proof |
| --- | --- |
| Missing claims, plain first screen, isolated `?demo=1`, banner/reset/exit | 14 independently run clean-clone claim commands passed. The live cold demo banner, reset, exit, and sample board are shown in `evidence/polish-3-live-demo-390.png`. |
| PWA versioning, offline reload, update notice | `@claim:offline-reload` passed from the clean clone and live. The real two-build waiting-worker update test passed in the clean-clone 43-test browser run. |
| CSP, cache policy, routes, sitemap, real 404, metadata, legal links, focus/history | Release contracts and browser route tests passed; live `verify-url.sh` found one title, `lang=en`, one h1, main, labelled controls, image alternatives, and no console errors. |
| Mobile clipping, keyboard, focus, reduced motion, touch targets | Browser suite passed its 390 px, keyboard, focus, and reduced-motion tests; the live screenshots show the stacked mobile layout without clipped navigation. |
| CSV import validation, ineligible assignment, midnight overlap, destructive-removal confirmation, form focus recovery | Clean-clone browser suite passed all validation/regression tests; `availability-check` and `csv-roundtrip` passed independently. |
| Dependency audit, bundle, interaction performance | `npm ci` reported zero vulnerabilities. Live Lighthouse mobile was 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO (FCP 0.9 s, LCP 1.3 s, TBT 0 ms, CLS 0). |

## Verification record

- Fresh clone: `/tmp/appointment-capacity-map-polish3-final.sy45ZP/repo` at
  `5c4a88cb46b232299fa346a84238c2eeb8de7d10`.
- Locked install: 140 packages; `npm audit` reported **0 vulnerabilities**.
- Fresh clone: `npm run typecheck`, `npm run lint`, `npm test` (**15/15**), and
  `npm run build` all passed. The build ships 12.59 kB gzip JavaScript, 3.58 kB
  gzip CSS, and 30.64 kB notebook art.
- Every `claims.json` command passed separately from that clone: all **14/14**.
- Full local browser suite: **43/43** passed, including Axe on nine routes,
  offline reload, the real waiting-worker update test, privacy, and mobile.
- After deployment, the production-safe live suite passed **42/42**. It excludes
  only the local two-build waiting-worker harness because it intentionally
  rewrites local `qa-old`/`qa-new` builds and cannot mutate an immutable live
  deployment; that harness passed in the clean clone above.
- `/opt/fleet/lib/verify-url.sh` against the live home page passed in 687 ms:
  correct title, `lang=en`, one h1, main landmark, no missing image alt text,
  no unlabelled buttons, and no console errors.
- Cold live checks: `/`, `/?demo=1`, `/privacy`, `/terms`, every application
  deep link, and an unknown route were checked. The custom domain served the
  deployed `assets/index-NWRl_Y91.js` build and returned HTTP 404 for the
  unknown route.

The catalog sentence is now verb-first and 57 characters: “Check service-job
overlaps before changing your calendar.”
