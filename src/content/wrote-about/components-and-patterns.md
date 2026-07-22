---
layout: layouts/post.liquid
tags: post
short: components & patterns
title: "Defining your design-system buckets"
subtitle: "Components and patterns: the simplest split I found that actually helped adoption stick."
date: 2025-02-10
reading: "3 min read"
topics: ["design-system", "governance"]
toc:
  - { id: "s1", label: "Like atomic design?" }
  - { id: "s2", label: "Clear definitions" }
  - { id: "s3", label: "That simple?" }
  - { id: "s4", label: "Take away" }
related:
  - { url: "/work/atolls-ds/", title: "One token architecture across 60+ brands" }
  - { url: "/wrote-about/naming-things-is-hard/", title: "Naming things is hard" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">Defining clear categories for each part of your design system goes a long way toward adoption and maintenance. There are many ways to do this — here's what worked for me.</p>

<img src="/uploads/components-patterns-hero.png" alt="Components and patterns" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:8px 0 32px">

<h2 id="s1">Like atomic design?</h2>
<p>Like many, listening to <a href="https://bradfrost.com/">Brad Frost</a> talk about <a href="https://bradfrost.com/blog/post/atomic-web-design/">Atomic Design</a> was eye-opening. Breaking a design down into constituent, reusable parts really resonated with me and changed how I approached designing digital products.</p>
<p>I'll admit, though — I've always struggled to explain the difference between a molecule and an organism, and struggled even more to communicate those decisions with any conviction. I ended up being the one who had to decide which bucket an element belonged in, simply because I couldn't articulate the rule clearly enough for anyone else to apply it. That's not a sustainable way to work — as a friend once put it, if I won the lottery tomorrow, someone else would need to make these calls.</p>
<p>Starting at <strong>Atolls</strong> in 2022 as Design System Lead, I was meant to evolve their initial system and scale it across all their products. It wasn't clear to me — or to anyone else — how to categorise the different elements. That's when I settled on a much simpler grouping: components and patterns.</p>

<h2 id="s2">Clear definitions</h2>
<p>A couple of defining characteristics started resonating with people, and the difference got much easier to explain.</p>
<h3>Component</h3>
<p>A common web-interface convention, not unique to our products, that a user should reasonably already know how to use — something that just works and we won't waste time reinventing: a button, an input box, a set of tabs.</p>
<h3>Pattern</h3>
<p>A group of components composed expressly to solve a user problem <strong>Atolls</strong> has deemed important — something worth getting right, worth user testing and iterating on directly.</p>

<h2 id="s3">That simple?</h2>
<p>Well, no. I'd like it to be, but then came the question of ownership. At <strong>Atolls</strong> we run a federated design-system model: a central team maintains the core, and every other team uses, consumes, and depends on its contents. Any team can include components and patterns from another team, but can't change them.</p>
<p>It's modelled fairly closely on <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">object-oriented programming</a> — we're chasing reusability above all. Each team is the subject-matter expert on the patterns it maintains, and should be unblocked to evolve them as user research dictates.</p>

<h2 id="s4">Take away</h2>
<p>Clear categories and definitions that are straightforward to understand are a key ingredient for adoption — and for keeping the buy-in that follows it.</p>
