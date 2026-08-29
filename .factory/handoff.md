# Verification handoff — appointment-capacity-map-verify-4

## Outcome: FAIL

Candidate `89dc76f13eb8773207a5e66d700838e20ca4c80f` was tested locally and at
`https://appointment-capacity-map.sociobot.in/` on 2026-08-29. The deployment
matches the candidate byte-for-byte for every deployable artifact checked. The
result is a product failure, not a deployment-only failure.

The full report is `.factory/verification-4.md`.

## Release blockers

1. **Invalid staff/service jobs can be saved.** In `/demo`, open Consultation
   with Ava, change Service to Mobile visit, and save. Mobile visit is configured
   only for Leo, but the app persists `staffId: "ava", serviceId: "visit"` and
   reports the job clear.
2. **Cross-midnight overlaps are missed.** A 23:30–00:30 Ava job does not block
   Ava at 00:00 the next day. Staff, resources, pair rules, and the two-week
   review all inherit the date-only comparison error.
3. **Setup removal causes silent cascading data loss.** Removing Ava immediately
   and permanently deleted both Ava jobs, showed no confirmation or undo, and
   left Treatment with no eligible staff.

Additional medium findings: proposed-job conflict feedback does not update when
fields change and discards the changed value after rejection; opening and
closing that sheet by keyboard loses focus to `<body>`.

## What passed

- Mandatory cold first-read and one-click isolated demo.
- All 12 exact claim commands after `npm ci`.
- Audit (0 vulnerabilities), typecheck, lint, 6/6 unit tests, 32/32 local browser
  tests, 31/31 live browser tests, and the exact production build.
- Live offline demo and deep-route reload; real two-build worker update test.
- Same-origin-only demo planning traffic; no analytics, console, or page errors.
- Axe: zero violations on nine routes; 390 px reflow/touch targets and reduced
  motion passed, apart from the manual keyboard focus defect above.
- Security headers, real 404, manifest/worker MIME and cache policy, and
  immutable hashed assets.
- Latest stable Lighthouse mobile: 98 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.13 s, TBT 175.5 ms, CLS 0.
- Bundle budgets: 11.06 kB gzip JS, 3.52 kB gzip CSS, 30.64 kB hero.
- License API: requests 1–30 returned 200; 31–40 returned 429 with
  `Retry-After: 4`.

## Reproduce

```sh
npm ci
npm audit --audit-level=moderate
npm run typecheck
npm run lint
npm test
# Run every exact command in .factory/claims.json separately.
npm run test:ui
npm run build
PLAYWRIGHT_BASE_URL=https://appointment-capacity-map.sociobot.in \
  npx playwright test e2e/claims.spec.ts e2e/planner.spec.ts
```

Do not release until the three core defects are repaired and the claim coverage
is extended to prevent their recurrence.
