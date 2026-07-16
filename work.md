# Work

Do not take our word for it. The clearest proof of origin-first is the thing you are reading it on. This site is built the way we build for clients, and every claim on it is inspectable.

## Case study zero: this origin

**The problem.** The next reader of your work is as likely to be a model assembling an answer as a person scrolling a page. Most sites are built only for the browser, so they are legible to people and opaque to machines. They cannot be found, trusted or invoked by the systems that increasingly decide what gets seen.

**What we built.** One canonical origin, projected for whoever asks. The same source of truth renders as HTML for browsers, JSON and JSON-LD for agents and crawlers, Markdown for writers and models, and MCP for tools. A single URL serves the right projection by content negotiation, with no separate API to keep in sync.

**What it does, live and inspectable:**

- **A working MCP server** at [/.well-known/mcp.json](/.well-known/mcp.json). An agent can call `ask`, `definitions` and `provenance` directly. No browser required.
- **Citation-first answers** at [/ask](/ask?q=what+is+an+origin). Ask the origin a question and every answer returns a canonical passage with its source. Nothing is generated, so nothing is invented.
- **A provenance API** at [/provenance](/provenance). For every item, where it came from and which version.
- **Structured data** that models a real firm: an Organization and ProfessionalService entity, a defined vocabulary, and per-article authorship and dates that a model can read and cite.
- **Source-available.** The whole build is open. Read it, run it, and check that it does what this page says.

**The shape of it:** seven canonical definitions, every answer cited, five projections from one source. Deterministic, so the same origin produces the same output every time.

This is exactly what we build for clients. The only difference is that we point it at your knowledge, your capabilities and your data instead of ours.

## Client work

Client engagements are underway. As they complete, the outcomes will appear here, each with the metric we moved and its provenance, on the same terms as everything else on this site: shown, not claimed.

## Work with us

[Start a conversation.](mailto:hello@heliacon.com?subject=Heliacon) We measure by invocation, not vanity traffic, and hand you the research, the reference implementation and the tools behind it.
