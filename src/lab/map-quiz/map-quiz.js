/*!
 * <map-quiz> — a framework-agnostic map quiz Web Component.
 *
 * Usage:
 *   <script type="module" src="map-quiz.js"></script>
 *   <map-quiz src="data/ireland.json"></map-quiz>          <!-- fetch JSON -->
 *   <map-quiz src="#ireland-data"></map-quiz>              <!-- inline <script type="application/json" id="ireland-data"> -->
 *   el.data = {...}                                        <!-- set data directly (frameworks) -->
 *
 * Data shape:
 *   {
 *     "id": "ireland",
 *     "title": "Counties of Ireland",
 *     "prompt": "county",                // singular noun used in prompts
 *     "viewBox": "0 0 620 780",
 *     "regions": [ { "id", "name", "path", "labelX", "labelY", "short?" }, ... ]
 *   }
 *
 * Attributes:
 *   src      URL to a data JSON file, or "#elementId" of an inline JSON script.
 *   mode     "learn" | "find" | "name"  — start directly in this mode (skips the picker).
 *   heading  override the data title.
 *
 * Theming (CSS custom properties, set on the element):
 *   --mq-bg        overall quiz background (set to your PAGE background)
 *   --mq-surface   raised surfaces: the map, cards, pills, controls
 *   --mq-border    hairlines: card/pill/button/map borders, progress track
 *   --mq-accent, --mq-land, --mq-land-hover, --mq-map-stroke, --mq-solved, --mq-target,
 *   --mq-wrong, --mq-text, --mq-muted, --mq-label, --mq-label-halo,
 *   --mq-radius, --mq-radius-control, --mq-font, --mq-font-mono
 *   --mq-max-height, --mq-min-height   (map screens fit the viewport; lower max-height
 *                                       to leave room for a sticky header)
 *
 * Styleable parts (target from outside with map-quiz::part(NAME)):
 *   wrap        the outer card
 *   heading     the h2 on the quiz picker / mode picker / results
 *   card        the selectable cards (quiz picker + mode picker)
 *   backlink    the "← All quizzes" link
 *   button, button-primary, button-secondary   the action buttons
 *   option      the answer pills (Name mode)
 *   stat, stat-value, stat-label   the HUD / results metrics
 *   kicker      the small uppercase labels
 *   progress    the progress-bar fill
 *   map         the <svg> map
 *   panel       the remaining-options panel (Name mode)
 *   zoom-button the + / − / reset map controls
 */
