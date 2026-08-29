# Independent verification 4 — FAIL

- **Candidate:** `89dc76f13eb8773207a5e66d700838e20ca4c80f`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Date:** 2026-08-29
- **Artifact:** local-first offline PWA
- **Verdict:** **FAIL — do not release**

The deployment is healthy and matches the candidate. This is a product failure,
not the previously reported deployment-only failure. Capacity Map can save a job
against a person who is not configured to perform that service, misses valid
cross-midnight overlaps, and deletes dependent jobs without confirmation or
undo. The first defect contradicts the core staff/service capacity job and the
`availability-check` claim.

## Mandatory first gates

### Claims — PASS as authored, but contradicted by independent coverage

`.factory/claims.json` exists with twelve entries. A literal pre-install attempt
from the clean checkout stopped at `tsc: not found`, as expected before project
dependencies exist. After the required locked `npm ci`, I ran every listed
command separately, before the other product checks. Each invoked one tagged
Playwright test through the demo entry point and passed:

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `offline-reload` | PASS |
| `csv-roundtrip` | PASS |
| `privacy-local-only` | PASS |
| `conflict-explanation` | PASS |
| `two-week-review` | PASS |
| `daily-license-check` | PASS |
| `plus-price` | PASS |
| `core-free` | PASS |
| `no-calendar-booking-payment` | PASS |
| `availability-check` | PASS as written; independent valid cases below disprove the broad claim |
| `license-request-data` | PASS |

The `availability-check` sandbox only opens a precomputed matrix choice. It does
not change the service/person fields in the proposed-job sheet and does not
exercise an appointment across midnight. Those valid paths produce incorrect
capacity decisions, so a green tag does not make the visitor-facing claim true.

### Cold first-read and demo — PASS

Fresh 1440 x 900 and 390 x 844 live contexts showed:

> Check which service jobs can overlap

> For service businesses with two to ten people who need clear answers before
> adding work to the calendar.

The primary action is **Try it with sample data**, immediately explained by
“Loads a separate notebook with a realistic day plan.” The three local-storage,
offline, and price facts are visible in the first mobile viewport. One click
opens `/demo` with Ava, Leo, three services, two resources, three jobs, and the
persistent demo/reset/start-real controls. The first-read gate passes.

## Release-blocking product evidence

### 1. Blocker — a job can be assigned to an ineligible person

Live reproduction in a fresh `/demo` context:

1. Open **Consultation with Ava: bookable**.
2. In **Check before you book**, change Service to **Mobile visit**.
3. The Team member options remain `Ava` and `Leo`, even though Mobile visit is
   configured only for Leo. The sheet continues to say **Clear to book**.
4. Choose **Add clear job**.

The app reports **Clear job added** and persists this IndexedDB record:

```json
{
  "start": "09:00",
  "staffId": "ava",
  "serviceId": "visit",
  "resourceIds": ["van"]
}
```

The board renders `Mobile visit — Ava — Service van`. Reload retains it. This
is not a display-only problem: invalid staff/service data is saved. CSV import
validation also checks only that the person and service exist, not that the
person is allowed for that service. A tool whose core purpose is expressing
overlap by staff member and service type cannot accept this result.

### 2. High — cross-midnight staff overlaps are reported as bookable

In a fresh live demo I added Consultation with Ava at 23:30 for 60 minutes,
then moved the board to 00:00 the next day. The matrix exposed
`Consultation with Ava: bookable`, although the first job runs until 00:30.
Conflict comparison returns early whenever the two start dates differ, so the
same issue affects resources and service-pair rules. The fourteen-day review
also misses these overlaps. An exact same-day endpoint was correctly allowed:
a 09:00–09:30 job permitted another at 09:30.

### 3. High — removing setup items causes unconfirmed cascading data loss

In `/demo/setup`, choosing **Remove** for Ava produced no dialog and no undo.
Before the click, storage held two staff, three jobs, and Treatment assigned to
Ava. Immediately afterward and after reload it held only Leo and the single Leo
job; both Ava jobs were permanently removed. Treatment remained as an invalid
orphan service with `staffIds: []`. The UI only showed the transient message
“Item removed; dependent plan entries were updated.” This violates the required
confirmation-or-undo policy for destructive actions and can erase a real plan
with one click.

### 4. Medium — proposed-job validation is stale and recovery discards input

Open a clear 09:00 Consultation with Ava, then change its start to 10:30, when
Ava already has a job. The sheet still says **Clear to book** and leaves **Add
clear job** enabled. Submit does prevent the conflicting write, but rerenders
the form at 09:00, discards the entered time, and again says Clear to book. The
user cannot see the conflict explanation for the value they entered.

### 5. Medium — keyboard focus is lost when the proposed-job sheet changes

With keyboard focus on `Consultation with Leo: bookable`, pressing Enter opens
the sheet but moves focus to `<body>`, not the sheet heading or first field.
Closing it with Enter again moves focus to `<body>` rather than the triggering
matrix cell. A keyboard or screen-reader user loses their position and receives
no dialog/sheet focus context. Route focus, skip-link focus, and visible outlines
otherwise pass.

