---
layout: layouts/post.liquid
tags: post
short: learning pool
title: "Wrangling 300+ themes for an LMS"
subtitle: "Automating theme deployment and maintenance across a fleet of Moodle instances at Learning Pool."
date: 2022-02-01
reading: "2 min read"
topics: ["design-system", "pipeline"]
related:
  - { url: "/work/cycloid-ds/", title: "Machine-readable token architecture & an AI sync pipeline" }
  - { url: "/work/aveva-ds/", title: "Unifying 150+ products across five tech stacks" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">Theme deployment and maintenance improved drastically once I moved theme settings out of manual edits and into an independent repository. The process automation that followed cut bug and feature-request turnaround dramatically.</p>

<img src="/uploads/learning-pool-hero.png" alt="Design system at Learning Pool" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:8px 0 32px">

<p>When I started at <a href="https://learningpool.com">Learning Pool</a>, there were roughly 150 <a href="https://moodle.org/">Moodle</a> instances, one per customer. Each was a separate code structure, manually maintained — core codebase, custom features, and themes alike. I led the initiative to automate theme maintenance and deployment across all instances, an opportunity made possible by a parallel effort from development to dramatically reduce the number of instances by serving multiple sites off the same codebase.</p>

<img src="/uploads/learning-pool-single-theme-flow.png" alt="Single theme management flow diagram" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0">

<p>Within a Moodle instance, theme settings were stored in a separate database table. Instead of editing individual theme settings through the web interface, I wrote scripts with SQL queries to extract theme information into a dedicated database — a precursor to design tokens — for all our brands, alongside custom scripts able to spin up a local instance of the latest Moodle code with our customisations, the previous day's data backup, and the theme data from that database. This was necessary to both create and deploy new themes and address theme-related bugs quickly and confidently.</p>

<img src="/uploads/learning-pool-multi-theme-flow.png" alt="Multi theme management flow diagram" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0">

<p>Advanced themes were also supported by injecting custom CSS and images into the same Moodle theme layer, with those customisations kept in the same centralised theme database — which expanded to hold more than just the values injected into Moodle's theme table.</p>

<p>By the time I finished up at Learning Pool in 2013, the number of supported instances had grown to over 300, all managed with a few keystrokes.</p>
