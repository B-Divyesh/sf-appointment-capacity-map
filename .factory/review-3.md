# Adversarial first-read review 3 — Capacity Map

- **Reviewed:** 2026-08-29 UTC
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Candidate:** `2235a5ad01fe95140907dfe99cdfe1fc21e070c3`
- **Verdict:** **FAIL** — two minor findings remain. There are no blocking
  functional findings, but PASS requires zero findings and no unlisted claim.

## Findings

### F-3-1 — Minor — The landing page and README use four terms for the same capacity concepts

**Exact locations and quotes:**

- Landing, **How it works**: “Record people, services, equipment, and limits.”
- Landing, **How it works**: “Each blocked slot names the person, item, or rule.”
- README opening: “The planner records people, services, shared equipment, and no-overlap rules.”
- README **Features**: “Check staff, equipment, and service-pair conflicts with a plain explanation.”

The product UI and its own terminology table call these concepts **team
member**, **shared resource**, and **service-pair rule**. The quoted copy changes
the same concepts to people/staff/person, equipment/item/shared equipment, and
limits/rule/no-overlap rule. A first-time visitor must infer whether an “item”
is the same thing as a “shared resource” and whether “limits” include something
other than service-pair rules. This fails the required one-term-per-concept
copy rule.

**Concrete fix:** use the established terms in all four places:

- “Record team members, services, shared resources, and service-pair rules.”
- “Each blocked slot names the team member, shared resource, or service-pair rule.”
- “The planner records team members, services, shared resources, and service-pair rules.”
- “Check team-member, shared-resource, and service-pair conflicts with a plain explanation.”

### F-3-2 — Minor — The no-third-party-resources privacy promise is not named in the claims contract

**Location:** README, **Privacy and legal terms**:

> “There are no analytics, third-party fonts, or third-party scripts.”

`privacy-local-only` names local plan storage, analytics, and employee
tracking. It does not name the separate promise that the product loads no
third-party fonts or scripts. Its request-log test currently observes only the
product origin, so the deployed behavior is consistent with the sentence, but
the public claim itself is absent from `.factory/claims.json`. The contract
therefore does not require a future test to retain those two guarantees.

**Concrete fix:** expand the `privacy-local-only` claim text and `where` field
to include “No third-party fonts or scripts are loaded.” Keep the request log
assertion from before navigation through the complete demo flow, and assert
that every loaded script, stylesheet, and font resource is same-origin.
Alternatively, remove “third-party fonts, or third-party scripts” from the
README sentence.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 opened the live home page
without prior storage, scrolling, or authentication. Before scrolling, both
screens answered all three questions:

| Question | First-read answer |
| --- | --- |
| What does it do? | It checks which service jobs can overlap. |
| For whom? | Service businesses with two to ten people. |
| What should I click first? | **Try it with sample data**; the adjacent sentence says it loads a separate notebook with a realistic day plan. |

The exact first-screen copy was:

> “Check which service jobs can overlap”
>
> “For service businesses with two to ten people who need clear answers before adding work to the calendar.”
>
> “Try it with sample data” — “Loads a separate notebook with a realistic day plan.”

At 390 px, the primary action began at y=399 and all three facts ended by
y=642, inside the 844 px viewport:

- “Your plan stays in this browser.”
- “Works offline after the first visit.”
- “Core planning is free. Plus costs $29 once.”

The page had no horizontal overflow and no console or page errors. This first
screen is not a blocking finding.

## Copy audit

