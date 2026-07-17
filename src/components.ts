/**
 * The Heliacon shared component library, built to design-system.md §4. Every visual primitive the
 * templates compose lives here so later template work never re-implements a card or a CTA. Each
 * export returns an HTML string, is typed, single-responsibility and composable.
 *
 * Conventions: text is escaped at the boundary; class names match src/design/css.ts; icons come
 * from src/icons.ts. Presentational only — no data loading, no business logic.
 */
import { esc, collapse } from "./util";
import { icon } from "./icons";

const arw = `<span class="arw" aria-hidden="true">&rarr;</span>`;

// ── labels ──────────────────────────────────────────────────────────────────
/** Mono uppercase section label / eyebrow (§2.3). `accent` tints it Dawn amber.
 *  `tag` renders it as a real heading where the label is the section's only heading (WCAG 1.3.1:
 *  card grids whose card titles are h3 need an h2 between them and the page h1). The `.eyebrow`
 *  class overrides every element-level h2 style, so the two renderings are visually identical. */
export const sectionLabel = (text: string, accent = false, tag: "span" | "h2" = "span"): string =>
  `<${tag} class="eyebrow${accent ? " eyebrow--accent" : ""}">${esc(text)}</${tag}>`;
export const eyebrow = sectionLabel;

/** Standard interior page header: optional eyebrow, H1, lede, inside a text container. */
export function pageHead(title: string, lede?: string, eyebrowText?: string): string {
  return `<section class="pagehead"><div class="container">` +
    (eyebrowText ? sectionLabel(eyebrowText) + `<div style="height:16px"></div>` : "") +
    `<h1>${esc(title)}</h1>` +
    (lede ? `<p class="lede">${esc(lede)}</p>` : "") +
    `</div></section>`;
}

// ── CTAs (§4.4) ─────────────────────────────────────────────────────────────
export interface CtaOpts { quiet?: boolean; disabled?: boolean; newTab?: boolean; ariaLabel?: string; }
/** Inline link-CTA with trailing arrow. The dominant CTA form across the site. */
export function ctaLink(label: string, href: string, opts: CtaOpts = {}): string {
  const cls = `ctalink${opts.quiet ? " ctalink--quiet" : ""}`;
  const attrs = [
    `class="${cls}"`,
    opts.disabled ? `aria-disabled="true"` : `href="${esc(href)}"`,
    opts.newTab ? `target="_blank" rel="noopener"` : "",
    opts.ariaLabel ? `aria-label="${esc(opts.ariaLabel)}"` : "",
  ].filter(Boolean).join(" ");
  return `<a ${attrs}>${esc(label)} ${arw}</a>`;
}

export interface ButtonOpts { href?: string; type?: string; iconOnly?: boolean; ariaLabel?: string; disabled?: boolean; }
/** Filled amber button (rare: form submit / newsletter). Icon-only variant for the arrow. */
export function filledButton(label: string, opts: ButtonOpts = {}): string {
  const cls = `btn${opts.iconOnly ? " btn--icon" : ""}`;
  const inner = opts.iconOnly ? `${arw}` : esc(label);
  if (opts.href) return `<a class="${cls}" href="${esc(opts.href)}"${opts.ariaLabel ? ` aria-label="${esc(opts.ariaLabel)}"` : ""}>${inner}</a>`;
  return `<button class="${cls}" type="${esc(opts.type ?? "submit")}"${opts.disabled ? " disabled" : ""}${opts.ariaLabel ? ` aria-label="${esc(opts.ariaLabel)}"` : ""}>${inner}</button>`;
}

// ── what-we-do row (§4.5) ────────────────────────────────────────────────────
export interface WwdItem { icon: string; title: string; caption: string; href?: string; }
/** The five-cell icon row. Plain cells, no card chrome. */
export function whatWeDoRow(items: WwdItem[]): string {
  const cell = (it: WwdItem) => {
    const inner =
      `<span class="wwd__icon">${icon(it.icon)}</span>` +
      `<span class="wwd__title">${esc(it.title)}</span>` +
      `<span class="wwd__cap">${esc(it.caption)}</span>`;
    return it.href
      ? `<a class="wwd__cell" href="${esc(it.href)}">${inner}</a>`
      : `<div class="wwd__cell">${inner}</div>`;
  };
  return `<div class="wwd">${items.map(cell).join("")}</div>`;
}

