---
layout: layouts/post.liquid
tags: post
short: primitive token generator
title: "How I stopped setting up design tokens by hand"
subtitle: "A Figma plugin that handles the primitive layer you always end up building before the real work starts."
date: 2026-07-23
reading: "4 min read"
topics: ["design-tokens", "figma", "tools", "ai"]
toc:
  - { id: "s1", label: "The primitive layer is always first" }
  - { id: "s2", label: "What it actually does" }
  - { id: "s3", label: "Building it with Claude" }
  - { id: "s4", label: "Where things stand" }
related:
  - { url: "/wrote-about/naming-things-is-hard/", title: "Naming things is hard" }
  - { url: "/wrote-about/design-token-documentation/", title: "Design token documentation" }
  - { url: "/writing/", title: "More writing" }
---

Every design systems project I've worked on starts the same way. Before any real work can happen, someone has to build the primitive token layer: color ramps, spacing scales, type size scales, all of it. It's mechanical. It's not particularly interesting. And it takes time to do properly.

So I built a Figma plugin to handle it. And since I wanted to see what working with Claude end-to-end actually looked like, I built almost all of it that way.

The result is **Primitive Token Generator**, a plugin that generates five categories of tokens (Color, Typography, Spacing, Border Radius, and Elevation) from a handful of inputs and exports them directly as Figma variables.

![The plugin UI alongside the generated canvas documentation in Figma](/uploads/ptg-hero.png)

## The primitive layer is always first

The semantic layer (`color/action/default`, `size/body/default`) is where the interesting decisions happen. But you can't build it until the primitives underneath it exist. And primitives are, by design, boring to produce.

You need color ramps that are perceptually uniform. A type scale that makes sense. A spacing system. All of it named consistently and sitting in Figma as variables before the semantic layer can reference any of it. Not hard, just slow and fiddly to do by hand, and easy to get subtly wrong in ways that only show up later.

This plugin takes care of that part.

## What it actually does

Five tabs, one per token category. Each one follows the same pattern: the one or two inputs you need for a sensible result at the top, everything else collapsed into an Advanced Settings panel. Generate, preview, move on. All the export happens in a single footer: one button, regardless of which tab you're on.

### Color

Generates ramps using OKLCH, which matters because it's why the stops actually look evenly spaced to the eye. Older approaches in sRGB or HSL never quite managed that. Drop in a seed hex, the plugin derives endpoints and fills in the stops with a bezier curve you can reshape. It opens with four pre-generated defaults (blue, green, red, neutral) so there's something to look at straight away.

![The color tab showing the ramp list, seed color input, and the stop preview strip](/uploads/ptg-colors.png)

### Typography

Covers font families, font sizes, and line heights. Sizes use a ratio scale anchored to a base value (Minor Second, Major Third, Perfect Fourth) and export as integer px values. Font family inputs get autocomplete from whatever fonts are available in your current Figma file. Everything exports under a `font/` group in the variables panel. The advanced panel lets you reshape the curve for each sub-scale independently.

![The Line Height sub-tab with the advanced bezier curve editor open](/uploads/ptg-typography-advanced.png)

### Spacing and Radius

Both work from a base value with a scale type: linear, geometric, or a t-shirt hybrid for spacing. Individual stops can be adjusted in a table after generation if something needs nudging.

![The spacing tab showing the base unit input and visual tile preview](/uploads/ptg-spacing.png)

### Elevation

The odd one out, because Figma variables don't support shadow effects. The plugin generates five levels of algorithmically-scaled shadow stacks and exports them as Effect Styles. Level 0 is flat; it gets progressively deeper from there.

After export, there's an option to generate a visual documentation page in Figma: swatches, type specimens, spacing tiles, all bound to the variables that were just created. Useful to have around while you're building the semantic layer on top.

## Building it with Claude

I used Claude through the Cowork desktop app as the development partner throughout the build. The plugin is vanilla JS, HTML, and CSS (no build tooling), and the whole thing was written iteratively across a series of sessions.

It's closer to pairing than prompting. I'd write out what I wanted in a spec, we'd implement it, something would be slightly off, I'd describe what was wrong, and we'd fix it. The OKLCH color math, the bezier curve editor, the canvas documentation generation. I wouldn't have had those working as quickly on my own.

One thing I didn't expect: having to describe the behavior precisely enough for Claude to implement it made me catch ambiguities I'd glossed over when I was just thinking about the design. The spec file went through several rounds of updates as decisions got made during implementation. Useful side effect.

> Having to describe behavior precisely enough to implement it made me catch ambiguities I'd glossed over when I was just thinking about the design.

## Where things stand

The plugin is working and I'm using it on live projects. It's loadable as a development plugin directly from the manifest, not in the Figma Community yet, but that's the next step.

Version 2 scope, roughly: a semantic token layer builder on top of the primitives, multi-mode variable support for light/dark and density, maybe Google Fonts integration for the font family picker.

If you're curious about trying it, [get in touch](mailto:dan.danowski@gmail.com).
