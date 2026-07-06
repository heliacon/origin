# Origin architecture

This document describes how Heliacon is built. It is the technical companion to the manifesto.
The manifesto says why. This says how. It is also the reference for the architecture we bring to
client work: any organisation can be origin-first by the same construction.

## The one idea

There is a single canonical source. Every representation is generated from it and traces back to
it. Nothing authoritative exists that is not a projection of the origin.

```
origin (source of truth)  ->  projections (html, json, jsonld, markdown, llms.txt, mcp)
```

The origin is not a website with an API bolted on. The website is a projection, equal in standing
to the JSON and the MCP tools. The browser is not privileged. Neither is the agent.

## The origin

The origin is structured data plus a corpus, not prose.

- `origin.yaml` is the canonical identity: id, name, tagline, description, principles,
  capabilities, and the list of projections. It is authored first. `origin.md` is generated from
  it, not the other way round.
- `corpus/` holds the body of work. Each entry is a versioned document with an id, a title, a
  status, an author, an updated date, and its relationships to other entries.
- `definitions/` holds the canonical terms, each conforming to `schemas/definition.schema.json`.

Structured first means every projection is consistent by construction, because they are all
rendered from the same object.

## Projections

A projection is a representation of the origin, negotiated for a given consumer. The build renders
all of them from source in one pass:

- **HTML** for browsers.
- **JSON** and **JSON-LD** for agents and crawlers.
- **Markdown** for writers and for models that prefer it.
- **llms.txt** as a clean index for language models.
- **MCP** so an agent can call the origin as tools.

Projections are deterministic. The same source produces the same output every time. Adding a new
projection is adding a new renderer, never a new source of truth.

## Negotiation

One URL serves many representations. An edge worker reads the `Accept` header and returns the
representation the caller asked for. A browser asking for `text/html` and an agent asking for
`application/json` hit the same address and each gets what it can use. This is where "the browser
is not privileged" stops being a slogan and becomes code.

## Provenance

Every projection carries its lineage. A claim is not just from Heliacon, it is from this entry, at
this version, updated on this date, with a link back to its source. `/provenance` returns the
record for any item. Versioning is part of provenance: an origin evolves like software, so a
reader can pin what they cite.

## Capabilities

An origin is judged by what it can do. The capabilities are invocable at stable URLs and over MCP,
not merely described:

- **ask** retrieves the passages of the corpus that answer a question, each with its citation. No
  answer is generated at the origin. The caller synthesises from cited source.
- **definitions** returns a canonical definition as data.
- **provenance** returns the source and version of any item.

The MCP server at `/mcp` exposes these as tools. It is read-only over its own data, so it can be
consumed but not abused.

## Discovery

The origin advertises itself: `sitemap.xml`, `robots.txt`, `llms.txt`, an Atom feed, and a
manifest at `/.well-known/mcp.json` that lists the live capabilities and their endpoints. The
manifest describes only what actually resolves. It does not advertise capability that does not
exist.

## Build and deploy

The whole origin is one language, TypeScript, so the generator and the edge code share a runtime.
`build.ts` renders `dist/` from source. The same audit and content code runs locally and on the
edge. Deployment is a Cloudflare Worker with static assets, redeployed on every push to `main`.
`dist/` is never committed. It is a projection, and projections are rebuilt, never stored.

## Discipline

Every change answers one question. Does this make the origin more canonical. Not, does this make
the website prettier. The repository is the architecture. If the repository needs a framework to
explain itself, the architecture is wrong.

## Status

This repository is the reference implementation. The architecture may in time be published as an
open specification, so that others can implement it while Heliacon remains the canonical origin and
the reference build. The name is the moat, not the mechanism.
