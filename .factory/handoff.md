# Repair handoff — appointment-capacity-map-repair-3

## Outcome: PASS

Every release-blocking and supporting product finding in
`.factory/verification-4.md` is repaired for candidate
`89dc76f13eb8773207a5e66d700838e20ca4c80f`. The report is stored in this
checkout by base commit `d13d5d83d4fec93e35f625bc1bd2412964958a04`;
the longer report SHA in the work order is not an object in the supplied clone.
The original `pwa-offline` artifact and static deployment class are unchanged.

The repair code is commit `ac97388a7d630751435f03341835f6686ad56ca8` and is
pushed to `origin/main`. It is deployed at
`https://appointment-capacity-map.sociobot.in/` as Azure deployment
`87f3640d-3aa8-4d83-98bd-5cb99a3be6a6`. The shipped PWA content version is
`0a2618594d7c`.

## Finding-to-fix map

| Verifier finding | Root-cause repair | Exact regression |
| --- | --- | --- |
| A job could be assigned to a person who does not provide its service | The shared conflict engine now treats staff/service ineligibility as a blocking reason. Changing a proposal's service immediately narrows the person list, selects an eligible person, and updates duration/resources. Submit rechecks the same rule. CSV import rejects ineligible assignments and mismatched service resources before replacing data. | `rejects a team member who is not configured for the service`; `rejects imported jobs assigned to a person who does not provide the service`; expanded `@claim:availability-check` changes Consultation/Ava to Mobile visit and proves only Leo can be saved. |
| Cross-midnight staff, resource, and service-pair overlaps appeared clear | Overlap comparison now uses complete UTC date-time instants and duration, not equal dates plus clock minutes. Strict inequalities preserve a valid exact endpoint. Board decisions and the Plus review share this function. | `finds staff, resource, and pair conflicts across midnight`; `allows an exact endpoint at midnight`; expanded `@claim:availability-check` adds 23:30–00:30 then proves 00:00 next day is blocked; expanded `@claim:two-week-review` proves both sides of a midnight conflict appear. |
| Setup removal silently deleted dependent data and left an orphan service | Every setup removal now asks for confirmation and names affected jobs, orphaned services, and pair rules. Cancelling changes nothing. Confirmed team removal also removes services with no remaining provider and their dependent rules/jobs, so persisted data stays valid. | `confirms setup cascades and never leaves a service without a team member` dismisses Ava's warning, reloads to prove no change, then accepts it and proves the valid cascade survives reload. |
| Proposal feedback stayed stale and rejection discarded the edited time | All proposal fields update the draft and decision as they change. Conflict reasons and submit state refresh without replacing typed values; submit retains the current draft if defensive revalidation rejects it. | `updates proposal conflicts without losing values and restores keyboard focus` changes Ava's proposal from 09:00 to the occupied 10:30 slot and proves the visible reason, retained value, and disabled save action. |
| Opening and closing the proposal sheet lost keyboard focus | The labelled sheet is now a dialog region. Opening focuses its heading. Closing restores the exact matrix trigger or Add a job button. | The same keyboard regression opens with Enter, asserts the heading is focused, scans the open sheet with Axe, closes with Enter, and asserts the original matrix cell is focused. |

The availability and two-week claim sandboxes in `.factory/claims.json` now
state the manual service-change and midnight-boundary coverage explicitly.

## Clean local verification

Run with Node 22 and the pinned Playwright 1.58.2:

```sh
npm ci
npm audit --audit-level=moderate
npm run typecheck
npm run lint
npm test
# Run each test command in .factory/claims.json separately.
npm run test:ui
npm run build
```

- Locked clean install: 140 packages; audit found 0 vulnerabilities.
- TypeScript and ESLint: pass.
- Vitest: 9/9 rule and release-contract tests pass.
- Claims: all 12 exact commands pass separately, one tagged browser test per
  claim and a fresh browser context per run.
- Playwright: 35/35 pass locally. This includes desktop, 390 px mobile,
  keyboard-only sheet operation, open-dialog Axe, all-route Axe, touch targets,
  reduced motion, privacy, offline reload, and a real two-build worker update.
