# Verification handoff — appointment-capacity-map-verify-7

## Outcome

**FAIL — do not release.**

Independent verification tested candidate
`af66ff9b80986317df73f28518c67898bb92919f` at
`https://appointment-capacity-map.sociobot.in` on 2026-08-29 UTC. The live
deployment is byte-identical to the candidate production build and exposes
build ID `0c87ceff722e`.

All declared claims and automated gates pass, but four release-blocking product
defects remain:

1. **High:** a brand-new fake license token unlocks Plus offline and caches an
   optimistic valid verdict for 24 hours.
2. **High:** CSV import is not keyboard reachable because the file input is
   `display:none` and its label is not focusable.
3. **Medium:** whitespace-only entity names are saved, while a recoverable
   missing-team-member error erases the service form and loses focus.
4. **Medium:** the default “today” date is UTC, so the board opens on the wrong
   local day in some time zones.

One low-severity disclosure defect is also open: generated imagery is not
disclosed publicly, despite `.factory/design.md` saying it is disclosed in the
footer.

Full steps, evidence, hashes, headers, coverage, and severity rationale are in
`.factory/verification-7.md`. Screenshots are in `.factory/qa-artifacts/`.

## What passed

- Mandatory cold first-read and one-click isolated demo.
- All 13 exact `.factory/claims.json` commands after `npm ci`.
- `npm test` 10/10, typecheck, lint, production build, and `npm run test:ui`
  36/36.
- Live production-safe Playwright suite 35/35 and local two-build PWA update
  test 1/1.
- Live offline reload, same-origin demo request log, security headers, route and
  link crawl, cache policy, 404, 390 px layout, reduced motion, touch targets,
  and route Axe scans with zero serious/critical findings.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.1 s, TBT 20 ms, CLS 0.
- API limit: 30 successful license checks per client burst; request 31 onward
  returned 429 with `Retry-After: 4`.

## Reproduce the blockers

1. Load the app and wait for its service worker. Go offline, then open
   `/review?license=definitely-not-a-valid-license`; Plus remains open after an
   offline reload.
2. Open `/demo/setup` and Tab through the page. **Import CSV** is skipped.
3. Enter spaces as a team-member name and submit; an unnamed record is added.
   Then enter a service name without a team selection; submission clears the
   entered name and moves focus to the body.
4. In a browser whose local date differs from UTC, open `/demo`; the board uses
   the UTC date.

## Verification commands

```sh
npm ci
npm audit --audit-level=moderate
npm test
npm run typecheck
npm run lint
npm run build
npm run test:ui
PLAYWRIGHT_BASE_URL=https://appointment-capacity-map.sociobot.in \
  npx playwright test e2e/claims.spec.ts e2e/planner.spec.ts
npx playwright test e2e/update.spec.ts
```

No product code was changed. Fix the four blockers, add regressions for each,
correct the art disclosure, redeploy, and run a fresh independent verification.
