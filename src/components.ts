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
  title: string; caption: string; href?: string; ctaLabel?: string;
  kicker?: string; image?: string; imageAlt?: string; iconName?: string; dataType?: string;
}
/** With `href` the whole card is the link target; without it the card renders as a static
 *  `.card--static` <div> (same chrome, no link affordance, no CTA row). */
export function projectCard(o: ProjectCardOpts): string {
  const media = o.image
    ? `<div class="card__media"><img src="${esc(o.image)}" alt="${esc(o.imageAlt ?? o.title)}" loading="lazy"></div>`
    : `<div class="card__media card__media--art">${cardArt(o.title)}</div>`;
  const body =
    `<div class="card__body">` +
      (o.kicker ? `<span class="eyebrow card__kicker">${esc(o.kicker)}</span>` : "") +
      `<h3 class="card__title">${esc(o.title)}</h3>` +
      `<p class="card__cap">${esc(o.caption)}</p>` +
      (o.href ? `<span class="ctalink card__cta">${esc(o.ctaLabel ?? "View project")} ${arw}</span>` : "") +
    `</div>`;
  const data = o.dataType ? ` data-type="${esc(o.dataType)}"` : "";
  return o.href
    ? `<a class="card" href="${esc(o.href)}"${data}>${media}${body}</a>`
    : `<div class="card card--static"${data}>${media}${body}</div>`;
}

/** A body-only link card: no media, so the words carry it. The right form for a vocabulary term or
 *  a landmark doc, where generative art would be noise. `wide` spans the grid as a keystone lead.
 *  Shared so the research hub and the definitions collection stay one system, not two. */
