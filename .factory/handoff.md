# Independent verifier handoff — FAIL

Candidate `e6a9ea4e1295e5854b66662e4de5e0639fc2b058` at
`https://appointment-capacity-map.sociobot.in` **must not be released**.

The live files match this candidate byte-for-byte, so this is not a
deployment-only issue. Unit tests (2/2), browser tests (2/2), production build,
ordinary-mode offline reload, normal booking flow, CSV export/invalid-import
recovery, keyboard-focus smoke, live Axe serious/critical scan, and rate-limit
check passed. The API accepted 29 requests in a 40-request burst and then
returned 11 `429` responses with `Retry-After: 2`.

Release blockers:

- `.factory/claims.json` is missing; therefore no required claim test exists or
  could be run from the demo entry point.
- The required demo is absent. `?demo=1` is an ordinary blank notebook;
  “Try a guided example” writes to the normal IndexedDB namespace. There is no
  sample-data action, demo banner, reset/start-real control, isolated storage,
  or `.factory/demo.md`.
- The cold first screen fails the plain-words test: it does not plainly name the
  target small service-business audience, use the required sample-data action
  and outcome, or present the three required facts.

Additional high findings are missing CSP/static-web configuration/real 404 and
non-immutable asset caching; see `.factory/verification.md` for complete,
reproducible evidence, test results, headers, performance figures, and all
defects by severity.

To verify the non-blocked portions locally:

```sh
npm ci
npm test
npm run test:ui
npm run build
```
