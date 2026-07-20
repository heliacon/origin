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

// ── hero scene (§4.3, design-language §10: the chart as landscape) ─────────────
/** Three authored ridge silhouette sets. Each is far/mid/near/fore, anchored to the bottom of a
 *  1440x900 viewBox. On the tall home hero the whole landscape shows; on short interior mastheads
 *  the sheet crops to the sky, so each section's signature motif lives up high (see SCENES). */
const RIDGES: Record<string, { far: string; mid: string; near: string; fore: string; contour: string }> = {
  rolling: {
    far: "M0,528 C220,486 360,502 560,486 C772,468 904,512 1116,486 C1276,466 1372,500 1440,486 L1440,900 L0,900 Z",
    mid: "M0,646 C200,606 372,636 528,612 C724,582 868,640 1048,616 C1228,592 1344,632 1440,612 L1440,900 L0,900 Z",
    near: "M0,758 L184,714 L360,750 L556,702 L764,744 L980,706 L1188,746 L1440,714 L1440,900 L0,900 Z",
    fore: "M0,846 L248,822 L472,842 L724,820 L984,844 L1240,824 L1440,840 L1440,900 L0,900 Z",
    contour: "M0,556 C220,514 360,530 560,514 C772,496 904,540 1116,514 C1276,494 1372,528 1440,514",
  },
  peaks: {
    far: "M0,540 L180,468 L340,522 L520,436 L720,512 L920,448 L1140,522 L1320,466 L1440,510 L1440,900 L0,900 Z",
    mid: "M0,652 L220,582 L430,642 L650,556 L880,636 L1120,572 L1320,642 L1440,598 L1440,900 L0,900 Z",
    near: "M0,760 L200,704 L410,754 L620,688 L840,750 L1080,698 L1300,754 L1440,710 L1440,900 L0,900 Z",
    fore: "M0,848 L260,820 L500,846 L760,816 L1020,848 L1280,820 L1440,840 L1440,900 L0,900 Z",
    contour: "M0,548 L180,476 L340,530 L520,444 L720,520 L920,456 L1140,530 L1320,474 L1440,518",
  },
  plateau: {
    far: "M0,520 L360,520 L404,486 L840,486 L884,520 L1160,520 L1204,494 L1440,494 L1440,900 L0,900 Z",
    mid: "M0,642 L280,642 L324,600 L720,600 L764,642 L1080,642 L1124,610 L1440,610 L1440,900 L0,900 Z",
    near: "M0,752 L240,752 L284,716 L680,716 L724,752 L1040,752 L1084,724 L1440,724 L1440,900 L0,900 Z",
    fore: "M0,846 L1440,846 L1440,900 L0,900 Z",
    contour: "M0,530 L360,530 L404,496 L840,496 L884,530 L1160,530 L1204,504 L1440,504",
  },
};

interface SceneCfg {
  ridges: keyof typeof RIDGES;
  sun?: { x: number; y: number; r: number };   // viewBox coords + radius in px, or none
  stars: number;
  motif: "survey" | "contour" | "constellation" | "path" | "waypoint";
}

/** One composition per section, meaning-led (design-language §10). The signature motif sits high in
 *  the sky so it reads on interior mastheads where the sheet crops the ground away. */
const SCENES: Record<string, SceneCfg> = {
  home:     { ridges: "rolling", sun: { x: 980, y: 300, r: 58 }, stars: 7,  motif: "survey" },
  studio:   { ridges: "rolling", sun: { x: 720, y: 250, r: 78 }, stars: 5,  motif: "waypoint" },
  work:     { ridges: "peaks",   sun: { x: 1040, y: 220, r: 46 }, stars: 6, motif: "path" },
  research: { ridges: "plateau", stars: 10, motif: "contour" },
  journal:  { ridges: "rolling", sun: { x: 360, y: 210, r: 40 }, stars: 18, motif: "constellation" },
  about:    { ridges: "peaks",   sun: { x: 1060, y: 230, r: 52 }, stars: 6, motif: "path" },
  contact:  { ridges: "plateau", sun: { x: 720, y: 240, r: 36 }, stars: 7,  motif: "waypoint" },
};

