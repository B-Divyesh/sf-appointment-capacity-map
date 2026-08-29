# Repair handoff — appointment-capacity-map-polish-2

## Outcome

PASS. All five findings in `.factory/review-2.md` are fixed, all six findings
from `.factory/review-1.md` remain closed, and the verified build is deployed at
`https://appointment-capacity-map.sociobot.in/`.

- Repair implementation: `7c5575baddc41a6fbb197bf7ae21817d1dd2e293`
- Azure deployment: `de0c6a1a-4e46-459b-8753-90209d509387`
- Live build version: `0c87ceff722e`
- Detailed finding map: `.factory/polish-2.md`

## What changed

- Completed the sitemap with `/demo/setup` and `/demo/review`, backed by a
  route-completeness contract test.
- Added the `capacity-setup` claim and a real browser test that creates,
  persists, reloads, and uses a person, resource, service, and pair rule.
- Strengthened `demo-isolation` to assert the advertised two people, three
  services, two resources, and three jobs before and after reset.
- Replaced footer jargon with “Plans stay in this browser.” and removed the
  decorative illustration slogan from the app and 404.
- Updated the catalog sentence and the complete plain-language copy audit.
- Preserved the handwritten notebook identity, static PWA architecture,
  isolated demo storage, metadata, focus routing, offline worker, and legal
  pages.

## Verification

From clean clone `/tmp/capacity-polish2-clean-D5lOZB/repo` at the repair commit:

- `npm ci`: 140 packages, zero vulnerabilities.
- Every exact command in `.factory/claims.json`: 13/13 passed independently.
- `npm test`: 10/10 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test:ui`: 36/36 passed.
- `npm run build`: passed; `dist/index.html` exists.

After deployment:

- Factory URL smoke: 200, 883 ms, zero errors, correct title/lang/h1/main/alt
  text/control labels.
- Live production-safe Playwright suite: 35/35 passed, including all claims,
  offline, privacy, mobile, routing, focus, metadata, 404, and axe coverage.
- `/`, all seven named subroutes: HTTP 200; unknown route: HTTP 404.
- Lighthouse mobile `/demo`: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.0 s, TBT 0 ms, CLS 0.
- Bundles: JS 36.55 kB raw / 12.05 kB gzip; CSS 12.53 kB raw / 3.53 kB gzip;
  hero image 30.64 kB.
- Cold visual evidence:
  `.factory/evidence/polish-2-demo-390.png`,
  `.factory/evidence/polish-2-setup-1440.png`, and
  `.factory/evidence/polish-2-404-390.png`.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:claims
npm run test:ui
npm run build
```

Run each `test` value in `.factory/claims.json` separately for the strict claim
gate. Open `/?demo=1` for a fresh sample; use **Reset demo** to restore it and
**Start for real** to delete the demo notebook.

## Known gaps and next steps

None within the product brief or cumulative adversarial reviews. No TODOs or
deferred minor findings remain.
