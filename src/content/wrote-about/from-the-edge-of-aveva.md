---
layout: layouts/post.liquid
tags: post
short: edge management
title: "Designing the edge"
subtitle: "Configuring IIoT edge devices shouldn't need a manual — a look at AVEVA Edge Management."
date: 2025-07-02
reading: "2 min read"
topics: ["product-design", "enterprise"]
related:
  - { url: "/wrote-about/aveva-procon/", title: "ProCon, rebuilt for usability" }
  - { url: "/work/aveva-ds/", title: "Unifying 150+ products across five tech stacks" }
  - { url: "/writing/", title: "More writing" }
---
<p class="lead">Starting work on a new product with a new team has its own challenges. For Edge Management, it was understanding the product manager's vision as well as the development team's real capacity.</p>

<img src="/uploads/aveva-edge-hero.png" alt="IIoT edge device" style="display:block;width:100%;border:1px solid var(--line2);border-radius:8px;margin:8px 0 32px">

<p>Once I moved into a larger design team at <a href="https://www.aveva.com/">AVEVA</a> with responsibility across a wider product portfolio, Edge Management was one of the applications I picked up.</p>

<p><a href="https://www.aveva.com/en/solutions/digital-transformation/edge-management/">AVEVA Edge Management</a> is an administrative web interface for configuring and maintaining IIoT (Industrial Internet of Things) edge devices — devices that could run AVEVA software and push operational telemetry to the cloud, for another of our products, Insight, to visualise for customers.</p>

<p>As an example: attach an edge device to an analog counter in a packaging plant that tracks how many boxes have been sealed. The count gets pushed to the cloud, visible from anywhere. Multiply that by hundreds of sensors across a plant, and by 50 plants across the globe, and you get a dashboard with real visibility over the whole operation.</p>

<p>I took the project over about six months after it started, inheriting an interface I then worked to bring in line with the company design standards we were starting to document at the time. The feature set was small but real: device registration and setup — single and bulk — plus device software installation and maintenance.</p>

<p>Here's a product demo of the UI I designed, recorded for YouTube.</p>

<div style="position:relative;padding-bottom:56.25%;height:0;margin:24px 0"><iframe src="https://www.youtube.com/embed/lOlDANusa30?si=1Bq4jWDgQU6X8XHn" title="AVEVA Edge Management product demo" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
