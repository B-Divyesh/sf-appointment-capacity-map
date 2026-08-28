# Capacity Map handoff

## What shipped

- A Vite + TypeScript local-first PWA in `dist/`, with a handwritten lab
  notebook visual system described in `.factory/design.md`.
- IndexedDB persistence for staff, service, shared-resource, service-pair rule,
  and job-plan records. The capacity board makes each staff/service option
  explicitly bookable or blocked and names the exact conflicting capacity rule.
- A guided example plus genuine blank, error, offline, keyboard, and mobile
  states. CSV import/export is available in the setup notebook and is never
  paid-gated.
- A one-time $29 Plus capability for the two-week conflict review using the
  Sociobot checkout / license-verify contract, including return-token storage,
  daily verification cache, offline optimistic access, and license restore.
- Manifest, generated icons, built service worker with versioned precache,
  offline fallback, and in-app update prompt. `/privacy` and `/terms` are real
  static pages as well as being reachable from the app.
- Original generated notebook art at `src/assets/capacity-notebook.webp`.
  The source prompt/deployment metadata is alongside it; it is 30 KB in the
  production build and is disclosed in the footer.

## Verification

Ran successfully on 2026-08-28:

```sh
npm test
npm run build
npx playwright test
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/evidence
```

- Unit tests: 2/2 rule-engine cases pass.
- Playwright: 2/2 pass, including adding a clear job, an offline reload after
  initial visit, and Axe with zero serious/critical violations.
- `verify-url.sh`: title, `lang=en`, exactly one h1, main landmark, image alt,
  labelled buttons, and browser console all pass; desktop load was 652 ms.
- Lighthouse mobile: Performance **99**, Accessibility **100**; FCP 1.2 s,
  LCP 1.7 s, TBT 110 ms, CLS 0.
- Production JS is 25.7 KB uncompressed (8.8 KB gzip), CSS is 10.1 KB
  uncompressed (3.0 KB gzip), and the hero artwork is 30.6 KB.

## Run / deploy

`npm install && npm run build` produces the exact static deploy root: `dist/`
with `dist/index.html`. `npm run preview` serves it locally.

## Known gaps / next steps

- The product intentionally does not sync calendars, expose a public booking
  page, process payments itself, or use analytics; those are outside v1.
- The checkout slug is ready for factory registration, but live billing should
  be exercised after the factory creates the corresponding Sociobot product.
