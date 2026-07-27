---
layout: layouts/post.liquid
tags: post
short: learning pool
title: "Wrangling 300+ themes for an LMS"
subtitle: "Automating theme deployment and maintenance across a fleet of Moodle instances at Learning Pool."
date: 2022-02-01
updated: 2026-07-27
reading: "4 min read"
topics: ["design-system", "pipeline"]
toc:
  - { id: "s1", label: "The problem" }
  - { id: "s2", label: "How it worked" }
  - { id: "s3", label: "A precursor to tokens" }
  - { id: "s4", label: "Where it landed" }
related:
  - { url: "/work/cycloid-ds/", title: "Machine-readable token architecture & an AI sync pipeline" }
  - { url: "/work/aveva-ds/", title: "Unifying 150+ products across five tech stacks" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">Making a change to 300 Moodle themes used to mean making it 300 times. Once the theme settings lived outside the CMS, in a database I controlled, it meant running a script.</p>

<img src="/uploads/learning-pool-hero.png" alt="Design system at Learning Pool" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:8px 0 32px">

## The problem

When I joined [Learning Pool](https://learningpool.com), there were roughly 80 [Moodle](https://moodle.org/) instances — one per customer. Learning Pool specialised in custom Moodle LMS deployments for UK local government, primarily to handle annual compliance training, so most of those instances belonged to individual councils. Each was a separate codebase, manually maintained: core updates, custom features, and theme changes all applied by hand, one instance at a time.

At that scale, it was already unsustainable. If a customer raised a theme bug, you had to log into their instance, work out what had drifted from what you'd intended, and fix it there. If a new customer came on with a new brand, you reproduced the same setup from scratch — clicking through Moodle's admin interface, manually. If you needed to roll a change across every instance, you were doing it 80 times, and hoping you were doing it consistently.

The root of the problem was where Moodle stored theme settings: in a database table inside each instance. That meant the canonical version of a customer's theme lived inside the system they were using — not somewhere you controlled, not somewhere you could version, not somewhere you could script against.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0" aria-label="Before: 80 separate Moodle instances each with their own theme settings">
  <style>
    .lp-instance-box { fill: #f0f0f0; stroke: #bbb; stroke-width: 1; }
    .lp-settings-box { fill: #e2e2e2; stroke: #bbb; stroke-width: 1; }
    .lp-instance-label { fill: #333; font-size: 18px; font-family: 'IBM Plex Mono', monospace; }
    .lp-settings-label { fill: #555; font-size: 15px; font-family: 'IBM Plex Mono', monospace; }
    .lp-footer { fill: #888; font-size: 14px; font-family: 'IBM Plex Mono', monospace; }
    .lp-heading { fill: #999; font-size: 12px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; letter-spacing: 1.5px; }
    .lp-db-body { fill: #e8e8e8; stroke: #bbb; stroke-width: 1; }
    .lp-db-top { fill: #f0f0f0; stroke: #bbb; stroke-width: 1; }
    .lp-db-bottom { fill: #d8d8d8; stroke: #bbb; stroke-width: 1; }
    .lp-db-label { fill: #444; font-size: 15px; font-family: 'IBM Plex Mono', monospace; }
    .lp-script-box { fill: #f0f0f0; stroke: #bbb; stroke-width: 1; }
    .lp-script-label { fill: #444; font-size: 15px; font-family: 'IBM Plex Mono', monospace; }
    .lp-connector { stroke: #999; stroke-width: 1.5; fill: none; }
    #lp-arr polygon { fill: #999; }
    @media (prefers-color-scheme: dark) {
      .lp-instance-box { fill: #2a2a2a; stroke: #444; }
      .lp-settings-box { fill: #333; stroke: #444; }
      .lp-instance-label { fill: #d0d0d0; }
      .lp-settings-label { fill: #999; }
      .lp-footer { fill: #555; }
      .lp-heading { fill: #666; }
      .lp-db-body { fill: #2a2a2a; stroke: #444; }
      .lp-db-top { fill: #333; stroke: #444; }
      .lp-db-bottom { fill: #222; stroke: #444; }
      .lp-db-label { fill: #999; }
      .lp-script-box { fill: #2a2a2a; stroke: #444; }
      .lp-script-label { fill: #999; }
      .lp-connector { stroke: #555; }
      #lp-arr polygon { fill: #555; }
    }
  </style>
  <text x="380" y="28" class="lp-heading" text-anchor="middle">BEFORE</text>
  <rect x="80" y="50" width="600" height="68" class="lp-instance-box" rx="5"/>
  <text x="108" y="73" class="lp-instance-label">Moodle instance</text>
  <rect x="100" y="82" width="560" height="26" class="lp-settings-box" rx="3"/>
  <text x="380" y="99" class="lp-settings-label" text-anchor="middle">Theme settings</text>
  <rect x="80" y="134" width="600" height="68" class="lp-instance-box" rx="5"/>
  <text x="108" y="157" class="lp-instance-label">Moodle instance</text>
  <rect x="100" y="166" width="560" height="26" class="lp-settings-box" rx="3"/>
  <text x="380" y="183" class="lp-settings-label" text-anchor="middle">Theme settings</text>
  <rect x="80" y="218" width="600" height="68" class="lp-instance-box" rx="5"/>
  <text x="108" y="241" class="lp-instance-label">Moodle instance</text>
  <rect x="100" y="250" width="560" height="26" class="lp-settings-box" rx="3"/>
  <text x="380" y="267" class="lp-settings-label" text-anchor="middle">Theme settings</text>
  <text x="380" y="310" class="lp-footer" text-anchor="middle">×80 instances, each managed separately</text>
</svg>

## How it worked

A parallel effort from the development team was already underway to consolidate instances: instead of one codebase per customer, multiple sites would run off the same one. That gave me the opening I needed. If we were rethinking how the instances worked, we could rethink how the themes worked too.

I wrote scripts with SQL queries to extract theme settings from each instance and pull them into a centralised, dedicated database — one place that held the theme data for all our customers, separated from the systems that consumed them. The theme values were no longer properties of individual Moodle instances; they were independent data that could be read and applied however was needed.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0" aria-label="After: a central theme database feeding a deployment script that pushes to all instances">
  <defs>
    <marker id="lp-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6"/>
    </marker>
  </defs>
  <text x="380" y="28" class="lp-heading" text-anchor="middle">AFTER</text>
  <rect x="113" y="132" width="88" height="56" class="lp-db-body"/>
  <ellipse cx="157" cy="132" rx="44" ry="10" class="lp-db-top"/>
  <ellipse cx="157" cy="188" rx="44" ry="10" class="lp-db-bottom"/>
  <text x="157" y="157" class="lp-db-label" text-anchor="middle">Theme</text>
  <text x="157" y="172" class="lp-db-label" text-anchor="middle">Database</text>
  <line x1="201" y1="160" x2="245" y2="160" class="lp-connector" marker-end="url(#lp-arr)"/>
  <rect x="247" y="142" width="120" height="36" class="lp-script-box" rx="4"/>
  <text x="307" y="157" class="lp-script-label" text-anchor="middle">Deployment</text>
  <text x="307" y="171" class="lp-script-label" text-anchor="middle">script</text>
  <line x1="367" y1="160" x2="407" y2="160" class="lp-connector"/>
  <line x1="407" y1="80" x2="407" y2="240" class="lp-connector"/>
  <line x1="407" y1="80"  x2="441" y2="80"  class="lp-connector" marker-end="url(#lp-arr)"/>
  <line x1="407" y1="160" x2="441" y2="160" class="lp-connector" marker-end="url(#lp-arr)"/>
  <line x1="407" y1="240" x2="441" y2="240" class="lp-connector" marker-end="url(#lp-arr)"/>
  <rect x="443" y="52"  width="200" height="56" class="lp-instance-box" rx="5"/>
  <text x="543" y="75"  class="lp-instance-label" text-anchor="middle">Moodle instance</text>
  <text x="543" y="96"  class="lp-settings-label" text-anchor="middle">council A</text>
  <rect x="443" y="132" width="200" height="56" class="lp-instance-box" rx="5"/>
  <text x="543" y="155" class="lp-instance-label" text-anchor="middle">Moodle instance</text>
  <text x="543" y="176" class="lp-settings-label" text-anchor="middle">council B</text>
  <rect x="443" y="212" width="200" height="56" class="lp-instance-box" rx="5"/>
  <text x="543" y="235" class="lp-instance-label" text-anchor="middle">Moodle instance</text>
  <text x="543" y="256" class="lp-settings-label" text-anchor="middle">council C</text>
  <text x="380" y="310" class="lp-footer" text-anchor="middle">300+ instances, managed from one place</text>
</svg>

Alongside that, I built scripts to spin up a local Moodle environment: the latest codebase, our customisations, the previous day's data backup, and the theme values pulled from that centralised database. This made it possible to develop and debug without touching live instances. Instead of making changes on a customer's site and hoping nothing broke, you had a local environment that matched production closely enough to catch problems before they shipped.

Advanced themes were handled by injecting custom CSS and images into Moodle's theme layer on top of the base settings. Those customisations went into the same centralised database — which expanded beyond the values Moodle's own theme table expected, to hold whatever a customer's brand actually required.

## A precursor to tokens

The terminology hadn't arrived yet. But what I was building followed the same principle the industry later codified as design tokens: separate the design values from the systems that consume them, maintain them in one place, push them to wherever they're needed.

I was doing this just as those ideas were beginning to be formalised elsewhere. I wasn't aware of that at the time; I was solving a practical problem, not following a field. But looking back from a career that's been largely about design systems infrastructure, it tracks. The instinct that made this feel like the right solution in 2010 is the same one that shows up later in how I structured the work at AVEVA and Cycloid.

## Where it landed

By the time I left Learning Pool in 2013, the number of supported instances had grown from 80 to over 300 — all maintained through that centralised database and the scripts built around it. A theme change that used to take hours now took a few keystrokes. Bug turnaround shrank significantly because local environment setup was fast and reliable. New customers got their themes from the same pipeline as everyone else.

It wasn't the most glamorous work. At the time I wasn't thinking of it in terms of design systems — I was thinking: this is unsustainable, and I need to fix it. Those descriptions aren't really in conflict.