- Axe: zero serious or critical findings on `/`, `/setup`, `/review`, `/demo`,
  `/demo/setup`, `/demo/review`, `/privacy`, `/terms`, `/404.html`, and the open
  proposal dialog.
- Factory URL smoke: local `/` and `/demo` return 200 with correct title, lang,
  one H1, main landmark, image alt, labelled controls, desktop/mobile
  screenshots, and zero console errors. Loads measured 552 ms and 526 ms.
- Mobile: 390 × 844 board and open sheet have no horizontal overflow; every
  visible link, button, input, and select is at least 44 px high. Reduced-motion
  animations are at most 0.001 seconds.
- Build: `dist/index.html` exists. Initial JS is 36.59 kB raw / 12.07 kB gzip;
  CSS is 12.53 kB raw / 3.53 kB gzip; hero WebP is 30.64 kB. All remain far
  below the 200 kB JS, 50 kB CSS, and 300 kB image budgets.
- `.factory/copy-audit.md` remains valid because no landing or README copy was
  changed: no audited sentence exceeds 22 words or contains a banned term.

## Live verification

- Factory URL smoke passes on `/` and `/demo`: live loads were 798 ms and
  717 ms, with no console/page errors and the same accessibility structure.
- Production-safe Playwright: 34/34 claims, planner, routing, mobile, keyboard,
  accessibility, privacy, and offline tests pass on the custom domain. The only
  excluded test is the localhost-only two-build worker harness, which passed in
  the 35/35 local suite.
- Lighthouse 12.8.2 mobile on live `/demo`: Performance 98, Accessibility 100,
  Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.1 s, TBT 170 ms, CLS 0.
- Offline/update: a fresh live demo installs the worker, survives an offline
  reload with sample data, and uses the isolated `demo:capacity` IndexedDB key.
  The local real-worker test upgrades `qa-old` to `qa-new` through the visible
  Refresh now notice.
- Privacy: the full tested planner flow stays on the product origin. There are
  no analytics, CDN scripts, or external fonts. Only explicit license checks
  can reach `api.sociobot.in`.
- Response policy: HTML has CSP with `frame-ancestors 'none'`, HSTS,
  Permissions-Policy, Referrer-Policy, nosniff, and frame denial. Hashed assets
  are immutable for one year; the manifest is typed and no-cache; the worker is
  no-store. Unknown routes return the styled page with HTTP 404.
- Billing policy: the registered checkout returns HTTP 303 to hosted Dodo;
  nothing is embedded. A synthetic invalid token returns HTTP 200 with
  `{ valid: false, reason: "invalid" }` and `Cache-Control: no-store`. In a
  sequential 40-request allowance check, requests 1–30 returned 200 and 31–40
  returned 429 with `Retry-After: 4`.
- Identity: all 16 public build artifacts match local bytes. Representative
  SHA-256 values: `index.html`
  `382aa977a3311a0b07c17b1d58dc9ef9331240335bc9b22eb512f4cf65e8e28d`;
  JS `067320414cde27e3bf9138f5e894783cfc440c6023c847357ef0b4210941f87e`;
  CSS `04c576cfe42d2a975951d1f830db85bb14cd11b14cb3635b3b81f72a44475dc9`;
  worker `9d809e8c2cd0f80fc86067c5ad0c9afd5d077537321ebd9fe5eb155a3437f66c`.

## Deployment and rollback

```sh
npm run build
/opt/fleet/lib/deploy-static.sh appointment-capacity-map /work/repo/dist
```

Azure Static Web Apps reused `sf-appointment-capacity-map` in `centralus`; the
custom domain and managed TLS are ready. To roll back, build a known-good prior
commit and deploy its `dist/` with the same helper.

## Known gaps

No release-blocking product gap remains. Package/consumer, backend health,
sign-in, and runtime AI checks do not apply to this static, local-first PWA.
The researched `.factory/brief.json` was absent from the supplied base, so the
existing scope and `.factory/design.md` were preserved without inventing a
brief.
