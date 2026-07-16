---
layout: layouts/case.liquid
tags: case
group: ds
order: 3
short: aveva
topics: ["design-system", "governance", "enterprise"]
title: "Unifying 150+ products across five tech stacks"
kicker: "enterprise design system · programme"
lede: "A board mandate to unify a product suite grown mostly through acquisition. No single component library could span .NET, AngularJS, Angular, React and Bootstrap — so the system's authority had to live in the spec, not the code."
meta:
  - { label: "ROLE", value: "Senior UX Engineer / DS Lead" }
  - { label: "SCOPE", value: "Strategy, programme management, adoption" }
  - { label: "FOUNDATION", value: "Material Design v2 · design tokens · Azure DevOps · SAFe", mono: "mono" }
  - { label: "PERIOD", value: "2015 – Feb 2022" }
card:
  n: "03"
  kicker: "enterprise design system · programme"
  title: "Unifying 150+ products across five tech stacks"
  blurb: "A spec-first, stack-agnostic system on a governed Material foundation with an industrial extension layer, tiered adoption tracked at programme level, and a dedicated engineer + QA I made the case to hire."
  metric: "150+ products · 5 stacks · 40+ components"
  role: "Senior UX Eng / DS Lead"
next:
  label: "next case — product craft"
  title: "Northwest Vipers — website redesign"
  url: "/work/northwest-vipers/"
---
<div style="padding:56px 0 60px;border-bottom:1px solid var(--line)">
  <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:12px;margin-bottom:22px">
    <div style="font-family:'IBM Plex Mono',monospace;font-size:13px;color:var(--accent);letter-spacing:0.04em">the documented system</div>
    <div style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--mute)">design.aveva.com/build</div>
  </div>
  <div style="display:grid;grid-template-columns:minmax(0,540px) 1fr;gap:44px;align-items:center">
    <img src="/uploads/aveva_ds-home.png" alt="AVEVA Design System Build — home" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px">
    <div style="max-width:44ch">
      <h3 style="font-size:21px;font-weight:600;letter-spacing:-0.01em;margin:0 0 12px">&ldquo;Design, Prototype, Build&rdquo;</h3>
      <p style="font-size:15.5px;line-height:1.62;color:var(--mute);margin:0">The guidelines site was the single source of truth &mdash; tokens, components, patterns and documented behaviours. Teams on .NET, AngularJS, Angular, React and Bootstrap each implemented the same spec in their own stack.</p>
    </div>
  </div>
</div>

<div class="case-sec"><div class="si">01 / the problem</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>150+ products, accumulated through acquisition, with no shared visual language and no shared implementation. The suite looked and behaved like products from different companies — because it was.</p><p class="muted">Engineering ran on five different stacks. Several teams had independently adopted Material Design v2 as a reference — but without governance, the same spec produced different results in different products.</p></div>
<div class="tagrow"><span class="stag">.NET</span><span class="stag">AngularJS</span><span class="stag">Angular</span><span class="stag">React</span><span class="stag">Bootstrap</span></div>
<p style="font-size:14px;color:var(--mute);margin:14px 0 0;font-family:var(--mono);letter-spacing:0.02em">five stacks — no single component library spans them</p>
</div></div>

<div class="case-sec"><div class="si">02 / spec-first, stack-agnostic</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>The structural decision: make the system agnostic to any one technology. Not a React library — a <strong>specification</strong> of tokens, guidelines, patterns and behaviours each team implements in their own stack. Authority in the spec, not the code.</p></div>
<div class="pipe"><div style="display:flex;flex-direction:column;align-items:center;gap:16px"><div class="node hot" style="min-width:230px;text-align:center"><div class="nl">THE SPEC</div><div class="nv">tokens · guidelines · patterns · behaviours</div></div><div style="font-family:var(--mono);color:var(--accent);letter-spacing:0.34em;font-size:15px">&darr; &darr; &darr; &darr; &darr;</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;width:100%"><div class="node" style="text-align:center"><div class="nv" style="font-size:12.5px">.NET</div></div><div class="node" style="text-align:center"><div class="nv" style="font-size:12.5px">AngularJS</div></div><div class="node" style="text-align:center"><div class="nv" style="font-size:12.5px">Angular</div></div><div class="node" style="text-align:center"><div class="nv" style="font-size:12.5px">React</div></div><div class="node" style="text-align:center"><div class="nv" style="font-size:12.5px">Bootstrap</div></div></div><div class="note" style="text-align:center">teams implementing the same spec independently converge on the same result</div></div></div>
<blockquote class="pull"><p>A spec-first system that works across five tech stacks is already platform-agnostic by necessity — adding AI tools as a sixth consumer is an extension, not a reinvention.</p></blockquote>
</div></div>