/** Star-bullet list variant of what-we-do (About / values, §4.5). Items may carry <strong>. */
export function starList(items: string[]): string {
  return `<ul class="starlist">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

// ── project / work card (§4.6) ───────────────────────────────────────────────
export interface ProjectCardOpts {
  title: string; caption: string; href: string; ctaLabel?: string;
  kicker?: string; image?: string; imageAlt?: string; iconName?: string; dataType?: string;
}
export function projectCard(o: ProjectCardOpts): string {
  const media = o.image
    ? `<div class="card__media"><img src="${esc(o.image)}" alt="${esc(o.imageAlt ?? o.title)}" loading="lazy"></div>`
    : `<div class="card__media"><div class="card__ph">${icon(o.iconName ?? "products")}</div></div>`;
  return `<a class="card" href="${esc(o.href)}"${o.dataType ? ` data-type="${esc(o.dataType)}"` : ""}>` +
    media +
    `<div class="card__body">` +
      (o.kicker ? `<span class="eyebrow card__kicker">${esc(o.kicker)}</span>` : "") +
      `<h3 class="card__title">${esc(o.title)}</h3>` +
      `<p class="card__cap">${esc(o.caption)}</p>` +
      `<span class="ctalink card__cta">${esc(o.ctaLabel ?? "View project")} ${arw}</span>` +
    `</div></a>`;
}

// ── journal row (§4.7) ───────────────────────────────────────────────────────
export interface JournalRowOpts { href: string; meta: string; title: string; summary?: string; thumb?: string; iconName?: string; dataType?: string; }
export function journalRow(o: JournalRowOpts): string {
  const thumb = o.thumb
    ? `<span class="jrow__thumb"><img src="${esc(o.thumb)}" alt="" loading="lazy"></span>`
    : `<span class="jrow__thumb"><span class="card__ph">${icon(o.iconName ?? "signals")}</span></span>`;
  return `<a class="jrow" href="${esc(o.href)}"${o.dataType ? ` data-type="${esc(o.dataType)}"` : ""}>` +
    thumb +
    `<span class="jrow__body">` +
      `<span class="jrow__meta">${esc(o.meta)}</span>` +
      `<span class="jrow__title">${esc(o.title)}</span>` +
      (o.summary ? `<span class="jrow__sum">${esc(o.summary)}</span>` : "") +
    `</span></a>`;
}

// ── filter tabs (§4.8) ───────────────────────────────────────────────────────
export interface Tab { label: string; value: string; href?: string; }
/** Links for no-JS resilience; app.js enhances them to client-side filters. */
export function filterTabs(tabs: Tab[], activeValue = "all"): string {
  return `<div class="tabs" role="tablist" data-filter-tabs>` +
    tabs.map((t) => {
      const active = t.value === activeValue;
      return `<a class="tab${active ? " tab--active" : ""}" role="tab" aria-selected="${active}" ` +
        `data-filter="${esc(t.value)}" href="${esc(t.href ?? `?type=${t.value}`)}">${esc(t.label)}</a>`;
    }).join("") +
    `</div>`;
}

// ── on-this-page TOC (§4.9) ──────────────────────────────────────────────────
export interface TocEntry { id: string; text: string; sub?: boolean; }
export function tocSidebar(entries: TocEntry[]): string {
  if (!entries.length) return "";
  const items = entries.map((e) =>
    `<a class="toc__item${e.sub ? " toc__item--sub" : ""}" href="#${esc(e.id)}">${esc(e.text)}</a>`).join("");
  return `<nav class="toc" aria-label="On this page">` +
    `<span class="eyebrow toc__head">On this page</span>` +
    `<div class="toc__list">${items}</div></nav>`;
}

// ── pullquote (§4.10) ────────────────────────────────────────────────────────
export function pullquote(text: string, cite?: string): string {
  return `<blockquote class="pullquote"><p>${esc(text)}</p>${cite ? `<cite>&mdash; ${esc(cite)}</cite>` : ""}</blockquote>`;
}

// ── code block (§4.12) ───────────────────────────────────────────────────────
export function codeBlock(code: string, label?: string): string {
  return `<div class="codeblock">` +
    (label ? `<div class="codeblock__label">${esc(label)}</div>` : "") +
    `<pre><code>${esc(code)}</code></pre></div>`;
}

// ── tag chip (§4.11) ─────────────────────────────────────────────────────────
export interface ChipOpts { href?: string; active?: boolean; }
export function tagChip(label: string, opts: ChipOpts = {}): string {
  const cls = `chip${opts.active ? " is-active" : ""}`;
  return opts.href ? `<a class="${cls}" href="${esc(opts.href)}">${esc(label)}</a>` : `<span class="${cls}">${esc(label)}</span>`;
}
export const chipCluster = (labels: string[], label = "Tags"): string =>
  `<div>${sectionLabel(label)}<div class="chips" style="margin-top:12px">${labels.map((l) => tagChip(l)).join("")}</div></div>`;

// ── related list (§4.14) ─────────────────────────────────────────────────────
export interface RelatedItem { href: string; title: string; thumb?: string; iconName?: string; }
export function relatedList(items: RelatedItem[], allHref?: string, allLabel = "View all articles"): string {
  if (!items.length) return "";
  const rows = items.map((it) => {
    const thumb = it.thumb
      ? `<span class="related__thumb"><img src="${esc(it.thumb)}" alt="" loading="lazy"></span>`
      : `<span class="related__thumb"><span class="card__ph">${icon(it.iconName ?? "connections")}</span></span>`;
    return `<a class="related__item" href="${esc(it.href)}">${thumb}<span class="related__title">${esc(it.title)}</span></a>`;
  }).join("");
  return `<div><span class="eyebrow" style="margin-bottom:16px">Related</span>${rows}` +
    (allHref ? `<div style="margin-top:8px">${ctaLink(allLabel, allHref)}</div>` : "") + `</div>`;
}

// ── newsletter box (§4.15) — build it; render only when a handler exists (ia gap 6) ──
export interface NewsletterOpts { title?: string; caption?: string; action?: string; }
export function newsletterBox(o: NewsletterOpts = {}): string {
  return `<form class="newsletter" action="${esc(o.action ?? "/subscribe")}" method="post">` +
    `<span class="newsletter__icon">${icon("evidence")}</span>` +
    `<h3>${esc(o.title ?? "Like what you read?")}</h3>` +
    `<p class="caption">${esc(o.caption ?? "Field notes and research, now and then. No noise.")}</p>` +
    `<div class="newsletter__row">` +
      `<label class="sr-only" for="nl-email">Email address</label>` +
      `<input class="field" id="nl-email" name="email" type="email" placeholder="you@example.com" required>` +
      filledButton("", { iconOnly: true, ariaLabel: "Subscribe" }) +
    `</div></form>`;
}

// ── stat block (§4.18) — honesty-safe: pass real receipts, never fabricated figures ──
export interface Stat { n: string; c: string; href?: string; }
export function statBlock(stats: Stat[]): string {
  return `<div class="stats">` + stats.map((s) => {
    const inner = `<span class="stat__n">${esc(s.n)}</span><span class="stat__c">${esc(s.c)}</span>`;
    return s.href ? `<a href="${esc(s.href)}" style="color:inherit">${inner}</a>` : `<div>${inner}</div>`;
  }).join("") + `</div>`;
}

// ── contact field (§4.17) ────────────────────────────────────────────────────
export interface FieldOpts { name: string; label: string; type?: string; placeholder?: string; required?: boolean; textarea?: boolean; }
export function contactField(o: FieldOpts): string {
  const id = `f-${o.name}`;
  const control = o.textarea
    ? `<textarea id="${id}" name="${esc(o.name)}" placeholder="${esc(o.placeholder ?? "")}"${o.required ? " required" : ""}></textarea>`
    : `<input id="${id}" name="${esc(o.name)}" type="${esc(o.type ?? "text")}" placeholder="${esc(o.placeholder ?? "")}"${o.required ? " required" : ""}>`;
  return `<div class="field"><label for="${id}">${esc(o.label)}</label>${control}<span class="field__err" hidden></span></div>`;
}

// ── hero (§4.3) ──────────────────────────────────────────────────────────────
/** Responsive <picture> for the full-bleed hero, AVIF -> WebP -> JPEG (seo HEL-038). */
export function heroPicture(alt: string): string {
  const set = (ext: string) =>
    `/assets/hero/hero-640.${ext} 640w, /assets/hero/hero-1024.${ext} 1024w, /assets/hero/hero-1535.${ext} 1535w`;
  return `<picture class="hero__media">` +
    `<source type="image/avif" srcset="${set("avif")}" sizes="100vw">` +
    `<source type="image/webp" srcset="${set("webp")}" sizes="100vw">` +
    `<img src="/assets/hero/hero-1535.jpg" srcset="${set("jpg")}" sizes="100vw" alt="${esc(alt)}" fetchpriority="high" decoding="async">` +
    `</picture>`;
}

export { esc, collapse };
