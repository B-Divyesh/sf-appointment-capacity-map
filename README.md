# Capacity Map

Capacity Map is a local-first, offline-capable planning notebook for two-to-ten
person service teams. It answers a practical question before a booking is made:
**can this job overlap, and why?**

It is for businesses that already have a calendar but need a simple, explainable
way to model people, job types, shared equipment, and no-overlap rules. It does
not make public booking pages, connect to calendars, take payments, or collect
employee surveillance data.

## What it does

- Records staff parallel capacity, services, and shared resources such as chairs
  or vans.
- Checks a proposed job against overlapping staff, equipment, and service-pair
  rules, explaining the exact reason when it cannot fit.
- Keeps planning records in the browser’s IndexedDB, so the core app works
  offline after the first load.
- Imports and exports a portable CSV file; export is never gated.
- Includes an optional $29 one-time Capacity Map Plus unlock for a two-week
  conflict review. The hosted checkout and license verification use Sociobot.

## Develop

Requirements: Node 22+.

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm test              # rule-engine unit tests
npx playwright test   # browser, offline, and Axe accessibility checks
npm run build          # produces ./dist with index.html at its root
npm run preview
```

`dist/` is the static deployment directory. The generated service worker
precaches the built app shell and provides an offline fallback on a first visit.

## Privacy and data

All planning data stays in the current browser unless you choose to export a
CSV. See `/privacy` and `/terms` in the running app. The visual direction and
original-asset provenance are recorded in `.factory/design.md`.

## License

MIT. See [LICENSE](LICENSE).
