# Review handoff — appointment-capacity-map-review-2

## Outcome: FAIL

This was an independent, non-code adversarial review of
`https://appointment-capacity-map.sociobot.in/`. The full report is
`.factory/review-2.md`.

One medium and four minor findings remain:

1. The sitemap omits the public `/demo/setup` and `/demo/review` routes.
2. The landing/README promise that users can record people, services, shared
   resources, and rules has no matching claim entry and test.
3. The README’s exact demo counts are not asserted by its claim test.
4. “Local-first planning notebook” is unexplained footer jargon.
5. “Original generated illustration” is an unhelpful, untested footer slogan.

## What was verified

- Cold 390 px and desktop first reads explain the job, audience, and sample
  action before scrolling. The live demo is one click, visibly seeded,
  isolated, resettable, and disposable.
- All 12 commands in `.factory/claims.json` passed independently from fresh
  clone `/tmp/capacity-review-clean-suE8a5`.
- Live Playwright checks confirmed same-origin demo requests, offline reload,
  route metadata, history/focus behavior, responsive layout, links, headers,
  and the real designed 404. Axe found no serious or critical violations across
  all public routes.
- In the fresh clone, `npm test` (9/9), typecheck, lint, and `npm run build`
  passed. The build generated `dist/`.
- Every prior review/polish/verification finding was read and rechecked; none
  regressed. Details are in the regression table in the review.

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
# Run each exact command in .factory/claims.json separately.
npm run test:ui
```

Open `/demo` or choose **Try it with sample data**. Use **Reset demo** to
reseed its separate browser storage, or **Start for real** to discard it.

## Next steps

Implement the five concrete fixes in `.factory/review-2.md`, then perform a
fresh review. No product code was changed in this work order.
