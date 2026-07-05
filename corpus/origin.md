---
id: origin
title: Origin
kind: essay
version: 0.1
status: draft
author: Pete Dainty
updated: 2026-07-04
related: [projection, provenance, capability, sovereignty]
---

# Origin

An **Origin** is the canonical source of an organisation's identity, knowledge,
capabilities, and trust. It is the one thing everything else is a copy of.

The web taught us to build for a single consumer: the browser. Everything — the
markup, the metadata, the marketing — was arranged so that a person with a screen
could read it. Machines were served leftovers: a sitemap, some structured data, a
scraped approximation of what the page really meant.

That assumption no longer holds. The consumers of an organisation are now plural and
unequal in capability: people, crawlers, models, and agents, each able to consume
something different. When you build for only one of them, the others get a degraded,
drifting copy — and drift is where trust dies. The moment the machine-readable claim
and the human-readable page disagree, neither can be believed.

An origin resolves this by inverting the order. You do not publish a website and
generate data from it. You publish a **source of truth** and generate every
representation — the website included — from that. The homepage is not the origin; it
is one projection of it. So is the JSON, the `llms.txt`, and the agent manifest.

This is why an origin is *structured first*. Prose is a projection, not the master.
Identity, definitions, capabilities, and provenance are modelled as data, versioned
like software, and addressed canonically. Every representation inherits those
properties for free: consistency by construction, provenance by default, and a single
place to change when the truth changes.

Heliacon is built as an origin so that it can demonstrate one. The claim is simple: in
an agentic internet, the organisations that endure will be the ones with a canonical
origin — not the ones with the best-looking page.
