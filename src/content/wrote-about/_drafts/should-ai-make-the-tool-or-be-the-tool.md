---
layout: layouts/post.liquid
tags: draft
permalink: false
short: AI working modes
title: "Should AI make the tool or be the tool?"
subtitle: "A question I keep asking, and a principle I've been applying longer than AI has existed."
date: 2026-07-27
reading: "6 min read"
topics: ["ai", "design-systems", "tools", "process"]
toc:
  - { id: "s1", label: "Three modes" }
  - { id: "s2", label: "I've seen this before" }
  - { id: "s3", label: "The design systems version" }
  - { id: "s4", label: "What I was actually testing" }
  - { id: "s5", label: "Where this leaves things" }
related:
  - { url: "/wrote-about/a-primitive-token-generator-for-figma/", title: "Primitive Token Generator" }
  - { url: "/writing/", title: "More writing" }
---

The question that keeps coming back to me is this: should AI make the tool, or be the tool?

It sounds like a distinction without a difference until you're actually deciding how to spend an afternoon. Then it matters quite a bit. And if I'm being straight about it, the question itself is newer than the principle underneath it — I've been asking something like this about every piece of tooling I've picked up, for as long as I've been doing this work.

## Three modes

The way I think about it now, there are three distinct ways to work with AI, and confusing them is where most of the frustration comes from.

*AI as thinking partner.* High context, high variability, different every time. Human judgement is irreplaceable; AI accelerates and challenges it. CV tailoring is a good example: every application is different, every context requires different emphasis. There's no shortcut to understanding the role, the company, the gap between where you are and what they're looking for. AI is useful here because it holds context, challenges assumptions, and pushes back when the logic is weak. But you can't automate it, and you can't build it once and walk away. It's collaborative every single time.

*AI as tool builder.* Repetitive, rule-based, predictable output. Build it once, use it forever. The Primitive Token Generator is this — I directed Claude to build a Figma plugin that generates color ramps, type scales, spacing systems. I did that work once. Now I use the plugin on every project, and the accumulated value compounds. The AI wrote the code; the real output was the reusable tool.

*AI as the tool.* Using it directly for a one-off task. Useful, but with a ceiling. You get the answer, the draft, the translation. Then you come back for the same thing next time. There's no accumulation, no compounding. It's a hire for the task, not for the capability.

Most people live almost entirely in the third mode. The first two are where the leverage actually is.

## I've seen this before

This isn't the first time I've worked through this kind of question.

Early in my career I used Dreamweaver, which was genuinely useful — it had both a WYSIWYG editor and a text editor for the same page, and you could move between them. The WYSIWYG was the point; it removed the friction of writing HTML by hand. But it produced artifacts: extra tags, redundant attributes, things the browser rendered fine but the code didn't need. So I moved to the text editor and stopped using the visual layer. That ended up being how I learned to code properly. Dreamweaver reduced the friction of getting things done, but understanding the output is what made me better at the work.

The same pattern shows up with JavaScript frameworks. Bootstrap, Angular, React — they're excellent at getting projects started and handling genuinely complex scenarios. But most projects don't use the full library, which means loading more than you need. Bloated applications don't perform optimally. The framework brought more than the project required, and the surplus became a cost.

Then there are tooling switches: Adobe XD to Figma, Angular to React. These don't just require learning new tools — they require understanding, often in retrospect, which parts of your old workflow were genuine process and which were workarounds for the previous tool's limitations. Get that wrong and the migration is harder than it should be. You end up solving problems that only existed because of the tool you just left.

The principle that connects all of this: understand what the tool is doing at the level below the abstraction. Not to avoid using the tool — use the tool — but so you know what you're actually building, and what you'd have if the tool disappeared tomorrow.

That's exactly the question I keep asking about AI. Is it so embedded in my workflow that I'm too reliant on it? What if I run out of credits? What if the service goes down? If AI sits in the middle of a workflow that isn't itself AI-powered, it becomes an unrelated bottleneck — the same problem as a framework whose removal would break the app it was supposed to accelerate.

The Primitive Token Generator runs without Claude. It was built with AI, but it's not powered by it. That distinction matters.

## The design systems version

A design system is infrastructure — the thing others build against. Once it's solid, every product on top of it benefits. You're not solving the spacing problem again for every screen; you solved it once and the solution is available everywhere.

AI as tool builder works the same way. Directing Claude to build the Primitive Token Generator was building infrastructure for my own workflow. Every design systems project I take on from here skips the mechanical setup step. That's not the same as asking Claude to generate tokens for me each time — that's the third mode. The tool is what makes the value persist.

Are you building product or building infrastructure? Both are necessary. The mistake is reaching for one when you needed the other.

## What I was actually testing

The Primitive Token Generator was built by directing Claude rather than writing code myself. This was a deliberate choice, not a limitation.

I have enough development experience to have built it myself, slowly and probably badly. What I wanted to understand was the AI-assisted development process from the position I actually occupy in most projects: the person who knows what the output should look and behave like, not the person implementing it. Design director writes the brief; Claude implements it.

What I found: having to describe behavior precisely enough for Claude to implement it forced decisions that vague thinking lets you defer. If I didn't know exactly how the color ramp curve should behave, or what the preview should show before export, I had to figure it out before I could write it down. That's not a cost of the process; that's the process working.

I've done a version of this on client work too — using Claude to help evolve a pattern library into something with enough structure to function as a proper design system. Same dynamic: the brief has to be precise enough to be useful, which means the thinking has to happen before the writing.

The output is real and useful. The process was the learning. Both things are true.

## Where this leaves things

There's a version of this problem I haven't mentioned yet. When CSS-in-JS became a React-era pattern, some developers put styles in JavaScript because they didn't like CSS. Not for principled reasons — just preference. HTML for structure, CSS for styling, JS for behaviour: that separation exists for good reasons, and routing around it because one layer is inconvenient tends to surface those reasons later. If all you have is a hammer, everything looks like a nail.

I think about that when I watch people reach for AI by default — not because it's the right tool, but because it's the familiar one. The framework I've described here is partly an answer to that: it forces a prior question before you open a chat window. What kind of task is this, actually? One-off, recurring, or complex judgement? Sometimes the honest answer is: none of the above, and AI isn't what this needs.

The hardest part isn't using AI well. It's knowing which version you need — and being willing to admit when the answer is none of them.
