---
layout: layouts/post.liquid
tags: post
short: design sprinting
title: "Design sprinting with ProCon"
subtitle: "Introducing a lightweight design-sprint ceremony to fix a lack of team buy-in."
date: 2022-02-01
reading: "3 min read"
topics: ["product-design", "governance"]
toc:
  - { id: "s1", label: "Contract Risk Management software" }
  - { id: "s2", label: "Bring the team along, just don't name it" }
related:
  - { url: "/wrote-about/aveva-procon/", title: "ProCon, rebuilt for usability" }
  - { url: "/work/aveva-ds/", title: "Unifying 150+ products across five tech stacks" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">Designing the right environment for the team to be creative became just as important as being creative myself. I introduced design sprints into the discovery process of feature development — and it changed who got to make decisions.</p>

<img src="/uploads/procon-design-sprint-hero.png" alt="Design sprint workshop" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:8px 0 32px">

<p>During my time at <a href="https://www.aveva.com/">AVEVA</a>, I focused mainly on enterprise web applications. The reality was a development-led setup: we churned out features and rarely circled back for a second version.</p>

<h2 id="s1">Contract Risk Management software</h2>
<p>The product I spent most of my time on was <a href="https://www.aveva.com/en/products/contract-risk-management/">ProCon (now Contract Risk Management)</a>, the sole product of 8over8 before its acquisition by AVEVA. It audited communication between the company commissioning a build and the contractor hired to build it, for mega-capital projects where costs ran into the tens of millions and overruns of 40%+ were common.</p>
<p>Over my time on ProCon, I brought it from a database-on-a-screen interface to something with a more considered approach to usability, working with each product owner to visualise features and get approval from product and development before any code was written. Several issues came from this: I became a hero-designer, which isn't healthy, and the product team lacked buy-in for the features we were shipping. That gap showed up later as bugs, because the team didn't understand why a feature existed or how it fit the larger product.</p>

<p>To address the lack of buy-in and move through ideation faster, I introduced a design-sprint ceremony into the agile discovery process. Inspired by the <a href="https://designsprintkit.withgoogle.com/methodology/overview">Google Design Sprint</a> methodology, different tasks were applied depending on the problem to be solved.</p>

<p>Our first step was mapping the current experience flow for the problem we were trying to solve. I'd convinced the office manager to paint one of the conference room walls with whiteboard paint — and I'm glad they agreed, because the user flows we dealt with were often complex enough to need the space.</p>

<img src="/uploads/procon-design-sprint-workshop.png" alt="Team mapping a user flow on a whiteboard wall during the design sprint" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0">
<img src="/uploads/procon-comms-flow.png" alt="Communication flow diagram from the design sprint" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0">
<img src="/uploads/procon-wireframe-sketches.png" alt="Wireframe sketches from the design sprint" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:24px 0 32px">

<h2 id="s2">Bring the team along on the journey, just don't name it</h2>
<p>The team was given three to five days during the kickoff workshop to address the problem: mapping out the user flow and highlighting pain points surfaced by the core problem, additional user feedback, or our own observations.</p>
