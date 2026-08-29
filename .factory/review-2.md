# Adversarial first-read review 2 — Capacity Map

- **Reviewed:** 2026-08-29
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Candidate reviewed locally:** `88dff407d125804a9c74b163880a61d1f2a3e612`
- **Verdict:** **FAIL** — one medium and four minor findings remain. PASS requires zero
  findings, including unlisted or insufficiently proved public claims.

## Cold first read

Fresh, logged-out Chromium contexts at 390 × 844 and 1440 × 900 loaded the
home route with no application console errors or horizontal overflow. Before
scrolling, the answers were clear:

| First-read question | Observed answer |
| --- | --- |
| What does it do? | It checks whether service jobs can overlap. |
| For whom? | Service businesses with two to ten people. |
| What should I click first? | **Try it with sample data**. It says it will load a separate notebook with a realistic day plan. |

The exact first-screen text was:

> “Check which service jobs can overlap”
>
> “For service businesses with two to ten people who need clear answers before adding work to the calendar.”
>
> “Try it with sample data” — “Loads a separate notebook with a realistic day plan.”

The three facts were visible in the 390 px viewport: “Your plan stays in this
browser.”, “Works offline after the first visit.”, and “Core planning is free.
Plus costs $29 once.” This is not a blocking first-read failure.

## Findings

### F-2-1 — Medium — The sitemap omits two public deep-link routes

**Location:** live `/sitemap.xml`; it lists `/demo`, `/setup`, and `/review`,
but omits `/demo/setup` and `/demo/review`.

**Why this fails:** Both omitted URLs are real, linked, reloadable application
routes. A visitor can reach them directly from the demo tabs, but discovery
tools receive an incomplete map. The site-structure contract requires the
sitemap to list every route.

**Concrete fix:** add `/demo/setup` and `/demo/review` to `public/sitemap.xml`.
If those views should not be indexed, instead send an explicit `noindex`
directive and remove the direct navigation routes rather than silently omitting
them from the sitemap.

### F-2-2 — Minor — The capacity-setup capability is an unlisted public claim

**Location:** landing, **How it works** step 1:

> “Record people, services, equipment, and limits.”

README opening:

> “The planner records people, services, shared equipment, and no-overlap rules.”

**Why this fails:** These are useful capability promises, but no entry in
`.factory/claims.json` names or proves them. `csv-roundtrip` proves a supplied
replacement can include a person and service; it does not prove that the
setup UI can create a person, shared resource, service, and service-pair rule,
then retain all of them after reload. A visitor deciding whether to use the
planner can rely on this capability.

**Concrete fix:** add a `capacity-setup` claim and tagged fresh-context test.
The test should create each of those four records in `/demo/setup`, reload, and
assert all four remain and are used by the capacity board. Alternatively,
remove both promises.

### F-2-3 — Minor — The exact demo composition is an unproved quantitative claim

**Location:** README, **Try the isolated demo**:

> “The demo loads two people, three services, two shared resources, and three jobs.”

**Why this fails:** `demo-isolation` proves one named sample job, a three-job
reset result, and storage isolation. It does not assert the promised two
people, three services, or two resources. The exact counts are a quantitative
claim and must be observable in the corresponding tagged test.

**Concrete fix:** extend `@claim:demo-isolation` to assert the exact sample
counts immediately after entering `/demo` and again after **Reset demo**, or
add a `demo-sample-composition` claim with that test. If the counts are not
important, rewrite the README as: “The demo loads a realistic service plan.”

### F-2-4 — Minor — The footer uses unexplained storage jargon

**Location:** landing footer:

> “Local-first planning notebook.”

**Why this fails:** “Local-first” is product-development jargon. It does not
tell a distracted first-time visitor where the plan is stored as plainly as the
nearby landing fact does, and it introduces a second term for the same privacy
idea.

**Concrete fix:** replace it with “Plans stay in this browser.” This is plain,
uses the existing terminology, and remains covered by `privacy-local-only`.

### F-2-5 — Minor — The footer’s illustration slogan does not help a visitor

**Location:** landing footer:

> “Original generated illustration.”

**Why this fails:** This is a provenance assertion without a visitor-facing
use, route, or explanation. It reads as a generic decorative label and is not
a claim in `.factory/claims.json`. The actual provenance is appropriately
documented in `.factory/design.md`; repeating this bare slogan in the product
does not help someone decide what to do.

**Concrete fix:** remove the sentence from the footer. Keep the documented
asset provenance in the design record. If public provenance must remain, link
to a short “Artwork provenance” page and give that statement a matching test.

## Copy audit

