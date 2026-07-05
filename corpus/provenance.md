---
id: provenance
title: Provenance
kind: essay
version: 0.1
status: draft
author: Pete Dainty
updated: 2026-07-04
related: [origin, invocation, capability, privacy]
---

# Provenance

**Provenance** is the verifiable record of where knowledge and capability came from. It is
what lets a claim be *trusted* rather than merely *asserted* — and in a web where machines
synthesise answers from many sources, it is the scarce and valuable thing.

When a person read a page, they judged its credibility from context: the domain, the design,
the byline. An agent assembling an answer from a dozen origins has no such luxury and no
patience for it. It needs the source as data — who said this, from what, and when — attached
to the claim itself, in a form it can follow and cite. Provenance makes the source
first-class.

*Provenance by default* means every projection carries its lineage. The JSON, the HTML, and
the agent's cited answer all trace to the same origin and the same version. Nothing is
published as authoritative without a traceable path back to what substantiates it — a
definition, a reference implementation, a piece of research. Versioning is part of this: a
claim is not just "from Heliacon" but "from this entry, at this version," so that when the
truth is revised, older citations remain honest about what they cited.

This is also the difference between an origin that can be *cited* and one that can only be
*scraped*. Scraping takes the words and loses the source. Citation preserves the link, and
the link is where the value and the trust live. Citability, compounded over time, is a moat
that a competitor copying your pages cannot take, because they cannot copy being the source.

Provenance is where privacy and trust meet, too: an origin proves the lineage of what it
publishes while disclosing nothing it should not. Says who, from what, when — and no more.