## Local candidate gates

| Check | Result and evidence |
| --- | --- |
| Checkout/install | HEAD was the exact candidate and the tree was clean. `npm ci` installed 140 packages. |
| Dependency audit | `npm audit --audit-level=moderate`: 0 vulnerabilities. |
| Type/lint/unit | `npm run typecheck`, `npm run lint`, and `npm test` passed; Vitest 6/6. |
| Claim commands | All 12 exact post-install commands passed independently, one test each. |
| Browser suite | `npm run test:ui` passed 32/32, including the real two-build service-worker update test. |
| Production build | `npm run build` passed and created `dist/`. |
| Bundles | JS 33.11 kB raw / 11.06 kB gzip; CSS 12.53 kB raw / 3.52 kB gzip; hero WebP 30.64 kB. All pass their size budgets. |
| Live authored suite | 31/31 production-safe Playwright tests passed against the deployed URL. |

## Independent live checks

- **Normal and invalid cases:** Consultation with Leo at 09:00 saved and
  survived reload. A following 09:30 job was bookable at the exact endpoint.
  Parallel-job values 0 and 6 failed the native 1–5 bounds. A service without a
  person showed “Choose at least one team member.” Malformed and unsupported CSV
  files were rejected without replacing the demo, and a valid CSV round trip
  passed.
- **Privacy:** the complete fresh demo load, service-worker install/reload, job
  add, setup visit, invalid import, and export made requests only to
  `https://appointment-capacity-map.sociobot.in`. There were no analytics,
  third-party fonts/scripts, console errors, or page errors. IndexedDB contained
  only `demo:capacity`.
- **PWA/offline:** the live worker controlled the page with cache
  `capacity-map-369e177fbf23`; the manifest start URL was
  `/?v=369e177fbf23`. Offline reloads of `/demo` and `/demo/setup` retained the
  sample and demo banner. The local two-build test updated `qa-old` to `qa-new`
  through the visible refresh notice.
- **Accessibility:** independent Axe scans returned zero violations of any
  impact on `/`, `/demo`, `/demo/setup`, `/demo/review`, `/setup`, `/review`,
  `/privacy`, `/terms`, and `/404.html`. At 390 px there was no horizontal
  overflow and no visible control shorter than 44 px. Reduced motion produced
  0.00001 s animation/transition durations. The manual focus failure above is
  not detected by Axe.
- **Headers/caching:** HTML returned CSP with `frame-ancestors 'none'`, HSTS,
  Permissions-Policy, Referrer-Policy, X-Content-Type-Options, and X-Frame-Options.
  Unknown paths returned the styled page with HTTP 404. Hashed JS/CSS/image
  assets returned one-year immutable caching; the manifest was correctly typed
  and no-cache; the worker was no-store.
- **Performance:** the latest successful Lighthouse 12.8.2 mobile run on live
  `/demo` scored Performance 98, Accessibility 100, Best Practices 100, SEO 100;
  FCP 0.99 s, LCP 1.13 s, TBT 175.5 ms, CLS 0. One earlier run under host
  contention scored 84 with 630 ms TBT, and an intervening Chromium process
  closed unexpectedly; bundle size and the repeat run pass the product budgets.
- **Links/checkout:** all internal routes returned 200, an unknown route 404,
  `sociobot.in` 200, and the registered Sociobot checkout returned 303 to its
  hosted Dodo checkout. No payment provider is embedded in the app.

## Deployment identity

Fresh local production output matched the deployed bytes for `index.html`, the
hashed JavaScript and CSS, service worker, manifest, 404 page, offline page,
robots, sitemap, icons, and images. Representative SHA-256 values:

- `index.html`: `3ee981376e2a261531ff65bc08fe26fc95eb389ae67616e9183cb85245eea878`
- JavaScript: `7a63e5c96a91b5cb50d13a0c1f2c85afd42d0476f5684f5c4e7c633318d35d0a`
- CSS: `04c576cfe42d2a975951d1f830db85bb14cd11b14cb3635b3b81f72a44475dc9`
- `sw.js`: `8efc9474740c472cc1531caf851da410eb57f17846d05da82ac6a676f7c7aa5c`

The footer/cache build ID is `369e177fbf23`. This proves the failures are in the
candidate served at the acceptance URL.

## License endpoint allowance

No sign-in is required. The only server-side product endpoint is optional
Sociobot license verification. From one client, sequential synthetic-invalid
requests 1–30 returned 200. Request 31 and requests 32–40 returned 429, each
with `Retry-After: 4`. Observed allowance: **30 verification requests per
client/burst window**. The endpoint satisfies the required limit behavior.

## Result

**FAIL.** Repair staff/service eligibility enforcement in every creation/import
path, handle cross-date intervals, protect cascading removals with confirmation
or undo, and restore keyboard focus. Expand the availability claim test to
cover manual field changes and midnight boundaries before re-verification.
