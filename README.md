# Heliacon Origin

**Be first light.**

This repository is the **canonical origin** for Heliacon — the single source of truth
from which every projection is derived.

Heliacon is a trusted origin for knowledge, capability, and provenance. It exists to
publish canonical research, expose trustworthy capabilities, and demonstrate how
organisations can become *origin-first* in an increasingly agentic internet.

## One origin, many projections

The same canonical source is rendered for whoever asks for it:

- HTML
- Markdown
- JSON
- JSON-LD
- `llms.txt`
- MCP
- future protocols

The browser is not privileged. Neither is the agent. **Every consumer negotiates the
projection most appropriate for its capabilities** — from one source of truth.

This repository documents and demonstrates that architecture.

## Structure

```
origin/
├── origin.yaml         # canonical identity (the root object)
├── origin.md           # a human projection of the identity
├── corpus/             # the body of work — essays & philosophy
├── definitions/        # canonical, structured definitions (the contracts)
├── schemas/            # JSON Schemas the definitions validate against
├── projections/        # generated outputs (html / json / jsonld / llms / mcp …)
├── diagrams/           # architecture diagrams
├── assets/             # brand assets (logo system)
└── .well-known/        # discovery endpoints
```

**Source of truth is structured.** Prose is a projection. `origin.yaml` and the
`definitions/*.yaml` are canonical; the Markdown and HTML are generated from them by the
build (see `build.py`). Edit the structured source, not the outputs.

## The five canonical definitions

1. [Origin](definitions/origin.yaml) — the canonical source of an organisation's identity, knowledge, capability and trust.
2. [Projection](definitions/projection.yaml) — a representation of the origin negotiated for a specific consumer.
3. [Invocation](definitions/invocation.yaml) — the successful use of a trusted capability to resolve an intent.
4. [Capability](definitions/capability.yaml) — a declared, invocable action the origin can perform or vouch for.
5. [Provenance](definitions/provenance.yaml) — the verifiable record of where knowledge and capability came from.

## Principles

- Provenance by default.
- Privacy by architecture.
- Capability over content.
- Invocation over attention.
- One origin. Many projections.

## Products

Products exist to demonstrate the research. **Apps prove. Games explore. Tools expose.
Research explains.**

## Success

We do not measure success by traffic. **We measure success by invocation.**

## Status

`v0.1` · draft. The architecture may become an open specification over time; the Heliacon
name and mark are trademarks of Heliacon LLC. See [LICENSE](LICENSE).

Author: Pete Dainty · Heliacon LLC · <https://heliacon.com>
