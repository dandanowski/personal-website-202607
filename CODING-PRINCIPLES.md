# Coding Principles

Canonical location: `~/.claude/CODING-PRINCIPLES.md` — **edit the canonical file there**; any
copies inside projects are mirrors of it.
Last updated: 2026-07-25 · v1

Loaded automatically by Claude Code via `~/.claude/CLAUDE.md` (which imports this file), so it
applies to every project on this machine. Projects that also run in Cowork's cloud keep a
synced copy in-repo (imported by that project's `CLAUDE.md`), because cloud sandboxes don't
read your home directory.

---

A working set of principles for how I like software built. Distilled from the map-quiz
project — these are the patterns I kept steering toward. Written to be followed both by me
and by an AI assistant working on my behalf. This is a living document; edit, cut, and add.

How to read it: each principle is a short rule, a reason, and (where useful) how it should
show up in practice. When two principles conflict, prefer correctness and the user's
experience over cleverness or brevity.

## 1. Architecture & dependencies

**No build step unless it earns its keep.** Prefer code that runs by opening a file or
adding one `<script>` tag. A build/bundler is a cost (setup, breakage, onboarding) that
must be justified by a concrete need, not adopted by default.

**Minimize dependencies.** Every dependency is a liability — supply chain, version churn,
weight, and lock-in. Reach for a library only when it clearly beats what the platform gives
you, and prefer small, single-purpose ones. Do heavy lifting offline/at build time so the
runtime stays lean (e.g. pre-computing data rather than pulling in a runtime engine).

**Framework-agnostic by default.** Build things that drop into any page or stack. Standard
Web Components, plain functions, and standard data formats travel further than
framework-specific code.

**Self-contained units.** A component should own its markup, styles, and behavior and not
leak into or depend on its surroundings. Guard against double-inclusion. Keep the public
surface (attributes, properties, events) small and obvious.

## 2. The platform first

**Use native platform features before libraries.** Modern HTML/CSS/JS is powerful — reach
for `<dialog>`, Shadow DOM, CSS custom properties, `light-dark()`, container queries, `dvh`,
`ResizeObserver`, pointer events, and so on before importing something to do the same job.

**Progressive enhancement and graceful fallback.** Feature-detect and degrade cleanly
(e.g. `dialog.showModal()` with a fallback path). Assume the environment varies.

## 3. Data & configuration over hardcoding

**Nothing domain-specific baked into the logic.** The code should know how to render/behave;
the *content* lives in data. Adding a new case should mean dropping in a data file or config,
not editing the engine. (The map-quiz knows nothing about Ireland, the US, or Europe.)

**One source of truth.** Derive rather than duplicate. A single function/rule should define
a concept (e.g. "what counts as quizzable") so behavior can't drift out of sync.

**Design for extension.** New optional fields should pass through untouched and default
sensibly, so the format can grow without breaking existing data or requiring code changes.

## 4. Accessibility & UX invariants

**Accessible by construction, not as an afterthought.** Keyboard operability, real focus
management (`:focus-visible`), correct roles/`aria-*`, live regions for feedback, and
sensible contrast in both light and dark. Interactive things are real buttons/controls.

**Be a good citizen of the host page.** Embedded UI must never trap scroll, never overflow
the viewport, and never leak styles in or out. It should fit and blend, not fight the page.

**Constant, legible presentation across states.** Text stays readable across zoom, resize,
and density; nothing balloons or collapses unexpectedly; states (selected, correct, wrong,
disabled) are unambiguous and win over transient states like hover.

**Protect the invariants.** Certain behaviors must never regress (scroll pass-through, click
vs. drag, viewport fit…). Treat these as contracts and re-verify them after any related change.

## 5. Theming & encapsulation

**Style through a contract, not by reaching in.** Expose theming via CSS custom properties
and explicit styling hooks (`::part()`), so a host can restyle without forking the code.
Keep internals encapsulated (Shadow DOM) so global CSS can neither break the component nor
be broken by it.

**Make the obvious things adjustable.** Padding, colors, radii, fonts, sizing — anything a
host will reasonably want to change — should be a variable with a good default, so
integration is a token remap, not a patch.

## 6. Correctness & verification

**Verify with real behavior, not assumptions.** Prove changes with the real thing — drive a
headless browser with genuine interactions (real clicks, real keys), read computed styles,
take screenshots — rather than trusting that the code "should" work. Synthetic shortcuts that
bypass the real code path hide the exact bugs worth catching.

**Fix root causes, not symptoms.** Understand *why* something breaks before changing it
(specificity, event retargeting, caching, projection math…). A fix you can't explain is a
guess. Diagnose, then patch the cause.

**Smallest change that fully solves it.** Prefer targeted, well-scoped edits over sweeping
rewrites. Don't over-engineer; add abstraction only when a second real case demands it.

**Get the facts right.** When code depends on real-world data, verify it — search/confirm
rather than trusting memory, and flag anything genuinely ambiguous or disputed instead of
quietly picking one answer.

## 7. Change discipline & documentation

**Version deliberately.** Bump a visible version on any material change so what's running is
identifiable.

**Comment the why, not the what.** Code shows what it does; comments capture the reason,
especially for non-obvious choices and hard-won invariants ("this exists because…").

**Keep docs and code in step.** When behavior, data shape, or the theming contract changes,
update the README/spec in the same pass. Keep canonical copies in sync.

**Be honest about trade-offs and limits.** State known approximations, compromises, and
"not authoritative" caveats plainly. Cite data sources. Don't oversell; a flagged limitation
is worth more than a silent one.

## 8. Working with an AI assistant

**Ask when a decision is genuinely the user's; otherwise proceed and state assumptions.**
Don't block on questions that have a sensible default — make the reasonable choice, say so,
and keep moving.

**Deliver, then explain briefly.** Hand over the artifact and give a short, substantive note
on what changed and why — not a play-by-play. Show the diffs of intent, not every keystroke.

**Verify before claiming done.** "It works" means it was checked, not that it looks right.
