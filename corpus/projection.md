---
id: projection
title: Projection
kind: essay
version: 0.1
status: draft
author: Pete Dainty
updated: 2026-07-04
related: [origin, invocation, provenance]
---

# Projection

A **Projection** is a representation of the origin, rendered for a specific consumer.
HTML for a browser. JSON-LD for a crawler. `llms.txt` for a model. An MCP manifest for
an agent. Markdown for a repository. Each is a different face of the same truth.

The important word is *negotiated*. A projection is not assumed — it is selected by what
the consumer can actually use. The browser is not privileged, and neither is the agent.
Both ask, and both are answered, from one source.

Because every projection is generated from the same canonical origin, they cannot
contradict one another. The machine view and the human view are the same claim, shaped
differently. This is the property that makes an origin trustworthy: there is no "real"
version hidden behind a marketing one. What the agent reads is what the person reads.

Projection also reframes distribution. Publishing the same article to your site, to a
developer platform, and to a social feed is not three acts of writing — it is one
canonical entry and two **non-canonical projections** of it. The copies carry a
`rel=canonical` link home, so the origin keeps the authority and the reach compounds to
it rather than fragmenting across platforms. Cross-posting, done properly, is just
projection with attribution.

The discipline is to resist maintaining the same thing by hand in several formats.
That path always ends in drift. Instead, model it once, and let the build render the
rest. When the truth changes, you change the source, and every projection follows.

One origin. Many projections. It is both an architecture and a way of refusing to let
your identity fracture across the surfaces that carry it.
