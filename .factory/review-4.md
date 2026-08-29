# Adversarial first-read review 4 — Capacity Map

- **Reviewed:** 2026-08-29
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Verdict:** **PASS** — zero findings of any severity.

## Cold first read

Fresh 390 × 844 and 1440 × 900 Chromium contexts answered all three questions
before scrolling, with no application console errors:

| Check | Observed answer |
| --- | --- |
| What does it do? | Check which service jobs can overlap before changing the calendar. |
| For whom? | Service businesses with two to ten people. |
| What first? | **Try it with sample data**; it loads a separate notebook with a realistic day plan. |

Exact visible first-screen copy:

> “Check which service jobs can overlap”
>
> “For service businesses with two to ten people who need clear answers before adding work to the calendar.”
>
> “Try it with sample data” — “Loads a separate notebook with a realistic day plan.”

The three facts are visible at 390 px: “Your plan stays in this browser.”,
“Works offline after the first visit.”, and “Core planning is free. Plus costs
$29 once.” The ruled-paper notebook presentation, original illustration, and
ink-like controls are distinct from a generic SaaS template.

## Copy audit

Counts treat hyphenated terms, paths, and prices as one word. This lists all
visitor-facing landing and README copy, including headings and controls. No
entry exceeds 22 words, is jargon for its audience, uses a banned marketing
word, relies on a mood/metaphor heading, has inconsistent capacity terminology,
or uses a non-result button. Every claim-like item is declared in
`.factory/claims.json`.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to planner; Capacity Map; Demo; Privacy; Saved on this device; Today board; Notebook setup; Two-week review | 3; 2; 1; 1; 4; 2; 2; 2 | Pass |
| Capacity Map | 2 | Pass |
| Check which service jobs can overlap | 6 | `availability-check` |
| For service businesses with two to ten people who need clear answers before adding work to the calendar. | 18 | Pass |
| Try it with sample data | 5 | `demo-isolation` |
| Loads a separate notebook with a realistic day plan. | 9 | `demo-isolation` |
| Set up my own notebook | 5 | Pass |
| Your plan stays in this browser. | 6 | `privacy-local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Core planning is free. | 4 | `core-free` |
| Plus costs $29 once. | 4 | `plus-price` |
| How it works; Add your capacity. | 3; 3 | Pass; `capacity-setup` |
| Record team members, services, shared resources, and service-pair rules. | 8 | `capacity-setup` |
| Choose a time. | 3 | Pass |
| See which jobs fit before changing your calendar. | 8 | `availability-check` |
| Read the reason. | 3 | Pass |
| Each blocked slot names the team member, shared resource, or service-pair rule. | 12 | `conflict-explanation` |
| Your browser holds the plan | 5 | Pass |
| Capacity Map does not connect to calendars, take bookings, or track employees. | 12 | `no-calendar-booking-payment` |
| You choose when to import or export a CSV file. | 10 | `csv-roundtrip` |
| Review two weeks with Plus | 5 | Pass |
| Capacity Map Plus lists conflicts across fourteen days. | 8 | `two-week-review` |
| It costs $29 as a one-time purchase. | 7 | `plus-price` |
| See Plus details | 3 | Pass |
| Plans stay in this browser. | 5 | `privacy-local-only` |
| Notebook art was generated for Capacity Map. | 7 | `generated-art-disclosure` |
| Terms; Built by Param Factory; Build version | 1; 4; 1 | Pass |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Capacity Map | 2 | Pass |
| Capacity Map checks which service jobs can overlap before a booking is made. | 13 | `availability-check` |
| It is for service businesses with two to ten people that already use a calendar. | 15 | Pass |
| The planner records team members, services, shared resources, and service-pair rules. | 10 | `capacity-setup` |
| It names the exact constraint behind a blocked time. | 9 | `conflict-explanation` |
| Planning data stays in the current browser unless the user exports it, and the installed app works offline after its first visit. | 22 | `privacy-local-only`, `offline-reload` |
| Try the isolated demo | 4 | Pass |
| Open `/demo` or choose **Try it with sample data** on the home page. | 13 | Pass |
| The demo loads two team members, three services, two shared resources, and three jobs. | 14 | `demo-isolation` |
| It uses separate browser storage and never reads or writes your real notebook. | 13 | `demo-isolation` |
| Choose **Reset demo** to restore the sample or **Start for real** to discard it. | 14 | `demo-isolation` |
| Features | 1 | Pass |
| Check team-member, shared-resource, and service-pair conflicts with a plain explanation. | 9 | `conflict-explanation` |
| Import and export the full plan as CSV. | 8 | `csv-roundtrip` |
| Keep core planning and CSV export free. | 7 | `core-free` |
| Preview the fourteen-day conflict review in demo mode. | 8 | `two-week-review` |
| Buy Capacity Map Plus for $29 as a one-time purchase through Sociobot. | 12 | `plus-price` |
| Capacity Map does not make public booking pages, connect to calendars, take payments itself, or collect employee tracking data. | 19 | `no-calendar-booking-payment` |
| Develop and verify; Use Node 22 or newer. | 3; 5 | Pass |
| Each public claim and its exact sandbox command is listed in `.factory/claims.json`. | 12 | Pass |
| Browser tests use the `/demo` entry point and do not need an account or license. | 15 | Pass |
| Deploy | 1 | Pass |
| `npm run build` creates the offline web app in `dist/`. | 10 | Pass |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass |
| `staticwebapp.config.json` supplies route rewrites, security headers, immutable asset caching, manifest MIME handling, and the 404 response. | 16 | Pass |
| The factory owns DNS and infrastructure. | 6 | Pass |
| Privacy and legal terms | 4 | Pass |
| Read `/privacy` and `/terms` in the running app. | 8 | Pass |
| License verification sends only the pasted token to `api.sociobot.in`, at most once per day. | 14 | `license-request-data`, `daily-license-check` |
| There are no analytics, third-party fonts, or third-party scripts. | 9 | `privacy-local-only` |
| License; MIT.; See [LICENSE](LICENSE). | 1; 1; 2 | Pass |

The terminology table is: planning record = notebook; employee/owner = team
member; equipment = shared resource; scheduled work = job; constraint between
two services = service-pair rule; sample workspace = demo. The maintained
duplicate audit is `.factory/copy-audit.md`.

## Demo, privacy, and claims

The home action entered `/demo` in one click. Its first screen was already a
working board with Ava, Leo, three services, two shared resources, three jobs,
and named conflicts. The persistent banner read “Demo — sample data, nothing
is saved to your notebook” and exposed **Reset demo** and **Start for real**.

In a fresh live context, a demo job and setup visit made only product-origin
requests. IndexedDB held only `demo:capacity`; **Start for real** removed it.
The exact `demo-isolation` test additionally proves reset, the `?demo=1`
alias, and separation from real storage. The fresh-context offline test passed.

All 14 exact commands declared in `.factory/claims.json` passed individually
from a fresh clone. The complete 14-test claim suite also passed against live:
`demo-isolation`, `capacity-setup`, `offline-reload`, `csv-roundtrip`,
`privacy-local-only`, `conflict-explanation`, `two-week-review`,
`daily-license-check`, `plus-price`, `core-free`,
`no-calendar-booking-payment`, `availability-check`,
`license-request-data`, and `generated-art-disclosure`.

No unlisted landing or README claim was found. CSV import/export is present.
The brief does not imply an AI need: deterministic, explainable capacity rules
are the job, so an AI layer would be decorative. No provider key is embedded.

## Earlier finding regression check

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. All prior
findings were checked against live behavior and source/tests:

| Finding | Current confirmation |
| --- | --- |
| F-1-1 | Unknown routes return the designed HTTP 404 with shared header/footer, legal links, skip link, main, and return action. |
| F-1-2 | Legal, app, demo, and 404 routes have route-specific title/description/canonical/social metadata and icons. |
| F-1-3 | `core-free` proves normal planning and CSV export without license or checkout. |
| F-1-4 | `no-calendar-booking-payment` proves the claimed absences and external Sociobot checkout. |
| F-1-5 | `availability-check` proves a clear job saves and a conflict is rejected before save. |
| F-1-6 | `license-request-data` proves the bodyless request sends only the pasted token. |
| F-2-1 | Live sitemap lists `/demo/setup` and `/demo/review`; both return 200. |
| F-2-2 | `capacity-setup` creates, reloads, and uses all advertised record types. |
| F-2-3 | `demo-isolation` verifies the precise advertised sample before and after reset. |
| F-2-4 | Footer now uses “Plans stay in this browser.” |
| F-2-5 | The rejected illustration slogan remains absent; the useful disclosed provenance is tested. |
| F-3-1 | Public capacity terms are consistently team member, shared resource, and service-pair rule. |
| F-3-2 | Privacy request logging covers no third-party fonts or scripts. |

## Structure and verification

`/`, `/setup`, `/review`, `/demo`, `/demo/setup`, `/demo/review`, `/privacy`,
`/terms`, and `/404.html` each have one h1/main, appropriate titles and
metadata. The live UI suite passed 43/43 including history/back focus,
keyboard, 390 px layout, reduced motion, Axe, routes, and offline behavior.
Internal links returned 200, `https://sociobot.in` returned 200, and unknown
routes returned HTTP 404. `robots.txt` and `sitemap.xml` are present.

This checkout passed `npm test` (15/15), typecheck, lint, and build. Output is
12.59 kB gzip JavaScript and 3.58 kB gzip CSS.

## What would make this perfect

No change is indicated. Repeat this cold live, demo-isolation, claims, and
routing review after the next deployment.
