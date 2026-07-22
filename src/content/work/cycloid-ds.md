---
layout: layouts/case.liquid
tags: case
group: ds
order: 1
short: cycloid
topics: ["design-tokens", "design-system", "ai", "pipeline"]
title: "Machine-readable token architecture & an AI sync pipeline"
kicker: "design system · ai-assisted pipeline"
lede: "A three-tier token model with naming built for machine readability, and a Figma → StyleDictionary → code pipeline built with Claude to keep design, code, and documentation in sync."
meta:
  - { label: "ROLE", value: "Senior Product Designer" }
  - { label: "SCOPE", value: "Token architecture, Figma/code sync" }
  - { label: "STACK", value: "Figma Variables · StyleDictionary · VueJS · Histoire · Claude", mono: "mono" }
  - { label: "PERIOD", value: "Oct 2025 – Apr 2026" }
card:
  n: "01"
  kicker: "design system · ai-assisted pipeline"
  title: "Machine-readable token architecture & an AI sync pipeline"
  blurb: "A three-tier token model with naming built for machine readability, plus a Figma → StyleDictionary → code pipeline built with Claude to keep design, code, and docs in sync."
  metric: "Pipeline rebuilt in under 2 weeks"
  role: "Senior Product Designer"
next:
  label: "next case — 02"
  title: "One token architecture across 60+ brands"
  url: "/work/atolls-ds/"
---
{% include "partials/bf-cycloid.liquid" %}

<div class="case-sec"><div class="si">01 / the problem</div><div class="case-body">
<p>Cycloid was built on the Vuetify component library with a token structure that had drifted out of sync between design and engineering. Developers were reaching for primitive-level tokens or hard-coded values throughout the codebase, which made the system inflexible.</p>
<p class="muted">The immediate consequence: shipping a dark-mode toggle wasn't feasible without significant rework. That was the symptom — the cause was structural.</p>
</div></div>

<div class="case-sec"><div class="si">02 / token architecture</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>I built a three-tier token structure so any developer could tell where a token belongs from its name alone — no need to interpret design intent.</p></div>
<div class="tiers"><div class="t"><div class="tl"><div class="lab">TIER 1</div><div class="nm">Primitive</div></div><div class="tr"><span class="d">Raw values — colours, spacing, radii.</span><code>--blue-600: #2E51FF</code></div></div><div class="t"><div class="tl"><div class="lab">TIER 2</div><div class="nm">Semantic</div></div><div class="tr"><span class="d">Usage-context aliases, mapped from primitives.</span><code>--bg-accent-emphasized → --blue-600</code></div></div><div class="t"><div class="tl"><div class="lab">TIER 3</div><div class="nm">Component</div></div><div class="tr"><span class="d">Component-scoped tokens, mapped from semantic. One update propagates everywhere.</span><code>--card-bg → --bg-accent-emphasized</code></div></div></div>
<div style="max-width:64ch"><h3>Choosing the naming convention</h3><p class="muted">I evaluated <strong>Material Design v3</strong> first and rejected it — the vocabulary didn't suit the application. I adopted <strong>Chakra UI</strong>'s approach as the basis: organised by usage context (foreground, background, border) rather than brand-colour roles. I extended it with variants — emphasized, primary, secondary — and three tonal steps per colour: main, muted, subtle. The name carries the intent.</p></div>
</div></div>

<div class="case-sec"><div class="si">03 / ai-assisted pipeline</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>With the structure in place, I built an AI-assisted pipeline to keep three sources of truth in sync. Claude built the tooling; once running, the pipeline operates as part of the normal build with no AI involvement.</p></div>
<div class="pipe"><div class="flow"><div class="node"><div class="nl">SOURCE</div><div class="nv">Figma Variables</div></div><span class="arr">&rarr;</span><div class="node hot"><div class="nl">TRANSFORM</div><div class="nv">StyleDictionary</div></div><span class="arr">&rarr;</span><div class="node"><div class="nl">OUTPUT</div><div class="nv">VueJS · Histoire</div></div></div><div class="note">built with Claude: StyleDictionary transforms + a custom Figma plugin to keep Variables in sync with the pipeline</div></div>
<blockquote class="pull"><p>I'd built the equivalent pipeline manually in a previous role. With Claude, this version shipped in under two weeks — a concrete baseline for what AI-augmented delivery actually buys you.</p></blockquote>
</div></div>

<div class="case-sec"><div class="si">04 / outcome</div><div class="case-body">
<p>The token architecture and pipeline shipped and were welcomed by the team. Dark mode itself didn't ship during the contract: turning it on required application-wide component refactoring to ensure consistent token usage throughout the codebase.</p>
<p class="muted">That work was scoped, accepted, and placed on the product backlog and roadmap before the contract ended. Foundation delivered, remaining work handed off clearly — not left implied.</p>
</div></div>

<div class="case-sec demos-sec" style="border-bottom:0"><div class="si">what this<br>demonstrates</div><div class="case-body" style="max-width:none"><div class="demos"><div><div class="a">&rarr;</div><p>Hands-on token architecture: tiers, naming conventions, component-token mapping.</p></div><div><div class="a">&rarr;</div><p>Choosing the right convention for context — Material v3 evaluated, Chakra adopted and extended.</p></div><div><div class="a">&rarr;</div><p>AI applied to production tooling with a measurable outcome, not aspirationally.</p></div><div><div class="a">&rarr;</div><p>Pragmatic delivery: foundation shipped, remaining work scoped and handed off.</p></div></div></div></div>
