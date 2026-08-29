# Landing and README copy audit

Audited 2026-08-29. Counts treat hyphenated terms, paths, prices, and version
strings as one word. No sentence exceeds 22 words or uses a banned marketing
word.

## Landing page

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
| Record people, services, equipment, and limits. | 6 | Pass — `capacity-setup` |
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
| Plans stay in this browser. | 5 | Pass — `privacy-local-only` |
| Notebook art was generated for Capacity Map. | 7 | Pass — `generated-art-disclosure` |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| Build version | 1 | Pass |

## README

| Copy | Words | Result |
| --- | ---: | --- |
| Capacity Map | 2 | Pass |
| Capacity Map checks which service jobs can overlap before a booking is made. | 13 | Pass — `availability-check` |
| It is for service businesses with two to ten people that already use a calendar. | 15 | Pass |
| The planner records people, services, shared equipment, and no-overlap rules. | 10 | Pass — `capacity-setup` |
| It names the exact constraint behind a blocked time. | 9 | Pass — `conflict-explanation` |
| Planning data stays in the current browser unless the user exports it, and the installed app works offline after its first visit. | 22 | Pass — `privacy-local-only`, `offline-reload` |
| Try the isolated demo | 4 | Pass |
| Open `/demo` or choose **Try it with sample data** on the home page. | 13 | Pass |
| The demo loads two people, three services, two shared resources, and three jobs. | 13 | Pass — `demo-isolation` |
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
| `staticwebapp.config.json` supplies route rewrites, security headers, immutable asset caching, manifest MIME handling, and the 404 response. | 16 | Pass |
| The factory owns DNS and infrastructure. | 6 | Pass |
| Privacy and legal terms | 4 | Pass |
| Read `/privacy` and `/terms` in the running app. | 8 | Pass |
| License verification sends only the pasted token to `api.sociobot.in`, at most once per day. | 14 | Pass — `license-request-data`, `daily-license-check` |
| There are no analytics, third-party fonts, or third-party scripts. | 9 | Pass — `privacy-local-only` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See [LICENSE](LICENSE). | 2 | Pass |

The first screen states the job, audience, first action, its result, and three
facts within one 390 × 844 viewport.

## Terminology

| Concept | Term used |
| --- | --- |
| User-owned planning record | notebook |
| Work offered by the business | service |
| Employee or owner who performs work | team member |
| Equipment used across jobs | shared resource |
| Scheduled unit of work | job |
| Constraint between two service types | service-pair rule |
| Isolated sample workspace | demo |
| Portable user-owned file | CSV |
