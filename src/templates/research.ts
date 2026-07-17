/**
 * Research hub (/research/), built to ia-and-ux §2.5 and design-system §4. The aggregator over the
 * durable body of work: the DEFINITIONS grid (seven canonical terms), the two FOUNDATIONS landmarks
 * (Architecture, Manifesto), and a quiet MACHINE NOTE tying the vocabulary to /ask and the MCP
 * manifest.
 *
 * The definitions are the single canonical vocabulary: each term defined once, versioned, and
 * carrying its provenance. Definition cards carry their canonical summary. Presentational only;
 * data is loaded and passed in by build.ts.
 */
import { Dict, esc, collapse } from "../util";
import { page } from "../layout/shell";
import { pageHero } from "../layout/article";
import { sectionLabel } from "../components";

const arw = `<span class="arw" aria-hidden="true">&rarr;</span>`;

/** A body-only card matching the collection index page build.ts renders for definitions. */
function linkCard(kicker: string, title: string, href: string, cap: string, cta = "Read"): string {
  return `<a class="card" href="${esc(href)}"><div class="card__body">` +
    (kicker ? `<span class="eyebrow card__kicker">${esc(kicker)}</span>` : "") +
    `<h3 class="card__title">${esc(title)}</h3>` +
    (cap ? `<p class="card__cap">${esc(cap)}</p>` : "") +
    `<span class="ctalink card__cta">${esc(cta)} ${arw}</span>` +
    `</div></a>`;
}

export function research(defs: Dict[], jsonld: unknown): string {
  // Feature Origin, the keystone term the other six derive from, as a full-width lead card so the
  // remaining six sit as two clean rows of three (no orphan card, stronger scent hierarchy).
  const origin = defs.find((d) => d.id === "origin");
  const rest = defs.filter((d) => d.id !== "origin");
  const restCards = rest
    .map((d) => linkCard("Definition", d.title, `/research/definitions/${d.id}/`, collapse(d.summary), "Read the definition"))
    .join("");
  const originCard = origin
    ? `<a class="card card--wide" href="/research/definitions/origin/"><div class="card__body">` +
        `<span class="eyebrow card__kicker">The keystone definition</span>` +
        `<h3 class="card__title">${esc(origin.title)}</h3>` +
        `<p class="card__cap">${esc(collapse(origin.summary))}</p>` +
        `<span class="ctalink card__cta">Read the definition ${arw}</span>` +
      `</div></a>`
    : "";
  const foundations =
    linkCard("Foundation", "Architecture", "/architecture/",
      "How Heliacon is built. One canonical origin, many projections, negotiated for whoever asks.", "Read the architecture") +
    linkCard("Foundation", "Manifesto", "/manifesto/",
      "The belief. Why we build origin-first, and what that commits us to.", "Read the manifesto");

  const body =
    pageHero({
      title: "Research",
      lede: "The canonical vocabulary behind the studio. The definitions the consulting applies, and what the ask endpoint retrieves.",
      eyebrow: "Research", section: "research",
    }) +

    `<section class="section"><div class="container">` +
      `<div class="section-head">${sectionLabel("Definitions", false, "h2")}</div>` +
      originCard +
      `<div class="grid-3" style="margin-top:var(--space-6)">${restCards}</div>` +
    `</div></section>` +

    `<section class="section--tight"><div class="container">` +
      `<div class="section-head">${sectionLabel("Foundations", false, "h2")}</div>` +
      `<div class="grid-2">${foundations}</div>` +
    `</div></section>` +

    `<section class="section--tight"><div class="container container--text">` +
      `<h2 class="eyebrow">For machines</h2>` +
      `<p class="small" style="color:var(--text-muted);margin-top:16px">` +
        `This vocabulary is exactly what <a href="/ask?q=what+is+an+origin">/ask</a> retrieves, and every answer it returns cites its source. ` +
        `The same definitions are available to agents over the Model Context Protocol.</p>` +
      `<p class="machine-row">` +
        `<a href="/ask?q=what+is+an+origin">Ask</a>` +
        `<a href="/.well-known/mcp.json">MCP</a>` +
        `<a href="/provenance">Provenance</a></p>` +
    `</div></section>`;

  return page("Research · Heliacon", body, "/research/", {
    section: "research", overHero: true, jsonld,
    description: "The Heliacon canonical vocabulary: seven versioned definitions, the architecture and the manifesto. What the ask endpoint retrieves.",
  });
}
