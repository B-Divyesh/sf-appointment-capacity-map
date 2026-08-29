# Adversarial first-read review 1 — Capacity Map

- **Reviewed:** 2026-08-29
- **Live URL:** `https://appointment-capacity-map.sociobot.in/`
- **Verdict:** **FAIL** — six findings remain. None invalidates the working
  planner or demo, but PASS requires zero findings.

## First 30 seconds

Fresh, logged-out 390 × 844 and 1440 × 900 contexts both answered the three
first-read questions before scroll:

| Question | Observed answer |
| --- | --- |
| What does it do? | It checks whether service jobs can overlap. |
| For whom? | Service businesses with two to ten people. |
| What should I click first? | **Try it with sample data**; it says it will load a separate notebook with a realistic day plan. |

The exact first-screen copy was:

> “Check which service jobs can overlap”
>
> “For service businesses with two to ten people who need clear answers before adding work to the calendar.”
>
> “Try it with sample data” — “Loads a separate notebook with a realistic day plan.”

The three privacy/offline/price facts were visible in the 390 px viewport (the
last ends at y=642 of 844). No blocking first-read finding.

## Findings

### F-1-1 — Medium — The designed 404 omits the site header and footer

**Location:** live `/not-a-real-route` (HTTP 404); `public/404.html`.

**Evidence:** the route renders only:

> “Capacity Map” / “This page is not in the notebook” / “Return to the planner”

It has no shared wordmark/header, no Demo or Privacy navigation, and no footer
with Privacy and Terms. A lost visitor cannot reach the legal pages that every
other route exposes. This does not meet the required consistent header/footer
on every route.

**Fix:** give `404.html` the same branded header, skip link, main, and footer
as app routes, including working Privacy and Terms links. Keep the existing
helpful h1 and return link.

### F-1-2 — Minor — Legal and 404 routes do not have route-appropriate metadata

**Location:** live `/privacy`, `/terms`, and `/not-a-real-route`; `src/main.ts`
`setMetadata()` and `public/404.html`.

**Evidence:** both legal pages retain the landing description and OG
description:

> “Check which service jobs can overlap before adding work to a small team's calendar.”

The 404 page has no description, canonical, Open Graph/Twitter metadata, or
favicon declaration. Titles and legal-route canonicals are correct, but this
does not complete the required per-route metadata.

**Fix:** set a plain route-specific description and matching OG/Twitter
description for Privacy and Terms during navigation. Add description,
canonical, social metadata, and the existing favicon links to the static 404
document.

### F-1-3 — Minor — “Core planning is free” is an unlisted claim

**Location:** landing fact, “Core planning is free.”; README Features,
“Keep core planning and CSV export free.”

`.factory/claims.json` has a test for the $29 Plus price, but none for the
separate claim that core planning and CSV export are free. A visitor could rely
on that pricing statement.

**Fix:** add a `core-free` claim and tagged browser test from a fresh normal
context that exercises core planning and CSV export without a license or
checkout, or remove the free-price statements.

### F-1-4 — Minor — Calendar, public-booking, and direct-payment absence claims are unlisted

**Location:** landing, “Capacity Map does not connect to calendars, take
bookings, or track employees.”; README, “Capacity Map does not make public
booking pages, connect to calendars, take payments itself, or collect employee
tracking data.”

The privacy claim covers employee tracking and same-origin demo requests, but
there is no claims entry for the distinct promises that the product has no
calendar connection, public-booking page, or direct payment collection.

**Fix:** either make one explicit `no-calendar-booking-payment` claim with a
browser/request-log test that demonstrates the planner flow has no such
integration and checkout is an external Sociobot link, or reduce the copy to
the already-tested local-data/analytics statement.

### F-1-5 — Minor — The main availability-check promise is not in the claims contract

**Location:** landing h1, “Check which service jobs can overlap”; README
opening, “Capacity Map checks which service jobs can overlap before a booking
is made.”

The `conflict-explanation` claim verifies the reason shown for selected
blocked overlaps. It is not an entry for the broader advertised promise that
the product determines whether jobs can overlap before booking.

**Fix:** add an `availability-check` claim and tagged test that starts from
`/demo`, proves one clear proposed job can be added and one staff/resource/rule
conflict is prevented before saving. The existing UI coverage can be split or
retagged to supply this proof.

### F-1-6 — Minor — The README’s “only the pasted token” privacy promise is unlisted

**Location:** README Privacy and legal terms: “License verification sends only
the pasted token to `api.sociobot.in`, at most once per day.”

