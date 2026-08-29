# Review handoff — appointment-capacity-map-review-3

## Outcome: FAIL

Adversarial review 3 is recorded in `.factory/review-3.md` for candidate
`2235a5ad01fe95140907dfe99cdfe1fc21e070c3` and the live deployment at
`https://appointment-capacity-map.sociobot.in/`.

No product code was modified. Two minor findings remain:

- `F-3-1`: landing and README copy use inconsistent terms for team members,
  shared resources, and service-pair rules.
- `F-3-2`: the README's no-third-party-font/script promise is observed by the
  request log but is not named in `.factory/claims.json`.

There are no blocking functional findings. The verdict is FAIL because the
work order permits PASS only with zero findings and no unlisted claim.

## Verification completed

- Fresh 390 × 844 and 1440 × 900 live cold reads.
- One-click live demo, realistic sample, reset, exit, pre-existing real-data
  isolation, request-origin logging, and offline reload.
- All 14 exact claim commands separately from clean clone
  `/tmp/capacity-review3-clean.wQvjwE/repo`; all passed.
- Live consolidated claims: 14/14 passed.
- Clean clone: `npm test` 13/13, typecheck, lint, build, and browser suite 43/43
  passed.
- Live planner/accessibility/regression suite: 28/28 passed.
- All app routes, metadata, history/focus, sitemap, 404, internal links,
  Sociobot attribution, and hosted checkout were checked.
- Every finding from reviews 1 and 2 was confirmed fixed in live behavior and
  source; none was reopened.

## Next step

Apply the exact terminology rewrites in `review-3.md`, expand the privacy claim
entry and its resource assertions (or shorten the README privacy sentence),
then rerun this review from a fresh context.