Counts treat hyphenated words, paths, prices, and version strings as one word.
Controls, headings, labels, and footer copy are included because visitors and
screen readers encounter them. Commands are excluded. No item exceeds 22
words and no banned marketing adjective appears. `F-2-4` and `F-2-5` are the
copy flags above.

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
| CAPACITY MAP | 2 | Pass |
| Check which service jobs can overlap | 6 | Pass — `availability-check` |
| For service businesses with two to ten people who need clear answers before adding work to the calendar. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a separate notebook with a realistic day plan. | 9 | Pass — `demo-isolation` |
| Set up my own notebook | 5 | Pass |
| Your plan stays in this browser. | 6 | Pass — `privacy-local-only` |
| Works offline after the first visit. | 6 | Pass — `offline-reload` |
| Core planning is free. | 4 | Pass — `core-free` |
| Plus costs $29 once. | 4 | Pass — `plus-price` |
| How it works | 3 | Pass |
| Add your capacity. | 3 | Pass |
| Record people, services, equipment, and limits. | 6 | **F-2-2: unlisted capacity-setup claim** |
| Choose a time. | 3 | Pass |
| See which jobs fit before changing your calendar. | 8 | Pass — `availability-check` |
| Read the reason. | 3 | Pass |
| Each blocked slot names the person, item, or rule. | 9 | Pass — `conflict-explanation` |
| Your browser holds the plan | 5 | Pass |
| Capacity Map does not connect to calendars, take bookings, or track employees. | 12 | Pass — `no-calendar-booking-payment` |
| You choose when to import or export a CSV file. | 10 | Pass — `csv-roundtrip` |
| Review two weeks with Plus | 5 | Pass |
| Capacity Map Plus lists conflicts across fourteen days. | 8 | Pass — `two-week-review` |
| It costs $29 as a one-time purchase. | 7 | Pass — `plus-price` |
| See Plus details | 3 | Pass |
| Local-first planning notebook. | 3 | **F-2-4: jargon** |
| Original generated illustration. | 3 | **F-2-5: decorative/unlisted assertion** |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v0a2618594d7c | 1 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Capacity Map | 2 | Pass |
| Capacity Map checks which service jobs can overlap before a booking is made. | 13 | Pass — `availability-check` |
| It is for service businesses with two to ten people that already use a calendar. | 15 | Pass |
| The planner records people, services, shared equipment, and no-overlap rules. | 10 | **F-2-2: unlisted capacity-setup claim** |
| It names the exact constraint behind a blocked time. | 9 | Pass — `conflict-explanation` |
| Planning data stays in the current browser unless the user exports it, and the installed app works offline after its first visit. | 22 | Pass — `privacy-local-only`, `offline-reload` |
| Try the isolated demo | 4 | Pass |
| Open `/demo` or choose **Try it with sample data** on the home page. | 13 | Pass |
| The demo loads two people, three services, two shared resources, and three jobs. | 13 | **F-2-3: unproved quantities** |
| It uses separate browser storage and never reads or writes your real notebook. | 13 | Pass — `demo-isolation` |
| Choose **Reset demo** to restore the sample or **Start for real** to discard it. | 14 | Pass — `demo-isolation` |
| Features | 1 | Pass |
| Check staff, equipment, and service-pair conflicts with a plain explanation. | 10 | Pass — `conflict-explanation` |
| Import and export the full plan as CSV. | 8 | Pass — `csv-roundtrip` |
| Keep core planning and CSV export free. | 7 | Pass — `core-free` |
| Preview the fourteen-day conflict review in demo mode. | 8 | Pass — `two-week-review` |
| Buy Capacity Map Plus for $29 as a one-time purchase through Sociobot. | 12 | Pass — `plus-price` |
| Capacity Map does not make public booking pages, connect to calendars, take payments itself, or collect employee tracking data. | 19 | Pass — `no-calendar-booking-payment` |
| Develop and verify | 3 | Pass |
| Use Node 22 or newer. | 5 | Pass |
| Each public claim and its exact sandbox command is listed in `.factory/claims.json`. | 12 | Pass |
| Browser tests use the `/demo` entry point and do not need an account or license. | 15 | Pass |
| Deploy | 1 | Pass |
| `npm run build` creates the offline web app in `dist/`. | 10 | Pass |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass |
| `staticwebapp.config.json` supplies route rewrites, security headers, immutable asset caching, manifest MIME handling, and the 404 response. | 16 | Pass — deployment documentation |
| The factory owns DNS and infrastructure. | 6 | Pass — deployment documentation |
| Privacy and legal terms | 4 | Pass |
| Read `/privacy` and `/terms` in the running app. | 8 | Pass |
| License verification sends only the pasted token to `api.sociobot.in`, at most once per day. | 14 | Pass — `license-request-data`, `daily-license-check` |
| There are no analytics, third-party fonts, or third-party scripts. | 9 | Pass — `privacy-local-only` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See [LICENSE](LICENSE). | 2 | Pass |

## Demo, claims, sandbox, and privacy

- A fresh home-page click opened `/demo` in one step. At 390 px the first demo
  screen showed the persistent **Demo — sample data, nothing is saved to your
  notebook** banner, **Reset demo**, **Start for real**, the date/start chooser,
  bookable sample services, and seeded jobs (Ava’s new-client call, treatment,
  and Leo’s home visit).
- The fresh demo IndexedDB database contained only
  `capacity-map/notebook/demo:capacity`. The browser request log while entering
  and using the demo contained only the product origin. **Reset demo** restored
  three jobs; **Start for real** removed the demo key. This was also covered by
  the independently run claim test.
- After an online visit and service-worker readiness, a live `/demo` reload
  while Playwright was offline retained “New client call” and produced no
  application console error. Its request log contained only the product origin.
