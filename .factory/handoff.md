# Repair handoff — appointment-capacity-map-polish-1

## Outcome: PASS

All six findings in `.factory/review-1.md`, both copy-audit flags, and the
earlier verification regressions are fixed. The product code repair is commit
`87befbd3f7a744331a62bd293e74b12b02ef1c02`. It was deployed through the static
work-order configuration as deployment `2626d8a9-084b-4fd9-8a17-a47b1d5c1cb1`
and cold-checked at `https://appointment-capacity-map.sociobot.in/`.

## What changed

- The branded HTTP 404 now has the shared navigation/footer, legal links,
  complete metadata, icons, focus treatment, and responsive notebook styling.
- Privacy, Terms, setup, review, demo, and demo subroutes now set accurate
  titles, descriptions, canonicals, Open Graph, and Twitter metadata.
- Setup and review use real history routes, including isolated `/demo/setup`
  and `/demo/review`; route navigation focuses and announces the h1.
- The claims contract grew from eight to twelve entries. New browser tests
  prove free core planning/export, lack of calendar/public-booking/direct-payment
  integrations, pre-save availability decisions, and license request minimisation.
- Demo isolation now proves the home action, reset, exit, storage keys, and the
  direct `?demo=1` entry path.
- README jargon was removed, the full copy audit has no flags, and the catalog
  description is verb-first and 65 characters.

The complete finding-to-change-to-evidence map is `.factory/polish-1.md`.

## Exact verification

- Clean clone: locked install, audit (0 vulnerabilities), typecheck, lint, 6/6
  unit/contract tests, all 12 claim commands run independently, 32/32 browser
  tests, and `npm run build` passed.
- Local and live factory URL smoke: correct title/lang/h1/main/alt/controls and
  zero console errors on home, demo, Privacy, and Terms.
- Live after deployment: claims 12/12 and public browser suite 31/31. The one
  excluded test is the localhost-only two-build update harness, which passed in
  the clean-clone 32/32 run.
- Live unknown path: HTTP 404 with header, footer, Privacy, Terms, metadata,
  icons, and CSP.
- Axe: zero serious/critical violations across nine routes. Keyboard focus,
  44 px targets, 390 px layout, and reduced motion passed.
- Privacy and offline: sample planning traffic stayed same-origin; `?demo=1`
  used only `demo:capacity`; an offline reload retained the demo after the
  first visit.
- Lighthouse mobile on live `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, interactive
  1.1 s.
- Build: JS 33.11 kB raw / 11.07 kB gzip; CSS 12.53 kB raw / 3.53 kB gzip;
  hero WebP 30.64 kB; `dist/index.html` exists.

## Run it again

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

Set `PLAYWRIGHT_BASE_URL=https://appointment-capacity-map.sociobot.in` to run
the claim and public browser specs against production. Run `e2e/update.spec.ts`
without that variable because it owns a two-build localhost fixture.

## Known gaps and next steps

None. No finding, copy flag, test failure, console error, accessibility issue,
privacy leak, offline defect, or deployment mismatch remains.
