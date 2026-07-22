---
layout: layouts/case.liquid
tags: case
group: ds
order: 2
short: atolls
topics: ["design-tokens", "design-system", "governance", "multi-brand"]
title: "One token architecture across 60+ brands"
kicker: "multi-brand design system · governance"
lede: "A white-label SaaS platform where every client needs its own identity inside one shared product. I inherited a system covering ~20% of the suite at 20 brands, and scaled it to full coverage at 60+ — faster to ship, not slower."
meta:
  - { label: "ROLE", value: "Head of Design / DS Manager" }
  - { label: "SCOPE", value: "Token architecture, pipeline, governance, team" }
  - {
      label: "STACK",
      value: "Figma · TokensStudio · StyleDictionary · React · Storybook",
      mono: "mono",
    }
  - { label: "PERIOD", value: "Mar 2022 – May 2025" }
card:
  n: "02"
  kicker: "multi-brand design system · governance"
  title: "One token architecture across 60+ brands"
  blurb: "Re-architected a flat token model into a three-tier default/override system, automated the Figma-to-code handoff, and split shared components from product-owned patterns to remove the DS bottleneck."
  metric: "20 → 60+ brands · onboarding 2 wks → 2 days"
  role: "Head of Design / DS Manager"
next:
  label: "next case — 03"
  title: "Unifying 150+ products across five tech stacks"
  url: "/work/aveva-ds/"
---

<div class="case-sec"><div class="si">01 / the problem</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>Three structural problems made scaling impossible without fixing the foundations first.</p></div>
<div class="trio"><div><div class="n">01</div><h4>Flat token model</h4><p>A single tier of primitives meant one brand change had knock-on effects elsewhere. Teams hard-coded values to cope.</p></div><div><div class="n">02</div><h4>Manual handoff</h4><p>Engineers copied brand colours and type specs by hand from Figma. Decisions were missed; rework was routine.</p></div><div><div class="n">03</div><h4>No component / pattern boundary</h4><p>All UI routed through the DS before product teams could use it — a bottleneck that owned decisions belonging to product.</p></div></div>
</div></div>

<div class="case-sec"><div class="si">02 / token architecture</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>I evolved the model from a single tier of primitives to a three-tier hierarchy. The semantic layer was the key change — separating what a value <em>is</em> from what it <em>does</em>, so components could be themed independently without side-effects.</p></div>
<div class="pipe"><div class="nl" style="font-family:var(--mono);font-size:11.5px;color:var(--mute);letter-spacing:0.06em;margin-bottom:18px">DEFAULT THEME + DELTA OVERRIDE MODEL</div><div class="flow"><div class="node hot"><div class="nv">Default theme</div><div class="nl" style="margin-top:5px;margin-bottom:0">full set of token values</div></div><span class="arr">+</span><div class="node"><div class="nv">brand-a.delta</div></div><div class="node"><div class="nv">brand-b.delta</div></div><div class="node"><div class="nv" style="color:var(--mute)">… ×60</div></div></div><div class="note">each brand declares only what differs — a delta, not a full re-declaration</div></div>
</div></div>

{% include "partials/bf-atolls.liquid" %}

<div class="case-sec"><div class="si">03 / automated pipeline</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>I replaced the copy-paste handoff with an automated pipeline. Engineers stopped copying values from Figma; design changes propagated automatically, and silent drift was eliminated.</p></div>
<div class="pipe"><div class="flow"><div class="node"><div class="nl">FIGMA</div><div class="nv">TokensStudio</div></div><span class="arr">&rarr;</span><div class="node"><div class="nl">W3C DTCG</div><div class="nv">JSON in git</div></div><span class="arr">&rarr;</span><div class="node hot"><div class="nl">TRANSFORM</div><div class="nv">StyleDictionary</div></div><span class="arr">&rarr;</span><div class="node"><div class="nl">OUTPUT</div><div class="nv">Figma Variables · CSS</div></div></div></div>
<div style="max-width:64ch;display:flex;gap:16px;align-items:center;background:var(--tint);border:1px solid var(--line);border-radius:6px;padding:18px 22px"><div style="font-family:var(--mono);font-size:clamp(22px,3vw,32px);font-weight:600;color:var(--accent);white-space:nowrap">2 wks → 2 days</div><div style="font-size:14px;color:var(--mute);line-height:1.5">Brand onboarding time, before and after the pipeline.</div></div>
</div></div>

<div class="case-sec"><div class="si">04 / governance</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>The harder problem wasn't components — it was keeping the system coherent across sixty client configurations and three years. I redefined what belonged in the shared system at all.</p></div>
<div class="demos"><div><div class="a" style="color:var(--accent)">OWNED BY DS</div><h4 style="font-size:18px;font-weight:600;margin:6px 0 9px">Components</h4><p>Universal UI any user might meet anywhere — buttons, inputs, dialogs. Built to one standard, versioned centrally.</p></div><div><div class="a" style="color:var(--accent)">OWNED BY PRODUCT</div><h4 style="font-size:18px;font-weight:600;margin:6px 0 9px">Patterns</h4><p>Product-specific compositions carrying business logic. Teams iterate freely; proven patterns can be promoted into the library — earned, not assumed.</p></div></div>
<div style="max-width:64ch"><p class="muted">Adoption was led through contribution models, standing design reviews across product teams, and documentation written for designers new to the conventions — not mandates. The same governance model that handled 20% at the start handled 100% at scale, with no central bottleneck.</p></div>
</div></div>

<div class="case-sec"><div class="si">05 / outcome</div><div class="case-body" style="max-width:none"><div class="otable"><div class="h"><div></div><div>BEFORE</div><div class="acc">AFTER</div></div><div class="r"><div class="lbl">Brands supported</div><div class="b">20</div><div class="a">60+</div></div><div class="r"><div class="lbl">Product suite coverage</div><div class="b">~20%</div><div class="a">100%</div></div><div class="r"><div class="lbl">Onboard a new brand</div><div class="b">~2 weeks</div><div class="a">~2 days</div></div><div class="r"><div class="lbl">DS bottleneck</div><div class="b">all UI via DS</div><div class="a">patterns owned by product</div></div></div></div></div>

<div class="case-sec demos-sec" style="border-bottom:0"><div class="si">what this<br>demonstrates</div><div class="case-body" style="max-width:none"><div class="demos"><div><div class="a">&rarr;</div><p>Diagnosing structural problems and redesigning foundations without discarding prior work.</p></div><div><div class="a">&rarr;</div><p>Token depth: three tiers plus a default/override multi-brand model.</p></div><div><div class="a">&rarr;</div><p>Governance thinking: redefining what belongs in a shared system to remove org bottlenecks.</p></div><div><div class="a">&rarr;</div><p>Adoption leadership: onboarding teams through contribution and review, not mandates.</p></div></div></div></div>