Counts treat hyphenated terms, paths, prices, and version strings as one word.
Controls, headings, labels, and footer copy are included because visitors and
screen readers encounter them. Shell commands are excluded. No item exceeds
22 words, contains a banned marketing word, uses a mood heading, or presents a
non-result-naming action. The terminology and unlisted-claim flags are the two
findings above.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to planner | 3 | Pass |
| Capacity Map | 2 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Saved on this device | 4 | Pass |
| Today board | 2 | Pass |
| Notebook setup | 2 | Pass |
| Two-week review | 2 | Pass |
| Capacity Map | 2 | Pass |
| Check which service jobs can overlap | 6 | Pass — `availability-check` |
| For service businesses with two to ten people who need clear answers before adding work to the calendar. | 18 | Pass |
| Try it with sample data | 5 | Pass — `demo-isolation` |
| Loads a separate notebook with a realistic day plan. | 9 | Pass — `demo-isolation` |
| Set up my own notebook | 5 | Pass |
| Your plan stays in this browser. | 6 | Pass — `privacy-local-only` |
| Works offline after the first visit. | 6 | Pass — `offline-reload` |
| Core planning is free. | 4 | Pass — `core-free` |
| Plus costs $29 once. | 4 | Pass — `plus-price` |
| How it works | 3 | Pass |
| Add your capacity. | 3 | Pass — `capacity-setup` |
| Record people, services, equipment, and limits. | 6 | **F-3-1: inconsistent terms.** |
| Choose a time. | 3 | Pass |
| See which jobs fit before changing your calendar. | 8 | Pass — `availability-check` |
| Read the reason. | 3 | Pass |
| Each blocked slot names the person, item, or rule. | 9 | **F-3-1: inconsistent terms.** |
| Your browser holds the plan | 5 | Pass |
| Capacity Map does not connect to calendars, take bookings, or track employees. | 12 | Pass — `no-calendar-booking-payment` |
| You choose when to import or export a CSV file. | 10 | Pass — `csv-roundtrip` |
| Review two weeks with Plus | 5 | Pass |
| Capacity Map Plus lists conflicts across fourteen days. | 8 | Pass — `two-week-review` |
| It costs $29 as a one-time purchase. | 7 | Pass — `plus-price` |
| See Plus details | 3 | Pass |
| Plans stay in this browser. | 5 | Pass — `privacy-local-only` |
| Notebook art was generated for Capacity Map. | 7 | Pass — `generated-art-disclosure` |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1290c4aced28 | 1 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Capacity Map | 2 | Pass |
| Capacity Map checks which service jobs can overlap before a booking is made. | 13 | Pass — `availability-check` |
| It is for service businesses with two to ten people that already use a calendar. | 15 | Pass |
| The planner records people, services, shared equipment, and no-overlap rules. | 10 | **F-3-1: inconsistent terms.** |
| It names the exact constraint behind a blocked time. | 9 | Pass — `conflict-explanation` |
| Planning data stays in the current browser unless the user exports it, and the installed app works offline after its first visit. | 22 | Pass — `privacy-local-only`, `offline-reload` |
| Try the isolated demo | 4 | Pass |
| Open `/demo` or choose **Try it with sample data** on the home page. | 13 | Pass |
| The demo loads two people, three services, two shared resources, and three jobs. | 13 | Pass — `demo-isolation` |
| It uses separate browser storage and never reads or writes your real notebook. | 13 | Pass — `demo-isolation` |
| Choose **Reset demo** to restore the sample or **Start for real** to discard it. | 14 | Pass — `demo-isolation` |
| Features | 1 | Pass |
| Check staff, equipment, and service-pair conflicts with a plain explanation. | 10 | **F-3-1: inconsistent terms.** |
| Import and export the full plan as CSV. | 8 | Pass — `csv-roundtrip` |
| Keep core planning and CSV export free. | 7 | Pass — `core-free` |
| Preview the fourteen-day conflict review in demo mode. | 8 | Pass — `two-week-review` |
| Buy Capacity Map Plus for $29 as a one-time purchase through Sociobot. | 12 | Pass — `plus-price` |
| Capacity Map does not make public booking pages, connect to calendars, take payments itself, or collect employee tracking data. | 19 | Pass — `no-calendar-booking-payment` |
| Develop and verify | 3 | Pass |
| Use Node 22 or newer. | 5 | Pass |
| Each public claim and its exact sandbox command is listed in `.factory/claims.json`. | 12 | Pass as repository documentation |
| Browser tests use the `/demo` entry point and do not need an account or license. | 15 | Pass as repository documentation |
| Deploy | 1 | Pass |
| `npm run build` creates the offline web app in `dist/`. | 10 | Pass |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass as deployment documentation |
| `staticwebapp.config.json` supplies route rewrites, security headers, immutable asset caching, manifest MIME handling, and the 404 response. | 16 | Pass as deployment documentation |
| The factory owns DNS and infrastructure. | 6 | Pass as deployment documentation |
| Privacy and legal terms | 4 | Pass |
| Read `/privacy` and `/terms` in the running app. | 8 | Pass |
| License verification sends only the pasted token to `api.sociobot.in`, at most once per day. | 14 | Pass — `license-request-data`, `daily-license-check` |
| There are no analytics, third-party fonts, or third-party scripts. | 9 | **F-3-2: partly unlisted privacy claim.** |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See [LICENSE](LICENSE). | 2 | Pass |

## Demo and sandbox behavior

- One click on **Try it with sample data** opened `/demo`. The first 390 px
  viewport already showed the working capacity board, the selected date and
  start time, Consultation options for Ava and Leo, and the persistent **Demo —
  sample data, nothing is saved to your notebook** banner.
- The demo contained Ava and Leo, Consultation, Treatment, Mobile visit, a
  treatment chair, a service van, a service-pair rule, and three named jobs:
  New client call, Follow-up, and Home visit.
- Adding a clear sample job changed the count from three to four. **Reset demo**
  restored three jobs. **Start for real** removed the `demo:capacity` key.
- A separate live check first created “Real notebook owner” under the real
  `capacity` key, used and reset the demo, then selected **Start for real**. The
  real record remained, Ava was absent, and IndexedDB contained only
  `capacity`. This confirms demo actions did not overwrite existing real data.
- The live claim flow recorded only
  `https://appointment-capacity-map.sociobot.in` requests. After service-worker
  readiness, `/demo` reloaded offline with the sample intact.

The demo requirement passes and is not a blocking finding.

## Claims

`.factory/claims.json` contains 14 unique entries. From clean clone
`/tmp/capacity-review3-clean.wQvjwE/repo` at candidate commit `2235a5a`, every
listed command was run separately after `npm ci`:

