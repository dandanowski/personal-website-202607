---
layout: layouts/post.liquid
tags: post
short: naming things is hard
title: "Naming things is hard"
subtitle: "The hunt for the perfect design-token naming convention."
date: 2025-03-31
reading: "4 min read"
topics: ["design-tokens", "naming", "design-system"]
toc:
  - { id: "s1", label: "Why can't we just call it this?" }
  - { id: "s2", label: "More guidelines than code" }
  - { id: "s3", label: "Right so, as it stands…" }
related:
  - { url: "/work/atolls-ds/", title: "One token architecture across 60+ brands" }
  - { url: "/work/cycloid-ds/", title: "Machine-readable token architecture" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">OMFG, naming things is so hard. I've come to the conclusion that the perfect naming convention for design tokens may actually exist — I'm just not smart enough to figure it out, and certainly not with these deadlines.</p>

<h2 id="s1">Why can't we just call it <em>this</em> and be done with it?</h2>
<p>It seems like everyone is having a hard time coming up with a good naming convention for their design system. While going through this exercise at <strong>Atolls</strong>, I really got bogged down naming design tokens. I was <em>thisclose</em> to the perfect convention — but some new use case kept breaking things. I even had a lovely spreadsheet with column definitions: populate the columns you needed, ignore the ones you didn't, and it spat out a dot-separated token name. I mean, who doesn't love a spreadsheet?</p>
<p>Anyway, it didn't take off. Funnily enough, not everyone shared my passion for a perfectly-named token that fit just so within our ecosystem. So it got relegated to the dustheap of non-critical projects we'll get back to someday.</p>
<p>I considered sharing the spreadsheet here, but honestly it's a little embarrassing. It's over-engineered. It's over-complicated. It's naïve. And wrong — wrong in so many ways.</p>
<p>So when the deadline loomed, a simpler solution came to light.</p>

<figure class="anatomy">
  <div class="card">
    <div class="ttl">TOKEN ANATOMY</div>
    <div class="name"><span style="color:#2E51FF">comp</span><span class="sep">.</span><span style="color:var(--ink)">button</span><span class="sep">.</span><span style="color:#1F8A5B">color</span><span class="sep">.</span><span style="color:#9a6cf0">background-emphasized</span></div>
    <div class="legend"><span><span style="color:#2E51FF">■</span> scope</span><span><span style="color:var(--ink)">■</span> component</span><span><span style="color:#1F8A5B">■</span> property group</span><span><span style="color:#9a6cf0">■</span> property</span></div>
  </div>
  <figcaption>The first two parts — scope + a unique component name — guarantee no clashes with anything else in the system.</figcaption>
</figure>

<h2 id="s2">More guidelines than actual code</h2>
<p>What I settled on was hard-and-fast rules for what lived inside the design system — but if product designers wanted to create their own tokens, they only had to follow the first two parts of the name. The first part designates a token for use with components only; the second is the unique name of the component it belongs to. With those two parts unique, you're guaranteed no clashes with any other token in the system.</p>
<p>The rest follows something like this:</p>

<h3>Align on token property groups</h3>
<p>To make things easier to read and understand, alignment on property groups is encouraged. The groups include:</p>
<ul><li>Animation</li><li>Color</li><li>Font</li><li>Shape</li><li>Spacing</li><li>Typography</li></ul>
<p>I like to keep the groups alphabetised for findability.</p>

<h3>No interdependency between patterns</h3>
<p>Tokens created to support custom patterns should only be used in those patterns. You shouldn't end up in a situation where a token you've been using gets deleted or renamed without you knowing. It also frees you up to add and remove tokens as needed, without worrying about breaking changes outside your control.</p>
<p>When creating tokens for your own patterns, remember to scope them properly to avoid name clashes. That relies on good communication across teams to land on good, understandable, unique pattern names.</p>

<blockquote><p>People can offer what worked for them — but in the end, you'll have to decide what works best for your current situation.</p></blockquote>

<h2 id="s3">Right so, as it stands…</h2>
<p>As with most things, it's a work in progress — but it all looks workable. Which brings me back to my original goal: a unifying token naming convention. Well, I didn't find <em>the</em> one… but I did find one that works for us.</p>
<p>As infuriating as that sounds, that's kinda how most things go.</p>