- Every command named by the 12 entries in `.factory/claims.json` was run
  separately from fresh clone `/tmp/capacity-review-clean-suE8a5`; every one
  passed. The claim commands cover `demo-isolation`, `offline-reload`,
  `csv-roundtrip`, `privacy-local-only`, `conflict-explanation`,
  `two-week-review`, `daily-license-check`, `plus-price`, `core-free`,
  `no-calendar-booking-payment`, `availability-check`, and
  `license-request-data`.
- `npm test` passed 9/9 tests; typecheck, lint, and production build passed.
  The build produced `dist/` with 12.07 kB gzip JavaScript and 3.53 kB gzip CSS.

## Structure, accessibility, routing, and identity

- `/`, `/demo`, `/setup`, `/review`, `/demo/setup`, `/demo/review`, `/privacy`,
  and `/terms` returned 200. An unknown route returned the designed 404 with
  HTTP 404, header, footer, Privacy and Terms links, metadata, canonical,
  favicon, and a return action.
- Every checked application route had one h1, one main landmark, `lang="en"`,
  a route-specific title, description, canonical, Open Graph title, Twitter
  card, favicon, and the shared header/footer. The title pattern is plain and
  route-appropriate, for example **Capacity Map — check service job overlaps**
  and **Privacy — Capacity Map**.
- Browser navigation to `/setup` moved focus to “Set up your capacity rules”
  and updated the polite live region. Back navigation returned focus and the
  announcement to “Check which service jobs can overlap.” Deep links loaded
  their correct state. `robots.txt`, `sitemap.xml`, manifest, CSP, HSTS,
  Referrer-Policy, `nosniff`, and permissions policy were present.
- The crawl found no dead internal links. All internal routes returned 200;
  `https://sociobot.in/` returned 200 and the registered checkout returned its
  expected 303 redirect.
- `/sitemap.xml` omits the two demo subroutes; this is **F-2-1**.
- Axe found zero serious or critical issues on `/`, `/demo`, `/setup`,
  `/review`, `/demo/setup`, `/demo/review`, `/privacy`, `/terms`, and `/404.html`.
  The 390 px page had no horizontal overflow. The warm ruled-paper surface,
  pencil marks, system-serif notebook headings, and original field-note art
  are a distinct product identity rather than a generic SaaS template.

## Earlier finding regression check

All history was read: `review-1.md`, `polish-1.md`, all five verification
reports, and the previous handoff. Each earlier defect was rechecked in the
live site and source; none is reopened below.

| Earlier finding | Live and source confirmation |
| --- | --- |
| F-1-1, incomplete 404 shell | Unknown route is HTTP 404 and includes the shared header/footer, legal links, skip link, one main, and return link in `public/404.html`. |
| F-1-2, legal/404 metadata | Live Privacy, Terms, demo, setup, review, and 404 routes have route-specific titles/descriptions, canonical, social metadata, and favicon. |
| F-1-3, free-core claim | `core-free` exists and passed independently; it creates a free plan and exports CSV without a license or checkout. |
| F-1-4, no calendar/booking/payment claim | `no-calendar-booking-payment` exists and passed independently with request and DOM checks. |
| F-1-5, availability claim | `availability-check` exists and passed independently, including staff/service eligibility and midnight conflict prevention before saving. |
| F-1-6, license payload claim | `license-request-data` exists and passed independently, asserting the precise bodyless Sociobot request. |
| Original verification: missing claims/demo/first read/security/routes/cache/version/mobile/audit/TBT | Claims file and isolated `/demo` are present; cold first read passes; CSP, robots, sitemap, route delivery, 404, responsive tabs, versioned worker contract, current dependencies, and build budget all pass. |
| Verification 2: daily check, destructive CSV import, update notice, incomplete conflict/review tests, contrast, art sidecar | The listed claim tests now assert one daily check, invalid-row preservation, person/resource/pair explanations, and day-13/day-14 bounds; `update.spec.ts` covers a real waiting worker; current palette values meet the stated contrast; design points to `src/assets/capacity-notebook.png.json`. |
| Verification 4: ineligible assignment, midnight overlap, unconfirmed cascading removal, stale proposal, lost sheet focus | `conflictsFor()` rejects ineligible people and compares UTC intervals across dates. Live `/demo` updates the eligible team member on service change and blocks the midnight conflict. Setup removal uses a named confirmation; `planner.spec.ts` covers input retention and dialog focus restoration. |

## Missed leverage

`.factory/brief.json` is absent, so there is no additional researched feature
requirement to test against. For the demonstrated local capacity-planning job,
CSV import/export is already present. Calendar sync would contradict the stated
local-only/no-calendar position. An AI step would not solve an obvious missing
part of this small, explainable capacity check and would add privacy/cost
complexity, so no AI-feature finding is raised.

## What would make this perfect

List the two demo subroutes in the sitemap, add two small isolated claim tests
for capacity setup and exact demo composition, then make the footer say only
what a first-time visitor can use. After those changes, repeat this full cold
review; no product-flow, demo, privacy, accessibility, or visual-system defect
was found in this round.
