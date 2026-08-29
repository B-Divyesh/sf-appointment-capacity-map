# Independent product verification 7 — Capacity Map

- **Candidate:** `af66ff9b80986317df73f28518c67898bb92919f`
- **Live URL:** `https://appointment-capacity-map.sociobot.in`
- **Verified:** 2026-08-29 UTC
- **Live build ID:** `0c87ceff722e`
- **Verdict:** **FAIL — do not release**

The candidate is deployed and the declared claims pass, but fresh adversarial
testing found two high-severity release blockers: an unverified token unlocks
Plus offline, and keyboard users cannot operate CSV import. Invalid setup input
and local-date handling also fail required recovery and boundary behavior.

## Mandatory first gates

### Claims — 13/13 pass after the clean install

`.factory/claims.json` exists and contains 13 unique claims. Before any other
repository inspection, the first exact claim command was invoked. As expected
in the dependency-free clone, it stopped at `tsc: not found`. `npm ci` then
installed the locked 140 packages with zero vulnerabilities. Every exact
command from the file was rerun separately through its declared demo sandbox:

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS — 1 test passed |
| `capacity-setup` | PASS — 1 test passed |
| `offline-reload` | PASS — 1 test passed |
| `csv-roundtrip` | PASS — 1 test passed |
| `privacy-local-only` | PASS — 1 test passed |
| `conflict-explanation` | PASS — 1 test passed |
| `two-week-review` | PASS — 1 test passed |
| `daily-license-check` | PASS — 1 test passed |
| `plus-price` | PASS — 1 test passed |
| `core-free` | PASS — 1 test passed |
| `no-calendar-booking-payment` | PASS — 1 test passed |
| `availability-check` | PASS — 1 test passed |
| `license-request-data` | PASS — 1 test passed |

The full claim and product suites also passed against live production: 35/35
tests in `e2e/claims.spec.ts` and `e2e/planner.spec.ts`.

### Cold first-read — pass

A fresh 1440 px browser context showed:

- What it does: **“Check which service jobs can overlap.”**
- Who it serves: **service businesses with two to ten people**.
- What to do first: **“Try it with sample data.”**
- What clicking does: **“Loads a separate notebook with a realistic day
  plan.”**

The action is visible on the first screen and opens `/demo` in one click. The
demo immediately shows two people, three services, two resources, three jobs,
and the persistent reset/start-for-real banner. Evidence:
`qa-artifacts/live-cold-desktop.png` and
`qa-artifacts/live-demo-mobile-390-reduced.png`.

## Release-blocking defects

### H-1 — A new, unverified token unlocks paid Plus offline

**Steps:** In a fresh browser context, visit the live app once and wait for the
service worker. Go offline, then open
`/review?license=definitely-not-a-valid-license`.

**Observed:** The URL token is stored, and the app writes this verdict before
verification succeeds:

```json
{"valid":true,"at":1788033604492,"token":"definitely-not-a-valid-license"}
```

The live page immediately renders the paid `.review` view with **“No
disallowed overlaps found”**; the purchase action is absent. Offline reload
remains unlocked. The attempted verification fails with
`net::ERR_INTERNET_DISCONNECTED`, but the optimistic `true` verdict is cached
for 24 hours. Evidence:
`qa-artifacts/live-offline-invalid-license-unlocked.png`.

An invalid token tested online correctly received HTTP 200 with `valid: false`
and re-locked Plus. The defect is the no-verdict/network-failure path. Only a
previously cached valid verdict for the same token should unlock optimistically;
a brand-new token must not become a cached valid license before verification.

### H-2 — CSV import is unreachable with a keyboard

On live `/demo/setup`, the import input has `display: none`. Its wrapping
`label` has `tabIndex = -1`. Forty-five consecutive Tab presses traversed every
setup control, wrapped to the page start, and never reached `#import-file`.
Calling `focus()` on it also left focus on the body.

This makes the documented core data-ownership/import workflow unavailable to
keyboard-only users. Axe does not detect this interaction failure, so the
otherwise green Axe result does not mitigate it.

### M-1 — Invalid setup values create broken records or lose entered work

- A whitespace-only team-member name passes native `required` validation. The
  live app added an unnamed person: list count changed from 0 to 1 and the row
  displayed only “up to 1 at once”. This can produce blank selectors and
  explanations such as an unnamed person being at capacity. Evidence:
  `qa-artifacts/live-invalid-blank-person.png`.
- Entering service name `Urgent repair` and duration `45` without choosing a
  team member shows “Choose at least one team member,” but rerenders the page,
  clears the name, resets duration to 30, and moves focus to `BODY`. The message
  is a general `role=status`, not associated with the invalid control.
  Evidence: `qa-artifacts/live-invalid-service-recovery.png`.

Trimmed names must be validated before mutation. Recoverable validation errors
must preserve values, focus the invalid field, and expose an associated error.

### M-2 — “Today” uses UTC instead of the browser's local date

