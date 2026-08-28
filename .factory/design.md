# Capacity Map design thesis

## Direction — handwritten lab notebook

Capacity rules are usually trapped in someone’s head or a tangle of calendars.
Capacity Map should feel like the crew’s dependable field notebook: margin notes
make the reasoning visible, ruled paper holds the time grid, and a handful of
ink colours distinguish people, services, and resources. This is deliberately
not a calendar-app dashboard: the primary artifact is a small, legible
experiment in whether a proposed job fits.

## Palette and type

The product is a deliberately single-mode warm paper surface, which avoids a
second, less authentic dark treatment. The app explicitly paints its background
in every context.

| Token | Value | Use |
| --- | --- | --- |
| paper | `#f7f0df` | canvas and installed splash |
| paper-deep | `#eadfc9` | ruled areas and callouts |
| ink | `#203634` | primary writing and headings |
| graphite | `#52635f` | supporting notes |
| red-pencil | `#b94e45` | conflicts and destructive actions |
| blue-ink | `#176b8a` | primary action and staff marks |
| ochre | `#a75a18` | resources and warning marks |
| moss | `#377353` | allowed/clear states |

Typography uses the self-hosted-friendly system serif stack (`Georgia`, then
serif) for notebook titles and a highly legible system sans stack for controls
and schedules. This keeps the PWA small and works offline without a font
request. The 4 px rhythm is expressed as 8 / 12 / 16 / 24 / 32 / 48 px spaces;
body copy is 16 px or larger and schedule figures use tabular numerals.

## Interaction and motion

Controls look like inked labels and paper tabs, but retain conventional buttons,
labels, and focus rings. The day board is the working surface: staff rows and
time columns explain availability; selecting a booking opens the evidence for
its decision. Rule chips spell out *why*, so colour is never the only signal.
Add/edit forms use a focused sheet rather than hiding the central schedule.

New rows and notices fade/settle over 180 ms; no ambient or looping animation.
For `prefers-reduced-motion`, transitions are removed entirely. Visible blue
focus rings and underlines make keyboard travel feel like a pencil marking the
next line.

## Original art plan and provenance

The only raster scene is a small “capacity field note” illustration, used in the
empty state and as a decorative, labelled companion to the overview. It shows
no people or brand and does not claim functionality. Prompt sheet:

- **Subject/world:** an overhead service-planning notebook with a hand-drawn
  grid, coloured tokens for a chair, treatment table, and work van.
- **Materials/light:** recycled cream paper, graphite, teal and rust pencils,
  warm window light; editorial cut-paper/ink illustration.
- **Lens/composition:** top-down, generous empty paper areas, simple bold forms.
- **Negative list:** no readable text, no logos, no watermark, no people,
  no trademarks, no photoreal calendar UI.

Generated with the factory image deployment on 2026-08-28. The selected source
and exact prompt are kept as `src/assets/capacity-notebook.prompt.json`; its
optimised WebP is product-original and disclosed in the footer.
