# Review handoff — appointment-capacity-map-review-1

## Outcome: FAIL

This was a read-only adversarial review of the deployed product. No product
code was changed. The complete report is in `.factory/review-1.md`.

## Verified

- Fresh 390 px and desktop cold visits clearly explained the job, audience, and
  first action.
- The live one-click `/demo` flow is isolated (`demo:capacity`), populated,
  resettable, leaves cleanly, remains same-origin, and works offline after the
  first controlled visit.
- All eight declared claim commands passed independently after `npm ci`.
- `npm test`, `npm run test:ui` (22/22), and `npm run build` passed.
- Earlier verification findings were rechecked and confirmed fixed.

## Remaining work

1. Add the full shared header/footer and complete metadata to the 404 route.
2. Add route-specific descriptions/OG descriptions for Privacy and Terms.
3. Add or remove the four unlisted claim groups documented as F-1-3 through
   F-1-6.
4. Apply the two README jargon rewrites in the copy audit.

## Reproduce

```sh
npm ci
npm test
npm run test:claims
npm run test:ui
npm run build
```