export interface LinkCardOpts {
  kicker?: string; title: string; caption?: string; href: string; ctaLabel?: string;
  wide?: boolean; titleTag?: "h2" | "h3";
}
export function linkCard(o: LinkCardOpts): string {
  const t = o.titleTag ?? "h3";
  return `<a class="card${o.wide ? " card--wide" : ""}" href="${esc(o.href)}"><div class="card__body">` +
    (o.kicker ? `<span class="eyebrow card__kicker">${esc(o.kicker)}</span>` : "") +
    `<${t} class="card__title">${esc(o.title)}</${t}>` +
    (o.caption ? `<p class="card__cap">${esc(o.caption)}</p>` : "") +
    `<span class="ctalink card__cta">${esc(o.ctaLabel ?? "Read")} ${arw}</span>` +
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


// ── generative card art (design-language §10: the motif kit, seeded per item) ──
/** A small deterministic PRNG seeded from a string, so the same card always draws the same art
 *  (stable across builds) while different cards vary. */
function seedRand(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h += 0x6d2b79f5; let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A compact motif from the hero's vocabulary, seeded per card/article: layered ridges, a
 *  topographic contour, a node graph, or signal bars. Prussian ground, one brass accent, crisp
 *  flat vector. Same kit as the hero, so a card and the horizon read as one world. */
export function cardArt(seed: string): string {
  const r = seedRand(seed || "heliacon");
  const kinds = ["ridges", "contour", "nodes", "signal"] as const;
  const kind = kinds[Math.floor(r() * kinds.length)];
  const W = 320, H = 180;
  let motif = "";
  if (kind === "ridges") {
    const band = (base: number, cls: string) => {
      const a = base - r() * 22, b = base - r() * 22, c = base - r() * 22;
      return `<path class="${cls}" d="M0,${a} C90,${a - 14} 150,${b + 12} 210,${b} C270,${b - 12} 300,${c} ${W},${c - 6} L${W},${H} L0,${H} Z"/>`;
    };
    const sun = `<circle class="ca-sun" cx="${210 + r() * 70}" cy="${44 + r() * 20}" r="14"/>`;
    motif = sun + band(96, "ca-r3") + band(120, "ca-r2") + band(150, "ca-r1");
  } else if (kind === "contour") {
    const cx = 90 + r() * 140, cy = 60 + r() * 60;
    const rings = Array.from({ length: 5 }, (_, i) =>
      `<ellipse class="ca-line" cx="${cx}" cy="${cy}" rx="${28 + i * 26}" ry="${18 + i * 17}"/>`).join("");
    motif = rings + `<circle class="ca-acc" cx="${cx}" cy="${cy}" r="3.4"/>`;
  } else if (kind === "nodes") {
    const pts = Array.from({ length: 6 }, () => [20 + r() * (W - 40), 24 + r() * (H - 48)]);
    const links = pts.slice(1).map((p, i) => {
      const q = pts[i];
      return `<line class="ca-line" x1="${q[0].toFixed(0)}" y1="${q[1].toFixed(0)}" x2="${p[0].toFixed(0)}" y2="${p[1].toFixed(0)}"/>`;
    }).join("");
    const accI = Math.floor(r() * pts.length);
    const dots = pts.map(([x, y], i) =>
      `<circle class="${i === accI ? "ca-acc" : "ca-node"}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${i === accI ? 4.5 : 3}"/>`).join("");
    motif = links + dots;
  } else {
    const n = 7, gap = W / (n + 1), accI = Math.floor(r() * n);
    motif = Array.from({ length: n }, (_, i) => {
      const x = gap * (i + 1), h = 24 + r() * 96;
      return `<rect class="${i === accI ? "ca-acc-f" : "ca-bar"}" x="${(x - 5).toFixed(0)}" y="${(H - 20 - h).toFixed(0)}" width="10" height="${h.toFixed(0)}" rx="2"/>`;
    }).join("");
  }
  return `<svg class="cardart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
    `<rect class="ca-bg" width="${W}" height="${H}"/>${motif}</svg>`;
}

// ── hero mesh (the "data terrain": generated wireframe layers, composited + parallaxed) ──
/** The five generated wire-mesh layers screened over the Prussian atmosphere, each an independent
 *  parallax plane. The grey backdrops the model painted are knocked out by the screen blend (light
 *  mesh survives, dark drops to navy); a colour tint + flat knock cool the whites toward Prussian
 *  and keep the brass ridge seam. Theme-independent atmosphere, so the light hero text reads in
 *  both themes. */
export function heroMesh(object: "monolith" | "planes" = "monolith", style: "glow" | "solid" = "glow"): string {
  // atmos is the opaque Prussian base. `glow` (default) screen-blends the pure-black wireframe
  // layers so the black drops out and everything reads as light. `solid` composites occluding
  // planes normally (the -s/-solid variants) — kept as an option pending a proper solid image set.
  const base = `<img class="hm hm-base" data-parallax="0.20" src="/assets/hero-mesh/atmos.webp" alt="" aria-hidden="true">`;
  // the heliacal star: first light rising behind the ridge (the brand's namesake, echoing the logo O)
  const star = (f: number) =>
    `<span class="hero__star" data-parallax="${f}" aria-hidden="true">` +
    `<svg viewBox="0 0 100 100"><path d="M50 6 L57 43 L94 50 L57 57 L50 94 L43 57 L6 50 L43 43 Z"/></svg></span>`;
  if (style === "solid") {
    const obj = object === "monolith" ? "monolith-solid" : "planes-a";
    const s = (file: string, f: number) =>
      `<img class="hm hm-al" data-parallax="${f}" src="/assets/hero-mesh/${file}.webp" alt="" aria-hidden="true">`;
    return `<div class="hero__mesh" aria-hidden="true">` + base +
      s("far-s", 0.17) + s("mid-s", 0.12) +
      s(obj, 0.085) + s("near-s", 0.05) + s("motes-a", 0.02) +
      star(0.19) + `</div>`;
  }
  const g = (name: string, f: number) =>
    `<img class="hm hm-scr" data-parallax="${f}" src="/assets/hero-mesh/${name}.webp" alt="" aria-hidden="true">`;
  return `<div class="hero__mesh" aria-hidden="true">` + base +
    g("far", 0.17) + g("mid", 0.12) + g(object, 0.085) + g("near", 0.05) + g("motes", 0.02) + `</div>`;
}

/**
 * The section motif: which vantage point on the data terrain each part of the site is seen from.
 *
 * ONE WORLD, DIFFERENT VANTAGE POINTS — not five identities. The atmosphere and both terrain layers
 * are shared by every section; only the SUBJECT layer changes. That is what makes the sections read
 * as connected rather than as separate microsites, and it is the same claim the site makes in words
 * (one origin, many projections) made in the art.
 *
 * The motif names are deliberately the same four the card art draws from (cardArt below), so a
 * section's masthead and the cards inside it come from one vocabulary instead of two.
 */
const SECTION_MOTIF: Record<string, string> = {
  studio: "monolith",    // the landmark you come to: the offer
  work: "nodes",         // the graph and its connections
  research: "contour",   // the vocabulary mapped as terrain
  journal: "horizon",    // first light on the ridge: the heliacal rising, the namesake
  about: "signal",       // the single lit path
  contact: "signal",
};

/**
 * The section subject, drawn at hero scale from the SAME motif kit as cardArt (design-language §10).
 * Parametric SVG rather than a raster layer: resolution-independent and hairline-sharp, which the
 * locked style demands ("softness reads as AI photo"), palette-locked because the colours are
 * tokens, and literally the same vocabulary as the cards inside the section rather than a matched
 * imitation of it.
 *
 * COMPOSITION CONSTRAINT, and it drives every motif below: on an interior page the content sheet
 * covers everything from y=220 down and is 1120px wide, so the only reliably visible art is the
 * strip between the nav (~72px) and the sheet. Every subject is therefore a WIDE, LOW-PROFILE band
 * living in y 70..210, never a centred object. Each also leaves the region around x=47% quieter,
 * where the heliacal star sits.
 *
 * Deterministic: seeded from the motif name, so a given section draws the same subject every build.
 */
export function heroMotif(kind: string): string {
  const r = seedRand(`heliacon-${kind}`);
  const W = 1600, H = 520;
  const n = (v: number) => v.toFixed(1);
  let art = "";

  if (kind === "monolith") {
    // the landmark: one vertical rising out of the terrain, ringed like the home hero
    // top sits below the nav band: the outer ring at cy-ry must clear ~72px of over-hero chrome
    const x = 1080, top = 104, base = 250, w = 46;
    art =
      `<ellipse class="hmo-line" cx="${x + w / 2}" cy="${top + 6}" rx="240" ry="40"/>` +
      `<ellipse class="hmo-acc-s" cx="${x + w / 2}" cy="${top + 16}" rx="150" ry="26"/>` +
      `<path class="hmo-line" d="M${x},${base} L${x},${top + 26} L${x + w / 2},${top + 12} L${x + w},${top + 26} L${x + w},${base} Z"/>` +
      `<line class="hmo-acc" x1="${x + w / 2}" y1="${top + 12}" x2="${x + w / 2}" y2="${base}"/>`;
  } else if (kind === "nodes") {
    // the graph: a wide open network strung across the band, one lit path through it
    const pts: number[][] = [];
    for (let i = 0; i < 11; i++) {
      const x = 90 + i * 142 + (r() - 0.5) * 70;
      const y = 96 + r() * 104;
      pts.push([x, y]);
    }
    art = pts.slice(1).map((p, i) =>
      `<line class="hmo-line" x1="${n(pts[i][0])}" y1="${n(pts[i][1])}" x2="${n(p[0])}" y2="${n(p[1])}"/>`).join("");
    // one continuous brass path through three consecutive nodes: the single lit route
    const a = 6;
    art += `<polyline class="hmo-acc" points="${pts.slice(a, a + 3).map((p) => `${n(p[0])},${n(p[1])}`).join(" ")}"/>`;
    art += pts.map(([x, y], i) =>
      `<circle class="${i >= a && i < a + 3 ? "hmo-dot-acc" : "hmo-dot"}" cx="${n(x)}" cy="${n(y)}" r="${i >= a && i < a + 3 ? 5 : 3.6}"/>`).join("");
  } else if (kind === "contour") {
    // the vocabulary mapped: wide flat isolines, one term at the centre of the reading
    const cx = 1120, cy = 150;
    art = Array.from({ length: 6 }, (_, i) =>
      `<ellipse class="hmo-line" cx="${cx}" cy="${cy}" rx="${70 + i * 78}" ry="${16 + i * 17}"/>`).join("");
    art += `<circle class="hmo-dot-acc" cx="${cx}" cy="${cy}" r="5"/>`;
  } else if (kind === "horizon") {
    // first light on the ridge: the heliacal rising, the name itself
    const pts: string[] = [];
    let y = 186;
    for (let x = 0; x <= W; x += 100) { y += (r() - 0.5) * 26; pts.push(`${x},${n(y)}`); }
    art = `<polyline class="hmo-line" points="${pts.join(" ")}"/>`;
    // the lit segment of the crest, and the point of first light rising off it
    art += `<polyline class="hmo-acc" points="${pts.slice(9, 13).join(" ")}"/>`;
    art += `<circle class="hmo-dot-acc" cx="1090" cy="118" r="5.5"/>`;
  } else if (kind === "signal") {
    // the single lit path: a measurement read across the band, one reading that matters
    const count = 26, gap = W / (count + 1), accI = 17;
    art = Array.from({ length: count }, (_, i) => {
      const x = gap * (i + 1), h = 22 + r() * 96;
      return `<line class="${i === accI ? "hmo-acc" : "hmo-line"}" x1="${n(x)}" y1="${n(206 - h)}" x2="${n(x)}" y2="206"/>`;
    }).join("");
    art += `<circle class="hmo-dot-acc" cx="${n(gap * (accI + 1))}" cy="106" r="5"/>`;
  } else {
    return "";
  }

  return `<svg class="hmo" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${art}</svg>`;
}

/** The interior masthead: the same world as the home hero but read as the SKY above it — the
 *  theme-aware atmosphere (dusk / night), the solid horizon rising to meet the content sheet, and
 *  the heliacal star. The sheet pulls up over the lower part, so this reads as a calm band of sky
 *  and horizon, with the section's own subject sitting in it.
 *
 *  Sections with no motif (products, 404, bare docs) get the shared sky alone, which is a legible
 *  fallback rather than a gap: no subject means no section to name. */
export function heroBannerMesh(section = ""): string {
  const img = (cls: string, file: string, f: number) =>
    `<img class="hm ${cls}" data-parallax="${f}" src="/assets/hero-mesh/${file}.webp" alt="" aria-hidden="true">`;
  const motif = SECTION_MOTIF[section];
  return `<div class="hero__mesh hero__mesh--band" aria-hidden="true">` +
    img("hm-base", "atmos", 0.16) +
    // NO terrain layers. The band is the SKY above the world, which is what this masthead always
    // claimed to be; the terrain belongs to the home hero, where the whole scene is in frame. With
    // the sheet gone there is no horizon line for a crest to meet, and a short band cover-crops a
    // 16:9 source to sky anyway. Dropping far-s and mid-s also takes 1.08MB off every interior page.
    (motif ? `<span class="hm hm-subject" data-parallax="0.095">${heroMotif(motif)}</span>` : "") +
    `<span class="hero__star hero__star--band" data-parallax="0.15" aria-hidden="true">` +
    `<svg viewBox="0 0 100 100"><path d="M50 6 L57 43 L94 50 L57 57 L50 94 L43 57 L6 50 L43 43 Z"/></svg></span>` +
    `</div>`;
}

// ── marketing sections (studio/work/research redesign) ────────────────────────
/** A section header: mono eyebrow + Garamond H2 + optional lede. Left-aligned by default (editorial
 *  hierarchy); pass center for the rare centred head. */
export function sectionHead(eyebrow: string, title: string, lede?: string, align: "left" | "center" = "left"): string {
  return `<div class="shead shead--${align}">` +
    `<p class="eyebrow eyebrow--accent shead__k">${esc(eyebrow)}</p>` +
    `<h2 class="shead__h">${esc(title)}</h2>` +
    (lede ? `<p class="lede shead__lede">${esc(lede)}</p>` : "") +
    `</div>`;
}

/** Feature / principle cards: a bordered card with an accent eyebrow, serif title and one line of
 *  body. No image — the text-forward counterpart to projectCard (used for "how we work", facets). */
export interface Feature { kicker?: string; title: string; body: string; icon?: string; }
export function featureGrid(items: Feature[], cols: 2 | 3 = 3): string {
  const card = (f: Feature) =>
    `<div class="feature">` +
      (f.icon ? `<span class="feature__icon">${icon(f.icon)}</span>` : "") +
      (f.kicker ? `<span class="eyebrow eyebrow--accent feature__k">${esc(f.kicker)}</span>` : "") +
      `<h3 class="feature__title">${esc(f.title)}</h3>` +
      `<p class="feature__body">${esc(f.body)}</p>` +
    `</div>`;
  return `<div class="features features--${cols}">${items.map(card).join("")}</div>`;
}

/** An ordered process laid out horizontally on a connecting line, each stage a numbered node. */
export interface ProcessStep { n: string; title: string; body: string; }
export function processSteps(steps: ProcessStep[]): string {
  return `<ol class="process">` + steps.map((s) =>
    `<li class="process__step"><span class="process__n">${esc(s.n)}</span>` +
      `<h3 class="process__title">${esc(s.title)}</h3>` +
      `<p class="process__body">${esc(s.body)}</p></li>`).join("") + `</ol>`;
}

export { esc, collapse };
