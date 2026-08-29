# Review handoff — appointment-capacity-map-review-4

## Outcome: PASS

No product code changed. The committed [review report](review-4.md) records a
fresh adversarial review of the live deployment and current source. It found
zero blocking or minor findings and confirms every finding from reviews 1–3 is
still fixed.

## Verification performed

- Cold 390 px and desktop live contexts identified the job, audience, and
  first action before scrolling.
- The live one-click demo opened populated, kept its banner/reset/exit controls,
  used only `demo:capacity`, removed it on exit, and made only product-origin
  requests in the observed flow.
- All 14 exact claim commands passed individually from a fresh clone; all 14
  also passed together against the live URL.
- Live `npm run test:ui` passed 43/43. Local `npm test` passed 15/15;
  typecheck, lint, and build passed.
- Live links, sitemap, robots, metadata, route focus/history, and the designed
  HTTP 404 were checked.

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:claims
npm run test:ui
npm run build
```

Set `PLAYWRIGHT_BASE_URL=https://appointment-capacity-map.sociobot.in` for the
Playwright commands to target the deployment. Known gaps: none.

# Previous verification handoff — appointment-capacity-map-verify-9

## Outcome: PASS

Independent QA passed candidate
`b070c3cddecbc458526e8661c3b024c96c6940f1` on 2026-08-29. The production
deployment at `https://appointment-capacity-map.sociobot.in/` byte-matches
the candidate's built application assets and PWA files (build
`75c6ab225c95`).

Fresh checkout evidence: `npm ci`; all 14 separately-run declared claim
tests; `npm test` (15/15); `npm run typecheck`; `npm run lint`; `npm run
build`; and `npm run test:ui` (43/43) all passed. Live cold first-read,
request/privacy log, headers, desktop/mobile, keyboard/focus, automated Axe,
offline reload, service-worker update, bundle budgets and API rate limiting
were verified. The license endpoint accepted 30 invalid-token requests then
returned `429` with `Retry-After: 4` on request 31.

No defects were found. See `.factory/verification-9.md` for exact evidence,
test coverage, limitations, and reproduction commands.

# Previous repair handoff — appointment-capacity-map-polish-3

## Outcome: PASS

Repair commits `3726b5918e5e3c2b7bd3bac9185b9638134eee1d` and
`5c4a88cb46b232299fa346a84238c2eeb8de7d10` close every finding from the three
adversarial reviews and their earlier verification records. The repaired static
PWA is deployed at `https://appointment-capacity-map.sociobot.in/` as Azure
Static Web Apps deployment `434ade3a-1496-4641-8f4b-82ff34d4d28e`.

## What changed

- Rewrote the landing and README capability copy to use **team member**,
  **shared resource**, and **service-pair rule** consistently.
- Added a release regression test that locks the four corrected sentences.
- Expanded `privacy-local-only` to explicitly cover third-party font and script
  loading, and upgraded its real browser request test to check scripts,
  stylesheets, and fonts as well as the full request origin set.
- Made the license-payload claim test observe the actual request directly,
  removing a route-handler timing race while still asserting the exact
  bodyless Sociobot GET.
- Updated the catalog sentence to the verb-first, 57-character “Check
  service-job overlaps before changing your calendar.”

See `.factory/polish-3.md` for the complete finding-by-finding map and live
screenshot evidence.

## How verified

- Fresh clone `/tmp/appointment-capacity-map-polish3-final.sy45ZP/repo` at
  `5c4a88cb46b232299fa346a84238c2eeb8de7d10`: `npm ci` (0 audit
  vulnerabilities), typecheck, lint, `npm test` (**15/15**), and build passed.
- All 14 exact commands from `.factory/claims.json` passed separately in that
  clean clone.
- Full local browser suite: **43/43** passed, including Axe, mobile, keyboard,
  focus, privacy, offline, and the real two-build service-worker update test.
- Live deployment: the production-safe browser suite passed **42/42**. The one
  excluded test is only the local two-build update harness; it passed locally
  and is not meaningful against an immutable live build.
- Live `verify-url.sh` passed: 687 ms load, correct title/language, one h1,
  main landmark, complete image alternatives, labelled controls, and zero
  console errors.
- Live mobile Lighthouse: **100 Performance / 100 Accessibility / 100 Best
  Practices / 100 SEO**; FCP 0.9 s, LCP 1.3 s, TBT 0 ms, CLS 0.
- Cold screenshots are in `.factory/evidence/polish-3-live-home-390.png`,
  `.factory/evidence/polish-3-live-demo-390.png`, and
  `.factory/evidence/polish-3-live-404-390.png`.

## Run and deploy

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run test:claims
npm run test:ui
npm run build
```

Deploy `dist/` through the static work-order configuration.

## Known gaps

None.
