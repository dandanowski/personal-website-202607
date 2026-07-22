# Map Quiz

A small, framework-agnostic **Web Component** (`<map-quiz>`) that quizzes players
on the regions of a map. Ships with three quizzes — **Counties of Ireland** (32),
**United States** (Learn mode shows all 56 — the 50 states, D.C. and the five inhabited
territories — while the quiz tests just the 50 states), and **Countries of Europe**
(Learn mode shows 51 — 45 countries plus six microstates — while the quiz tests the 45
countries) — and is built so adding more is just dropping in a data file.

Point it at a **manifest** listing several quizzes and the component shows its own
landing page — the player picks a quiz, then a mode, then plays — all inside the one
element. Point it at a single quiz instead and it skips straight to the mode picker.
The flow is: **choose a quiz → choose a mode → interact with the map.**

Three modes, chosen by the player at the start of each quiz:

- **Learn the map** — every region is labelled; hover or tap one to focus it (its
  full name shows in the header). Clicking or tapping a region pins a **callout** with its
  name and capital (or county town, etc.), which you dismiss by clicking anywhere else or
  pressing Esc. Small, crowded regions (small US states, for example) collapse to a dot you
  can hover to read, so nothing overlaps.
- **Find it on the map** — the quiz names a region, the player clicks it.
- **Name the region** — a region is highlighted and the player picks its name
  from the full list of remaining regions (the list shrinks as they get them right).

The two quiz modes track first-try accuracy, total misses, and time, with a results
screen at the end.

Every map is **zoomable and pannable** in all three modes — zoom with **⌘/Ctrl + scroll**,
the on-map `+` / `−` / reset buttons, or a two-finger pinch; drag to pan once zoomed in.
A **plain scroll passes straight through to the page** (a brief hint reminds you to hold
⌘/Ctrl to zoom), so a map embedded in a long page never traps the scroll wheel. This
makes small, tightly packed regions (like the north-eastern US states) easy to
see and click. Region
borders stay crisp at any zoom level, and labels keep a constant, readable size
rather than ballooning — so in Learn mode, zooming into a crowded area actually
reveals the labels that were collapsed to dots.

## Files

```
map-quiz.js            The component. One file, no dependencies, no build step.
index.html             Self-contained demo (open it directly in a browser).
quizzes.json           Manifest listing the quizzes (drives the landing page).
data/ireland.json      Counties of Ireland geometry + names.
data/us-states.json    US states geometry + names.
data/europe.json       Countries of Europe geometry + names.
tools/geojson-to-quiz.mjs   Converter to generate more quizzes from any GeoJSON.
```

## Using it on your site

Include the script once, then drop the element wherever you want a quiz. Point it
at a **manifest** to get the built-in quiz picker, or at a **single quiz** to skip
straight to the mode picker:

```html
<script src="/path/to/map-quiz.js"></script>

<!-- multiple quizzes: shows a "choose a quiz" landing page -->
<map-quiz src="/path/to/quizzes.json"></map-quiz>

<!-- a single quiz: goes straight to the mode picker -->
<map-quiz src="/path/to/data/ireland.json"></map-quiz>
```

`map-quiz.js` is a plain script (no `import`/`export`), so a normal
`<script>` tag works everywhere — including a page opened directly from disk.

When you use `src="…json"`, that file is loaded with `fetch`, which browsers only
allow over http(s). So to test the `src="data/…json"` form locally, serve the folder
(e.g. `python3 -m http.server` then open `http://localhost:8000`). If you just want
to double-click a file with no server, use the inline-data form below (that's what the
included `index.html` demo does). Three other ways to supply data:

```html
<!-- 1. Inline JSON already on the page (works from file:// with no server) -->
<script type="application/json" id="ie">{ ...quiz json... }</script>
<map-quiz src="#ie"></map-quiz>
```

```js
// 2. Set the data directly — handy in React/Vue/Svelte
document.querySelector('map-quiz').data = irelandData;
```

```html
<!-- 3. Skip the mode picker and start in one mode -->
<map-quiz src="data/ireland.json" mode="name"></map-quiz>   <!-- or mode="find" / mode="learn" -->
```

The component emits a `quizcomplete` event when a run finishes:

```js
el.addEventListener('quizcomplete', (e) => console.log(e.detail));
// { mode, total, firstTry, mistakes, accuracy, ms }
```

### Theming

The component uses Shadow DOM, so your global CSS can't leak in (and can't accidentally
break it). You theme it two ways: **custom properties** for colour / type / shape, and
**`::part()`** for element-level styling.

Custom properties (set on the element or any ancestor — they inherit through the shadow
boundary). If you point them at `light-dark()` tokens, the quiz follows your light/dark
theme automatically, because `color-scheme` inherits into the shadow tree:

```css
map-quiz {
  /* surfaces */
  --mq-bg: transparent;        /* main quiz background — transparent by default so the page
                                  (colour, gradient, image) shows through; set a colour to fill it */
  --mq-surface: #fff;          /* the map, selection cards, pills, controls */
  --mq-border: #e2e8f0;        /* hairlines: card/pill/button/map borders, progress track */

  /* colour */
  --mq-accent: #2563eb;        /* buttons/links · progress · focus */
  --mq-land: #cbd5e1;          /* unsolved regions */
  --mq-land-hover: #94a3b8;
  --mq-map-stroke: #fff;       /* lines between map regions */
  --mq-solved: #34d399;        /* a correct answer */
  --mq-target: #fbbf24;        /* the highlighted region */
  --mq-wrong: #f87171;         /* a wrong-guess flash */
  --mq-text: #0f172a;
  --mq-muted: #64748b;
  --mq-label: #0f172a;         /* region label text (set light for dark maps) */
  --mq-label-halo: rgba(255,255,255,.85); /* halo behind labels */

  /* shape + type */
  --mq-radius: 14px;           /* the outer container */
  --mq-radius-control: 10px;   /* buttons + map controls */
  --mq-font: system-ui, sans-serif;
  --mq-font-mono: var(--mq-font); /* set to a mono stack for a technical look */

  /* fit the viewport (map screens only) */
  --mq-max-height: 100dvh;     /* the component never grows taller than this — the map
                                  scales down to fit rather than pushing the page taller */
  --mq-min-height: 480px;      /* functional floor for the map screens */
  --mq-chrome: 240px;          /* space the HUD + progress + toolbar take around the map */
}
```

On the play/learn screens the component is capped to `--mq-max-height` and the (portrait)
map scales down to fit — no more page scrolling for a tall map like Ireland. If the quiz
sits under a sticky header, subtract it: `--mq-max-height: calc(100dvh - 64px)`.

