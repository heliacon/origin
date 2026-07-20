/**
 * Research hub (/research/). Redesigned (2026-07) onto the marketing kit: the DEFINITIONS (Origin as
 * a keystone lead card, the other six in a grid), the two FOUNDATIONS landmarks, and a machine note
 * tying the vocabulary to /ask and the MCP manifest — each as its own section on the paper.
 *
 * The definitions are the single canonical vocabulary: each term defined once, versioned, carrying
 * its provenance. Presentational only; data is loaded and passed in by build.ts.
 */
import { Dict, esc, collapse } from "../util";
import { page } from "../layout/shell";
import { marketingPage } from "../layout/article";
import { sectionHead, linkCard } from "../components";

export function research(defs: Dict[], jsonld: unknown): string {
  const origin = defs.find((d) => d.id === "origin");
  const rest = defs.filter((d) => d.id !== "origin");
  const restCards = rest
    .map((d) => linkCard({
      kicker: "Definition", title: d.title, href: `/research/definitions/${d.id}/`,
      caption: collapse(d.summary), ctaLabel: "Read the definition",
    })).join("");
  const originCard = origin
    ? linkCard({
        kicker: "The keystone definition", title: origin.title, href: "/research/definitions/origin/",
        caption: collapse(origin.summary), ctaLabel: "Read the definition", wide: true,
      })
    : "";
  const foundations =
    linkCard({
      kicker: "Foundation", title: "Architecture", href: "/architecture/",
      caption: "How Heliacon is built. One canonical origin, many projections, negotiated for whoever asks.",
      ctaLabel: "Read the architecture",
    }) +
    linkCard({
      kicker: "Foundation", title: "Manifesto", href: "/manifesto/",
      caption: "The belief. Why we build origin-first, and what that commits us to.",
      ctaLabel: "Read the manifesto",
    });

  const definitions = `
<section class="section"><div class="container">
  ${sectionHead("Definitions", "The canonical vocabulary")}
  ${originCard}
  <div class="grid-3 cardgrid">${restCards}</div>
</div></section>`;

  const foundationsSec = `
<section class="section section--sunk"><div class="container">
  ${sectionHead("Foundations", "The landmarks")}
  <div class="grid-2 cardgrid">${foundations}</div>
</div></section>`;

  const machines = `
<section class="section"><div class="container container--text">
  ${sectionHead("For machines", "The vocabulary, machine-readable")}
  <p>This vocabulary is exactly what <a href="/ask?q=what+is+an+origin">/ask</a> retrieves, and every answer it returns cites its source. The same definitions are available to agents over the Model Context Protocol.</p>
  <p class="machine-row"><a href="/ask?q=what+is+an+origin">Ask</a><a href="/.well-known/mcp.json">MCP</a><a href="/provenance">Provenance</a></p>
</div></section>`;

  const body = marketingPage(
    { title: "Research", lede: "The canonical vocabulary behind the studio. The definitions the consulting applies, and what the ask endpoint retrieves.", section: "research" },
    definitions + foundationsSec + machines,
  );

  return page("Research · Heliacon", body, "/research/", {
    section: "research", overHero: true, jsonld,
    description: "The Heliacon canonical vocabulary: seven versioned definitions, the architecture and the manifesto. What the ask endpoint retrieves.",
  });
}
