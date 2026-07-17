/**
 * Landmark long-form document (Manifesto, Architecture). These are top-level for shareability
 * (ia §5.1) but belong to Research: they light RESEARCH in the nav and carry a light "part of
 * Research" affordance (the back link). Rendered in the clean reading layout: a banner page head,
 * then the two-column body with a sticky "On this page" TOC and the machine markdown alternate.
 *
 * The document schema is built by src/schema.ts and passed in as `jsonld`. Heading ids come from
 * withHeadingIds so passages are deep-linkable.
 */
import { CANON, esc } from "../util";
import { page, Section } from "../layout/shell";
import { withHeadingIds, articleLayout } from "../layout/article";
import { tocSidebar, sectionLabel } from "../components";

export interface DocOpts {
  slug: string; title: string; eyebrow: string; lede?: string;
  htmlBody: string; description: string; jsonld: unknown;
  section?: Section; mdAlternate?: string;
}

export function doc(o: DocOpts): string {
  const { html, toc } = withHeadingIds(o.htmlBody);

  const aside =
    tocSidebar(toc) +
    (o.mdAlternate
      ? `<div>${sectionLabel("This page as")}<p class="machine-row" style="margin-top:12px"><a href="${esc(o.mdAlternate)}">Markdown</a></p></div>`
      : "");

  const body = articleLayout({
    hero: {
      section: o.section ?? "research",
      backLabel: "Back to Research", backHref: "/research/",
      title: o.title,
      sub: o.lede,
    },
    body: html, aside,
  });

  return page(`${o.title} · Heliacon`, body, `/${o.slug}/`, {
    section: o.section ?? "research",
    overHero: true,
    jsonld: o.jsonld,
    description: o.description,
    ...(o.mdAlternate ? { alternates: { "text/markdown": `${CANON}/${o.slug}.md` } } : {}),
  });
}
