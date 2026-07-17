/**
 * Corpus essay (/research/corpus/{slug}/), to ia-and-ux §2.7. The shared article layout: a
 * full-bleed hero over the dawn art, then a two-column body of reading measure plus a sticky aside.
 *
 * Aside: "On this page" (only when the essay has H2 sections, so short essays show no empty TOC),
 * the matching canonical definition, related essays, and the machine markdown alternate. The essay
 * markdown carries no `summary` frontmatter, so the dek falls back to the essay's opening line.
 *
 * The Article + BreadcrumbList schema is emitted by src/schema.ts and passed in as `jsonld`.
 */
import { CANON, Dict, esc, collapse } from "../util";
import { page } from "../layout/shell";
import { withHeadingIds, articleLayout } from "../layout/article";
import { tocSidebar, relatedList, ctaLink, sectionLabel } from "../components";

export interface CorpusRelated { href: string; title: string; }

/** The essay's opening paragraph as a dek fallback (essays carry no `summary` frontmatter). */
function leadFromHtml(html: string, max = 170): string {
  const m = html.match(/<p>([\s\S]*?)<\/p>/i);
  if (!m) return "";
  const text = collapse(m[1].replace(/<[^>]+>/g, ""));
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
}

export function corpusEssay(c: Dict, htmlBody: string, jsonld: unknown, hasDefinition: boolean, related: CorpusRelated[]): string {
  const { html, toc } = withHeadingIds(htmlBody);
  const dek = collapse(c.summary ?? "") || leadFromHtml(htmlBody);

  const aside =
    tocSidebar(toc) +
    (hasDefinition
      ? `<div>${sectionLabel("Definition")}<p style="margin-top:12px">${ctaLink(c.title, `/research/definitions/${esc(c.slug)}/`)}</p></div>`
      : "") +
    relatedList(related.map((r) => ({ href: r.href, title: r.title, iconName: "connections" })), "/research/", "All research") +
    `<div>${sectionLabel("This page as")}<p class="machine-row" style="margin-top:12px"><a href="/research/corpus/${esc(c.slug)}.md">Markdown</a></p></div>`;

  const content = articleLayout({
    hero: {
      section: "research", backLabel: "Back to Research", backHref: "/research/",
      meta: `Essay · v${c.version ?? "0.1"}`, title: String(c.title), sub: dek,
    },
    body: html, aside,
  });
  return page(`${c.title} · Heliacon`, content, `/research/corpus/${c.slug}/`, {
    section: "research", overHero: true, jsonld, ogType: "article",
    description: dek.slice(0, 155),
    alternates: { "text/markdown": `${CANON}/research/corpus/${c.slug}.md` },
  });
}
