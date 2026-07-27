---
layout: layouts/post.liquid
tags: draft
permalink: false
short: map quiz
title: "A map quiz for the two countries I live between"
subtitle: "A web component that quizzes you on regions of a map. Partly a geography project, partly an excuse to learn something new."
date: 2026-07-24
reading: "5 min read"
topics: ["web-components", "maps", "tools", "ai", "learning"]
toc:
  - { id: "s1", label: "The actual reason" }
  - { id: "s2", label: "What it does" }
  - { id: "s3", label: "How it's built" }
  - { id: "s4", label: "Building it with Claude" }
  - { id: "s5", label: "Where it stands" }
related:
  - { url: "/lab/map-quiz/", title: "Try the quiz" }
  - { url: "/wrote-about/a-primitive-token-generator-for-figma/", title: "Primitive Token Generator" }
  - { url: "/writing/", title: "More writing" }
---

I've lived in Northern Ireland for 17 years. You'd think that'd be enough time to learn where all 32 counties are. It is not.

I'm also American, and my geography there isn't much more impressive. I can do the big ones — Texas, California, the Florida peninsula. But point to Delaware on a blank map and I'll probably gesture somewhere vaguely in the direction of the northeast coast and hope for the best.

So I built a map quiz. Not a particularly original idea, but I wanted mine to be embeddable, maintainable without a build pipeline, and actually fun to use. The result is `<map-quiz>`: one JS file, no dependencies, three modes, and maps of Ireland, the US, and Europe.

## The actual reason

It started as a personal project in the most literal sense. I wanted to learn both maps — the country I'm from and the country I live in — and nothing I found online was quite what I wanted. Most are Flash-era in spirit if not in technology.

But it also became a project *about* learning. I wanted to properly understand what web components can do in 2026, without the ceremony of a framework. Shadow DOM, CSS custom properties, `::part()` for theming, zero build tooling. The constraint was a useful one: if it couldn't be done in a plain `<script>` tag, it didn't belong here.

Ending up with three maps in the component wasn't really planned. Ireland was obvious. The US felt necessary for the same reasons. Europe came along because the SVG projection work was already done and it seemed wasteful not to.

## What it does

Three modes. *Learn the map* labels every region and lets you hover or tap to focus; click to pin a callout with the region's name and capital (or county town). *Find it on the map* names a region and you click the right one on the map. *Name the region* highlights a region and you pick its name from a shrinking list of everything left to guess.

The quiz modes track first-try accuracy, total misses, and time, with a results screen at the end. Both are honest about when you go wrong.

The map is zoomable and pannable throughout, which matters more than it sounds. The northeastern US states are genuinely tiny at full view — being able to hold ⌘ and scroll into the corner where Rhode Island, Connecticut, and Massachusetts are competing for the same pixels is what makes those modes actually playable. Regular scrolling passes straight through to the page; the component only intercepts scroll when you're holding the modifier key.

For the US and Europe quizzes, Learn mode shows more than the quiz tests. D.C. and the five inhabited territories are shown and labelled in Learn mode but left out of the quiz — same for the six European microstates (Monaco, San Marino, and the rest, which are sub-pixel at map scale and rendered as positioned markers rather than outlines). They show up differently, with a legend, so it's clear what's quizzed and what's just context.

If you point the component at a manifest file, it shows a quiz picker. Point it at a single quiz file and it skips to the mode picker. Either way, everything's self-contained.

## How it's built

One JS file, no `import`/`export`, no build step — it works from a `<script>` tag or a module, dropped directly into any page. The map is SVG: each region is a `<path>` whose geometry is already projected into the viewBox coordinate space in the data file. Labels sit at precalculated coordinates, stay a constant size as you zoom (so zooming into a crowded area reveals labels rather than ballooning them), and collapse to a dot on small regions where the full name won't fit at the default zoom level.

Quiz data is JSON: a `viewBox`, a `prompt` string, and a `regions` array where each entry has an SVG path, label coordinates, an optional `capital` for the Learn-mode callout, and an optional `category` field to mark context-only regions. Adding a new quiz means converting a GeoJSON file with the bundled tool and pointing the component at the result — nothing in the component knows anything about Ireland or the US specifically.

Theming goes through CSS custom properties for colors, radius, and font stack, plus `::part()` selectors for element-level overrides. Shadow DOM means the component's styles don't leak out and your page styles don't leak in — which makes it genuinely embeddable without worrying about cascade conflicts.

The Ireland data took a bit of work to get right. The Republic's counties come from GADM boundaries; Northern Ireland's six historic counties had to be reconstructed by dissolving district boundaries from a different dataset. The internal lines near Belfast are slightly approximate as a result, but the county set, outlines, and overall shapes are correct.

## Building it with Claude

Same approach as the Figma plugin: I used Claude through the Cowork desktop app as the development partner throughout the build. Vanilla JS, built iteratively, each session picking up from the last.

The SVG pan/zoom implementation and the projection work for the US insets (Alaska and Hawaii in the Albers USA projection, the territories placed as separate insets) were the parts I was least confident about tackling on my own. Both came together well.

What's interesting about building something like this with Claude versus a typical design-systems tool is how much the constraint-articulation matters. With the Figma plugin, I was describing UI behavior — what happens when you click, what the preview should look like. With this, I was describing spatial and mathematical constraints: how should the map stay centered on the cursor while zooming, when should the pan bounds clamp, should labels scale with zoom or hold a constant size. Having to answer those questions precisely, rather than leaving them for later, meant the decisions were made before they could become bugs.

## Where it stands

It's live in the lab — [try it here](/lab/map-quiz/). The three bundled quizzes are working. I now know where Fermanagh is, and I've stopped confusing Delaware with Rhode Island.

What's rougher: touch zoom could be smoother, and the Name mode answer list gets long with larger quizzes. Whether those get fixed depends on whether I keep using it, which is honestly the best test for whether a personal project was worth building at all.

For now, it works. That's enough.
