---
layout: post
title: Naming things is hard
subtitle: The perfect design token naming convention
permalink: /wrote-about/naming-design-tokens-is-hard
date: 2025-03-31
updated: Last Modified
className: post
tags:
    - post
    - design system
    - design tokens
    - naming
---

OMFG naming things is so hard. I've come to the conclusion that the perfect naming convention for design tokens may actually exist, but I'm not smart enough to figure it out, and certainly not with these deadlines.

<!-- excerpt -->

---

<img class="hero" alt="This is hard" src="/assets/hero/this-is-hard.png" />

## Why can we just call it this and be done with it?
It seems like everyone is having a hard time trying to come up with a good naming convention for their design system. While going through this exercise at Atolls, I really got bogged down when it came to naming design tokens. I was _thisclose_ to coming up with the perfect naming convention, but some new use case kept breaking things. I even had a lovely spreadsheet with column definitions so you can populate the columns you needed, ignored the ones you didn't and it would produce a dot-separated token name. I mean, who doesn't love a spreadsheet?

Anyway, it didn't take off. Funnily enough, not everyone shared my passion for a well named token that fit perfectly within our ecosystem. So it got relegated to the dustheap of non-critical projects we'll get back to someday.

<!-- ![Star Wars](/assets/the-more-you-tighten-your-grip.jpg) -->

I considered sharing the spreadsheet here, but it's a little embarassing to be honest. It's over-engineered. It's over complicated. It's naieve. And wrong, wrong in so many ways.

So, when the deadline loomed, a solution came to light.

## More guidelines than an actual code
What I settled on was something like hard and fast rules for what was in the design system, but if the product designers were to create their own tokens they would only have to follow the first two parts of name. The first part designates the tokens to be used with components only, the second part was the unique name of the component in which they were used. With those two parts being unique, that would ensure no clashes with any other token used in the system.

The rest follows something like this:

### Align on token property groups
To make things easier to read and understand, alignment on property groups is encouraged. The groups include:
* Animation
* Color
* Font
* Shape
* Spacing
* Typography

I like to keep the groups alphabetized for findability.

### No interdependency between patterns
Tokens that are being created to support custom patterns should only be used in those patterns. You shouldn't get into a situation where a token you have been using gets deleted or renamed without you knowing about it. This also frees you up to add and remove tokens as needed without working about breaking changes outside your control.

When creating tokens for your own patterns, remember to scope them properly to avoid name clashes. This will rely on good communication across the teams to help come up with good, understandable, and unique pattern names

<!-- ![The Princess Bride](/assets/who-won-how-did-it-end.jpeg) -->

## Right so, as it stands...
As with most things, it's a work in progress, but it all looks workable. But that brings me back to my original thought which was to come up with unifying token naming convention. Well, I didn't, but I did find one that works for us.

As infuriating as that sounds, that's kinda how most things go. People can offer what worked for them, but in the end you'll have to decide for what works best for your current sitation.


