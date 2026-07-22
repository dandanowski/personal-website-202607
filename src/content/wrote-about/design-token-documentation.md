---
layout: layouts/post.liquid
tags: post
short: token docs
title: "Generating token docs for free"
subtitle: "A Style Dictionary proof of concept that documents design tokens as part of the same build that ships them."
date: 2024-07-01
reading: "1 min read"
topics: ["design-tokens", "design-system", "documentation"]
related:
  - { url: "/work/cycloid-ds/", title: "Machine-readable token architecture & an AI sync pipeline" }
  - { url: "/wrote-about/naming-things-is-hard/", title: "Naming things is hard" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">While automating design tokens and thinking about how to scale them, I kept running into the same problem: documentation drifting out of date. Some dead code I found in a Style Dictionary version turned out to be the seed of an idea — generate the documentation from the same tokens that ship in production, on every build.</p>

<p>I hand-coded this proof-of-concept version of the GSG design-system documentation site. The goal was to use the design-token JSON structure itself — including its description fields — to generate the docs, with filters by type and by the hierarchy already written into the tokens.</p>

<p><a href="https://gsg-design.github.io/style-guide.html">Here's the proof of concept</a>, with filtering of tokens by type and by where they sit in the token structure.</p>

<a href="https://gsg-design.github.io/style-guide.html"><img src="/uploads/atolls-token-docs-poc.png" alt="GSG design-system documentation site, proof of concept" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0"></a>

<p>Like most PoCs, it's sitting on a shelf for now — but I'm hoping it takes on a life of its own in a future project.</p>