(() => {
  if (customElements.get('map-quiz')) return;

  const SVGNS = 'http://www.w3.org/2000/svg';
  // Label/dot sizes are in SCREEN pixels; they're converted to map units at render time
  // so text stays this size no matter how wide the map is drawn or how far it's zoomed.
  const LABEL_PX = 12, ACTIVE_PX = 16, HALO_PX = 2.6, DOT_PX = 2.6, PAD_PX = 2;
  const shuffle = (a) => {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const fmtTime = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (w) => (/[^aeiou]y$/i.test(w) ? w.slice(0, -1) + 'ies' : w + 's'); // county->counties, state->states

  const STYLE = `
    :host {
      --mq-accent: #2563eb;
      --mq-bg: transparent;      /* main quiz background — transparent so the page shows through; set a colour to fill it */
      --mq-surface: #fff;        /* raised surfaces: the map, cards, pills, controls */
      --mq-border: #e2e8f0;      /* hairlines: card/pill/button/map borders, progress track */
      --mq-land: #cbd5e1;
      --mq-land-hover: #94a3b8;
      --mq-map-stroke: #fff;     /* the lines between map regions */
      --mq-label: #0f172a;       /* region label text */
      --mq-label-halo: rgba(255,255,255,.85); /* halo behind labels for legibility */
      --mq-solved: #34d399;
      --mq-target: #fbbf24;
      --mq-wrong: #f87171;
      --mq-text: #0f172a;
      --mq-muted: #64748b;
      --mq-radius: 14px;
      --mq-radius-control: 10px; /* buttons & map controls */
      --mq-pad: clamp(14px, 3cqw, 26px); /* padding around the whole quiz; set 0 to sit flush */
      /* On the map screens the component fits the viewport: it never grows taller than
         --mq-max-height, and the map scales down to fit. Lower --mq-max-height to leave
         room for a sticky header, e.g. calc(100dvh - 140px). */
      --mq-max-height: 100dvh;
      --mq-min-height: 480px;    /* functional floor for the map screens */
      --mq-chrome: 240px;        /* height used by the HUD + progress + toolbar around the map */
      --mq-font: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --mq-font-mono: var(--mq-font); /* set to a mono stack for a technical look on labels/buttons/pills */
      display: block;
      color: var(--mq-text);
      font-family: var(--mq-font);
      container-type: inline-size;
    }
    * { box-sizing: border-box; }
    .wrap {
      background: var(--mq-bg);
      border-radius: var(--mq-radius);
      padding: var(--mq-pad);
      /* No shadow by default — the main area is transparent and blends into the page.
         Give --mq-bg a colour and add a shadow via ::part(wrap) if you want a raised card. */
    }

    /* ---------- start screen ---------- */
    .start { text-align: center; padding: min(6cqw, 48px) 16px; position: relative; }
    .backlink {
      position: absolute; left: 8px; top: 8px; appearance: none; cursor: pointer;
      background: none; border: none; font: inherit; font-size: 13.5px; font-weight: 600;
      color: var(--mq-muted); padding: 6px 8px; border-radius: 8px; font-family: var(--mq-font-mono);
    }
    .backlink:hover { color: var(--mq-accent); }
    .backlink:focus-visible { outline: 3px solid color-mix(in srgb, var(--mq-accent) 45%, transparent); outline-offset: 2px; }
    .start h2 { margin: 0 0 6px; font-size: clamp(22px, 5cqw, 34px); letter-spacing: -.02em; }
    .start p { margin: 0 auto 26px; max-width: 46ch; color: var(--mq-muted); line-height: 1.5; }
    .modes { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); max-width: 820px; margin: 0 auto; }
    @container (max-width: 680px) { .modes { grid-template-columns: 1fr 1fr; } }
    @container (max-width: 430px) { .modes { grid-template-columns: 1fr; } }
    .mode-card {
      appearance: none; cursor: pointer; text-align: left; font: inherit; color: inherit;
      background: var(--mq-surface); border: 1.5px solid var(--mq-border); border-radius: 12px; padding: 18px;
      transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease;
    }
    .mode-card:hover { border-color: var(--mq-accent); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,.14); }
    .mode-card:focus-visible { outline: 3px solid color-mix(in srgb, var(--mq-accent) 45%, transparent); outline-offset: 2px; }
    .mode-card .ic { font-size: 26px; line-height: 1; }
    .mode-card b { display: block; margin: 10px 0 4px; font-size: 17px; }
    .mode-card span { color: var(--mq-muted); font-size: 13.5px; line-height: 1.45; }

    /* ---------- play screen ---------- */
    .hud { display: flex; align-items: center; gap: 10px 18px; flex-wrap: wrap; margin-bottom: 14px; }
    .hud .prompt { flex: 1 1 240px; min-width: 0; }
    .hud .prompt .lead { font-size: 12.5px; text-transform: uppercase; letter-spacing: .08em; color: var(--mq-muted); font-family: var(--mq-font-mono); }
    .hud .prompt .target { font-size: clamp(20px, 4.4cqw, 28px); font-weight: 700; letter-spacing: -.01em; line-height: 1.15; }
    .stats { display: flex; gap: 14px; flex-wrap: wrap; }
    .stat { text-align: center; font-family: var(--mq-font-mono); }
    .stat b { display: block; font-size: 18px; font-variant-numeric: tabular-nums; }
    .stat span { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--mq-muted); }
    .bar { height: 8px; border-radius: 999px; background: var(--mq-border); overflow: hidden; margin-bottom: 14px; }
    .bar > i { display: block; height: 100%; width: 0; background: var(--mq-accent); border-radius: inherit; transition: width .35s ease; }

    .layout { display: grid; grid-template-columns: 1fr; gap: 16px; }
    @container (min-width: 720px) { .layout.has-panel { grid-template-columns: 1fr minmax(220px, 300px); } }

    /* Viewport-fit on the map screens: the map never grows past (viewport − chrome), so the
       whole component stays within --mq-max-height. It scales down (letterboxes) to fit;
       a map that's already short just sizes naturally. --mq-min-height floors the map screens. */
    .wrap[data-screen="play"], .wrap[data-screen="learn"] { min-height: var(--mq-min-height); }
    .wrap[data-screen="play"] svg.map {
      max-height: calc(var(--mq-max-height) - var(--mq-chrome));
    }
    .wrap[data-screen="learn"] svg.map {   /* learn has no progress bar / toast, so ~52px less chrome */
      max-height: calc(var(--mq-max-height) - var(--mq-chrome) + 52px);
    }
    /* Fallback bound for the stacked (single-column) layout; when the panel sits beside
       the map, JS caps the list to the map's rendered height so the two columns line up. */
    .wrap[data-screen="play"] .options {
      max-height: calc(var(--mq-max-height) - var(--mq-chrome) - 44px);
    }

    .mapbox { background: var(--mq-surface); border-radius: 12px; padding: 8px; border: 1px solid var(--mq-border); position: relative; overflow: hidden; }
    svg.map { width: 100%; height: auto; display: block; touch-action: pan-y; }
    svg.map.zoomed { cursor: grab; touch-action: none; }   /* once zoomed, one-finger drag pans */
    svg.map.grabbing { cursor: grabbing; }
    .zoom-hint {
      position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
      z-index: 3; pointer-events: none; opacity: 0; transition: opacity .18s ease;
      background: rgba(15,23,42,.82); color: #fff; font-size: 13px; font-weight: 600;
      padding: 8px 14px; border-radius: 999px; white-space: nowrap;
    }
    .zoom-hint.show { opacity: 1; }
    .zoom-ctl { position: absolute; top: 14px; right: 14px; z-index: 2; display: flex; flex-direction: column; gap: 6px; }
    .zoom-ctl button {
      appearance: none; width: 34px; height: 34px; border-radius: var(--mq-radius-control); cursor: pointer;
      border: 1px solid var(--mq-border); background: var(--mq-surface); color: var(--mq-text);
      font-size: 19px; line-height: 1; font-weight: 600; display: grid; place-items: center;
      box-shadow: 0 1px 3px rgba(15,23,42,.12); transition: border-color .12s ease, color .12s ease;
    }
    .zoom-ctl button:hover { border-color: var(--mq-accent); color: var(--mq-accent); }

    /* "About the data" button — bottom-right of the map */
    .map-about {
      position: absolute; right: 10px; bottom: 10px; z-index: 3;
      appearance: none; display: inline-flex; align-items: center; gap: 5px; cursor: pointer;
      padding: 4px 9px; font-size: 11.5px; line-height: 1; font-family: var(--mq-font-mono);
      border: 1px solid var(--mq-border); border-radius: var(--mq-radius-control);
      background: var(--mq-surface); color: var(--mq-muted); opacity: .9;
      box-shadow: 0 1px 3px rgba(15,23,42,.1); transition: opacity .12s ease, border-color .12s ease, color .12s ease;
    }
    .map-about:hover { opacity: 1; border-color: var(--mq-accent); color: var(--mq-accent); }
    .map-about:focus-visible { outline: 3px solid color-mix(in srgb, var(--mq-accent) 45%, transparent); outline-offset: 2px; }
    .map-about .ic { font-size: 12.5px; }
    .about-dlg {
      margin: auto; padding: 0; max-width: 460px; width: calc(100% - 32px); color: var(--mq-text);
      border: 1px solid var(--mq-border); border-radius: var(--mq-radius);
      background: var(--mq-surface); box-shadow: 0 12px 44px rgba(15,23,42,.3);
    }
    .about-dlg::backdrop { background: rgba(15,23,42,.5); }
    .about-dlg .dlg-in { position: relative; padding: 20px 22px; }
    .about-dlg h3 { margin: 0 0 12px; font-size: 16px; font-weight: 700; letter-spacing: -.01em; }
    .about-dlg p { margin: 0 0 11px; font-size: 13.5px; line-height: 1.55; color: var(--mq-text); }
    .about-dlg p:last-child { margin-bottom: 0; }
    .about-dlg .src { font-size: 12.5px; color: var(--mq-muted); font-family: var(--mq-font-mono); }
    .about-dlg .src a { color: var(--mq-accent); }
    .about-dlg .dlg-close {
      appearance: none; position: absolute; top: 12px; right: 12px; width: 28px; height: 28px;
      border: 1px solid transparent; border-radius: var(--mq-radius-control); cursor: pointer;
      background: transparent; color: var(--mq-muted); font-size: 15px; line-height: 1; display: grid; place-items: center;
    }
    .about-dlg .dlg-close:hover { color: var(--mq-text); border-color: var(--mq-border); }

    /* Learn mode: selection callout (region name + capital / county town) */
    .callout {
      position: absolute; left: 0; top: 0; z-index: 5; display: none; max-width: 230px;
      background: var(--mq-surface); color: var(--mq-text);
      border: 1px solid var(--mq-border); border-radius: var(--mq-radius-control);
      box-shadow: 0 6px 24px rgba(15,23,42,.22); padding: 9px 12px;
    }
    .callout.show { display: block; animation: mq-pop .12s ease-out; }
    @keyframes mq-pop { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
    .callout .callout-name { font-size: 14.5px; font-weight: 700; letter-spacing: -.01em; line-height: 1.2; }
    .callout .callout-fact { margin-top: 3px; font-size: 13px; }
    .callout .callout-fact .k { color: var(--mq-muted); font-family: var(--mq-font-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; margin-right: 6px; }
    .callout .callout-note { margin-top: 4px; font-size: 11.5px; color: var(--mq-muted); font-style: italic; }
    .zoom-ctl button:disabled { opacity: .45; cursor: default; }
    .zoom-ctl button:focus-visible { outline: 3px solid color-mix(in srgb, var(--mq-accent) 45%, transparent); outline-offset: 2px; }
    svg.map path.region {
      fill: var(--mq-land); stroke: var(--mq-map-stroke); stroke-width: 1; stroke-linejoin: round;
      transition: fill .15s ease; outline: none;
    }
    svg.map.pick path.region { cursor: pointer; }
    svg.map.pick path.region:not(.wrong):not(.solved):hover { fill: var(--mq-land-hover); }
    svg.map path.region:focus-visible { stroke: var(--mq-accent); stroke-width: 2.2; }
    svg.map path.region.solved { fill: var(--mq-solved); cursor: default; }
    svg.map path.region.target { fill: var(--mq-target); }
    svg.map path.region.wrong { fill: var(--mq-wrong); }
    svg .lbl { font-size: 11px; font-weight: 600; fill: var(--mq-label); paint-order: stroke; stroke: var(--mq-label-halo); stroke-width: 2.4px; pointer-events: none; opacity: 0; }
    svg .lbl.show { opacity: 1; }

    /* ---------- learn mode ---------- */
    svg.map.learn path.region { cursor: pointer; }
    svg.map.learn path.region.noquiz { fill: #93c5fd; }   /* D.C. & territories: shown, not quizzed */
    svg.map.learn path.region:hover, svg.map.learn path.region:focus-visible { stroke: var(--mq-accent); stroke-width: 1.6; }
    svg.map.learn path.region.active { fill: var(--mq-target); }
    svg.map.learn .lbl { opacity: 1; fill: var(--mq-label); font-size: 10px; stroke-width: 2.8px; }
    svg.map.learn .lbl.hidden { opacity: 0; }
    svg.map.learn .lbl.active { opacity: 1; font-size: 15px; font-weight: 700; fill: var(--mq-label); stroke-width: 3.2px; }
    svg .dot { fill: #475569; opacity: 0; pointer-events: none; }
    svg .dot.on { opacity: .5; }

    .panel { display: flex; flex-direction: column; min-height: 0; }
    .panel h3 { margin: 0 0 8px; font-size: 12.5px; text-transform: uppercase; letter-spacing: .07em; color: var(--mq-muted); }
    /* Name mode: a vertical, scrollable list of the remaining regions. Its height is
       capped to the map's rendered height by JS when the panel sits beside the map;
       the CSS rule below is the fallback for the stacked single-column layout. */
    .options { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; padding: 2px; }
    .opt {
      appearance: none; font: inherit; cursor: pointer; color: inherit;
      display: block; width: 100%; text-align: left;
      background: var(--mq-surface); border: 1.5px solid var(--mq-border); border-radius: var(--mq-radius-control);
      padding: 9px 13px; font-size: 14px; line-height: 1.25; transition: all .12s ease;
      font-family: var(--mq-font-mono);
    }
    .opt:hover { border-color: var(--mq-accent); color: var(--mq-accent); }
    .opt:focus-visible { outline: 3px solid color-mix(in srgb, var(--mq-accent) 45%, transparent); outline-offset: 1px; }
    .opt.wrong { border-color: var(--mq-wrong); color: #b91c1c; background: color-mix(in srgb, var(--mq-wrong) 15%, #fff); animation: shake .3s; }
    @keyframes shake { 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

    .toolbar { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
    button.btn {
      appearance: none; font: inherit; cursor: pointer; border-radius: var(--mq-radius-control); padding: 9px 16px;
      border: 1.5px solid transparent; font-weight: 600; font-size: 14px; transition: all .12s ease;
      font-family: var(--mq-font-mono);
    }
    button.btn.primary { background: var(--mq-accent); color: #fff; }
    button.btn.primary:hover { filter: brightness(1.06); }
    button.btn.ghost { background: var(--mq-surface); border-color: var(--mq-border); color: var(--mq-text); }
    button.btn.ghost:hover { border-color: var(--mq-accent); color: var(--mq-accent); }
    button.btn:focus-visible { outline: 3px solid color-mix(in srgb, var(--mq-accent) 45%, transparent); outline-offset: 2px; }

    .legend { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--mq-muted); flex-wrap: wrap; margin-left: 4px; font-family: var(--mq-font-mono); }
    .legend .sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; border: 1px solid rgba(15,23,42,.15); }
    .legend .sw-state { background: var(--mq-land); }
    .legend .sw-other { background: #93c5fd; margin-left: 10px; }

    .toast { position: relative; min-height: 20px; margin-top: 10px; font-size: 14px; font-weight: 600; color: var(--mq-muted); }
    /* Find mode: feedback sits in the controls area above the map, not below it */
    .toast.toast-top { margin-top: 2px; margin-bottom: 8px; }
    .toast.good { color: #047857; }
    .toast.bad { color: #b91c1c; }

    /* ---------- done screen ---------- */
    .done { text-align: center; padding: min(4cqw, 30px) 8px; }
    .done .big { font-size: clamp(40px, 9cqw, 60px); line-height: 1; margin-bottom: 6px; }
    .done h2 { margin: 0 0 20px; font-size: clamp(20px, 4.5cqw, 28px); }
    .scorecard { display: flex; justify-content: center; gap: 22px; flex-wrap: wrap; margin-bottom: 24px; }
    .scorecard .s b { display: block; font-size: clamp(24px, 6cqw, 34px); font-variant-numeric: tabular-nums; }
    .scorecard .s span { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--mq-muted); }
    .scorecard .s { font-family: var(--mq-font-mono); }

    @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
  `;

  class MapQuiz extends HTMLElement {
    static version = '1.7.1'; // bump on release; check via document.querySelector('map-quiz').constructor.version
    static get observedAttributes() { return ['src', 'mode', 'heading']; }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._data = null;
      this._manifest = null; // set when the source lists multiple quizzes
      this._state = null;
      this._timer = null;
    }

    connectedCallback() {
      if (!this.shadowRoot.firstChild) {
        const style = document.createElement('style');
        style.textContent = STYLE;
        const root = document.createElement('div');
        root.className = 'wrap';
        root.setAttribute('part', 'wrap');
        this.shadowRoot.append(style, root);
        this._root = root;
      }
      const src = this.getAttribute('src');
      if (this._manifest) this._renderQuizSelect();
      else if (this._data) this._renderStart();
      else if (src) this._loadSource(src);
      else this._message('No quiz data. Set the "src" attribute or the .data property.');
    }

    disconnectedCallback() { this._stopTimer(); if (this._ro) { this._ro.disconnect(); this._ro = null; } }

    attributeChangedCallback(name, oldV, newV) {
      if (name === 'src' && newV && this.isConnected && !this._data && !this._manifest) this._loadSource(newV);
    }

    // Accepts either a single quiz object (has `regions`) or a manifest (`{ quizzes: [...] }`).
    set data(v) { this._ingest(v); }
    get data() { return this._data; }

    async _readJson(src) {
      if (src.startsWith('#')) {
        const el = (this.getRootNode().getElementById && this.getRootNode().getElementById(src.slice(1)))
          || document.getElementById(src.slice(1));
        if (!el) throw new Error('inline element "' + src + '" not found');
        return JSON.parse(el.textContent);
      }
      const res = await fetch(src);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }

    async _loadSource(src) {
      try { this._ingest(await this._readJson(src)); }
      catch (err) { this._message('Could not load quiz data (' + err.message + ').'); }
    }

    // Route a loaded object: a manifest shows the quiz picker; a single quiz goes to the mode picker.
    _ingest(obj) {
      if (obj && Array.isArray(obj.quizzes)) {
        this._manifest = obj; this._data = null;
        if (this.isConnected) this._renderQuizSelect();
      } else {
        this._data = this._normalise(obj); this._manifest = null;
        if (this.isConnected) this._renderStart();
      }
    }

    _normalise(d) {
      if (!d || !Array.isArray(d.regions)) throw new Error('invalid quiz data');
      return d;
    }

    _message(text) {
      if (this._root) this._root.innerHTML = `<p style="color:var(--mq-muted);text-align:center;padding:30px">${esc(text)}</p>`;
    }

    /* ---------------- QUIZ PICKER (landing) ---------------- */
    _renderQuizSelect() {
      this._stopTimer();
      this._root.dataset.screen = 'picker';
      const m = this._manifest;
      const title = this.getAttribute('heading') || m.title || 'Map quiz';
      const quizzes = m.quizzes || [];
      this._root.innerHTML = `
        <div class="start">
          <h2 part="heading">${esc(title)}</h2>
          <p>${esc(m.subtitle || 'Choose a quiz to begin.')}</p>
          <div class="modes">
            ${quizzes.map((qz, i) => `
              <button class="mode-card" part="card" data-i="${i}">
                <div class="ic">${esc(qz.icon || '🗺️')}</div>
                <b>${esc(qz.title || 'Quiz ' + (i + 1))}</b>
                ${qz.subtitle ? `<span>${esc(qz.subtitle)}</span>` : ''}
              </button>`).join('')}
          </div>
        </div>`;
      this._root.querySelectorAll('.mode-card').forEach((btn) =>
        btn.addEventListener('click', () => this._selectQuiz(+btn.dataset.i)));
    }

    async _selectQuiz(i) {
      const entry = (this._manifest.quizzes || [])[i];
      try {
        let data;
        if (entry && Array.isArray(entry.regions)) data = entry;          // full quiz inline in the manifest
        else if (entry && entry.data) data = entry.data;                  // { title, data: {...} }
        else if (entry && entry.src) data = await this._readJson(entry.src); // { title, src: "..." | "#id" }
        else throw new Error('quiz entry has no "regions", "data" or "src"');
        this._data = this._normalise(data);
        this._renderStart();
      } catch (err) {
        this._message('Could not load this quiz (' + err.message + ').');
      }
    }

    /* ---------------- START (mode picker) ---------------- */
    _renderStart() {
      this._stopTimer();
      const forced = this.getAttribute('mode');
      const title = this.getAttribute('heading') || this._data.title || 'Map quiz';
      const noun = this._data.prompt || 'region';
      const learnNoun = this._data.learnUnit || noun;
      const total = this._data.regions.length;
      const quizCount = this._quizRegions().length;
      const mixed = total > quizCount;
      if (forced === 'find' || forced === 'name' || forced === 'learn') { this._begin(forced); return; }

      this._root.dataset.screen = 'modes';
      this._root.innerHTML = `
        <div class="start">
          ${this._manifest ? `<button class="backlink" part="backlink" data-back>← All quizzes</button>` : ''}
          <h2 part="heading">${esc(title)}</h2>
          <p>${mixed
            ? `Explore all ${total} ${esc(plural(learnNoun))} in Learn mode, then test yourself on the ${quizCount} ${esc(plural(noun))}.`
            : `Test yourself on all ${quizCount} ${esc(plural(noun))}. Choose how you want to play.`}</p>
          <div class="modes">
            <button class="mode-card" part="card" data-mode="learn">
              <div class="ic">📖</div>
              <b>Learn the map</b>
              <span>Every ${esc(learnNoun)} labelled — hover or tap to focus one before you test yourself.</span>
            </button>
            <button class="mode-card" part="card" data-mode="find">
              <div class="ic">📍</div>
              <b>Find it on the map</b>
              <span>We name a ${esc(noun)} — you click it on the map.</span>
            </button>
            <button class="mode-card" part="card" data-mode="name">
              <div class="ic">🏷️</div>
              <b>Name the ${esc(noun)}</b>
              <span>We highlight a ${esc(noun)} — you pick its name from the list.</span>
            </button>
          </div>
        </div>`;
      this._root.querySelectorAll('.mode-card').forEach((b) =>
        b.addEventListener('click', () => this._begin(b.dataset.mode))
      );
      const back = this._root.querySelector('[data-back]');
      if (back) back.addEventListener('click', () => this._renderQuizSelect());
    }

    /* ---------------- PLAY ---------------- */
    _begin(mode) {
      if (mode === 'learn') { this._renderLearn(); return; }
      const regions = this._quizRegions();
      this._playRegions = regions;
      this._state = {
        mode,
        queue: shuffle(regions.map((r) => r.id)),
        solved: new Set(),
        mistakes: 0,
        firstTry: 0,
        targetMistakes: 0,
        start: performance.now(),
        current: null,
      };
      this._renderPlay();
      this._next();
      this._startTimer();
    }

    /* ---------------- LEARN ---------------- */
    _renderLearn() {
      this._stopTimer();
      this._root.dataset.screen = 'learn';
      const noun = this._data.learnUnit || this._data.prompt || 'region';
      const n = this._data.regions.length;
      const title = this.getAttribute('heading') || this._data.title || 'Map';
      const hint = `Hover or tap a ${noun}`;
      const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
      const catLabel = Object.assign({ district: 'federal district', territory: 'U.S. territory', microstate: 'microstate' }, this._data.categoryLabels || {});
      const desc = (id) => { const c = this._region(id).category; return c ? (catLabel[c] || c) : ''; };
      const hasContext = this._data.regions.some((r) => (r.category || 'state') !== 'state');
      const legendQuizzed = (this._data.legend && this._data.legend.quizzed) || cap(this._data.prompt || 'region');
      const legendContext = (this._data.legend && this._data.legend.context) || 'shown, not quizzed';
      const about = this._mapAbout();
      this._root.innerHTML = `
        <div class="hud">
          <div class="prompt">
            <div class="lead" part="kicker">Learning mode · ${n} ${esc(plural(noun))}</div>
            <div class="target" data-active>${esc(hint)}</div>
          </div>
          <div class="stats">
            <button class="btn primary" part="button button-primary" data-quiz>Test yourself →</button>
          </div>
        </div>
        <div class="layout">
          <div class="mapbox">
            <div class="zoom-ctl">
              <button type="button" part="zoom-button" data-zin aria-label="Zoom in">+</button>
              <button type="button" part="zoom-button" data-zout aria-label="Zoom out">&minus;</button>
              <button type="button" part="zoom-button" data-zreset aria-label="Reset zoom">⤢</button>
            </div>
            <div class="zoom-hint" data-hint></div>
            <svg class="map learn" part="map" viewBox="${esc(this._data.viewBox)}" role="group" aria-label="${esc(title)} map — every ${esc(noun)} labelled"></svg>
            ${about.btn}${about.dlg}
            <div class="callout" part="callout" data-callout role="status" aria-live="polite"></div>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn ghost" part="button button-secondary" data-quit>← Back to menu</button>
          ${hasContext ? `<span class="legend"><i class="sw sw-state"></i>${esc(legendQuizzed)}<i class="sw sw-other"></i>${esc(legendContext)} (shown, not quizzed)</span>` : ''}
        </div>`;

      const svg = this._root.querySelector('svg.map');
      const vp = document.createElementNS(SVGNS, 'g');
      vp.setAttribute('class', 'viewport');
      const dotLayer = document.createElementNS(SVGNS, 'g');
      const labelLayer = document.createElementNS(SVGNS, 'g');
      this._paths = {};
      this._labels = {};
      this._dots = {};
      this._lblBox = {};
      this._learnPinned = null;
      this._activeId = null;
      const head = this._root.querySelector('[data-active]');
      const setActive = (id) => {
        Object.values(this._paths).forEach((p) => p.classList.remove('active'));
        this._activeId = id || null;
        if (id) {
          this._paths[id].classList.add('active');
          const d = desc(id);
          head.textContent = this._region(id).name + (d ? ' · ' + d : '');
        } else {
          head.textContent = hint;
        }
        if (this._relayout) this._relayout(); // re-flow labels so the focused one always shows
      };

      // ---- selection callout (name + capital / county town) ----
      if (this._teardownCallout) { this._teardownCallout(); this._teardownCallout = null; }
      const capLabel = this._data.capitalLabel || 'Capital';
      const callout = this._root.querySelector('[data-callout]');
      const mapbox = this._root.querySelector('.mapbox');
      const positionCallout = (id) => {
        if (!callout.classList.contains('show') || !this._paths[id]) return;
        const pr = this._paths[id].getBoundingClientRect();
        const mr = mapbox.getBoundingClientRect();
        const cw = callout.offsetWidth, ch = callout.offsetHeight, pad = 8;
        let left = (pr.left + pr.width / 2 - mr.left) - cw / 2;
        left = Math.max(pad, Math.min(left, mr.width - cw - pad));
        let top = (pr.top - mr.top) - ch - 10;          // prefer above the region
        if (top < pad) top = (pr.bottom - mr.top) + 10; // flip below if no room
        top = Math.max(pad, Math.min(top, mr.height - ch - pad));
        callout.style.left = left + 'px';
        callout.style.top = top + 'px';
      };
      const onKey = (e) => { if (e.key === 'Escape' && this._learnPinned) { e.stopPropagation(); dismissCallout(); } };
      const onDocClick = (e) => {
        if (this._dragMoved) return;                     // ignore the click synthesised after a pan
        const path = e.composedPath ? e.composedPath() : [e.target];
        if (path.some((el) => el.classList && (el.classList.contains('region') || el.classList.contains('callout')))) return;
        dismissCallout();
      };
      let dismissBound = false;
      const bindDismiss = () => { if (dismissBound) return; dismissBound = true; window.addEventListener('keydown', onKey, true); window.addEventListener('click', onDocClick); };
      const unbindDismiss = () => { if (!dismissBound) return; dismissBound = false; window.removeEventListener('keydown', onKey, true); window.removeEventListener('click', onDocClick); };
      this._teardownCallout = unbindDismiss;
      const showCallout = (id) => {
        const r = this._region(id);
        const cat = r.category ? (catLabel[r.category] || r.category) : '';
        callout.innerHTML =
          `<div class="callout-name">${esc(r.name)}</div>` +
          (r.capital ? `<div class="callout-fact"><span class="k">${esc(capLabel)}</span> ${esc(r.capital)}</div>` : '') +
          (cat ? `<div class="callout-note">${esc(cat)}</div>` : '');
        callout.classList.add('show');
        positionCallout(id);
        this._repositionCallout = () => positionCallout(id);
        bindDismiss();
      };
      const dismissCallout = () => {
        this._learnPinned = null;
        setActive(null);
        callout.classList.remove('show');
        this._repositionCallout = null;
        unbindDismiss();
      };

      this._data.regions.forEach((r) => {
        const p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', r.path);
        p.setAttribute('class', (r.category || 'state') === 'state' ? 'region' : 'region noquiz');
        p.setAttribute('vector-effect', 'non-scaling-stroke');
        p.dataset.id = r.id;
        p.setAttribute('tabindex', '0');
        p.setAttribute('role', 'img');
        p.setAttribute('aria-label', r.name);
        p.addEventListener('mouseenter', () => { if (!this._learnPinned) setActive(r.id); });
        p.addEventListener('mouseleave', () => { if (!this._learnPinned) setActive(null); });
        p.addEventListener('focus', () => { if (!this._learnPinned) setActive(r.id); });
        p.addEventListener('blur', () => { if (!this._learnPinned) setActive(null); });
        p.addEventListener('click', () => {
          if (this._dragMoved) return;
          if (this._learnPinned === r.id) { dismissCallout(); }
          else { this._learnPinned = r.id; setActive(r.id); showCallout(r.id); }
        });
        p.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); }
        });
        vp.appendChild(p);
        this._paths[r.id] = p;

        const t = document.createElementNS(SVGNS, 'text');
        t.setAttribute('x', r.labelX);
        t.setAttribute('y', r.labelY);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'lbl show');
        t.textContent = r.short || r.name; // compact code on the map, full name in the header
        labelLayer.appendChild(t);
        this._labels[r.id] = t;

        const c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('r', 2.4);
        c.setAttribute('class', 'dot');
        dotLayer.appendChild(c);
        this._dots[r.id] = c;
      });
      svg.appendChild(vp);            // region shapes — scaled by zoom
      svg.appendChild(dotLayer);      // dot markers — constant size
      svg.appendChild(labelLayer);    // labels — constant size, repositioned on zoom

      // Rank regions by area so the bigger region keeps its label when two would collide.
      this._areaOrder = this._data.regions.slice().sort((a, b) => {
        const ba = this._paths[a.id].getBBox(), bb = this._paths[b.id].getBBox();
        return bb.width * bb.height - ba.width * ba.height;
      }).map((r) => r.id);

      // Labels track the map but render at a constant SCREEN size — independent of both the
      // zoom level and how wide the map is drawn (so they stay readable in a narrow panel).
      // Where two would overlap, the smaller region's label collapses to a hoverable dot;
      // zooming in spreads the anchors apart and reveals hidden labels automatically.
      this._layoutLabels = (s, tx, ty) => {
        const u = this._pxToUser || 1;                 // map user-units per screen pixel
        const baseFs = LABEL_PX * u, actFs = ACTIVE_PX * u, halo = HALO_PX * u, dotR = DOT_PX * u, pad = PAD_PX * u;
        const active = this._activeId;
        this._data.regions.forEach((r) => {
          const x = r.labelX * s + tx, y = r.labelY * s + ty;
          const l = this._labels[r.id];
          l.setAttribute('x', x); l.setAttribute('y', y);
          l.style.fontSize = (r.id === active ? actFs : baseFs) + 'px';
          l.style.strokeWidth = halo + 'px';
          const d = this._dots[r.id];
          d.setAttribute('cx', x); d.setAttribute('cy', y); d.setAttribute('r', dotR);
        });
        const order = active ? [active, ...this._areaOrder.filter((id) => id !== active)] : this._areaOrder;
        const placed = [];
        order.forEach((id) => {
          const l = this._labels[id];
          const bb = l.getBBox();                      // reflects the pixel size just set above
          const rect = { x: bb.x, y: bb.y, w: bb.width, h: bb.height };
          const forced = id === active;
          const clash = !forced && placed.some((q) =>
            !(rect.x + rect.w < q.x - pad || rect.x > q.x + q.w + pad || rect.y + rect.h < q.y - pad || rect.y > q.y + q.h + pad));
          if (clash) {
            l.classList.add('hidden');
            l.classList.remove('active');
            this._dots[id].classList.add('on');
          } else {
            l.classList.remove('hidden');
            this._dots[id].classList.remove('on');
            l.classList.toggle('active', forced);
            if (forced) labelLayer.appendChild(l); // raise the focused label above neighbours
            placed.push(rect);
          }
        });
      };
      this._enablePanZoom(svg, vp);

      this._root.querySelector('[data-quit]').addEventListener('click', () => this._renderStart());
      this._root.querySelector('[data-quiz]').addEventListener('click', () => this._renderStart());
      this._wireAbout();
    }

    _renderPlay() {
      const noun = this._data.prompt || 'region';
      const isName = this._state.mode === 'name';
      const about = this._mapAbout();
      this._repositionCallout = null; // no Learn callout on the quiz screens
      if (this._teardownCallout) { this._teardownCallout(); this._teardownCallout = null; }
      this._root.dataset.screen = 'play';
      this._root.innerHTML = `
        <div class="hud">
          <div class="prompt">
            <div class="lead" part="kicker">${isName ? `Which ${esc(noun)} is highlighted?` : `Find this ${esc(noun)}`}</div>
            <div class="target" data-target>—</div>
          </div>
          <div class="stats">
            <div class="stat" part="stat"><b part="stat-value" data-found>0</b><span part="stat-label">of ${this._playRegions.length}</span></div>
            <div class="stat" part="stat"><b part="stat-value" data-miss>0</b><span part="stat-label">misses</span></div>
            <div class="stat" part="stat"><b part="stat-value" data-time>0:00</b><span part="stat-label">time</span></div>
          </div>
        </div>
        <div class="toast toast-top" data-toast aria-live="polite"></div>
        <div class="bar"><i part="progress" data-progress></i></div>
        <div class="layout ${isName ? 'has-panel' : ''}">
          <div class="mapbox">
            <div class="zoom-ctl">
              <button type="button" part="zoom-button" data-zin aria-label="Zoom in">+</button>
              <button type="button" part="zoom-button" data-zout aria-label="Zoom out">&minus;</button>
              <button type="button" part="zoom-button" data-zreset aria-label="Reset zoom">⤢</button>
            </div>
            <div class="zoom-hint" data-hint></div>
            <svg class="map ${isName ? '' : 'pick'}" part="map" viewBox="${esc(this._data.viewBox)}" role="group" aria-label="${esc(this._data.title)} map"></svg>
            ${about.btn}${about.dlg}
          </div>
          ${isName ? `<div class="panel" part="panel"><h3 part="kicker">Remaining ${esc(plural(noun))}</h3><div class="options" data-options role="listbox" aria-label="Answer choices"></div></div>` : ''}
        </div>
        <div class="toolbar">
          <button class="btn ghost" part="button button-secondary" data-skip>Skip / reveal</button>
          <button class="btn ghost" part="button button-secondary" data-quit>Change mode</button>
        </div>`;

      // build the map
      const svg = this._root.querySelector('svg.map');
      const vp = document.createElementNS(SVGNS, 'g');
      vp.setAttribute('class', 'viewport');
      const labelLayer = document.createElementNS(SVGNS, 'g');
      this._paths = {};
      this._labels = {};
      this._playRegions.forEach((r) => {
        const p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', r.path);
        p.setAttribute('class', 'region');
        p.setAttribute('vector-effect', 'non-scaling-stroke');
        p.dataset.id = r.id;
        p.setAttribute('aria-label', r.name);
        if (!isName) {
          p.setAttribute('tabindex', '0');
          p.setAttribute('role', 'button');
          p.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._guessRegion(r.id); }
          });
        }
        p.addEventListener('click', () => { if (!isName && !this._dragMoved) this._guessRegion(r.id); });
        vp.appendChild(p);
        this._paths[r.id] = p;

        const t = document.createElementNS(SVGNS, 'text');
        t.setAttribute('x', r.labelX);
        t.setAttribute('y', r.labelY);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'lbl');
        t.textContent = r.name;
        labelLayer.appendChild(t);
        this._labels[r.id] = t;
      });
      svg.appendChild(vp);           // region shapes — scaled by zoom
      svg.appendChild(labelLayer);   // labels — follow the map but keep constant size
      this._layoutLabels = (s, tx, ty) => {
        const u = this._pxToUser || 1;
        const fs = LABEL_PX * u, halo = HALO_PX * u;
        this._playRegions.forEach((r) => {
          const t = this._labels[r.id];
          t.setAttribute('x', r.labelX * s + tx);
          t.setAttribute('y', r.labelY * s + ty);
          t.style.fontSize = fs + 'px';
          t.style.strokeWidth = halo + 'px';
        });
      };
      this._enablePanZoom(svg, vp);

      this._els = {
        target: this._root.querySelector('[data-target]'),
        found: this._root.querySelector('[data-found]'),
        miss: this._root.querySelector('[data-miss]'),
        time: this._root.querySelector('[data-time]'),
        progress: this._root.querySelector('[data-progress]'),
        toast: this._root.querySelector('[data-toast]'),
        options: this._root.querySelector('[data-options]'),
      };
      this._root.querySelector('[data-skip]').addEventListener('click', () => this._reveal());
      this._root.querySelector('[data-quit]').addEventListener('click', () => this._renderStart());
      this._wireAbout();
      if (isName) this._renderOptions();
    }

    _renderOptions() {
      const box = this._els.options;
      box.innerHTML = '';
      // remaining = every region not yet solved, alphabetical for scannability
      const remaining = this._playRegions
        .filter((r) => !this._state.solved.has(r.id))
        .sort((a, b) => a.name.localeCompare(b.name));
      remaining.forEach((r) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.setAttribute('part', 'option');
        b.textContent = r.name;
        b.dataset.id = r.id;
        b.setAttribute('role', 'option');
        b.addEventListener('click', () => this._guessName(r.id, b));
        box.appendChild(b);
      });
    }

    _next() {
      const st = this._state;
      if (!st.queue.length) return this._finish();
      st.current = st.queue[0];
      st.targetMistakes = 0;
      const r = this._region(st.current);
      if (st.mode === 'name') {
        // clear previous target styling, highlight current
        Object.values(this._paths).forEach((p) => p.classList.remove('target'));
        this._paths[st.current].classList.add('target');
        this._els.target.textContent = '—';
      } else {
        this._els.target.textContent = r.name;
      }
      this._setToast('', '');
    }

    _guessRegion(id) {
      const st = this._state;
      if (!st.current || st.solved.has(id)) return;
      if (id === st.current) return this._correct();
      // wrong
      st.mistakes++; st.targetMistakes++;
      const p = this._paths[id];
      p.classList.add('wrong');
      setTimeout(() => p.classList.remove('wrong'), 550);
      this._updateStats();
      this._setToast(`Not quite — that's ${this._region(id).name}.`, 'bad');
    }

    _guessName(id, btn) {
      const st = this._state;
      if (!st.current) return;
      if (id === st.current) return this._correct();
      st.mistakes++; st.targetMistakes++;
      btn.classList.add('wrong');
      setTimeout(() => btn.classList.remove('wrong'), 550);
      this._updateStats();
      this._setToast('Try again.', 'bad');
    }

    _correct() {
      const st = this._state;
      const id = st.current;
      st.solved.add(id);
      st.queue.shift();
      if (st.targetMistakes === 0) st.firstTry++;
      const p = this._paths[id];
      p.classList.remove('target', 'wrong');
      p.classList.add('solved');
      p.removeAttribute('tabindex');
      this._labels[id].classList.add('show');
      if (st.mode === 'name') {
        const btn = this._els.options.querySelector(`[data-id="${CSS.escape(id)}"]`);
        if (btn) btn.remove();
      }
      this._updateStats();
      this._setToast(`Correct — ${this._region(id).name}! ✓`, 'good');
      this._next();
    }

    _reveal() {
      const st = this._state;
      if (!st.current) return;
      const id = st.current;
      st.solved.add(id);
      st.queue.shift();
      const p = this._paths[id];
      p.classList.remove('target');
      p.classList.add('solved');
      p.removeAttribute('tabindex');
      this._labels[id].classList.add('show');
      // flash to draw the eye
      p.animate?.([{ opacity: .35 }, { opacity: 1 }], { duration: 500 });
      if (st.mode === 'name') {
        const btn = this._els.options.querySelector(`[data-id="${CSS.escape(id)}"]`);
        if (btn) btn.remove();
      }
      this._setToast(`That was ${this._region(id).name}.`, '');
      this._updateStats();
      this._next();
    }

    _finish() {
      this._stopTimer();
      this._root.dataset.screen = 'done';
      const st = this._state;
      const total = this._playRegions.length;
      const elapsed = performance.now() - st.start;
      const acc = Math.round((st.firstTry / total) * 100);
      this._root.innerHTML = `
        <div class="done">
          <div class="big">${acc >= 90 ? '🏆' : acc >= 60 ? '🎉' : '🗺️'}</div>
          <h2 part="heading">${esc(this._data.title)} — complete!</h2>
          <div class="scorecard">
            <div class="s" part="stat"><b part="stat-value">${st.firstTry}/${total}</b><span part="stat-label">first try</span></div>
            <div class="s" part="stat"><b part="stat-value">${acc}%</b><span part="stat-label">accuracy</span></div>
            <div class="s" part="stat"><b part="stat-value">${st.mistakes}</b><span part="stat-label">total misses</span></div>
            <div class="s" part="stat"><b part="stat-value">${fmtTime(elapsed)}</b><span part="stat-label">time</span></div>
          </div>
          <div class="toolbar" style="justify-content:center">
            <button class="btn primary" part="button button-primary" data-again>Play again</button>
            <button class="btn ghost" part="button button-secondary" data-modes>Change mode</button>
          </div>
        </div>`;
      this._root.querySelector('[data-again]').addEventListener('click', () => this._begin(st.mode));
      this._root.querySelector('[data-modes]').addEventListener('click', () => this._renderStart());
      this.dispatchEvent(new CustomEvent('quizcomplete', {
        bubbles: true, composed: true,
        detail: { mode: st.mode, total, firstTry: st.firstTry, mistakes: st.mistakes, accuracy: acc, ms: Math.round(elapsed) },
      }));
    }

    /* ---------------- pan & zoom ---------------- */
    _enablePanZoom(svg, vp) {
      const vb = svg.viewBox.baseVal;
      const W = vb.width, H = vb.height;
      const MIN = 1, MAX = 14;
      const st = { s: 1, tx: 0, ty: 0 };
      this._zoom = st;
      this._dragMoved = false;
      const q = (sel) => this._root.querySelector(sel);
      const zin = q('[data-zin]'), zout = q('[data-zout]'), zreset = q('[data-zreset]');

      const clampPan = () => {
        st.tx = Math.min(0, Math.max(W * (1 - st.s), st.tx));
        st.ty = Math.min(0, Math.max(H * (1 - st.s), st.ty));
      };
      const apply = () => {
        clampPan();
        vp.setAttribute('transform', `translate(${st.tx} ${st.ty}) scale(${st.s})`);
        svg.classList.toggle('zoomed', st.s > 1.001);
        if (zout) zout.disabled = st.s <= MIN + 1e-3;
        if (zin) zin.disabled = st.s >= MAX - 1e-3;
        // map units per screen pixel — use the binding axis so labels stay a constant
        // screen size even when the map is letterboxed to fit the viewport height.
        const r = svg.getBoundingClientRect();
        const scale = Math.min(r.width / W || 0, r.height / H || 0) || (r.width / W) || 1;
        this._pxToUser = scale ? 1 / scale : 1;
        if (this._layoutLabels) this._layoutLabels(st.s, st.tx, st.ty); // labels follow but keep a constant screen size
        this._syncPanelHeight(r.height);
        if (this._repositionCallout) this._repositionCallout(); // keep the Learn callout anchored on pan/zoom
      };
      this._relayout = () => { if (this._layoutLabels) this._layoutLabels(st.s, st.tx, st.ty); };
      const toVB = (cx, cy) => {
        const ctm = svg.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };
        const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
        return pt.matrixTransform(ctm.inverse());
      };
      const zoomAt = (factor, cx, cy) => {
        const ns = Math.min(MAX, Math.max(MIN, st.s * factor));
        const f = ns / st.s;
        st.tx = cx - (cx - st.tx) * f;
        st.ty = cy - (cy - st.ty) * f;
        st.s = ns;
        apply();
      };
      this._resetZoom = () => { st.s = 1; st.tx = 0; st.ty = 0; apply(); };

      // Wheel zoom is gated behind a modifier so a plain scroll still moves the PAGE
      // (an embedded map must never trap the wheel). ⌘/Ctrl + wheel zooms; a plain wheel
      // over the map scrolls the page and shows a brief hint on how to zoom.
      const hintEl = q('[data-hint]');
      const isMac = /Mac|iPhone|iPad|iPod/.test((navigator.platform || navigator.userAgent || ''));
      if (hintEl) hintEl.textContent = `Use ${isMac ? '⌘' : 'Ctrl'} + scroll to zoom`;
      let hintTimer = null;
      const showHint = () => {
        if (!hintEl) return;
        hintEl.classList.add('show');
        if (hintTimer) clearTimeout(hintTimer);
        hintTimer = setTimeout(() => hintEl.classList.remove('show'), 1300);
      };
      svg.addEventListener('wheel', (e) => {
        if (!(e.ctrlKey || e.metaKey)) { showHint(); return; } // let the page scroll
        e.preventDefault();
        const p = toVB(e.clientX, e.clientY);
        zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, p.x, p.y);
      }, { passive: false });

      const pointers = new Map();
      let last = null, pinchDist = 0, downX = 0, downY = 0;
      svg.addEventListener('pointerdown', (e) => {
        // Do NOT capture the pointer on a plain press: pointer capture retargets the
        // follow-up `click` to the <svg>, so a region's own click never fires. Capture
        // only once a drag or pinch actually begins (see pointermove).
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        this._dragMoved = false;
        downX = e.clientX; downY = e.clientY;
        if (pointers.size === 1) last = toVB(e.clientX, e.clientY);
        else if (pointers.size === 2) {
          const p = [...pointers.values()];
          pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
          pointers.forEach((_, id) => { try { svg.setPointerCapture(id); } catch (_) {} });
        }
      });
      svg.addEventListener('pointermove', (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size >= 2) {
          const p = [...pointers.values()];
          const dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
          if (pinchDist > 0) {
            const mid = toVB((p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2);
            zoomAt(dist / pinchDist, mid.x, mid.y);
          }
          pinchDist = dist;
          this._dragMoved = true;
          return;
        }
        if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 4) {
          this._dragMoved = true;
          // now that it's really a drag, capture so panning continues off the element
          try { if (!svg.hasPointerCapture(e.pointerId)) svg.setPointerCapture(e.pointerId); } catch (_) {}
        }
        if (st.s <= 1) return;
        const p = toVB(e.clientX, e.clientY);
        if (last) { st.tx += p.x - last.x; st.ty += p.y - last.y; apply(); }
        last = toVB(e.clientX, e.clientY);
        svg.classList.add('grabbing');
      });
      const end = (e) => {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) pinchDist = 0;
        if (pointers.size === 0) {
          last = null; svg.classList.remove('grabbing');
          setTimeout(() => { this._dragMoved = false; }, 0);
        } else {
          const p = [...pointers.values()][0]; last = toVB(p.x, p.y);
        }
      };
      svg.addEventListener('pointerup', end);
      svg.addEventListener('pointercancel', end);

      if (zin) zin.addEventListener('click', () => zoomAt(1.4, W / 2, H / 2));
      if (zout) zout.addEventListener('click', () => zoomAt(1 / 1.4, W / 2, H / 2));
      if (zreset) zreset.addEventListener('click', () => this._resetZoom());

      // Re-flow labels when the map is resized (e.g. the panel narrows) so their
      // constant screen size is recomputed and the declutter re-runs for the new width.
      if (this._ro) this._ro.disconnect();
      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(() => apply());
        this._ro.observe(svg);
      }

      apply();
    }

    // Name mode: when the answer list sits beside the map (two-column layout), cap the
    // list to the map's rendered height (map card outer height minus the panel heading)
    // so its bottom lines up with the map instead of overrunning it. In the stacked
    // single-column layout, clear the cap and let the CSS fallback bound it.
    _syncPanelHeight(svgH) {
      const opts = this._root.querySelector('[data-options]');
      if (!opts) return;
      const layout = this._root.querySelector('.layout');
      const panel = this._root.querySelector('.panel');
      const mapbox = this._root.querySelector('.mapbox');
      const twoCol = layout && getComputedStyle(layout).gridTemplateColumns.split(' ').length > 1;
      if (twoCol && svgH > 0 && mapbox && panel) {
        const cs = getComputedStyle(mapbox);
        const extra = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) +
                      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        const mapOuter = svgH + (extra || 0);
        // space the heading (and its margin) takes above the list, within the panel
        const headingOffset = opts.getBoundingClientRect().top - panel.getBoundingClientRect().top;
        opts.style.maxHeight = Math.max(80, mapOuter - headingOffset) + 'px';
      } else {
        opts.style.maxHeight = '';
      }
    }

    // "About the data" affordance: a small button in the map's bottom-right corner that
    // opens a dialog explaining where the geometry came from and noting disputed borders.
    // Content is per-quiz via the data's `about` (paragraphs) and `sources` ({label,url}).
    _mapAbout() {
      const d = this._data || {};
      const about = Array.isArray(d.about) ? d.about : (d.about ? [d.about] : []);
      const sources = Array.isArray(d.sources) ? d.sources : [];
      if (!about.length && !sources.length) return { btn: '', dlg: '' };
      const btn = `<button type="button" class="map-about" part="about-button" data-about aria-label="About this map's data"><span class="ic" aria-hidden="true">ⓘ</span> About the data</button>`;
      const paras = about.map((p) => `<p>${esc(p)}</p>`).join('');
      const src = sources.length
        ? `<p class="src">Source${sources.length > 1 ? 's' : ''}: ${sources.map((s) => s && s.url
            ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label || s.url)}</a>`
            : esc((s && s.label) || '')).join(' · ')}</p>`
        : '';
      const dlg = `<dialog class="about-dlg" part="dialog" data-about-dlg aria-label="About this map">
        <div class="dlg-in">
          <button type="button" class="dlg-close" part="dialog-close" data-about-close aria-label="Close">✕</button>
          <h3 part="heading">About this map</h3>
          ${paras}${src}
        </div>
      </dialog>`;
      return { btn, dlg };
    }
    _wireAbout() {
      const open = this._root.querySelector('[data-about]');
      const dlg = this._root.querySelector('[data-about-dlg]');
      if (!open || !dlg) return;
      open.addEventListener('click', () => {
        if (typeof dlg.showModal === 'function') { try { dlg.showModal(); return; } catch (_) {} }
        dlg.setAttribute('open', ''); // fallback for browsers without <dialog>
      });
      const close = this._root.querySelector('[data-about-close]');
      if (close) close.addEventListener('click', () => { dlg.open && dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
      // click on the backdrop (the dialog element itself, outside .dlg-in) closes it
      dlg.addEventListener('click', (e) => { if (e.target === dlg && dlg.close) dlg.close(); });
    }

    /* ---------------- helpers ---------------- */
    _region(id) { return this._data.regions.find((r) => r.id === id); }
    // regions that count for the quiz — anything not flagged as a different category.
    // A region with category "district" / "territory" (or quiz:false) is Learn-only.
    _quizRegions() { return this._data.regions.filter((r) => r.quiz !== false && (r.category || 'state') === 'state'); }
    _setToast(msg, kind) { const t = this._els.toast; t.textContent = msg; t.classList.remove('good', 'bad'); if (kind) t.classList.add(kind); }
    _updateStats() {
      const st = this._state, total = this._data.regions.length;
      this._els.found.textContent = st.solved.size;
      this._els.miss.textContent = st.mistakes;
      this._els.progress.style.width = (st.solved.size / total) * 100 + '%';
    }
    _startTimer() {
      this._stopTimer();
      this._timer = setInterval(() => {
        if (this._els && this._els.time) this._els.time.textContent = fmtTime(performance.now() - this._state.start);
      }, 500);
    }
    _stopTimer() { if (this._timer) { clearInterval(this._timer); this._timer = null; } }
  }

  customElements.define('map-quiz', MapQuiz);
})();
