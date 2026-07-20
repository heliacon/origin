/**
 * The shared interior layout: a short image banner (nav only, no text on the image), then a solid
 * content sheet pulled up over the hero so the heading and the content read as one held-together
 * unit (design-system §3.3, §4.9; the sheet-over-hero pattern). Used by journal posts, corpus
 * essays, work case-study detail, landmark docs, definitions and every index/marketing page.
 * Below 960px the article grid collapses and the sidebar drops beneath the body (handled in CSS).
 */
import { esc, collapse, slugify } from "../util";
import { navBar, Section } from "./shell";
import { heroBannerMesh, sectionLabel } from "../components";
import type { TocEntry } from "../components";

/**
 * The interior hero banner: image, a light overlay (top band for the over-hero nav, bottom blend)
 * and the transparent nav. No title, lede or eyebrow sits on the image; those live in the sheet.
 */
export function heroBanner(section: Section, variant: "hero--page" | "hero--article" = "hero--page"): string {
  return `<section class="hero ${variant}">` +
    heroBannerMesh(section) +
    navBar(section, true) +
    `</section>`;
}

export interface ArticleHeroOpts {
  section: Section;
  backLabel: string; backHref: string;
  meta?: string;      // e.g. "4 July 2026 · Engineering · 8 min read"
  title: string;
  sub?: string;
}

/** The article heading block, rendered inside the top of the sheet (never over the image). */
export function articleHead(o: ArticleHeroOpts): string {
  return `<header class="article__head">` +
    `<a class="backlink" href="${esc(o.backHref)}">&larr; ${esc(o.backLabel)}</a>` +
    (o.meta ? `<p class="article__meta">${esc(o.meta)}</p>` : "") +
    `<h1 class="article__h1">${esc(o.title)}</h1>` +
    `<hr class="sheet__rule">` +
    (o.sub ? `<p class="lede article__dek">${esc(o.sub)}</p>` : "") +
    `</header>`;
}

/**
 * Marketing-page shell, and now the shell for every index page (studio, work, research, about,
 * journal, contact, definitions, 404): the masthead, then just the TITLE in a sheet pulled over it,
 * then the page's sections flow on the paper below in their own rhythm, not trapped in one
 * container. Replaced the old pageHero glass box (removed 2026-07-20).
 *
 * The head is LEFT-aligned (design review 2026-07-20): centred, it put the sheet on a different
 * alignment logic from every section beneath it, so one page carried two axes 70px apart.
 *
 * `eyebrow` is optional and means one thing: the PARENT section this page sits under, read as a
 * breadcrumb. Do not pass it where it would only echo the title (STUDIO / Studio); an element that
 * always appears means nothing, which is the colour law applied to layout.
 */
export function marketingPage(o: { title: string; lede?: string; eyebrow?: string; section?: Section }, sections = ""): string {
  return heroBanner(o.section ?? "", "hero--page") +
    `<div class="sheet-wrap"><div class="sheet sheet--head">` +
      `<header class="sheet__head">` +
        (o.eyebrow ? sectionLabel(o.eyebrow) : "") +
        `<h1>${esc(o.title)}</h1>` +
        `<hr class="sheet__rule">` +
        (o.lede ? `<p class="lede">${esc(o.lede)}</p>` : "") +
      `</header>` +
    `</div></div>` +
    `<div class="marketing">${sections}</div>`;
}

/**
 * Give every <h2>/<h3> in rendered markdown a stable id (deep-linkable passages, seo §2e) and
 * return the table of contents built from them. H2 are top-level TOC items, H3 are sub-items.
 */
/** Decode the entities the markdown renderer emits in heading text (&#39; &amp; &quot; ...), so
 *  TOC labels don't re-escape into visible "&#39;" and slugs don't carry stray digits. */
const decodeEntities = (s: string): string =>
  s.replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)))
   .replace(/&#x([0-9a-f]+);/gi, (_m, n: string) => String.fromCodePoint(parseInt(n, 16)))
   .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function withHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = decodeEntities(collapse(inner.replace(/<[^>]+>/g, "")));
    let id = slugify(text) || "section";
    while (seen.has(id)) id += "-x";
    seen.add(id);
    toc.push({ id, text, sub: lvl === "3" });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

export interface ArticleLayoutOpts { hero?: ArticleHeroOpts; body: string; aside?: string; }

/**
 * Compose the article: banner, then one sheet holding the heading block and the two-column
 * reading grid (prose + sticky TOC sidebar), so the entire article is a single contained unit.
 */
export function articleLayout(o: ArticleLayoutOpts): string {
  return (o.hero ? heroBanner(o.hero.section, "hero--article") : "") +
    `<div class="sheet-wrap"><div class="sheet">` +
      `<div class="article">` +
        (o.hero ? articleHead(o.hero) : "") +
        `<div class="article__body prose">${o.body}</div>` +
        (o.aside ? `<aside class="article__aside">${o.aside}</aside>` : "") +
      `</div>` +
    `</div></div>`;
}
