# Capacity Map

Capacity Map checks which service jobs can overlap before a booking is made.
It is for service businesses with two to ten people that already use a calendar.

The planner records people, services, shared equipment, and no-overlap rules. It
names the exact constraint behind a blocked time. Planning data stays in the
current browser unless the user exports it, and the installed app works offline
after its first visit.

## Try the isolated demo

Open `/demo` or choose **Try it with sample data** on the home page. The demo
loads two people, three services, two shared resources, and three jobs. It uses
separate browser storage and never reads or writes your real notebook.
Choose **Reset demo** to restore the sample or **Start for real** to discard it.

## Features

- Check staff, equipment, and service-pair conflicts with a plain explanation.
- Import and export the full plan as CSV.
- Keep core planning and CSV export free.
- Preview the fourteen-day conflict review in demo mode.
- Buy Capacity Map Plus for $29 as a one-time purchase through Sociobot.

Capacity Map does not make public booking pages, connect to calendars, take
payments itself, or collect employee tracking data.

## Develop and verify

Use Node 22 or newer.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run test:claims
npm run test:ui
npm run build
```

Each public claim and its exact sandbox command is listed in
`.factory/claims.json`. Browser tests use the `/demo` entry point and do not
need an account or license.

## Deploy

`npm run build` creates the offline web app in `dist/`. Deploy that directory to
Azure Static Web Apps. `staticwebapp.config.json` supplies route rewrites,
security headers, immutable asset caching, manifest MIME handling, and the 404
response. The factory owns DNS and infrastructure.

## Privacy and legal terms

Read `/privacy` and `/terms` in the running app. License verification sends only
the pasted token to `api.sociobot.in`, at most once per day. There are no
analytics, third-party fonts, or third-party scripts.

## License

MIT. See [LICENSE](LICENSE).
