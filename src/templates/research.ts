/**
 * Research hub (/research/), built to ia-and-ux §2.5 and design-system §4. The aggregator over the
 * durable body of work: the CORPUS grid (seven essays), the DEFINITIONS grid (seven canonical
 * terms), the two FOUNDATIONS landmarks (Architecture, Manifesto), and a quiet MACHINE NOTE tying
 * the corpus to /ask and the MCP manifest.
 *
 * Essay cards are captioned from the essay's own opening line (real text, not the definition
 * summary, so the two grids do not read as duplicates). Definition cards carry their canonical
 * summary. Presentational only; data is loaded and passed in by build.ts.
 */
import { Dict, esc, collapse } from "../util";
import { page } from "../layout/shell";
import { pageHead, sectionLabel, ctaLink } from "../components";

const arw = `<span class="arw" aria-hidden="true">&rarr;</span>`;

/** A body-only card matching the collection index pages build.ts renders for corpus/definitions. */
function linkCard(kicker: string, title: string, href: string, cap: string, cta = "Read"): string {
  return `<a class="card" href="${esc(href)}"><div class="card__body">` +
    (kicker ? `<span class="eyebrow card__kicker">${esc(kicker)}</span>` : "") +
    `<h3 class="card__title">${esc(title)}</h3>` +
    (cap ? `<p class="card__cap">${esc(cap)}</p>` : "") +
    `<span class="ctalink card__cta">${esc(cta)} ${arw}</span>` +
    `</div></a>`;
}

/** First real sentence-or-two of an essay's markdown body, for a card caption. Strips the leading
 *  H1 and light markdown, collapses whitespace, and truncates on a word boundary. */
function firstPara(md: string, max = 150): string {
  const noH1 = String(md ?? "").replace(/^#\s+.*(?:\r?\n)+/, "");
  const block = noH1.split(/\r?\n\s*\r?\n/)[0] ?? "";
  const text = collapse(block.replace(/[#*_`>]/g, ""));
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
}

export function research(corpus: Dict[], defs: Dict[], jsonld: unknown): string {
  const essays = corpus
    .map((c) => linkCard("Essay", c.title, `/research/corpus/${c.slug}/`, firstPara(c.body_md)))
    .join("");
  const terms = defs
    .map((d) => linkCard("Definition", d.title, `/research/definitions/${d.id}/`, collapse(d.summary), "Read the definition"))
    .join("");
  const foundations =
    linkCard("Foundation", "Architecture", "/architecture/",
      "How Heliacon is built. One canonical origin, many projections, negotiated for whoever asks.", "Read the architecture") +
    linkCard("Foundation", "Manifesto", "/manifesto/",
      "The belief. Why we build origin-first, and what that commits us to.", "Read the manifesto");

  const body =
    pageHead("Research",
      "The canonical body of work behind the studio. The research the consulting applies, and what the ask endpoint retrieves.") +

    `<section class="section"><div class="container">` +
      `<div class="section-head">${sectionLabel("Corpus")}</div>` +
      `<div class="grid-3">${essays}</div>` +
    `</div></section>` +

    `<section class="section--tight"><div class="container">` +
      `<div class="section-head">${sectionLabel("Definitions")}</div>` +
      `<div class="grid-3">${terms}</div>` +
    `</div></section>` +

    `<section class="section--tight"><div class="container">` +
      `<div class="section-head">${sectionLabel("Foundations")}</div>` +
      `<div class="grid-2">${foundations}</div>` +
    `</div></section>` +

    `<section class="section--tight"><div class="container container--text">` +
      `<span class="eyebrow">For machines</span>` +
      `<p class="small" style="color:var(--text-muted);margin-top:16px">` +
        `This corpus is exactly what <a href="/ask?q=what+is+an+origin">/ask</a> retrieves, and every answer it returns cites its source. ` +
        `The same vocabulary and essays are available to agents over the Model Context Protocol.</p>` +
      `<p class="machine-row">` +
        `<a href="/ask?q=what+is+an+origin">Ask</a>` +
        `<a href="/.well-known/mcp.json">MCP</a>` +
        `<a href="/provenance">Provenance</a></p>` +
    `</div></section>`;

  return page("Research · Heliacon", body, "/research/", {
    section: "research", jsonld,
    description: "The Heliacon research corpus and vocabulary: seven essays, seven canonical definitions, the architecture and the manifesto. What the ask endpoint retrieves.",
  });
}
