---
layout: layouts/case.liquid
tags: case
group: craft
order: 6
short: nested teams
topics: ["product-design", "access-control", "enterprise"]
title: "Nested teams & permission inheritance"
kicker: "feature design · enterprise access control"
lede: "When a contract with the European Union demanded thousands of users, Cycloid's flat team model broke. I designed a nested hierarchy with inherited, role-based permissions — scoping a hard problem into shippable surfaces and flagging every assumption early."
meta:
  - { label: "ROLE", value: "Senior Product Designer" }
  - { label: "SCOPE", value: "Discovery, IA, three connected surfaces" }
  - { label: "DRIVER", value: "EU contract — thousands of users" }
  - { label: "REFERENCES", value: "GitLab · GitHub group/subgroup models", mono: "mono" }
card:
  n: "02"
  kicker: "feature design · enterprise access control"
  title: "Cycloid — nested teams & permission inheritance"
  blurb: "Designed a nested team hierarchy with inherited, role-based permissions when an EU contract broke the flat model — scoping a complex problem into three shippable surfaces and flagging assumptions early."
  role: "Senior Product Designer"
next:
  label: "back to the work"
  title: "See all case studies"
  url: "/#work"
---
{% include "partials/bf-permissions.liquid" %}

<div class="case-sec"><div class="si">01 / the problem</div><div class="case-body">
<p>Cycloid's permission model used a flat team structure with manually assigned roles. The EU contract — thousands of users — broke it on two fronts.</p>
<p class="muted">Manual setup and maintenance at that scale was operationally unworkable, and the flat structure simply couldn't represent the organisational hierarchy the EU needed to maintain access control.</p>
</div></div>

<div class="case-sec"><div class="si">02 / discovery</div><div class="case-body">
<p>I ran competitor analysis to understand existing patterns. <strong>GitLab</strong> and <strong>GitHub</strong> were the primary references — both with well-documented group/subgroup inheritance — alongside a direct competitor. The research validated a nested team hierarchy with role-based inherited permissions as the right direction.</p>
</div></div>

<div class="case-sec"><div class="si">03 / key personas</div><div class="case-body" style="max-width:none"><div class="trio"><div><div class="n">01</div><h4>DevOps Admin</h4><p>Sets up and configures Cycloid; full access; owns the permission model itself.</p></div><div><div class="n">02</div><h4>Developer</h4><p>Occasional user; mostly consumes pipelines set up by DevOps and checks notifications.</p></div><div><div class="n">03</div><h4>Manager / Admin</h4><p>Needs summary and reporting information; doesn't touch the technical setup.</p></div></div></div></div>

<div class="case-sec"><div class="si">04 / design decisions</div><div class="case-body" style="max-width:none">
<div style="max-width:64ch"><p>With no defined limit from the Product Owner, I made reasonable assumptions to keep moving — and flagged them explicitly.</p></div>
<div class="demos" style="margin-bottom:24px"><div style="background:var(--tint)"><div class="a" style="color:var(--accent)">ASSUMPTION · FLAGGED</div><p style="font-size:14.5px">~15–20 members per team, up to <strong>4 levels deep</strong>.</p></div><div style="background:var(--tint)"><div class="a" style="color:var(--accent)">ASSUMPTION · FLAGGED</div><p style="font-size:14.5px">Permissions apply at <strong>project level</strong> — unblocking user-facing design from complex entity logic.</p></div></div>
<div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:20px;align-items:start">
<div class="pipe" style="margin:0"><div style="font-family:var(--mono);font-size:11px;color:var(--mute);letter-spacing:0.05em;margin-bottom:16px">TEAMS — COLLAPSIBLE TREE</div><div style="font-family:var(--mono);font-size:13px;line-height:2"><div style="display:flex;justify-content:space-between"><span><span style="color:var(--accent)">▾</span> Commission</span><span style="color:var(--mute);font-size:11.5px">214</span></div><div style="display:flex;justify-content:space-between;padding-left:20px"><span><span style="color:var(--accent)">▾</span> Directorate A</span><span style="color:var(--mute);font-size:11.5px">96</span></div><div style="display:flex;justify-content:space-between;padding-left:40px"><span><span style="color:#9aa0ab">▸</span> Platform</span><span style="color:var(--mute);font-size:11.5px">41</span></div><div style="display:flex;justify-content:space-between;padding-left:40px"><span><span style="color:#9aa0ab">▸</span> Security</span><span style="color:var(--mute);font-size:11.5px">23</span></div><div style="display:flex;justify-content:space-between;padding-left:20px"><span><span style="color:#9aa0ab">▸</span> Directorate B</span><span style="color:var(--mute);font-size:11.5px">118</span></div></div></div>
<div style="display:flex;flex-direction:column;gap:14px"><div style="border:1px solid var(--line);border-radius:6px;padding:18px 20px"><div style="font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:0.05em;margin-bottom:7px">SURFACE 01 · TEAMS PAGE</div><p style="margin:0;font-size:14px;line-height:1.55;color:var(--mute)">A collapsible tree; each node counts members across itself and all child teams.</p></div><div style="border:1px solid var(--line);border-radius:6px;padding:18px 20px"><div style="font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:0.05em;margin-bottom:7px">SURFACE 02 · USER PROFILE</div><p style="margin:0;font-size:14px;line-height:1.55;color:var(--mute)">Which teams a user belongs to, which permissions they hold and <em>where they originate</em> (inherited vs. direct), and their projects.</p></div><div style="border:1px solid var(--line);border-radius:6px;padding:18px 20px"><div style="font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:0.05em;margin-bottom:7px">SURFACE 03 · PROJECT VIEW</div><p style="margin:0;font-size:14px;line-height:1.55;color:var(--mute)">Which teams are assigned to a project, and the membership of those teams.</p></div></div>
</div>
</div></div>

<div class="case-sec"><div class="si">05 / outcome</div><div class="case-body">
<p>The user-facing work shipped and landed well. When the project moved into entity-level permissions — how components and environments behave under the model — it hit ambiguity at the product-definition level.</p>
<p class="muted">That was a product problem, not a design-execution one. The design correctly identified and surfaced the complexity early, rather than absorbing it silently.</p>
</div></div>

<div class="case-sec demos-sec" style="border-bottom:0"><div class="si">what this<br>demonstrates</div><div class="case-body" style="max-width:none"><div class="demos"><div><div class="a">&rarr;</div><p>Autonomous decision-making under ambiguity, with assumptions flagged to stakeholders.</p></div><div><div class="a">&rarr;</div><p>Scoping a complex enterprise problem into deliverable surfaces.</p></div><div><div class="a">&rarr;</div><p>Systems thinking across connected views — teams, users, projects.</p></div><div><div class="a">&rarr;</div><p>Pragmatic unblocking without waiting for perfect information.</p></div></div></div></div>
