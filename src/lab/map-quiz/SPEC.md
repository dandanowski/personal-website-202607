# Map Quiz — Design Specification

Status: living document · Component version at time of writing: **1.6.0**

This document describes what the `<map-quiz>` component is, how it behaves, and the
decisions behind it. It is the reference for anyone extending the component, adding a
quiz, or theming it into a site. `README.md` is the usage guide; this is the design
rationale and contract.

## 1. Purpose and goals

`<map-quiz>` is a self-contained, framework-agnostic Web Component that quizzes a player
on the regions of a map — countries, states, counties, or any set of same-type areas. It
ships with three quizzes (Counties of Ireland, United States, Countries of Europe) and is
built so that adding another is a matter of dropping in one JSON data file.

The design is governed by five goals, in priority order:

1. **Drop-in reuse.** One script tag, one custom element, no build step and no
   dependencies. It must work from a plain HTML page opened off disk as readily as inside
   a bundler-driven app.
2. **Data-driven, not hard-coded.** Nothing in the component knows about Ireland, the US,
   or Europe. A quiz is entirely described by its data file; the same code renders any
   region set.
3. **Embeddable without hostility.** Dropped into a long page, it must never trap the
   scroll wheel, never overflow the viewport, and never leak styles in or out.
4. **Themeable to a host design system** without forking the code, via CSS custom
   properties and `::part()`.
5. **Accessible and legible** at any map size and zoom level.

Non-goals: it is not a general GIS/mapping library, not a routing or choropleth tool, and
does not fetch or generate geometry at runtime (geometry is pre-projected offline).

## 2. Architecture

The component is a single `MapQuiz extends HTMLElement` class registered as `map-quiz`,
delivered as one plain (non-module) `.js` file wrapped in an IIFE with a
`customElements.get('map-quiz')` guard so double-inclusion is safe. It attaches an **open
Shadow DOM** root and injects one `<style>` block plus a render target.

State lives on the instance: `_manifest` (when pointed at a multi-quiz manifest), `_data`
(the active quiz), `_state` (a run in progress), `_zoom` (pan/zoom transform), and the
per-render lookup maps `_paths`, `_labels`, `_dots`. Rendering is screen-oriented: each
screen (`_renderQuizSelect`, `_renderStart`, `_renderPlay`, `_renderLearn`, `_finish`)
rewrites the shadow root's `innerHTML` and re-binds handlers. The current screen is
published on the wrapper as `data-screen` (`picker | modes | play | learn | done`), which
CSS uses for viewport-fit rules.

Geometry is authored offline (see §9) into `viewBox`-space SVG path strings, so at runtime
the component only ever draws pre-projected paths — no projection math on the client.

## 3. Data model

A quiz is one JSON object. The component validates only that `regions` is an array
(`_normalise`); everything else is optional with sensible fallbacks, and the whole object
is stored verbatim as `_data`, so new top-level fields pass through without code changes.

Top-level fields:

- `id` — string identifier for the quiz.
- `title` — display name (overridable per-embed by the `heading` attribute).
- `prompt` — singular noun for a region ("state", "county", "country"). Pluralised
  automatically for list headings.
- `viewBox` — the SVG viewBox all region paths are projected into (e.g. `"0 0 1000 820"`).
- `regions` — the array of regions (below).
- `learnUnit` (optional) — collective noun for the Learn-mode count when the set is mixed
  (US uses `"region"` → "56 regions" while the quiz says "50 states").
- `legend` (optional) — `{ quizzed, context }` wording for the Learn legend. `quizzed`
  defaults to the capitalised `prompt`; `context` labels the shown-but-not-quizzed swatch.
- `categoryLabels` (optional) — maps a `category` value to header wording. Built-in
  defaults cover `district`, `territory`, `microstate`; unknown categories fall back to
  the raw value.
- `about` (optional) — provenance text for the "About the data" affordance (§5a): a string
  or array of strings rendered as paragraphs.
- `sources` (optional) — a list of `{ label, url }` links shown under the `about` text.

Region fields:

- `id` — unique string, used as the DOM/data key.
- `name` — full display name, used for prompts, answers, and the focus header.
- `path` — SVG path `d` string already projected into `viewBox` space.
- `labelX`, `labelY` — the label anchor in `viewBox` units (typically the centroid of the
  region's largest polygon so labels don't land in the sea).
- `short` (optional) — a compact on-map label (e.g. `"RI"`) shown in Learn mode when the
  full name won't fit; `name` is still used everywhere else.
- `category` (optional) — marks a region as context-only. Any value other than `"state"`
  (`"district"`, `"territory"`, `"microstate"`, …), or an explicit `"quiz": false`, means
  the region is shown and labelled in **Learn** mode but excluded from the two quiz modes.
- `quiz: false` (optional) — explicit exclusion from the quiz, independent of `category`.

The quiz set is defined by `_quizRegions()`:
`regions.filter(r => r.quiz !== false && (r.category || 'state') === 'state')`. This is the
single source of truth for "what gets tested" and is deliberately liberal: a region with
no `category` defaults to `'state'` and is quizzed, regardless of the quiz's `prompt` noun.

