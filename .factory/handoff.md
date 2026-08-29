# Repair handoff — appointment-capacity-map-polish-3

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