/** Draw the section's signature survey motif as a sky layer (1440x900 viewBox). */
function sceneMotif(kind: SceneCfg["motif"], ridges: (typeof RIDGES)[string]): string {
  if (kind === "survey") {
    return `<path class="hero__contour" d="${ridges.contour}"/>` +
      `<circle class="hero__mk" cx="560" cy="512" r="4"/><circle class="hero__mk-ring" cx="560" cy="512" r="10"/>`;
  }
  if (kind === "contour") {
    const cx = 720, cy = 250;
    const rings = [0, 1, 2, 3, 4].map((i) =>
      `<ellipse class="hero__line" cx="${cx}" cy="${cy}" rx="${70 + i * 78}" ry="${34 + i * 40}"/>`).join("");
    return rings + `<circle class="hero__mk" cx="${cx}" cy="${cy}" r="4.5"/>`;
  }
  if (kind === "constellation") {
    const pts = [[300, 150], [470, 240], [640, 170], [560, 320], [820, 300], [980, 210], [1140, 280], [1250, 180]];
    const links = [[0, 1], [1, 2], [1, 3], [2, 4], [4, 5], [4, 6], [5, 7]]
      .map(([a, c]) => `<line class="hero__line" x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[c][0]}" y2="${pts[c][1]}"/>`).join("");
    const dots = pts.map((p, i) =>
      `<circle class="${i === 4 ? "hero__mk" : "hero__node"}" cx="${p[0]}" cy="${p[1]}" r="${i === 4 ? 5 : 3}"/>`).join("");
    return links + dots;
  }
  if (kind === "path") {
    const pts = [[120, 400], [300, 350], [470, 372], [650, 312], [840, 300], [1010, 244]];
    const line = `<polyline class="hero__trail" points="${pts.map((p) => p.join(",")).join(" ")}"/>`;
    const dots = pts.map((p, i) =>
      `<circle class="${i === pts.length - 1 ? "hero__mk" : "hero__node"}" cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 5 : 3}"/>`).join("");
    return line + dots;
  }
  // waypoint: a single reticle high on the horizon
  const cx = 720, cy = 250;
  return `<circle class="hero__line" cx="${cx}" cy="${cy}" r="26" fill="none"/>` +
    `<path class="hero__line" d="M${cx},${cy - 40}v14 M${cx},${cy + 26}v14 M${cx - 40},${cy}h14 M${cx + 26},${cy}h14"/>` +
    `<circle class="hero__mk" cx="${cx}" cy="${cy}" r="4.5"/>`;
}

/** The flat crisp vector hero for a section: a layered Prussian landscape at first light with a
 *  brass sun-disc (the heliacal rising, echoing the logo O) and the section's signature survey
 *  motif. Every layer is a parallax plane (data-parallax = depth factor; higher is farther and
 *  slower). Theme-independent, so the light hero text reads in both themes; app.js drives the
 *  parallax and it degrades to a still scene with no JS or under reduced motion. */
export function heroScene(variant: keyof typeof SCENES = "home"): string {
  const cfg = SCENES[variant] ?? SCENES.home;
  const R = RIDGES[cfg.ridges];
  const stars = Array.from({ length: cfg.stars }, (_, i) => {
    const x = ((i * 197 + 130) % 1400) + 20, y = ((i * 143 + 60) % 320) + 40;
    return `<circle cx="${x}" cy="${y}" r="1.6"/>`;
  }).join("");
  const sun = cfg.sun
    ? `<span class="hero__sun" data-parallax="0.46" style="left:${(cfg.sun.x / 1440 * 100).toFixed(1)}%;top:${(cfg.sun.y / 900 * 100).toFixed(1)}%;width:${cfg.sun.r * 2}px;height:${cfg.sun.r * 2}px;margin:${-cfg.sun.r}px 0 0 ${-cfg.sun.r}px"></span>`
    : "";
  const ridge = (cls: string, d: string, f: number) =>
    `<svg class="hero__ridge hero__ridge--${cls}" data-parallax="${f}" viewBox="0 0 1440 900" ` +
    `preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="${d}"/></svg>`;
  return `<div class="hero__scene" aria-hidden="true">` +
    `<div class="hero__sky"></div>` +
    `<svg class="hero__stars" data-parallax="0.5" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice">${stars}</svg>` +
    sun +
    `<svg class="hero__motif" data-parallax="0.4" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sceneMotif(cfg.motif, R)}</svg>` +
    ridge("far", R.far, 0.34) +
    ridge("mid", R.mid, 0.22) +
    ridge("near", R.near, 0.12) +
    ridge("fore", R.fore, 0.03) +
    `</div>`;
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
  const base = `<img class="hm hm-base" data-parallax="0.46" src="/assets/hero-mesh/atmos.webp" alt="" aria-hidden="true">`;
  // the heliacal star: first light rising behind the ridge (the brand's namesake, echoing the logo O)
  const star = (f: number) =>
    `<span class="hero__star" data-parallax="${f}" aria-hidden="true">` +
    `<svg viewBox="0 0 100 100"><path d="M50 6 L57 43 L94 50 L57 57 L50 94 L43 57 L6 50 L43 43 Z"/></svg></span>`;
  if (style === "solid") {
    const obj = object === "monolith" ? "monolith-solid" : "planes-a";
    const s = (file: string, f: number) =>
      `<img class="hm hm-al" data-parallax="${f}" src="/assets/hero-mesh/${file}.webp" alt="" aria-hidden="true">`;
    return `<div class="hero__mesh" aria-hidden="true">` + base +
      s("far-s", 0.4) + s("mid-s", 0.28) +
      s(obj, 0.2) + s("near-s", 0.12) + s("motes-a", 0.04) +
      star(0.42) + `</div>`;
  }
  const g = (name: string, f: number) =>
    `<img class="hm hm-scr" data-parallax="${f}" src="/assets/hero-mesh/${name}.webp" alt="" aria-hidden="true">`;
  return `<div class="hero__mesh" aria-hidden="true">` + base +
    g("far", 0.4) + g("mid", 0.28) + g(object, 0.2) + g("near", 0.12) + g("motes", 0.04) + `</div>`;
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
