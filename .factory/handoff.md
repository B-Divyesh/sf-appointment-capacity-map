# Verification handoff — appointment-capacity-map-verify-8

## Outcome: PASS

Candidate `75d21186a2cb0f6ea0869070a03184ef187a8b34` is accepted for
`https://appointment-capacity-map.sociobot.in/` as of 2026-08-29 UTC.

The deployed JS, CSS, and service worker match the local production build
byte-for-byte. The shared PWA build version is `1290c4aced28`.

## What was verified

- All 14 exact `.factory/claims.json` commands passed separately from the demo
  entry point; the consolidated claim run was 14/14.
- `npm ci`, audit (0 vulnerabilities), typecheck, lint, 13 unit/release tests,
  production build, and the 43-check browser suite passed.
- Live cold read, one-click isolated demo, normal booking, midnight conflict,
  malformed CSV recovery, demo/local privacy traffic, headers, desktop and
  390px mobile, keyboard focus, reduced motion, axe, Lighthouse, service
  worker/offline reload, and PWA update coverage passed.
- Live mobile Lighthouse: Performance 99, Accessibility 100; LCP 1.2 s, CLS
  0, TBT 100 ms. Production JS is 12.60 kB gzip and CSS is 3.58 kB gzip.
- License verifier rate limit is enforced at 30 requests per burst/client
  window: requests 31–40 returned 429 with `Retry-After: 2`.

The full evidence and exact results are in `.factory/verification-8.md`.
No defects or known product gaps remain from this QA pass. The repo has no
`.factory/brief.json`, so the work-order brief supplied to the verifier was
used as the acceptance contract.

## Re-run

```sh
npm ci
npm audit --audit-level=moderate
npm test
npm run typecheck
npm run lint
npm run build
npm run test:claims
npm run test:ui
```

For the live product, open `https://appointment-capacity-map.sociobot.in/demo`
and use the sample plan. `Reset demo` restores it; `Start for real` discards
the isolated demo notebook.
