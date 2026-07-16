/**
 * The page shell: <head> metadata, the shared nav (two states), the multi-column footer, the skip
 * link and the site script hook. Every template renders through page().
 *
 * Nav states (design-system §4.2, ia §4.3):
 *   - Over-hero pages (home, article) pass overHero:true; the template renders navBar(section,true)
 *     inside its hero (transparent, absolute) and page() omits the solid header.
 *   - Interior pages get the solid .siteheader bar with navBar(section,false).
 * Active state is by section membership; the current item carries aria-current="page".
 */
import { CANON, esc, collapse } from "../util";
import { fontPreload } from "../design/fonts";

const YEAR = 2026;
const DEFAULT_DESC =
  "Heliacon is a studio and consultancy at the intersection of search, AI and human intent. We make your knowledge legible to the machines that now read the web: found, cited and invocable.";

export type Section = "studio" | "work" | "research" | "journal" | "about" | "contact" | "";

// label, href, section key
const NAV_ITEMS: [string, string, Section][] = [
  ["Studio", "/studio/", "studio"],
  ["Work", "/work/", "work"],
  ["Research", "/research/", "research"],
  ["Journal", "/journal/", "journal"],
  ["About", "/about/", "about"],
  ["Contact", "/contact/", "contact"],
];

/** The nav bar. `over` picks the transparent-over-hero treatment. */
export function navBar(active: Section = "", over = false): string {
  const cur = (s: Section) => (s === active ? ` aria-current="page"` : "");
  const links = NAV_ITEMS.map(([label, href, s]) =>
    `<li><a class="nav__link" href="${href}"${cur(s)}>${esc(label)}</a></li>`).join("");
  const sheetLinks = NAV_ITEMS.map(([label, href, s]) =>
    `<li><a class="${s === "contact" ? "is-cta" : ""}" href="${href}"${cur(s)}>${esc(label)}</a></li>`).join("");
  return `<div class="nav${over ? " nav--over" : ""}">` +
    `<a class="nav__brand" href="/" aria-label="Heliacon home">` +
      `<img class="nav__logo" src="/assets/logo/wordmark-dawn.svg" alt="Heliacon" height="26"></a>` +
    `<ul class="nav__links">${links}</ul>` +
    `<button class="nav__toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-sheet"><span></span></button>` +
    `<div class="nav__sheet" id="nav-sheet"><ul>${sheetLinks}</ul></div>` +
    `</div>`;
}

/** The grouped footer (§4.16, ia §1.3): brand blurb, WORK / RESOURCES / COMPANY, machine row. */
export function footer(): string {
  const col = (head: string, links: [string, string][]) =>
    `<div class="footer__col"><p class="footer__col-h">${esc(head)}</p><ul>` +
    links.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join("") + `</ul></div>`;
  const machines = [
    ["MCP", "/.well-known/mcp.json"], ["JSON", "/origin.json"], ["Provenance", "/provenance"],
    ["Ask", "/ask?q=what+is+an+origin"], ["Feed", "/feed.xml"],
  ].map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join('<span aria-hidden="true"> &middot; </span>');
  return `<footer class="footer"><div class="container"><div class="footer__grid">` +
    `<div class="footer__col">` +
      `<div class="footer__brand-mark"><img class="footer__logo" src="/assets/logo/wordmark-dawn.svg" alt="Heliacon" height="22"></div>` +
      `<p class="footer__mission">We help organisations navigate uncertainty and build with confidence at the intersection of search, AI and human intent.</p>` +
    `</div>` +
    col("Work", [["Strategy", "/work/?type=strategy"], ["Research", "/work/?type=research"], ["Products", "/products/"], ["Partnerships", "/studio/#partnerships"], ["Studio", "/studio/"]]) +
    col("Resources", [["Journal", "/journal/"], ["Research", "/research/"], ["Case studies", "/work/"], ["Tools", "/products/"]]) +
    col("Company", [["About", "/about/"], ["Values", "/about/#values"], ["Approach", "/studio/#how-we-work"], ["Contact", "/contact/"]]) +
    `</div>` +
    `<div class="footer__machines"><span class="eyebrow">For machines</span>${machines}</div>` +
    `<div class="footer__base"><span>&copy; ${YEAR} Heliacon LLC &middot; All rights reserved.</span>` +
      `<span><a href="https://www.linkedin.com/in/petedainty" rel="noopener">LinkedIn</a> &middot; <a href="https://github.com/heliacon" rel="noopener">GitHub</a></span></div>` +
    `</div></footer>`;
}

export interface PageOpts {
  description?: string;
  jsonld?: unknown;
  alternates?: Record<string, string>;
  section?: Section;
  overHero?: boolean;   // template renders its own transparent nav inside a hero
  extraMeta?: string;
  ogType?: string;
}

/** Render a full HTML document. Body is the template's <main> content. */
export function page(title: string, body: string, canonicalPath: string, opts: PageOpts = {}): string {
  const {
    description = DEFAULT_DESC, jsonld, alternates = {}, section = "",
    overHero = false, extraMeta = "", ogType = "website",
  } = opts;
  const url = `${CANON}${canonicalPath}`;
  const alt = Object.entries(alternates)
    .map(([t, href]) => `<link rel="alternate" type="${t}" href="${href}">`).join("\n    ");
  const ld = jsonld
    ? `\n<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>` : "";
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(collapse(description))}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/assets/logo/mark-dawn-mono.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/logo/icon-180.png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Heliacon">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(collapse(description))}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${CANON}/assets/logo/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(collapse(description))}">
${fontPreload}
${extraMeta ? extraMeta + "\n" : ""}${alt ? "    " + alt + "\n" : ""}<link rel="stylesheet" href="/styles.css">${ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${overHero ? "" : `<header class="siteheader">${navBar(section, false)}</header>`}
<main id="main">${body}</main>
${footer()}
<script src="/assets/app.js" defer></script>
</body>
</html>`;
}