`daily-license-check` proves the once-per-day part. It does not list or test
the separate data-minimisation promise that only the pasted token is sent.

**Fix:** add a `license-request-data` claim whose intercepted request asserts
the exact Sociobot origin, no request body, and no identifiers/data beyond the
user-provided license token; or change the README to the tested daily-check
statement only.

## Copy audit

Counts treat hyphenated terms, paths, and prices as one word. Buttons,
headings, labels, and footer text are included because they are read aloud and
form the first-use copy. Code commands are excluded as they are not sentences.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Skip to planner | 3 | Pass |
| Capacity Map | 2 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Saved on this device | 4 | Pass |
| Today board | 2 | Pass |
| Notebook setup | 2 | Pass |
| Two-week review | 2 | Pass |
| Check which service jobs can overlap | 6 | Pass |
| For service businesses with two to ten people who need clear answers before adding work to the calendar. | 18 | Pass |
| Try it with sample data | 6 | Pass |
| Loads a separate notebook with a realistic day plan. | 9 | Pass |
| Set up my own notebook | 6 | Pass |
| Your plan stays in this browser. | 6 | Pass; mapped to `privacy-local-only`. |
| Works offline after the first visit. | 6 | Pass; mapped to `offline-reload`. |
| Core planning is free. | 4 | **F-1-3: unlisted claim.** |
| Plus costs $29 once. | 4 | Pass; mapped to `plus-price`. |
| How it works | 3 | Pass |
| Add your capacity. | 3 | Pass |
| Record people, services, equipment, and limits. | 6 | Pass |
| Choose a time. | 3 | Pass |
| See which jobs fit before changing your calendar. | 8 | **F-1-5: unlisted availability claim.** |
| Read the reason. | 3 | Pass |
| Each blocked slot names the person, item, or rule. | 9 | Pass; mapped to `conflict-explanation`. |
| Your browser holds the plan | 5 | Pass |
| Capacity Map does not connect to calendars, take bookings, or track employees. | 12 | **F-1-4: partly unlisted claim.** |
| You choose when to import or export a CSV file. | 10 | Pass; mapped to `csv-roundtrip`. |
| Review two weeks with Plus | 5 | Pass |
| Capacity Map Plus lists conflicts across fourteen days. | 8 | Pass; mapped to `two-week-review`. |
| It costs $29 as a one-time purchase. | 7 | Pass; mapped to `plus-price`. |
| See Plus details | 3 | Pass |
| Local-first planning notebook. | 3 | Pass; mapped to `privacy-local-only`. |
| Original generated illustration. | 3 | Pass; provenance is recorded in the design thesis. |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |

No landing sentence exceeds 22 words, uses a banned marketing adjective, or
uses a mood/metaphor heading. All visible buttons name their outcome.

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Capacity Map | 2 | Pass |
| Capacity Map checks which service jobs can overlap before a booking is made. | 13 | **F-1-5: unlisted availability claim.** |
| It is for service businesses with two to ten people that already use a calendar. | 15 | Pass |
| The planner records people, services, shared equipment, and no-overlap rules. | 10 | Pass |
| It names the exact constraint behind a blocked time. | 9 | Pass; mapped to `conflict-explanation`. |
| Planning data stays in the current browser unless the user exports it, and the installed app works offline after its first visit. | 22 | Pass at the cap; mapped to `privacy-local-only` and `offline-reload`. |
| Try the isolated demo | 4 | Pass |
| Open `/demo` or choose **Try it with sample data** on the home page. | 13 | Pass |
| The demo loads two people, three services, two shared resources, and three jobs. | 13 | Pass; mapped to `demo-isolation`. |
| It uses the `demo:capacity` IndexedDB key and never reads or writes the real notebook. | 14 | **Jargon:** `IndexedDB` and the implementation key are not needed here. Rewrite: “It uses separate browser storage and never reads or writes your real notebook.” |
| Choose **Reset demo** to restore the sample or **Start for real** to discard it. | 13 | Pass |
| Features | 1 | Pass |
| Check staff, equipment, and service-pair conflicts with a plain explanation. | 10 | Pass; mapped to `conflict-explanation`. |
| Import and export the full plan as CSV. | 8 | Pass; mapped to `csv-roundtrip`. |
| Keep core planning and CSV export free. | 7 | **F-1-3: unlisted claim.** |
| Preview the fourteen-day conflict review in demo mode. | 8 | Pass; mapped to `two-week-review`. |
| Buy Capacity Map Plus for $29 as a one-time purchase through Sociobot. | 12 | Pass; mapped to `plus-price`. |
| Capacity Map does not make public booking pages, connect to calendars, take payments itself, or collect employee tracking data. | 18 | **F-1-4: partly unlisted claim.** |
| Develop and verify | 3 | Pass |
| Use Node 22 or newer. | 5 | Pass |
| Each public claim and its exact sandbox command is listed in `.factory/claims.json`. | 13 | Pass |
| Browser tests use the `/demo` entry point and do not need an account or license. | 15 | Pass |
| Deploy | 1 | Pass |
| `npm run build` produces the static PWA in `dist/`. | 8 | **Jargon:** “static PWA” is unexplained. Rewrite: “`npm run build` creates the offline web app in `dist/`.” |
| Deploy that directory to Azure Static Web Apps. | 7 | Pass for deployment documentation |
| `staticwebapp.config.json` supplies route rewrites, security headers, immutable asset caching, manifest MIME handling, and the 404 response. | 12 | Pass for deployment documentation |
| The factory owns DNS and infrastructure. | 6 | Pass |
| Privacy and legal terms | 4 | Pass |
| Read `/privacy` and `/terms` in the running app. | 7 | Pass |
| License verification sends only the pasted token to `api.sociobot.in`, at most once per day. | 11 | **F-1-6: partly unlisted claim.** |
| There are no analytics, third-party fonts, or third-party scripts. | 9 | Pass; request log is covered by `privacy-local-only`. |
| License | 1 | Pass |
| MIT. See [LICENSE](LICENSE). | 3 | Pass |