The **quiz background** (`--mq-bg`) and the **surfaces** (`--mq-surface` — the map, cards,
and pills) are separate. `--mq-bg` defaults to `transparent`, so the component blends into
your page (your page's colour, gradient, or background image shows straight through) while
the map and cards still read as raised surfaces. Set `--mq-bg` to a colour if you want the
quiz to sit on its own fill instead.

Styleable parts, targeted with `map-quiz::part(NAME)` (these override the internal
styles, so no `!important` needed):

`wrap` (outer card) · `heading` · `card` (the quiz/mode selection cards) · `backlink` ·
`button`, `button-primary`, `button-secondary` · `option` (answer pills) · `stat`,
`stat-value`, `stat-label` · `kicker` (small labels) · `progress` · `map` (the `<svg>`) ·
`panel` (Name-mode list) · `zoom-button` · `about-button` (the "About the data" button) ·
`dialog`, `dialog-close` (the about dialog) · `callout` (the Learn-mode selection callout).
Example:

```css
map-quiz::part(card) { border: 1px solid var(--line); border-radius: 6px; }
map-quiz::part(card):hover { border-color: var(--accent); }
map-quiz::part(button-primary) { background: var(--ink); color: var(--paper); }
```

A ready **`map-quiz.css`** (shipped alongside) maps every variable and part to a
Figma-token design system (`light-dark()` semantic tokens, Archivo + mono, hairline
cards) — copy it and repoint the token names at yours.

The map scales to the width of its container, and the layout collapses to a single
column on narrow screens. Answer choices are real buttons and the map regions are
keyboard-focusable, so it works with a keyboard and screen readers.

## Manifest (the quiz picker)

To offer several quizzes from one `<map-quiz>`, point `src` at a manifest — an object
with a `quizzes` array. The component detects it (vs a single quiz, which has a
`regions` array) and shows a landing page listing each quiz; picking one loads it and
moves on to the mode picker. A "← All quizzes" link on the mode picker returns to it.

```json
{
  "title": "Map Quiz",
  "subtitle": "Choose a quiz to begin.",
  "quizzes": [
    { "title": "Counties of Ireland", "subtitle": "All 32 counties", "icon": "🍀", "src": "data/ireland.json" },
    { "title": "United States", "subtitle": "50 states — plus D.C. & territories to learn", "icon": "🗽", "src": "data/us-states.json" }
  ]
}
```

Each entry needs a `title` (and optional `subtitle` / `icon`) plus one source for the
quiz data: `src` (a URL or an `#inline-id`), an inline `data` object, or the quiz's own
`regions` inline. The shipped `quizzes.json` is a ready manifest for the two bundled
quizzes; the demo `index.html` uses an inline version of the same. You can also set it
in code: `el.data = { quizzes: [...] }`.

## Data format

Each quiz is one JSON object. To add a quiz, produce a file in this shape and point
a `<map-quiz>` at it — nothing in the component is hard-coded to Ireland or the US.

```json
{
  "id": "ireland",
  "title": "Counties of Ireland",
  "prompt": "county",
  "viewBox": "0 0 620 780",
  "regions": [
    { "id": "ie-cork", "name": "Cork", "path": "M...Z", "labelX": 210.4, "labelY": 640.1 }
  ]
}
```

- `path` is an SVG path string already projected into the `viewBox` coordinate space.
- `labelX` / `labelY` place the region's name (shown once solved, or in Learn mode).
- `prompt` is the singular noun used in the UI ("Find this **county**"); it's
  pluralised automatically ("Remaining **counties**").
- `short` (optional) is a compact label (e.g. `"RI"`) that Learn mode prints on the
  map when the full name won't fit; the full `name` is still used for prompts, answers,
  and the focus header. The US data uses this for the small north-eastern states.
- `capital` (optional) is the secondary fact shown in the **Learn-mode callout** when a
  region is selected — a capital city for countries and US states, a county town for Irish
  counties, and so on. Regions without a `capital` just show their name in the callout.
- `capitalLabel` (optional, top-level) is the label for that fact (default `"Capital"`;
  the Ireland quiz sets it to `"County town"`).
- `category` (optional) marks a region as context-only. Anything other than `"state"`
  (e.g. `"district"`, `"territory"`, `"microstate"`) — or an explicit `"quiz": false` — is
  shown and labelled in **Learn** mode but left out of the quiz modes. Learn mode tints
  these differently, shows a legend, and appends a note in the header (e.g. "Puerto Rico ·
  U.S. territory", "Monaco · microstate"). The US quiz uses this for D.C. and its
  territories; the Europe quiz uses it for the six microstates.
- `learnUnit` (optional, top-level) is the collective noun Learn mode uses for its count
  when the set is mixed (the US quiz sets it to `"region"`, so Learn reads "56 regions"
  while the quiz still says "50 states"; Europe sets it to `"country"`).
- `about` (optional, top-level) is the explanatory text shown by the **"About the data"**
  button in the map's bottom-right corner — a string, or an array of strings rendered as
  paragraphs. Use it to say where the geometry came from and to note any disputed borders.
- `sources` (optional, top-level) is a list of `{ "label", "url" }` links listed under the
  `about` text (e.g. the dataset's homepage). The button only appears when a quiz supplies
  `about` and/or `sources`; it opens a dialog (native `<dialog>`, closes on Esc, the ✕, or a
  backdrop click).
- `categoryLabels` (optional, top-level) maps a `category` to the wording shown in the
  Learn header, e.g. `{ "microstate": "microstate" }`. Built-in defaults cover
  `district`, `territory`, and `microstate`; anything else falls back to the raw category.
- `legend` (optional, top-level) sets the Learn-mode legend wording:
  `{ "quizzed": "Country", "context": "Microstate" }`. `quizzed` defaults to the
  capitalised `prompt`; `context` is the label for the shown-not-quizzed swatch.

## Adding another quiz

Grab a GeoJSON (or TopoJSON) of the regions you want, then run the converter:

```bash
cd tools
npm i d3-geo topojson-client
node geojson-to-quiz.mjs \
  --in departements.geojson \
  --out ../data/france.json \
  --name-key nom \
  --id france --title "Départements de France" --prompt department \
  --projection mercator --width 620 --height 780
```

Then: `<map-quiz src="data/france.json"></map-quiz>`. Pick the projection that suits
the region (`mercator`, `conicConformal`, `albersUsa`, `equalEarth`, `naturalEarth`).

## Data sources & notes

- **United States:** [US Atlas TopoJSON](https://github.com/topojson/us-atlas) (US Census
  cartographic boundaries), projected with Albers USA so Alaska and Hawaii sit as insets;
  the five inhabited territories (Puerto Rico, U.S. Virgin Islands, Guam, Northern Mariana
  Islands, American Samoa) are each projected separately and placed as insets, with the
  largest island of each shown so it's visible. D.C. and all five territories are marked
  `category` context (see above): Learn mode shows all 56, the quiz tests the 50 states.
  To include a territory in the quiz too, remove its `category`; to drop it entirely,
  delete its region.
- **Europe:** [Natural Earth 1:50m admin‑0 countries](https://github.com/nvkelso/natural-earth-vector),
  projected with an Azimuthal Equal‑Area centred on Europe (ETRS‑LAEA style) and cropped to a
  European window (so Russia's and Kazakhstan's eastern extents are clipped). Includes the
  commonly‑counted transcontinental states (Russia, Turkey, Cyprus, Georgia, Armenia, Azerbaijan,
  Kazakhstan). The six microstates (Andorra, Liechtenstein, Malta, Monaco, San Marino, Vatican
  City) are drawn as small `category: "microstate"` markers at their true locations (they're
  sub‑pixel as real outlines at this scale) — Learn mode shows all 51, the quiz tests the 45
  countries. To quiz a microstate too, remove its `category`.
- **Ireland — Republic (26 counties):** GADM level‑1 county boundaries.
- **Ireland — Northern Ireland (6 counties):** reconstructed by dissolving Natural
  Earth 1:10m district boundaries into the six historic counties (Antrim, Armagh,
  Down, Fermanagh, Londonderry, Tyrone). A pristine historic‑county dataset wasn't
  reachable from the build environment, so a handful of internal boundaries near
  Belfast are approximate; the county set, outlines, and overall shapes are correct
  and quiz‑accurate. Swap in an official OSNI county‑boundary GeoJSON via the
  converter if you want survey‑grade internal lines.