### Manifest

To offer several quizzes from one element, `src` may point at a manifest — an object with a
`quizzes` array (distinguished from a single quiz, which has `regions`). Each entry has a
`title`, optional `subtitle`/`icon`, and one data source (`src` URL or `#inline-id`, an
inline `data` object, or inline `regions`). The component then renders its own landing page.

## 4. Screen flow

```
manifest → [Quiz picker] → [Mode picker] → [ Learn | Find | Name ] → [Results]
single quiz →              [Mode picker] → …
```

Pointing `src` at a manifest shows the quiz picker first; pointing it at a single quiz
skips straight to the mode picker. A "← All quizzes" link returns from the mode picker to
the manifest picker; "Change mode" / "← Back to menu" return from a run to the mode picker.
The `mode` attribute (`find | name | learn`) can skip the mode picker entirely.

## 5. Play modes

Three modes, chosen by the player at the start of each quiz:

- **Learn the map.** Every region is labelled. Hovering, focusing, or tapping a region
  focuses it (its full name — plus any category note like "Monaco · microstate" — shows in
  the header); tapping pins the focus. Context regions (`category`) are tinted differently
  and explained in a legend. This is a study mode with no scoring.
- **Find it on the map.** The prompt names a region; the player clicks it on the map.
- **Name the region.** A region is highlighted; the player picks its name from a scrollable
  list of the regions not yet solved (the list shrinks as they are answered).

Both quiz modes track first-try accuracy, total misses, and elapsed time, and end on a
results screen that emits a `quizcomplete` event (§8).

### Feedback rules

- A correct answer marks the region solved (fills `--mq-solved`), reveals its label, and
  advances. A first-try correct answer increments the accuracy numerator.
- A wrong answer flashes the offending region/pill `--mq-wrong` for ~550 ms and posts a
  message; the target stays active so the player can retry.
- The feedback line ("Not quite — that's X." / "Try again." / reveal text) sits **above the
  map**, in the controls area, in both quiz modes — so it reads where the player is already
  looking rather than below a tall map.
- Solved and wrong states must win over the hover state. The hover fill is scoped
  `:not(.wrong):not(.solved)` so a just-clicked region shows its result colour immediately,
  even while the cursor is still over it.

### 5a. Provenance ("About the data")