The two jargon rewrites are copy-audit flags, not separate numbered defects.
There are no over-22-word sentences, marketing-adjective flags, meaningless
headings, or non-result-naming buttons.

## Demo, sandbox, privacy, and claims

- One click from a fresh home page opened `/demo` with Ava, Leo, Consultation,
  Treatment, Mobile visit, shared resources, three sample jobs, and visible
  conflicts. The first demo screen was the working product, not an explanation.
- The persistent banner reads “Demo — sample data, nothing is saved to your
  notebook” and exposes **Reset demo** and **Start for real**. Reset restored
  the sample; Start for real returned to `/` after deleting the demo key.
- IndexedDB contained only `demo:capacity` in the fresh demo. After leaving it,
  no demo key remained. The live demo request log contained only
  `https://appointment-capacity-map.sociobot.in`.
- After an online controlled visit, a live `/demo` reload while offline retained
  the sample and rendered without console errors.
- Each declared claim test was run independently after `npm ci`; all passed:

| Claim | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `offline-reload` | Pass |
| `csv-roundtrip` | Pass |
| `privacy-local-only` | Pass |
| `conflict-explanation` | Pass |
| `two-week-review` | Pass |
| `daily-license-check` | Pass |
| `plus-price` | Pass |

The findings F-1-3 through F-1-6 are unlisted live/README claims, not failures
of those eight declared tests.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. The unknown route
  returned a real 404. Titles, one h1, main landmark, language, favicon,
  canonical, focus-on-route-change, back-button restoration, robots, sitemap,
  security headers, and the distinct notebook visual system were confirmed.
- The header/footer are consistent on app routes. F-1-1 records the exception
  for the 404 route. F-1-2 records route metadata omissions.
- At 390 px there was no horizontal overflow (`scrollWidth === clientWidth ===
  390`), all three first-screen facts were visible, and no console errors were
  observed. The complete local Playwright suite passed 22/22.
- Crawled product links returned 200: home, demo, privacy, terms, robots,
  sitemap, manifest, icon, social image, and Sociobot attribution. The checkout
  link returned its expected 303 to Dodo checkout.
- No AI feature is needed for the stated local capacity-planning job. CSV
  import/export already provides the obvious portability feature; sync would
  conflict with the explicit local-first privacy position.

## Earlier-review regression check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I read
`.factory/verification.md`, `.factory/verification-2.md`,
`.factory/verification-3.md`, and the prior handoff. Their numbered defects
were rechecked on live and source and are fixed: claims file/tests, one-click
isolated demo, first-screen copy, CSP/cache/manifest/routing/404 delivery,
versioned service-worker flow, 390 px tab overflow, daily license throttling,
validated unknown CSV rejection, service-worker update notice, complete
conflict and 14-day claim coverage, and red/ochre contrast tokens. No legacy
finding is re-opened.

## What would make this perfect

Make the 404 a full member of the site, give every route accurate metadata,
and either prove or remove the four unlisted promise groups. Then simplify the
two README implementation terms. Re-run this whole review from a fresh context;
with no findings, the result can be PASS.
