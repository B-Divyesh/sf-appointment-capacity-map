# Independent verification — FAIL

- **Candidate:** `e6a9ea4e1295e5854b66662e4de5e0639fc2b058`
- **Deployment checked:** `https://appointment-capacity-map.sociobot.in/`
- **Date:** 2026-08-28
- **Verdict:** **FAIL — do not release**

The deployed HTML, JavaScript, CSS, image and service worker matched a fresh
production build of the candidate byte-for-byte (SHA-256 compared). This is a
candidate/product failure, not a deployment-only failure.

## Mandatory gates

### Claims gate — FAIL (release blocking)

`.factory/claims.json` is absent in the clean candidate checkout. Consequently
there were no declared claim tests to execute through the required demo entry
point. This alone fails the required claims contract.

The README and product copy make observable claims including local-first
storage, working offline after the first load, CSV import/export, no tracking,
and daily license verification. None has a matching entry or tagged test in a
claims file. These are unlisted claims under the acceptance contract.

### Cold first-read and demo gate — FAIL (release blocking)

Fresh desktop visit, with no prior storage, showed:

> “Map what can happen at the same time.” “Add your people, job types, and
> shared things…” Primary action: “Try a guided example.”

My first-read: this appears to help a team decide whether jobs, people and
equipment can overlap; the intended small service-business audience is only
implicit; the first action appears to be **Try a guided example**. It does not
plainly state that it is for two-to-ten-person service businesses, does not
offer the required **“Try it with sample data”** action or say what will happen
after clicking, and does not show the required three plain privacy/offline/price
facts. It therefore does not answer what it does, for whom, and what to click
first in the required form.

`https://appointment-capacity-map.sociobot.in/?demo=1` loads the ordinary blank
notebook. It has no sample data, no `Demo — sample data, nothing is saved`
banner, no Reset demo/Start for real controls, and no isolation. Source confirms
normal and guided data use IndexedDB database `capacity-map`, store `notebook`,
key `capacity`; there is no `demo:` namespace. `.factory/demo.md` is also
absent. The guided example writes to ordinary storage and cannot meet the
required sandbox guarantee.

## Executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Fresh install | PASS | `npm ci` completed; audit reported 1 moderate, 1 high, and 1 critical development-dependency advisory. |
| Unit tests | PASS | `npm test`: 2/2 Vitest tests passed. |
| Browser tests | PASS, insufficient coverage | `npm run test:ui`: 2/2 Playwright tests passed (clear booking/offline reload; Axe). Neither is tagged as a claim test or uses `/demo`. |
| Typecheck/production build | PASS | `npm run build` completed and produced `dist/`. |
| Required URL smoke check | PASS | `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ /tmp/capacity-evidence`: title, `lang=en`, one h1, main, image alt, labelled buttons and console all passed; 786 ms local load. |
| Live functional flow | PASS for normal mode | Guided sample loaded; Treatment at 09:00 was added; Mobile visit at 09:00 showed `Mobile visit and Treatment do not overlap`; CSV download contained header and seed rows; malformed CSV showed `This does not look like a Capacity Map CSV.` |
| Offline reload | PASS for ordinary mode only | After an online load and guided sample, `context.setOffline(true)` plus reload retained the capacity board on the live host. This does not prove the missing demo claim. |
| Privacy/network smoke | PASS for ordinary flow, untestable claim | A fresh normal/demo-parameter flow generated only same-origin GETs for the document and three hashed assets; no analytics or third-party font/script request was seen. The license flow was not activated. No required intercepting claim test exists. |
| Desktop/390px | PARTIAL | Desktop works. At 390px tabs have `scrollWidth: 526` vs `clientWidth: 390`; the “Two-week review” tab is visibly clipped until horizontally scrolled. |
| Keyboard/reduced motion | PASS smoke | First Tab reaches visible 3px-outline skip link. With `prefers-reduced-motion`, animation and transition durations are `0.01ms`. |
| Axe | PASS | Live ordinary setup state: zero serious/critical violations using `@axe-core/playwright`. |
| Lighthouse mobile, local production build | PASS budgets except TBT target | Performance 95, Accessibility 100; FCP 1.2 s, LCP 1.7 s, CLS 0, TBT 230 ms. Initial JS is 8.81 KB gzip; CSS is 3.01 KB gzip; image is 30.64 KB. |
| Service worker | PARTIAL | Live app has an active controller and offline reload works. Update behavior could not be exercised against an unchanged live deployment. The worker/manifest use fixed `capacity-map-v1` and `?v=1`, rather than build-versioned values. |
| Headers/caching | FAIL policy | HTTPS, HSTS, Referrer-Policy, and `X-Content-Type-Options` are present. There is no CSP. Hashed JS/CSS/image responses are only `cache-control: public, must-revalidate, max-age=30`, not long-lived immutable caching. Manifest is served as `application/octet-stream`. |
| Routing/discovery | FAIL policy | `/privacy` and `/terms` return 200, but there is no `/demo`, `robots.txt`, `sitemap.xml`, `staticwebapp.config.json`, or real 404 (`/does-not-exist` returns the planner with 200). In-app Privacy/Terms are stateful buttons, not URL navigation. |
| Rate limiting | PASS | 40 concurrent requests to `GET https://api.sociobot.in/api/v1/products/appointment-capacity-map/verify?license=qa-invalid-capacity-map-verifier`: 29 returned 200, then 11 returned 429 with `Retry-After: 2`. Threshold observed: 29 accepted requests in this burst. |
| Deployment identity | PASS | Local and deployed `index.html`, `sw.js`, JS, CSS and WebP SHA-256 digests matched exactly. |

## Defects

### Blocker

1. **No `.factory/claims.json`, hence no executable claim tests.** The acceptance
   contract explicitly makes this release-blocking. All visitor-facing promises
   are unlisted/unverified.
2. **No one-click isolated sample-data demo.** The first screen has “Try a
   guided example,” not the required sample-data action. `?demo=1` is ignored;
   there is no persistent demo notice, reset/start-real controls, namespace
   isolation, or `.factory/demo.md`. Guided data is written to real IndexedDB.
3. **Cold first screen fails the plain-words acceptance test.** It lacks the
   plainly named target user, mandatory primary action/click outcome, and three
   required facts.

### High

1. **Required PWA/site security and route delivery is incomplete.** The live
   response has no Content-Security-Policy; no `staticwebapp.config.json`,
   robots file, sitemap, or styled 404 route exists. Hashed production assets
   lack immutable caching.
2. **The documented PWA update/version scheme is not build-versioned.**
   `src` emits `const CACHE='capacity-map-v1'` and the manifest uses `/?v=1`.
   A versioned cache/update policy cannot be independently demonstrated from
   this candidate and does not meet the stated versioned-cache requirement.

### Medium

1. **Mobile navigation is horizontally clipped at 390px.** It is scrollable,
   but a key tab is cut off on first render (526px tab row in a 390px viewport).
2. **Tooling dependency audit is not clean.** `npm audit` found direct Vite
   high-severity development-server advisories and a critical Vitest UI advisory;
   non-major fixes are available (`vite@6.4.3`, `vitest@3.2.7`). These do not
   ship in the static bundle but should be upgraded before development use.
3. **Lighthouse TBT was 230 ms** in the reproducible mobile local run, above
   the stated 200 ms interaction-performance target; LCP/CLS and bundle budgets
   were within target.

## Reproduction

```sh
npm ci
npm test
npm run test:ui
npm run build
npm run preview -- --host 127.0.0.1
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ /tmp/capacity-evidence
```

For the mandatory claims gate, add `.factory/claims.json` and run every listed
command from a fresh browser context via `/demo` before re-submission.