<div class="case-sec"><div class="si">03 / extending material</div><div class="case-body">
<p>Material Design was built for consumer apps. AVEVA's products are operational software — engineers and operators in high-stakes, industrial environments. I governed the Material foundation and added a documented extension layer for what it didn't cover:</p>
<ul><li>Alarm states and operational status indicators</li><li>High-density data displays for control-room contexts</li><li>Safety-critical interaction and visual conventions</li></ul>
<p class="muted">The layer said clearly which patterns were Material-standard and which were AVEVA-specific — so teams knew what they were working with, and why.</p>
</div></div>

<div style="padding:62px 0 56px;border-bottom:1px solid var(--line)">
  <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:12px;margin-bottom:22px">
    <div style="font-family:'IBM Plex Mono',monospace;font-size:13px;color:var(--accent);letter-spacing:0.04em">spec made tangible</div>
    <div style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--mute)">component library · component guidance</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">
    <figure style="margin:0">
      <div style="height:440px;border:1px solid var(--line2);border-radius:8px;overflow:hidden;background:var(--chip);display:flex;align-items:center;justify-content:center">
        <img src="/uploads/aveva_ds-adobe_xd_plugin.png" alt="AVEVA Design System Adobe XD plugin" style="max-width:100%;max-height:100%;object-fit:contain;display:block">
      </div>
      <figcaption style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--mute);letter-spacing:0.02em;margin-top:13px;line-height:1.5">The Adobe XD plugin — a stack-agnostic component &amp; icon library (141 icons) designers pulled from.</figcaption>
    </figure>
    <figure style="margin:0">
      <div style="height:440px;border:1px solid var(--line2);border-radius:8px;overflow:hidden;background:var(--chip);display:flex;align-items:center;justify-content:center">
        <img src="/uploads/aveva_ds-component_button.png" alt="AVEVA Design System Button guidance" style="max-width:100%;max-height:100%;object-fit:contain;display:block">
      </div>
      <figcaption style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--mute);letter-spacing:0.02em;margin-top:13px;line-height:1.5">Per-component guidance — usage, behaviour and states documented for every team to implement.</figcaption>
    </figure>
  </div>
</div>

<div class="case-sec"><div class="si">04 / tiered adoption</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>Asking 150+ products to hit full compliance at once wasn't realistic. Teams worked through defined tiers at a pace their delivery schedule could absorb — every team showing measurable progress, none blocked by a single deadline. Progress was tracked at programme level in Azure DevOps.</p></div>
<div class="pipe"><div class="flow"><div class="node"><div class="nl">TIER 1</div><div class="nv">Visual alignment</div><div class="nl" style="margin-top:4px;margin-bottom:0">foundational colour &amp; type</div></div><div class="node"><div class="nl">TIER 2</div><div class="nv">Component standard</div><div class="nl" style="margin-top:4px;margin-bottom:0">shared components adopted</div></div><div class="node hot"><div class="nl">TIER 3</div><div class="nv">Full compliance</div><div class="nl" style="margin-top:4px;margin-bottom:0">pattern &amp; interaction parity</div></div></div></div>
</div></div>

<div style="padding:56px 0 56px;border-bottom:1px solid var(--line)">
  <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:12px;margin-bottom:22px">
    <div style="font-family:'IBM Plex Mono',monospace;font-size:13px;color:var(--accent);letter-spacing:0.04em">levels of adoption, published</div>
    <div style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--mute)">/build/overview/adoption</div>
  </div>
  <div style="display:grid;grid-template-columns:minmax(0,540px) 1fr;gap:44px;align-items:center">
    <img src="/uploads/aveva_ds-adoption.png" alt="AVEVA Design System adoption levels" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px">
    <div style="max-width:44ch">
      <h3 style="font-size:21px;font-weight:600;letter-spacing:-0.01em;margin:0 0 12px">Published, measurable compliance</h3>
      <p style="font-size:15.5px;line-height:1.62;color:var(--mute);margin:0">The adoption levels were documented and split for browser-based and desktop/native applications — so every team knew the next tier to reach, and each product's progress could be tracked at programme level.</p>
    </div>
  </div>
</div>

<div class="case-sec"><div class="si">05 / building the team</div><div class="case-body">
<p>The system started as a UX initiative with no dedicated engineering resource. I made the case for a permanent <strong>design system engineer</strong> to own the implementation infrastructure and bridge spec to code. The role was approved and filled; a dedicated <strong>QA</strong> resource followed.</p>
<p class="muted">The design system moved from a project with UX ownership to a cross-functional team with its own delivery capacity — the organisational foundation that sustained it at scale.</p>
</div></div>

<div class="case-sec demos-sec" style="border-bottom:0"><div class="si">what this<br>demonstrates</div><div class="case-body" style="max-width:none"><div class="demos"><div><div class="a">&rarr;</div><p>Leading a board-mandated initiative inside a 20-person UX org.</p></div><div><div class="a">&rarr;</div><p>Programme-scale structural thinking: spec-first made the system buildable at all.</p></div><div><div class="a">&rarr;</div><p>Extending a general-purpose system for the demands of industrial software.</p></div><div><div class="a">&rarr;</div><p>Making the case for investment — turning an initiative into a funded team.</p></div></div></div></div>