| Claim ID | Exact-command result |
| --- | --- |
| `demo-isolation` | PASS — 1 test |
| `capacity-setup` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `csv-roundtrip` | PASS — 1 test |
| `privacy-local-only` | PASS — 1 test |
| `conflict-explanation` | PASS — 1 test |
| `two-week-review` | PASS — 1 test |
| `daily-license-check` | PASS — 1 test |
| `plus-price` | PASS — 1 test |
| `core-free` | PASS — 1 test |
| `no-calendar-booking-payment` | PASS — 1 test |
| `availability-check` | PASS — 1 test |
| `license-request-data` | PASS — 1 test |
| `generated-art-disclosure` | PASS — 1 test |

The consolidated claim suite also passed 14/14 against the live deployment.
No listed claim test failed. F-3-2 records the one claim-like README sentence
that is not fully named in an entry.

Clean-clone quality gates also passed: `npm test` 13/13, typecheck, lint,
production build, and `npm run test:ui` 43/43. The build produced 12.60 kB gzip
JavaScript and 3.58 kB gzip CSS.

## Earlier finding regression check

Both earlier reviews, both polish reports, and the previous handoff were read.
Every earlier finding was checked in the current source and live deployment:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 — incomplete 404 shell | Fixed: an unknown route returns HTTP 404 with the shared header, skip link, main, footer, Demo, Privacy, Terms, and return action. |
| F-1-2 — legal/404 metadata | Fixed: legal pages and 404 have route-specific titles, descriptions, canonical/social metadata, and favicons. |
| F-1-3 — free-core claim unlisted | Fixed: `core-free` exists and its exact clean-clone and live tests passed. |
| F-1-4 — calendar/booking/payment absence unlisted | Fixed: `no-calendar-booking-payment` exists and passed with DOM and request checks. |
| F-1-5 — availability promise unlisted | Fixed: `availability-check` passed clear-job, staff eligibility, and midnight-conflict coverage. |
| F-1-6 — license payload promise unlisted | Fixed: `license-request-data` passed the exact origin, path, sole query value, GET method, and empty body checks. |
| F-2-1 — demo subroutes omitted from sitemap | Fixed: live sitemap lists `/demo/setup` and `/demo/review`; both return 200. |
| F-2-2 — setup capability unlisted | Fixed: `capacity-setup` creates, reloads, and uses every advertised record type. |
| F-2-3 — sample counts unproved | Fixed: `demo-isolation` asserts two people, three services, two resources, and three jobs before and after reset. |
| F-2-4 — “Local-first” jargon | Fixed: the footer says “Plans stay in this browser.” |
| F-2-5 — unexplained illustration slogan | Fixed: “Original generated illustration” is absent. The current sentence is a plain generated-art disclosure backed by `generated-art-disclosure` and the design provenance sidecar. |

No earlier finding is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/demo/setup`, `/demo/review`, `/setup`, `/review`, `/privacy`,
  and `/terms` returned 200. An unknown route returned the designed HTTP 404.
- All application routes had one h1, one main, `lang="en"`, route-specific
  descriptions and canonical/OG/Twitter metadata, favicon declarations, and
  the shared header/footer. Titles follow the required pattern: **Capacity Map
  — check service job overlaps**, **Demo — Capacity Map**, **Notebook setup —
  Capacity Map**, **Two-week review — Capacity Map**, **Demo setup — Capacity
  Map**, **Demo review — Capacity Map**, **Privacy — Capacity Map**, **Terms —
  Capacity Map**, and **Page not found — Capacity Map**.
- Deep links loaded the correct state. History back restored the prior route
  and scroll position, focused the destination h1, and updated the polite route
  announcement. Keyboard navigation, the skip link, dialog focus return, and
  visible focus indicators passed live.
- The sitemap lists all eight public application routes. The crawl found no
  dead links: internal routes and `sociobot.in` returned 200; the registered
  Sociobot checkout returned 303 and completed at hosted Dodo checkout with
  200.
- The live 28-test planner/regression suite passed, including axe checks on all
  app routes and `404.html`. Axe found zero serious or critical violations.
  At 390 px there was no horizontal overflow, controls were at least 44 px,
  and reduced motion disabled the short entry animation.
- The warm ruled-paper canvas, ink-and-pencil palette, serif notebook headings,
  original field-note art, square paper controls, and sparse motion match
  `.factory/design.md`. The result is distinguishable from a centered generic
  SaaS hero or feature-card template.

## Missed leverage

`.factory/brief.json` is absent, so no additional researched feature can be
verified from it. CSV import/export already supplies the obvious portability
path. Calendar sync would contradict the explicit no-calendar/local-storage
position. An AI step would not improve the deterministic, explainable overlap
decision and would add network, privacy, and cost requirements. No missed-
leverage or decorative-AI finding is raised.

## What would make this perfect

Use **team member**, **shared resource**, and **service-pair rule** consistently
in the four flagged landing/README sentences. Then either register and directly
test the no-third-party-font/script promise or remove that part of the README
sentence. Re-run the complete cold review after those two copy-contract changes;
the tested demo, core workflow, routing, privacy behavior, accessibility, and
visual system need no other correction from this round.
