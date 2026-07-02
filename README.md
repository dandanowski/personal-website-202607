# Dan Danowski — Portfolio (Eleventy)

Static site built with [Eleventy (11ty)](https://www.11ty.dev/) and **Liquid** templates.
No backend, no database — it builds to plain HTML/CSS you can host anywhere
(Netlify, GitHub Pages, Cloudflare Pages, S3, any shared host).

## Run it

```bash
npm install
npm start          # dev server with live reload at http://localhost:8080
npm run build      # production build into _site/
```

Deploy the generated `_site/` folder.

## Structure

```
src/
  _data/site.json            Global site data (name, email, links, year)
  _includes/
    layouts/base.liquid      <head>, header, footer, theme bootstrap
    layouts/case.liquid      Case-study chrome (title, meta strip, next nav)
    layouts/post.liquid      Blog-post chrome (header + sticky TOC sidebar)
    partials/header.liquid   Sticky nav + theme toggle
    partials/footer.liquid   Footer bar
  css/index.css              All styles. Tokens in :root; dark theme overrides.
  assets/js/theme.js         Light/dark toggle (persists to localStorage)
  uploads/                   Images (case-study screenshots)
  index.html                 Home
  writing.html               Blog index
  work/*.md                  Case studies   -> /work/<slug>/
  wrote-about/*.md           Blog posts     -> /wrote-about/<slug>/
```

## Add a case study

Create `src/work/<slug>.md`. Front matter drives the chrome; the body is the
content (plain HTML using the helper classes in `index.css` — `.case-sec`,
`.tiers`, `.pipe`, `.trio`, `.demos`, `.otable`, `blockquote.pull`).

```yaml
---
layout: layouts/case.liquid
tags: case
group: ds            # "ds" = main work list, "craft" = secondary section
order: 4             # controls ordering in the work list
short: my-case       # breadcrumb label
title: "…"
kicker: "…"
lede: "…"
meta:                # the 4-column spec strip (mono: "mono" for monospace value)
  - { label: "ROLE", value: "…" }
card:                # how it appears on the home page work list
  n: "04"
  kicker: "…"
  title: "…"
  blurb: "…"
  metric: "…"        # omit for craft cards
  role: "…"
next: { label: "next case", title: "…", url: "/work/next/" }
---
```

## Add a blog post

Create `src/wrote-about/<slug>.md` with `layout: layouts/post.liquid` and
`tags: post`. Set `subtitle`, `date`, `reading`, `tags_display`, `toc`
(jump-links — give each `<h2>` a matching `id`), and `related`. Write the body
as HTML so heading `id`s are explicit.

## Dark mode

The whole palette lives as CSS custom properties in `:root`. The dark theme is
just an override block — `:root[data-theme="dark"] { … }`. The toggle in the
header flips `data-theme` on `<html>` and saves the choice; first-time visitors
get their OS preference (`prefers-color-scheme`). A tiny inline script in
`base.liquid` applies the saved theme before first paint to avoid a flash.

## The "blockframe" illustrations

The token-tier tables, pipelines, the nested-team tree and the token-anatomy
diagram are **HTML + CSS**, not images — so they stay sharp at any zoom, the
text is selectable, and they recolour automatically in dark mode. They can be
edited directly in the `.md` bodies.

## Responsiveness

Layouts use CSS grid with breakpoints at 920px and 640px (see the bottom of
`index.css`) — multi-column grids collapse to single column and the sidebar
de-stickies on small screens.

## Notes

- The Northwest Vipers case shows the legacy-site screenshots. Drop a screenshot
  of the rebuilt site into `src/uploads/` and add an "after" figure when ready.
- Fonts: Archivo + IBM Plex Mono, loaded from Google Fonts in `base.liquid`.