Because the maps are simplified and some borders are disputed, each map screen (Find, Name,
Learn) shows an unobtrusive **"About the data"** button in the map's bottom-right corner. It
opens a modal dialog explaining how the map was drawn (source dataset, projection, any
cropping) and noting disputed borders. The content is per-quiz and data-driven via `about`
(paragraphs) and `sources` (labelled links); the button appears only when a quiz supplies
them. The dialog is a native `<dialog>` opened with `showModal()` (top layer, so it is not
clipped by the map card's `overflow: hidden`), and closes on Escape, the ✕ button, or a
backdrop click. This keeps attribution and disclaimers with the map without cluttering it.

## 6. Interaction and layout invariants

These are the "must never regress" behaviours; they exist because each fixed a concrete
failure during development.

- **Scroll is never trapped.** A plain wheel over the map scrolls the page; zoom requires
  ⌘/Ctrl + wheel (a brief hint says so), the on-map +/−/reset buttons, or a two-finger
  pinch. An embedded quiz in a long article must not swallow the wheel.
- **Pointer capture only on drag.** The map captures the pointer only once a drag or pinch
  actually begins — never on a plain press — because capturing on `pointerdown` retargets
  the follow-up `click` to the `<svg>` and breaks region clicks. A small movement threshold
  distinguishes a click from a drag (`_dragMoved`).
- **Labels are constant screen size.** Labels live in an unscaled layer and are re-sized
  each frame to a fixed *pixel* size via `--pxToUser` (map-units-per-pixel), so they neither
  balloon when zooming in nor shrink when the map is drawn narrow. Crisp borders use
  `vector-effect: non-scaling-stroke`.
- **Declutter, don't overlap.** In Learn mode, when two labels would collide the
  smaller-area region's label collapses to a hoverable dot; zooming in spreads the anchors
  and reveals hidden labels automatically. The focused/pinned label always wins.
- **Letterbox-aware scaling.** `--pxToUser` is computed from the binding axis
  (`min(rect.w/W, rect.h/H)`) so labels stay correct when the map is letterboxed to fit.
- **Viewport fit.** On the play/learn screens the component never grows taller than
  `--mq-max-height`; the map scales down (letterboxes) to fit rather than pushing the page
  taller, with `--mq-min-height` as a floor and `--mq-chrome` accounting for the HUD,
  progress bar, and toolbar. Uses `dvh`, not `vh`, so the mobile browser bar doesn't
  reintroduce scroll.
- **Name-mode list matches the map.** When the answer list sits beside the map, it is
  capped by JS to the map's rendered height (card outer height minus the panel heading) so
  the two columns bottom-align; in the stacked single-column layout it falls back to a CSS
  bound and scrolls below the map. Recomputed on resize via `ResizeObserver`.

## 7. Theming contract

Because the component uses Shadow DOM, host CSS cannot leak in or out. Two supported
theming surfaces:

**CSS custom properties** (inherit through the shadow boundary). Point them at
`light-dark()` tokens and the quiz follows the host's light/dark toggle automatically,
because `color-scheme` inherits into the shadow tree. The full set:

- Colour: `--mq-accent`, `--mq-solved`, `--mq-target`, `--mq-wrong`, `--mq-text`,
  `--mq-muted`.
- Surfaces: `--mq-bg` (main background — **`transparent` by default** so the page shows
  through; set a colour for a filled card), `--mq-surface` (map, cards, pills, controls),
  `--mq-border` (hairlines).
- Map: `--mq-land`, `--mq-land-hover`, `--mq-map-stroke`, `--mq-label`, `--mq-label-halo`.
- Shape/type: `--mq-radius`, `--mq-radius-control`, `--mq-font`, `--mq-font-mono`.
- Fit: `--mq-max-height` (default `100dvh`), `--mq-min-height` (`480px`), `--mq-chrome`
  (`240px`).

**Styleable parts** via `map-quiz::part(NAME)` (these override internal styles, no
`!important` needed): `wrap`, `heading`, `card`, `backlink`, `button` /
`button-primary` / `button-secondary`, `option`, `stat` / `stat-value` / `stat-label`,
`kicker`, `progress`, `map`, `panel`, `zoom-button`, `about-button`, `dialog`,
`dialog-close`.

Design intent: `--mq-bg` (page) and `--mq-surface` (raised things) are deliberately
separate so the component can blend into a page while the map and cards still read as
surfaces. The shipped `map-quiz.css` maps every variable and part onto a Figma-token
design system and is the reference example.

## 8. Public API

- **Element:** `<map-quiz>`.
- **Attributes:** `src` (URL, or `#id` of an inline `<script type="application/json">`),
  `mode` (`find | name | learn`, skips the mode picker), `heading` (overrides the title).
- **Property:** `el.data = {...}` sets the quiz or manifest object directly (for
  frameworks); mirrors `src`.
- **Event:** `quizcomplete` (bubbles, composed) with
  `detail = { mode, total, firstTry, mistakes, accuracy, ms }`.
- **Version:** `document.querySelector('map-quiz').constructor.version`.

## 9. Geometry pipeline

Geometry is prepared offline and committed as data; the runtime never projects. Two tools
live in `tools/`:

- `geojson-to-quiz.mjs` — the general converter: takes any GeoJSON/TopoJSON, projects it
  (`mercator | conicConformal | albersUsa | equalEarth | naturalEarth`), and writes a quiz
  file with centroid labels and rounded coordinates.
- `build-europe.mjs` — the Europe-specific build (an example of the harder cases): clips
  Natural Earth 1:50m countries to a European lon/lat window, projects with an Azimuthal
  Equal-Area centred on Europe, takes labels from each country's **largest** polygon, and
  adds the six microstates as small learn-only markers (sub-pixel as real outlines at this
  scale).

Authoring guidance: pick a projection suited to the region; label at the largest polygon's
centroid (not the multipolygon centroid, which can land offshore); round coordinates to
keep files small; and use `category`/`quiz:false` for regions that should be shown for
context but not tested.

### Data source notes

- **United States** — US Atlas TopoJSON, Albers USA (Alaska/Hawaii as insets); the five
  inhabited territories and D.C. are `category` context.
- **Ireland** — GADM level-1 for the Republic; Northern Ireland's six counties reconstructed
  from Natural Earth 1:10m districts (a few internal lines near Belfast are approximate).
- **Europe** — Natural Earth 1:50m (smooth, detailed borders), cropped to a European window
  (Russia/Kazakhstan tails clipped); microstates are point-markers at true locations, not full
  outlines.

## 10. Accessibility

Map regions are keyboard-focusable with `role="button"` (quiz) / `role="img"` (learn) and
respond to Enter/Space; answer choices are real `<button>`s. Focus styling uses
`:focus-visible`. Feedback uses `aria-live="polite"`. The map carries an `aria-label`, and
each region an `aria-label` of its name. Layout collapses to a single column on narrow
screens. Themers pointing colours at `light-dark()` tokens get correct contrast in both
schemes for free.

## 11. Verification

Because the interaction rules above are subtle, changes should be checked in a headless
browser (Playwright), not by inspection alone. The standing checks: real
`page.mouse.click` on scaled/zoomed regions registers as correct; wheel-scroll passes to
the page while ⌘/Ctrl-wheel zooms; labels hold a constant pixel size across zoom and
container width; the component stays within the viewport across representative sizes; the
Name-mode list bottom-aligns with the map; and no console errors. Synthetic dispatched
clicks are avoided because they bypass pointer capture and hide the exact bugs these rules
prevent.

## 12. Known trade-offs

- Europe microstates are point-markers, not real outlines (sub-pixel at Europe scale, and
  more consistently hoverable as uniform markers); the build script can be adapted to use their
  real 1:50m/1:10m geometry if desired.
- Europe's eastern edge (Russia/Kazakhstan) is a clip line, not a natural border — a normal
  Europe-map compromise.
- Geometry is static: changing a border means re-running the offline pipeline, not a
  runtime update.
