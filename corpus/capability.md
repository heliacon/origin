---
id: capability
title: Capability
kind: essay
version: 0.1
status: draft
author: Pete Dainty
updated: 2026-07-04
related: [invocation, provenance, origin]
---

# Capability

A **Capability** is a declared, invocable action an origin can perform or vouch for. It is
the origin's offer to *do work* — not merely to display content.

Most of the web is content: things to be read. That is the right shape for a human with
time and a screen. It is the wrong shape for an agent acting on someone's behalf, which
does not want a paragraph to interpret but an action it can take. Capability over content
is the shift from "here is what we know" to "here is what you can invoke."

A capability is specified, not implied. It has a name, a description, defined inputs and
outputs, and provenance. That specification is itself projected — into JSON for APIs, into
`llms.txt` for discovery, into an MCP manifest for agents — so that a machine can find and
use it without a bespoke integration or a human reading the docs. Discoverability is part
of the contract, not an afterthought.

Heliacon's first capabilities are deliberately modest and honest: `ask` a question of the
corpus and get a cited answer; retrieve a `definition` and its relationships; return the
`provenance` of a claim; expose `research` for retrieval. Each is a promise to do a small,
verifiable thing well.

A promise, though, is only as good as its backing. A capability that returns
unattributed or unverifiable results is available but not trustworthy — and in an agentic
internet, untrustworthy capabilities are invoked once and then routed around. So capability
and provenance are two halves of the same idea: the offer to do work, and the evidence that
the work can be believed.

Content tells you what an origin knows. Capability tells you what it can do for you. The
second is the one that gets used.
