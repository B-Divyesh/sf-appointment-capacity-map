# Polish round 2 — adversarial review closure

- **Reviewed candidate:** `7cf9870f118ffac18e96b4f97c67013f76c372d4`
- **Repair implementation:** `7c5575baddc41a6fbb197bf7ae21817d1dd2e293`
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Deployment:** Azure Static Web Apps deployment `de0c6a1a-4e46-459b-8753-90209d509387`
- **Live build:** `0c87ceff722e`
- **Result:** PASS — all current and earlier findings are closed.

Both adversarial reports and the earlier polish report were read in full. The
round-one changes remain covered by the release and browser suites.

## Review 2 finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Added `/demo/setup` and `/demo/review` to `public/sitemap.xml`. Added a release-contract test that enumerates every public app route. | `src/release-contract.test.ts` — “lists every public application route in the sitemap”; clean-clone `npm test` passed 10/10; live `GET /sitemap.xml` contains both URLs; both routes return HTTP 200. |
| F-2-2 | Added the `capacity-setup` claim and a fresh `/demo/setup` test. It creates a person, shared resource, service, and service-pair rule, reloads, proves all four persist, uses the person/resource/service on the board, and proves the new pair rule prevents saving an overlap. | `npm run test:claims -- --grep @claim:capacity-setup` passed independently from the clean clone and live; `e2e/claims.spec.ts` test “creates and retains every capacity record for board checks”; screenshot `.factory/evidence/polish-2-setup-1440.png`; live `/demo/setup`. |
| F-2-3 | Expanded `demo-isolation` so its claim names the exact sample. The test checks two people, three services, two resources, and three jobs on entry and after reset. It still proves one-click entry, the sole `demo:capacity` key, real-data isolation, disposal, and the `?demo=1` alias. | `npm run test:claims -- --grep @claim:demo-isolation` passed independently from the clean clone and live; screenshot `.factory/evidence/polish-2-demo-390.png`; cold live `/?demo=1` opened `/demo` with the banner and reset controls. |
| F-2-4 | Replaced “Local-first planning notebook” with “Plans stay in this browser.” in both the application and branded 404 footer. | `privacy-local-only` passed independently and live; live browser suite checked the app and 404; screenshots `.factory/evidence/polish-2-demo-390.png` and `.factory/evidence/polish-2-404-390.png`; live HTML contains the new sentence. |
| F-2-5 | Removed “Original generated illustration” from both footers. Asset provenance remains in `.factory/design.md`, where it is useful and complete. | Live cold screenshots above contain no slogan; live application and 404 HTML contain no slogan; the original artwork and notebook visual system remain unchanged. |

## Review 1 regression map

| Finding | Preserved change | Evidence |
| --- | --- | --- |
| F-1-1 | The designed 404 retains the shared header, navigation, skip link, main, footer, and legal links. | Live unknown URL returned HTTP 404; `.factory/evidence/polish-2-404-390.png`; planner metadata/404 test passed live. |
| F-1-2 | Privacy, Terms, app subroutes, demo routes, and 404 retain route-specific titles, descriptions, canonicals, social metadata, and favicons. | Live planner routing/metadata tests passed; axe covered all nine routes; URL verifier reported the correct title, language, h1, main, alt text, labels, and zero console errors. |
| F-1-3 | `core-free` continues to prove planning and CSV export without a license or checkout. | Its exact claim command passed independently in the clean clone and passed live. |
| F-1-4 | `no-calendar-booking-payment` continues to prove the absence of calendar, booking, direct-payment, and employee-tracking integrations. | Its exact request/DOM claim test passed independently and live. |
| F-1-5 | `availability-check` continues to prove a clear job can be added and an overlap is rejected before saving. | Its exact claim command passed independently and live. |
| F-1-6 | `license-request-data` continues to prove the bodyless Sociobot GET contains only the pasted token. | Its exact intercepted-request test passed independently and live. |

## Cross-cutting acceptance evidence

- The accepted first screen still states the job, audience, sample action,
  action result, browser storage, offline behavior, free core, and Plus price.
- `/demo` and `/?demo=1` remain isolated, resettable, disposable, and available
  offline after the first visit. The persistent banner is visible at 390 px.
- Real History API routes, route titles, heading focus, polite announcements,
  back navigation, the HTTP 404, and Privacy/Terms links passed live.
- The 390 px tests found no horizontal overflow; every visible control was at
  least 44 px high; reduced motion, keyboard operation, and designed focus
  indicators passed.
- `.factory/copy-audit.md` contains the revised full landing/README audit with
  no sentence over 22 words and no banned word. The catalog line is a
  69-character verb-first sentence.

## Verification record

- Clean clone: `/tmp/capacity-polish2-clean-D5lOZB/repo`, exact commit
  `7c5575baddc41a6fbb197bf7ae21817d1dd2e293`.
- Locked install: 140 packages, zero audit vulnerabilities.
- Every one of 13 `.factory/claims.json` commands passed separately.
- `npm test`: 10/10; typecheck and lint: pass; `npm run test:ui`: 36/36;
  final `npm run build`: pass with `dist/index.html`.
- Production-safe live suite: 35/35 against the custom HTTPS URL. It includes
  all claims, privacy logging, offline reload, route/focus/history checks, and
  axe checks on `/`, `/setup`, `/review`, `/demo`, both demo subroutes, both
  legal routes, and `/404.html`.
- Factory URL verifier: 883 ms load, zero errors, one h1, one main, `lang=en`,
  no missing alt text, and no unlabelled buttons.
- Live Lighthouse mobile `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 0 ms, CLS 0.
- Production output: JavaScript 36.55 kB raw / 12.05 kB gzip; CSS 12.53 kB raw
  / 3.53 kB gzip; hero WebP 30.64 kB.

No finding of any severity remains unresolved.
