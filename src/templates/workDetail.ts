/**
 * Work case-study / project detail, to ia-and-ux §2.4. Reuses the shared article layout: an
 * over-image hero, then a two-column body carrying the case-study spine (The problem / What we
 * built / What it does, live and inspectable / The shape of it) with a sticky "On this page" TOC.
 *
 * The spine and its live-endpoint bullets come from the rendered markdown (work.md for Case Study
 * Zero, the ARMX and Kenovar write-ups in build.ts) so every metric is a real count, never a
 * client KPI. The sidebar carries the TOC, related projects and the Markdown alternate; a
 * full-width CTA band closes the page (§2.4). British English, no em dash.
 */
import { CANON, esc, collapse } from "../util";
import { page } from "../layout/shell";
import { articleHero, withHeadingIds, articleLayout } from "../layout/article";
import { tocSidebar, relatedList, ctaLink } from "../components";

export interface WorkDetailOpts {
  slug: string; title: string; sub: string; kicker: string;
  htmlBody: string; jsonld: unknown; description: string;
  related: { href: string; title: string }[];
  mdAlternate?: string;
}

export function workDetail(o: WorkDetailOpts): string {
  const { html, toc } = withHeadingIds(o.htmlBody);
  const hero = articleHero({
    section: "work", backLabel: "Back to Work", backHref: "/work/",
    meta: o.kicker, title: o.title, sub: o.sub,
  });
  const aside =
    tocSidebar(toc) +
    relatedList(o.related.map((r) => ({ href: r.href, title: r.title, iconName: "connections" })), "/work/", "All work") +
    (o.mdAlternate ? `<div><span class="eyebrow">This page as</span><p class="machine-row" style="margin-top:12px"><a href="${esc(o.mdAlternate)}">Markdown</a></p></div>` : "");
  const cta = `
<section class="cta-band"><div class="container">
  <h2 style="margin-bottom:24px">Want this for your origin?</h2>
  ${ctaLink("Start a conversation", "/contact/?ref=work")}
</div></section>`;
  const content = articleLayout({ hero, body: html, aside }) + cta;
  return page(`${o.title} · Heliacon`, content, `/work/${o.slug}/`, {
    section: "work", overHero: true, jsonld: o.jsonld, ogType: "article",
    description: collapse(o.description),
    ...(o.mdAlternate ? { alternates: { "text/markdown": `${CANON}${o.mdAlternate}` } } : {}),
  });
}
