/**
 * The shared article layout: a full-bleed hero over the dawn art, then a two-column body of
 * reading measure + a sticky "On this page" sidebar (design-system §3.3, §4.9). Used by journal
 * posts, corpus essays and work case-study detail. Below 960px the grid collapses and the sidebar
 * drops beneath the body (handled in CSS).
 */
import { esc, collapse, slugify } from "../util";
import { navBar, Section } from "./shell";
import { heroPicture, sectionLabel } from "../components";
import type { TocEntry } from "../components";

export interface ArticleHeroOpts {
  section: Section;
  backLabel: string; backHref: string;
  meta?: string;      // e.g. "4 July 2026 · Engineering · 8 min read"
  title: string;
  sub?: string;
}

/** The over-image article header with the nav rendered transparent inside it. */
export function articleHero(o: ArticleHeroOpts): string {
  return `<section class="hero hero--article">` +
    heroPicture("") +
    `<div class="hero__overlay"></div>` +
    navBar(o.section, true) +
    `<div class="hero__inner"><div class="hero__block">` +
      `<a class="backlink" href="${esc(o.backHref)}">&larr; ${esc(o.backLabel)}</a>` +
      (o.meta ? `<p class="jrow__meta" style="color:var(--text-strong);opacity:.85">${esc(o.meta)}</p>` : "") +
      `<h1 class="hero__h1" style="font-size:clamp(30px,4vw,44px)">${esc(o.title)}</h1>` +
      `<hr class="hero__rule">` +
      (o.sub ? `<p class="hero__sub">${esc(o.sub)}</p>` : "") +
    `</div></div></section>`;
}

/**
 * The over-image header for interior pages (studio, work, about, etc). The heading is centred over
 * the image, so it uses the balanced --page overlay (see css.ts) rather than the home/article veil.
 */
export function pageHero(o: { title: string; lede?: string; eyebrow?: string; section?: Section }): string {
  return `<section class="hero hero--page">` +
    heroPicture("") +
    `<div class="hero__overlay hero__overlay--page"></div>` +
    navBar(o.section ?? "", true) +
    `<div class="hero__inner"><div class="hero__block hero__block--center">` +
      (o.eyebrow ? sectionLabel(o.eyebrow) + `<div style="height:14px"></div>` : "") +
      `<h1 class="hero__h1" style="font-size:clamp(32px,4vw,44px)">${esc(o.title)}</h1>` +
      `<hr class="hero__rule">` +
      (o.lede ? `<p class="hero__sub" style="max-width:640px">${esc(o.lede)}</p>` : "") +
    `</div></div></section>`;
}

/**
 * Give every <h2>/<h3> in rendered markdown a stable id (deep-linkable passages, seo §2e) and
 * return the table of contents built from them. H2 are top-level TOC items, H3 are sub-items.
 */
export function withHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = collapse(inner.replace(/<[^>]+>/g, ""));
    let id = slugify(text) || "section";
    while (seen.has(id)) id += "-x";
    seen.add(id);
    toc.push({ id, text, sub: lvl === "3" });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

export interface ArticleLayoutOpts { hero?: string; body: string; aside?: string; }

/** Compose the article: optional hero, then the two-column reading grid. */
export function articleLayout(o: ArticleLayoutOpts): string {
  return (o.hero ?? "") +
    `<div class="article">` +
      `<div class="article__body prose">${o.body}</div>` +
      (o.aside ? `<aside class="article__aside">${o.aside}</aside>` : "") +
    `</div>`;
}