At `2026-08-29T20:03:06Z`, a fresh browser in `Asia/Tokyo` reported local date
`2026-08-30`, while live `/demo` selected `2026-08-29` and headed the board
“Sat, Aug 29”. The same UTC helper seeds demo jobs and names CSV exports.
Evidence: `qa-artifacts/live-tokyo-wrong-day.png`.

For businesses east or west of UTC, the default board and fourteen-day review
can open on yesterday or tomorrow for hours each day. Calendar dates must be
derived from local date parts.

### L-1 — Generated-art disclosure is absent and the design record is stale

The supplied image-generation contract requires a public about/footer
disclosure. The footer does not disclose generated imagery, while
`.factory/design.md` says the illustration “is ... disclosed in the footer.”
Prompt, date, model context, and source sidecar otherwise exist.

## Functional and boundary evidence

- Normal flow: created and retained a clear job, exported the complete plan,
  imported a checked replacement, and kept real/demo IndexedDB keys isolated.
- Conflicts: live tests displayed staff, shared-resource, and service-pair
  reasons and disabled save for a blocked proposal.
- Boundaries: midnight-spanning overlaps were found; an exact midnight endpoint
  was allowed; review included offset 13 and excluded offset 14.
- Bad CSV: malformed headers, unknown row types, invalid staff/service
  assignment, resource mismatch, and failed replacement all preserved the old
  notebook with an actionable error.
- Destructive setup removal showed dependency-specific confirmation and kept
  data unchanged when cancelled.
- No sign-in exists, so the Entra authority requirement is not applicable.
- This is a static PWA, not a library, CLI, or product backend. Consumer package,
  application-server concurrency, and server persistence checks are not
  applicable.

## Accessibility, mobile, and motion

- Live `@axe-core/playwright` scans on `/`, `/setup`, `/review`, `/demo`,
  `/demo/setup`, `/demo/review`, `/privacy`, `/terms`, and `/404.html` found
  zero serious or critical violations.
- The factory URL verifier passed: title present, `lang=en`, one h1, main
  landmark, zero missing image alternatives, zero unnamed buttons, and zero
  console/page errors; observed load was 675 ms.
- At 390 × 844, document width was exactly 390 px, no visible control was under
  44 px high, planner tabs fit, and the proposed-job sheet did not clip.
- Reduced motion computed to `0.01ms`; no looping or flashing motion exists.
- Keyboard smoke passed for skip-link focus, 3 px visible focus, route focus,
  dialog heading focus, Enter activation, and return focus. H-2 is the exception.

## Privacy, headers, and external endpoints

- A fresh live demo flow (enter demo, add job, open setup) made only same-origin
  GET requests. No analytics, third-party scripts, or fonts were requested.
  IndexedDB contained only `demo:capacity`.
- Main response headers included a restrictive CSP, HSTS,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a camera/microphone/
  geolocation-denying Permissions Policy.
- The only runtime external origin permitted is `https://api.sociobot.in` for
  checkout/license verification. The registered checkout returned HTTP 303 to
  hosted Dodo checkout; no payment form is embedded.
- License endpoint allowance: one client received 200 for requests 1–30.
  Requests 31–40 returned 429 and every response included `Retry-After: 4`.
  Observed allowance: **30 requests per burst/client window**.

## PWA, routing, deployment, and performance

- Live offline reload passed with the sample job still visible. The separately
  controlled two-build test upgraded `qa-old` to `qa-new`, showed the update
  notice, and applied **Refresh now**.
- The worker and manifest share version `0c87ceff722e`; the cache is versioned,
  the installed start URL is `/?v=0c87ceff722e`, and icons are valid at 192,
  512, and 180 px.
- `/`, all seven named application subroutes, robots, sitemap, manifest, worker,
  icons, and assets returned 200. An unknown route returned the designed HTTP
  404. Every discovered internal link returned 200; Sociobot returned 200.
- Hashed JS/CSS/icons use one-year immutable caching. The service worker uses
  `no-cache, no-store`; the manifest uses `no-cache`; HTML revalidates after 30
  seconds.
- Candidate and live SHA-256 values match byte-for-byte for `index.html`, JS,
  CSS, hero WebP, `sw.js`, and `manifest.webmanifest`.
- Production bundles: JavaScript 36.55 kB raw / 12.05 kB gzip; CSS 12.53 kB raw
  / 3.53 kB gzip; landing illustration 30.64 kB. All budgets pass.
- Fresh mobile Lighthouse on live `/demo`: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 20 ms, CLS 0.

## Repository gates

| Gate | Result |
| --- | --- |
| Exact checkout | PASS — HEAD is the candidate commit |
| `npm ci` | PASS — 140 packages, zero audit findings |
| `npm audit --audit-level=moderate` | PASS |
| `npm test` | PASS — 10/10 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` produced |
| `npm run test:ui` | PASS — 36/36 |
| Live production-safe Playwright | PASS — 35/35 |
| `npx playwright test e2e/update.spec.ts` | PASS — 1/1 |

No product code was modified during verification.
