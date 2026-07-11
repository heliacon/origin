/**
 * Heliacon origin build. Projects the canonical source into many representations.
 *
 *     origin.yaml + definitions/*.yaml + corpus/*.md
 *         -> dist/                     (the deployable site + machine projections)
 *
 * One source of truth, many projections. The browser is not privileged; neither is the
 * agent. Run:  npm run build   (outputs to ./dist)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { marked } from "marked";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const CANON = "https://heliacon.com";

type Dict = Record<string, any>;

// ── loading ────────────────────────────────────────────────────────────────
// js-yaml parses `2026-07-04` into a Date; project it back to a plain YYYY-MM-DD string
// Do it at load, so every projection is consistent, JSON included.
function normDates(v: any): any {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (Array.isArray(v)) return v.map(normDates);
  if (v && typeof v === "object") { for (const k in v) v[k] = normDates(v[k]); return v; }
  return v;
}

const loadYaml = (p: string): Dict => normDates((yaml.load(readFileSync(p, "utf8")) as Dict) ?? {});

function parseFrontmatter(text: string): { meta: Dict; body: string } {
  // Match an explicit fenced block. Splitting on '---' silently swallows the whole body when
  // the closing fence is missing, and truncates on a '---' inside a value.
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (m) {
    const meta = normDates((yaml.load(m[1]) as Dict) ?? {});
    return { meta, body: text.slice(m[0].length).trim() };
  }
  return { meta: {}, body: text.trim() };
}

function listFiles(dir: string, ext: string): string[] {
  const d = join(ROOT, dir);
  return existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(ext)).sort() : [];
}

function loadCorpus(): Dict[] {
  return listFiles("corpus", ".md").map((f) => {
    try {
      const { meta, body } = parseFrontmatter(readFileSync(join(ROOT, "corpus", f), "utf8"));
      return { ...meta, body_md: body, slug: meta.id ?? f.replace(/\.md$/, "") };
    } catch (e) { throw new Error(`corpus/${f}: ${(e as Error).message}`); }
  });
}

const loadDefinitions = (): Dict[] =>
  listFiles("definitions", ".yaml").map((f) => {
    try { return loadYaml(join(ROOT, "definitions", f)); }
    catch (e) { throw new Error(`definitions/${f}: ${(e as Error).message}`); }
  });

// The notes stream: posts, newest first.
function loadPosts(): Dict[] {
  return listFiles("posts", ".md")
    .map((f): Dict => {
      try {
        const { meta, body } = parseFrontmatter(readFileSync(join(ROOT, "posts", f), "utf8"));
        return { ...meta, body_md: body, slug: meta.id ?? f.replace(/\.md$/, "") };
      } catch (e) { throw new Error(`posts/${f}: ${(e as Error).message}`); }
    })
    .sort((a, b) => String(b.published ?? "").localeCompare(String(a.published ?? "")));
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function fmtDate(d: unknown): string {
  const [y, m, day] = String(d ?? "").split("-");
  return m ? `${Number(day)} ${MONTHS[Number(m) - 1]} ${y}` : String(d ?? "");
}

// ── helpers ──────────────────────────────────────────────────────────────────
const esc = (s: unknown): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const collapse = (s: unknown): string => String(s ?? "").split(/\s+/).join(" ").trim();

// dates from js-yaml come back as Date. Project them as YYYY-MM-DD
const jsonReplacer = (_k: string, v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : v;

// ── html projection ──────────────────────────────────────────────────────────

// The site stylesheet. Written once to /styles.css and linked, so a browser fetches it once
// and caches it across every page, rather than re-parsing an inline copy on each request.
const CSS = `@font-face{font-family:Cinzel;font-weight:500;font-display:swap;src:url(/assets/fonts/cinzel-500.woff2) format("woff2")}
@font-face{font-family:Cinzel;font-weight:600;font-display:swap;src:url(/assets/fonts/cinzel-600.woff2) format("woff2")}
:root{--navy:#0E1533;--ink:#0B1029;--cream:#F4ECD8;--gold:#E7B23C;--dim:#9aa0b8}
*{box-sizing:border-box}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ink);color:var(--cream);font:400 18px/1.65 "Iowan Old Style",Palatino,"Palatino Linotype",Georgia,serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;padding:44px 24px 96px}
a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
header.mast{display:flex;flex-direction:column;gap:16px;margin-bottom:56px}
header.mast img{width:min(340px,72%);height:auto;display:block}
.tag{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:var(--gold)}
h1,h2,h3{font-weight:600;letter-spacing:-.01em;line-height:1.15}
h1,h3{font-family:Cinzel,"Iowan Old Style",Palatino,Georgia,serif;letter-spacing:.02em}
h1{font-size:38px;margin:0 0 8px}
h2{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);font-family:ui-sans-serif,system-ui,sans-serif;margin:78px 0 20px}
h3{font-size:24px;margin:0 0 6px}
p{margin:0 0 18px}
.lede{font-size:22px;color:var(--cream)}
ul{padding-left:1.1em}li{margin:6px 0}
.card{display:block;padding:20px 22px;margin:10px 0;border:1px solid #2a3050;border-radius:14px;background:#141a38;transition:border-color .15s,transform .1s}
.card:hover{border-color:var(--gold);transform:translateY(-1px);text-decoration:none}
.card .k{font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.card h3{margin:8px 0 4px;color:var(--cream)}
.card p{margin:0;color:var(--dim);font-size:16px}
.archive{margin:18px 0 10px;border-top:1px solid #2a3050}
.arow{display:block;padding:22px 4px;border-bottom:1px solid #2a3050;transition:padding-left .12s ease}
.arow:hover{padding-left:10px;text-decoration:none}
.arow .ad{display:block;font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.arow .at{display:block;font-family:Cinzel,"Iowan Old Style",Palatino,Georgia,serif;font-size:22px;color:var(--cream);letter-spacing:.02em;margin:7px 0 5px;line-height:1.2}
.arow:hover .at{color:var(--gold)}
.arow .ax{display:block;color:var(--dim);font-size:16px;line-height:1.5}
.diagram{margin:40px 0 8px}.diagram img{width:100%;height:auto;display:block}
.center{text-align:center}
.post-meta{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.04em;color:var(--dim);margin:0 0 30px}
.post h2{font-family:Cinzel,"Iowan Old Style",Palatino,Georgia,serif;font-size:23px;letter-spacing:.02em;text-transform:none;color:var(--cream);margin:38px 0 14px}
.post blockquote{margin:26px 0;padding:14px 20px;border-left:2px solid var(--gold);background:#141a38;border-radius:0 10px 10px 0}
.post blockquote p{margin:0;color:var(--dim);font-size:15px;line-height:1.6}
.post figure.fig{margin:28px 0}
.post figure.fig img{width:100%;display:block;border-radius:12px;border:1px solid #2a3050}
.post figcaption{margin-top:10px;color:var(--dim);font-size:14px;line-height:1.55}
.post figcaption strong{color:var(--cream)}
.post .tablewrap{overflow-x:auto;border:1px solid #2a3050;border-radius:12px}
.post table{width:100%;border-collapse:collapse;font-size:16px;line-height:1.5}
.post thead th{text-align:left;font:600 12px/1.3 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);background:#141a38;padding:13px 18px;border-bottom:1px solid #2a3050;white-space:nowrap}
.post tbody td{padding:13px 18px;color:var(--cream);vertical-align:top;border-bottom:1px solid #1c2344}
.post tbody tr:last-child td{border-bottom:none}
.post tbody td strong{color:var(--gold);font-weight:600}
.cta{display:inline-block;background:var(--gold);color:var(--ink);font:600 15px/1 ui-sans-serif,system-ui,sans-serif;padding:14px 24px;border-radius:12px;margin-top:6px}
.cta-row{display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:16px}
.more{color:var(--cream);opacity:.85;font:600 14px/1 ui-sans-serif,system-ui,sans-serif;text-decoration:none;border-bottom:1px solid rgba(244,236,216,.3);padding-bottom:3px}
.more:hover{opacity:1;border-bottom-color:var(--gold)}
.fineprint{font-size:13px;color:var(--dim);max-width:640px;margin-top:14px}
.cta:hover{filter:brightness(1.08);text-decoration:none}
.hero{position:relative;left:50%;right:50%;width:100vw;margin-left:-50vw;margin-right:-50vw;margin-top:-44px;min-height:94vh;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(11,16,41,.95),rgba(11,16,41,.7) 30%,rgba(11,16,41,.2) 52%,rgba(11,16,41,.6)),url(/assets/hero.jpg) center 20%/cover no-repeat;background-color:var(--ink)}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:22px 26px}
.topbar .wm img{width:150px;height:auto;display:block}
.status{font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.05em;color:var(--dim);display:flex;align-items:center;gap:7px}
.status i{width:7px;height:7px;border-radius:50%;background:#33a06a;box-shadow:0 0 9px #33a06a}
.status.off i{background:#8890b4;box-shadow:none}
.hero-in{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;width:100%;max-width:760px;margin:0 auto;padding:20px 24px 90px}
.fl{font-size:clamp(40px,7vw,66px);line-height:1.05;margin:0 0 12px;color:var(--cream);text-shadow:0 2px 34px rgba(0,0,0,.55)}
.fl .gold{color:var(--gold)}
.sub{font-size:20px;color:#e3e7f5;margin:0 0 34px;text-shadow:0 1px 22px rgba(0,0,0,.7)}
.askbox{display:flex;align-items:center;gap:8px;width:min(640px,100%);background:rgba(18,24,54,.66);backdrop-filter:blur(8px);border:1px solid #3a4778;border-radius:14px;padding:6px 6px 6px 20px;transition:border-color .15s}
.askbox:focus-within{border-color:var(--gold)}
.askbox input{flex:1;min-width:0;background:none;border:0;outline:0;color:var(--cream);font:400 17px/1.4 "Iowan Old Style",Palatino,Georgia,serif;padding:14px 0}
.askbox input::placeholder{color:#8f97ba}
.askbox button{flex:none;width:44px;height:44px;border-radius:10px;border:0;background:var(--gold);color:var(--ink);font:700 20px/1 serif;cursor:pointer}
.askbox button:hover{filter:brightness(1.08)}
.hint{font-size:14px;color:#8f97ba;margin:16px 0 0}
.answers{width:min(640px,100%);margin:22px auto 0;display:grid;gap:10px;text-align:left}
.answers .ans{display:block;padding:14px 16px;border:1px solid #2a3050;border-radius:12px;background:rgba(18,24,54,.72)}
.answers .ans:hover{border-color:var(--gold);text-decoration:none}
.answers .ans-t{display:block;font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.answers .ans-x{display:block;color:#c9cee6;font-size:15px}
.pillars{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin:10px 0 44px}
.pillar{display:block;padding:18px 18px 20px;border:1px solid #2a3050;border-radius:14px;background:#141a38;transition:border-color .15s,transform .1s}
.pillar:hover{border-color:var(--gold);transform:translateY(-1px);text-decoration:none}
.pillar svg{width:24px;height:24px;stroke:var(--gold);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;display:block;margin-bottom:12px}
.pillar .p-n{display:block;font-family:Cinzel,"Iowan Old Style",Palatino,Georgia,serif;font-size:19px;color:var(--cream);letter-spacing:.02em;margin-bottom:5px}
.pillar .p-l{display:block;color:var(--dim);font-size:14px;line-height:1.5}
.proj{font:500 13px/1.8 ui-sans-serif,system-ui,sans-serif;color:var(--dim)}
.proj a{color:var(--dim);border:1px solid #2a3050;border-radius:999px;padding:4px 12px;margin:0 6px 8px 0;display:inline-block}
.proj a:hover{color:var(--gold);border-color:var(--gold);text-decoration:none}
footer{margin-top:72px;padding-top:24px;border-top:1px solid #2a3050;font:400 14px/1.7 ui-sans-serif,system-ui,sans-serif;color:var(--dim)}
.back{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}
.topnav{display:flex;gap:18px;flex-wrap:wrap;align-items:center;font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.05em}
.topnav a{color:var(--cream);opacity:.82}
.topnav a:hover{color:var(--gold);opacity:1;text-decoration:none}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px 24px;flex-wrap:wrap;margin-bottom:44px;padding-bottom:18px;border-bottom:1px solid #2a3050}
.nav-wm img{width:128px;height:auto;display:block}
.skip{position:absolute;left:-9999px;top:0;background:var(--gold);color:var(--ink);padding:10px 16px;border-radius:0 0 10px 0;font:600 14px/1 ui-sans-serif,system-ui,sans-serif;z-index:20}
.skip:focus{left:0}
a:focus-visible,button:focus-visible,input:focus-visible,.cta:focus-visible,.card:focus-visible,.pillar:focus-visible,.arow:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}*{transition:none !important;animation:none !important}}
article h2{font-family:ui-sans-serif,system-ui,sans-serif}`;

// Dependency-free minifiers. Safe for this project's hand-written CSS and generated markup.
const minifyCss = (css: string): string =>
  css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").replace(/\s+/g, " ").trim();

function minifyHtml(html: string): string {
  const keep: string[] = [];
  const stashed = html.replace(/<(pre|code|textarea|script)[\s\S]*?<\/\1>/gi, (m) => `\x00${keep.push(m) - 1}\x00`);
  // NB: do not collapse `>\s+<` — that eats significant whitespace between adjacent inline
  // elements (e.g. two links separated by only a space run together). Collapsing runs of 2+
  // whitespace to a single space is enough and preserves inline spacing.
  const min = stashed.replace(/<!--[\s\S]*?-->/g, "").replace(/\s{2,}/g, " ").trim();
  return min.replace(/\x00(\d+)\x00/g, (_, i) => keep[Number(i)]);
}

interface PageOpts { description?: string; jsonld?: unknown; alternates?: Record<string, string>; header?: boolean; extraMeta?: string; }

const DEFAULT_DESC = "Heliacon is a studio and consultancy that makes companies origin-first: found, trusted and invoked by the machines that now read the web.";

// Primary site navigation, buyer-first. Shared by the homepage hero and every interior header.
const NAV_LINKS: [string, string][] = [
  ["/consulting/", "Services"],
  ["/products/", "Products"],
  ["/notes/", "Research"],
  ["/manifesto/", "Manifesto"],
  ["mailto:hello@heliacon.com?subject=Consulting", "Contact"],
];
const navLinks = (): string => NAV_LINKS.map(([h, t]) => `<a href="${h}">${t}</a>`).join("");

function page(title: string, body: string, canonicalPath: string, opts: PageOpts = {}): string {
  const { description = DEFAULT_DESC, jsonld, alternates = {}, header = true, extraMeta = "" } = opts;
  const url = `${CANON}${canonicalPath}`;
  const alt = Object.entries(alternates)
    .map(([t, href]) => `<link rel="alternate" type="${t}" href="${href}">`)
    .join("\n    ");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/assets/logo/mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/logo/icon-180.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Heliacon">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${CANON}/assets/logo/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
${extraMeta ? extraMeta + "\n" : ""}    ${alt}
<link rel="stylesheet" href="/styles.css">${jsonld ? `\n<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>` : ""}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="wrap">
${header ? `<header class="nav"><a href="/" class="nav-wm" aria-label="Heliacon">${logoImg()}</a><nav class="topnav">${navLinks()}</nav></header>` : ""}
<main id="main">${body}</main>
<footer>
  <a href="/consulting/">Services</a> ·
  <a href="/notes/">Research</a> ·
  <a href="/corpus/">Corpus</a> ·
  <a href="/definitions/">Definitions</a> ·
  <a href="/products/">Products</a> ·
  <a href="/manifesto/">Manifesto</a> ·
  <a href="/architecture/">Architecture</a> ·
  <a href="/.well-known/mcp.json">MCP</a> ·
  <a href="/origin.json">JSON</a><br>
  One origin, many projections · © 2026 Heliacon LLC
</footer>
</div>
</body>
</html>`;
}

// Reference the wordmark as an external image so the browser caches it once, rather than
// inlining ~12KB of SVG into the homepage HTML.
const logoImg = (): string => '<img src="/assets/logo/wordmark.svg" alt="Heliacon">';

// Minimal line icons for the seven pillars, drawn to a common 24x24 grid.
const ICON: Record<string, string> = {
  origin: '<circle cx="12" cy="12" r="3.4"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9"/>',
  projection: '<circle cx="4.5" cy="12" r="1.6"/><path d="M6 12h14M6.4 11l13-5.4M6.4 13l13 5.4"/>',
  invocation: '<path d="M13 2.5 4.5 13.5H11l-1.5 8 8.5-11H11z"/>',
  capability: '<path d="M12 2.6l8.2 4.7v9.4L12 21.4 3.8 16.7V7.3z"/>',
  provenance: '<path d="M12 2.6l7.4 2.7v5.6c0 4.6-3.2 7.4-7.4 9-4.2-1.6-7.4-4.4-7.4-9V5.3z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
  privacy: '<rect x="5" y="10.6" width="14" height="9.4" rx="2"/><path d="M8 10.6V7a4 4 0 0 1 8 0v3.6"/>',
  sovereignty: '<path d="M4 18.5h16M4.5 18l1.1-9.2 4.7 3.9L12 6l1.7 6.7 4.7-3.9 1.1 9.2"/>',
};
const icon = (id: string): string => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id] ?? ICON.origin}</svg>`;

const PILLAR_LINE: Record<string, string> = {
  origin: "One canonical source. Everything derives from it.",
  projection: "HTML, JSON, MCP. Rendered for whoever asks.",
  invocation: "Measured by use, not attention.",
  capability: "What an origin can do, not just publish.",
  provenance: "Citable. Verifiable. Always.",
  privacy: "No tracking. No profiling. Yours stays yours.",
  sovereignty: "You hold the origin. No one rents it to you.",
};

function homeHtml(origin: Dict, defs: Dict[], posts: Dict[]): string {
  const byId = Object.fromEntries(defs.map((d) => [d.id, d]));
  const notes = posts.slice(0, 6).map((p) =>
    `<a class="arow" href="/notes/${p.slug}/"><span class="ad">${fmtDate(p.published)}</span>` +
    `<span class="at">${esc(p.title)}</span><span class="ax">${esc(collapse(p.summary ?? ""))}</span></a>`).join("");
  const order = ["origin", "projection", "invocation", "capability", "provenance", "privacy", "sovereignty"];
  const pillars = order.map((id) => byId[id]).filter(Boolean).map((d) =>
    `<a class="pillar" href="/definitions/${d.id}/">${icon(d.id)}` +
    `<span class="p-n">${esc(d.title)}</span>` +
    `<span class="p-l">${esc(PILLAR_LINE[d.id] ?? collapse(d.summary))}</span></a>`).join("");

  const body = `
<section class="hero">
  <header class="topbar">
    <a href="/" aria-label="Heliacon" class="wm">${logoImg()}</a>
    <nav class="topnav">${navLinks()}<span class="status" id="status"><i></i>Origin online</span></nav>
  </header>
  <div class="hero-in">
    <h1 class="fl">Be <span class="gold">the first light</span>.</h1>
    <p class="sub">Heliacon is a studio and consultancy. We make you the origin the machines that now read the web find, trust and invoke, not the page they skip.</p>
    <p class="cta-row"><a class="cta" href="/consulting/">Work with us</a> <a class="more" href="#ask-panel">or ask our origin &rarr;</a></p>
  </div>
</section>

<h2 id="services">Work with Heliacon</h2>
<p class="lede">The reader is now as often a machine as a person. We make you origin-first: found and cited by the models that summarise the web, and invocable by the agents that act on it.</p>
<a class="card" href="/consulting/"><span class="k">Consulting</span><h3>Be found, trusted and invoked</h3><p>SEO, AEO and GEO, one level deeper. We measure by invocation, and hand you the research, the reference implementation and the tools behind it.</p></a>
<p class="lede" style="font-size:18px;margin:22px 0 0">Alongside: experimentation and measurement, search and relevance, agentic product, and fractional product leadership.</p>
<p class="proj">Start a conversation. <a href="mailto:hello@heliacon.com?subject=Consulting">hello@heliacon.com</a> · <a href="https://www.linkedin.com/in/petedainty">Pete on LinkedIn</a></p>

<h2 id="ask-panel">We practise what we sell</h2>
<p class="lede">Do not take our word for it. Ask our own origin a question. It answers from our corpus and every answer cites its source. This is exactly what we build for clients: knowledge a machine can find, trust and invoke.</p>
<form class="askbox" id="ask" action="/ask" method="get">
  <input id="q" name="q" placeholder="What is an origin? How do I become invocable?" autocomplete="off" aria-label="Ask the origin">
  <button type="submit" aria-label="Ask">&rarr;</button>
</form>
<div class="answers" id="answers" role="status" aria-live="polite"></div>
<p class="proj">Or call it directly, no browser required:
  <a href="/ask?q=what+is+an+origin">Ask</a>
  <a href="/.well-known/mcp.json">MCP</a>
  <a href="/provenance">Provenance</a>
  <a href="/origin.md">Markdown</a>
  <a href="/origin.json">JSON</a>
  <a href="/origin.jsonld">JSON-LD</a>
  <a href="/feed.xml">Feed</a>
</p>
<p class="fineprint">This site runs a working MCP server, a citation-first ask endpoint and a provenance API. It is source-available. Inspect it.</p>

<h2>The lab behind the work</h2>
<p class="lede">We think in public. The research the consulting applies, worked out in the open. One origin, many projections, each carrying its provenance.</p>
${notes ? `<div class="archive">${notes}</div>\n<p class="proj"><a href="/notes/">All notes</a> · <a href="/manifesto/">Manifesto</a> · <a href="/definitions/origin/">Definitions</a> · <a href="/feed.xml">Feed</a></p>` : ""}
<div class="pillars">${pillars}</div>

<h2>What we build</h2>
<p class="lede">Products prove the research. Apps, tools and games built on the same origin, each a projection of it.</p>
<a class="card" href="/products/"><span class="k">Products</span><h3>Apps, tools and games</h3><p>In development. Each one stands on its own and traces back to the research it proves.</p></a>

<figure class="diagram"><img src="/assets/diagram.svg" width="920" height="460"
  alt="One origin, origin.yaml and the corpus, projected to HTML for browsers, JSON for agents, JSON-LD for crawlers, Markdown for writers and MCP for tools, negotiated by Accept"></figure>
<p class="cta-row" style="margin-top:8px"><a class="cta" href="/consulting/">Work with us</a> <a class="more" href="mailto:hello@heliacon.com?subject=Consulting">hello@heliacon.com &rarr;</a></p>
<script src="/assets/app.js" defer></script>`;
  return page("Heliacon · Be the first light", body, "/", {
    header: false,
    description: collapse(origin.description),
    jsonld: jsonld(origin, defs),
    alternates: {
      "text/markdown": `${CANON}/origin.md`,
      "application/json": `${CANON}/origin.json`,
      "application/ld+json": `${CANON}/origin.jsonld`,
      "application/atom+xml": `${CANON}/feed.xml`,
    },
  });
}

function definitionHtml(d: Dict): string {
  const sec = (label: string, items?: unknown[]) =>
    !items?.length ? "" : `<h2>${label}</h2><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const rel = (d.related ?? []).map((r: string) =>
    `<a href="/definitions/${r}/">${esc(r[0].toUpperCase() + r.slice(1))}</a> `).join("");
  const body = `
<article>
<h1 style="margin-top:8px">${esc(d.title)}</h1>
<p class="post-meta">Definition · v${d.version ?? "0.1"} · ${esc(d.status ?? "draft")}</p>
<p class="lede">${esc(collapse(d.summary))}</p>
<p>${esc(collapse(d.definition))}</p>
${sec("Why it matters", d.rationale)}
${sec("Examples", d.examples)}
${sec("Not this", d.antipatterns)}
<h2>Related</h2><p class="proj">${rel}</p>
<h2>Projections</h2>
<p class="proj">
  <a href="/definitions/${d.id}.json">JSON</a>
  <a href="/definitions/${d.id}.md">Markdown</a>
</p>
</article>`;
  return page(`${d.title} · Heliacon`, body, `/definitions/${d.id}/`, {
    description: collapse(d.summary),
    jsonld: {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "@id": `${CANON}/definitions/${d.id}/`,
      name: d.title,
      description: collapse(d.summary),
      inDefinedTermSet: `${CANON}/#corpus`,
      version: String(d.version ?? "0.1"),
    },
    alternates: {
      "application/json": `${CANON}/definitions/${d.id}.json`,
      "text/markdown": `${CANON}/definitions/${d.id}.md`,
    },
  });
}

// ── machine projections ──────────────────────────────────────────────────────
function definitionMarkdown(d: Dict): string {
  const out: string[] = [`# ${d.title}`, "", `> ${collapse(d.summary)}`, "", collapse(d.definition), ""];
  for (const [label, key] of [["Why it matters", "rationale"], ["Examples", "examples"], ["Not this", "antipatterns"]]) {
    if (d[key]?.length) out.push(`## ${label}`, "", ...d[key].map((x: string) => `- ${x}`), "");
  }
  if (d.related?.length) out.push("## Related", "", d.related.join(", "), "");
  out.push("---", `id: ${d.id} · version: ${d.version} · status: ${d.status} · source: ${CANON}/definitions/${d.id}/`);
  return out.join("\n");
}

function jsonld(origin: Dict, defs: Dict[]): Dict {
  const founderSlug = (origin.author?.name ?? "founder").toLowerCase().replace(/\s+/g, "-");
  const termRefs = defs.map((d) => ({ "@id": `${CANON}/definitions/${d.id}/` }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${CANON}/#organization`,
        name: origin.name,
        url: CANON,
        logo: `${CANON}/assets/logo/og.png`,
        image: `${CANON}/assets/logo/og.png`,
        slogan: origin.tagline,
        description: collapse(origin.description),
        foundingDate: "2026",
        areaServed: { "@type": "Place", name: "Worldwide" },
        knowsAbout: [
          ...termRefs,
          "Answer engine optimization",
          "Generative engine optimization",
          "Search engine optimization",
          "Agentic web",
          "Model Context Protocol",
        ],
        ...(origin.contact ? { email: origin.contact } : {}),
        ...(origin.contact
          ? { contactPoint: { "@type": "ContactPoint", email: origin.contact, contactType: "business" } }
          : {}),
        ...(origin.sameas?.length ? { sameAs: origin.sameas } : {}),
        founder: { "@id": `${CANON}/#${founderSlug}` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: [
            ["Be found and cited", "The source an assistant quotes, retrievable and verifiable by the models that summarise the web."],
            ["Be invocable", "Your capabilities exposed as things an agent can call, grounded and provenance-first, not just pages it can read."],
            ["Experimentation and measurement", "Designing, running and reading tests, and building the velocity to ship far more of them."],
            ["Search, discovery and personalisation", "Ranking, relevance and recommendations at scale."],
            ["AI product and agentic workflows", "Putting models and agents to work in a product, without the theatre."],
            ["Fractional product leadership", "Senior product and engineering leadership, by the engagement."],
          ].map(([name, description]) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, description, provider: { "@id": `${CANON}/#organization` } },
          })),
        },
      },
      {
        // Advertise the live query capability so an agent (or Google) knows the origin is
        // askable, not just readable. The MCP endpoint stays discoverable via /.well-known/mcp.json.
        "@type": "WebSite",
        "@id": `${CANON}/#website`,
        url: CANON,
        name: origin.name,
        publisher: { "@id": `${CANON}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${CANON}/ask?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Person",
        "@id": `${CANON}/#${founderSlug}`,
        name: origin.author?.name,
        jobTitle: "Founder",
        worksFor: { "@id": `${CANON}/#organization` },
        knowsAbout: [
          "Answer engine optimization", "Generative engine optimization",
          "Search and relevance", "AI product", "Product leadership",
        ],
        ...(origin.author?.linkedin ? { sameAs: [origin.author.linkedin] } : {}),
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${CANON}/#corpus`,
        name: "Heliacon Origin Vocabulary",
        hasDefinedTerm: termRefs,
      },
      ...defs.map((d) => ({
        "@type": "DefinedTerm",
        "@id": `${CANON}/definitions/${d.id}/`,
        name: d.title,
        description: collapse(d.summary),
        inDefinedTermSet: `${CANON}/#corpus`,
        version: String(d.version ?? "0.1"),
      })),
    ],
  };
}

function llmsTxt(origin: Dict, defs: Dict[], corpus: Dict[], posts: Dict[]): string {
  const l: string[] = [
    `# ${origin.name}`, "",
    `> ${collapse(origin.description)}`, "",
    `Tagline: ${origin.tagline}`,
    `Canonical: ${CANON}`,
    `Manifesto: ${CANON}/manifesto`,
    `Architecture: ${CANON}/architecture`,
    `Consulting: ${CANON}/consulting`,
    `Products: ${CANON}/products`,
    `Notes: ${CANON}/notes`,
    `Ask: ${CANON}/ask?q=`,
    `MCP: ${CANON}/mcp`,
    `Provenance: ${CANON}/provenance`,
    `Feed: ${CANON}/feed.xml`, "",
    "One origin, many projections. This file is the projection for language models.",
    "", "## Notes",
    ...posts.map((p) => `- [${p.title}](${CANON}/notes/${p.slug}.md): ${collapse(p.summary ?? "")}`),
    "", "## Definitions",
    ...defs.map((d) => `- [${d.title}](${CANON}/definitions/${d.id}.md): ${collapse(d.summary)}`),
    "", "## Corpus",
    ...corpus.map((c) => `- [${c.title}](${CANON}/corpus/${c.slug}.md)`),
    "", "## Capabilities",
    ...(origin.capabilities ?? []).map((c: string) => `- ${c}`),
    "", "## Principles",
    ...(origin.principles ?? []).map((p: string) => `- ${p}`),
  ];
  return l.join("\n") + "\n";
}

// Only the capabilities that actually resolve. Each tool names its live endpoint.
function mcpManifest(origin: Dict): Dict {
  return {
    schema_version: "2026-03-01",
    name: "heliacon-origin",
    description: collapse(origin.description),
    canonical: CANON,
    mcp: { endpoint: `${CANON}/mcp`, transport: "streamable-http" },
    tools: [
      { name: "ask", description: "Retrieve the passages of the Heliacon corpus that answer a question, each with its citation.", endpoint: `${CANON}/ask`, method: "GET", params: { q: "the question" } },
      { name: "definitions", description: "Return a canonical definition as JSON.", endpoint: `${CANON}/definitions/{id}.json`, method: "GET", params: { id: "definition id" } },
      { name: "provenance", description: "Return the source and version of any item.", endpoint: `${CANON}/provenance/{id}`, method: "GET", params: { id: "item id" } },
    ],
  };
}

function sitemapXml(defs: Dict[], corpus: Dict[], posts: Dict[]): string {
  const entries: { loc: string; lastmod?: string }[] = [
    { loc: "/" }, { loc: "/consulting/" }, { loc: "/products/" }, { loc: "/manifesto/" },
    { loc: "/architecture/" }, { loc: "/notes/" }, { loc: "/corpus/" }, { loc: "/definitions/" },
    ...posts.map((p) => ({ loc: `/notes/${p.slug}/`, lastmod: (p.updated ?? p.published) as string })),
    ...defs.map((d) => ({ loc: `/definitions/${d.id}/`, lastmod: d.updated as string })),
    ...corpus.map((c) => ({ loc: `/corpus/${c.slug}/`, lastmod: (c.updated ?? c.published) as string })),
  ];
  const items = entries.map((e) =>
    `  <url><loc>${CANON}${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

// provenance: for every item, where it came from and which version. The verifiable record
// behind each projection. Served whole at /provenance.json and per item by the worker.
function provenanceIndex(defs: Dict[], corpus: Dict[]): Dict {
  const items = [
    ...defs.map((d) => ({
      id: d.id, kind: "definition", title: d.title,
      version: String(d.version ?? "0.1"), status: d.status ?? "draft",
      author: d.author ?? "Heliacon", updated: d.updated ?? null,
      canonical: `${CANON}/definitions/${d.id}/`, source: `${CANON}/definitions/${d.id}.md`,
    })),
    ...corpus.map((c) => ({
      id: c.slug, kind: "essay", title: c.title,
      version: String(c.version ?? "0.1"), status: c.status ?? "draft",
      author: c.author ?? "Heliacon", updated: c.updated ?? null,
      canonical: `${CANON}/corpus/${c.slug}/`, source: `${CANON}/corpus/${c.slug}.md`,
    })),
  ];
  return { origin: "heliacon", count: items.length, items };
}

function atomFeed(origin: Dict, posts: Dict[]): string {
  const latest = posts.map((p) => p.updated ?? p.published).filter(Boolean).sort().pop() ?? "2026-01-01";
  const summary = (p: Dict) => collapse(String(p.summary ?? (p.body_md ?? "").replace(/^#.*$/m, "").replace(/[#*_`>-]/g, ""))).slice(0, 240);
  const entries = posts.map((p) => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${CANON}/notes/${p.slug}/"/>
    <id>${CANON}/notes/${p.slug}/</id>
    <updated>${p.updated ?? p.published ?? latest}T00:00:00Z</updated>
    <summary>${esc(summary(p))}</summary>
  </entry>`).join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(origin.name)}</title>
  <subtitle>${esc(collapse(origin.description))}</subtitle>
  <link href="${CANON}/feed.xml" rel="self"/>
  <link href="${CANON}/"/>
  <id>${CANON}/</id>
  <updated>${latest}T00:00:00Z</updated>
${entries}
</feed>
`;
}

// ask: a retrieval index over the corpus. Each passage carries its citation, so the worker can
// answer a question with canonical passages and their provenance, no generation.
function askIndex(defs: Dict[], corpus: Dict[]): Dict {
  const passages: Dict[] = [];
  for (const d of defs) {
    const text = [collapse(d.summary), collapse(d.definition), ...(d.rationale ?? [])].filter(Boolean).join(" ");
    passages.push({ id: d.id, kind: "definition", title: d.title, url: `${CANON}/definitions/${d.id}/`, source: `${CANON}/definitions/${d.id}.md`, text });
  }
  for (const c of corpus) {
    const paras = (c.body_md ?? "").split(/\n\n+/)
      .map((p: string) => collapse(p.replace(/^#.*$/m, "").replace(/[#*_`>-]/g, " ")))
      .filter((p: string) => p.length > 40);
    paras.forEach((text: string, part: number) =>
      passages.push({ id: c.slug, kind: "essay", title: c.title, url: `${CANON}/corpus/${c.slug}/`, source: `${CANON}/corpus/${c.slug}.md`, text, part }));
  }
  return { count: passages.length, passages };
}

// Per-page structured data for the content pages, so a model has author, dates and hierarchy
// on the page itself (not only in the homepage graph).
const founderRef = (origin: Dict): string =>
  `${CANON}/#${(origin.author?.name ?? "founder").toLowerCase().replace(/\s+/g, "-")}`;

const breadcrumb = (trail: [string, string][]): Dict => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${CANON}${url}` })),
});

const postJsonld = (p: Dict, origin: Dict): Dict => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${CANON}/notes/${p.slug}/`,
      headline: p.title,
      datePublished: p.published,
      dateModified: p.updated ?? p.published,
      author: { "@id": founderRef(origin), name: p.author ?? origin.author?.name },
      publisher: { "@id": `${CANON}/#organization` },
      mainEntityOfPage: `${CANON}/notes/${p.slug}/`,
      image: `${CANON}/assets/logo/og.png`,
      ...(p.summary ? { description: collapse(p.summary) } : {}),
      isPartOf: { "@id": `${CANON}/#website` },
    },
    breadcrumb([["Heliacon", "/"], ["Research", "/notes/"], [p.title, `/notes/${p.slug}/`]]),
  ],
});

const corpusJsonld = (c: Dict): Dict => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${CANON}/corpus/${c.slug}/`,
      headline: c.title,
      author: c.author ? { "@type": "Person", name: c.author } : { "@id": `${CANON}/#organization` },
      publisher: { "@id": `${CANON}/#organization` },
      ...(c.updated ? { dateModified: c.updated } : {}),
      mainEntityOfPage: `${CANON}/corpus/${c.slug}/`,
      isPartOf: { "@id": `${CANON}/#corpus` },
    },
    breadcrumb([["Heliacon", "/"], ["Corpus", "/corpus/"], [c.title, `/corpus/${c.slug}/`]]),
  ],
});

const robotsTxt = () => `User-agent: *\nAllow: /\n\nSitemap: ${CANON}/sitemap.xml\n`;

// Security headers on everything, then content types and CORS for the machine projections
// so agents can fetch them cross-origin.
const HEADERS_FILE = `/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/origin.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
/origin.jsonld
  Content-Type: application/ld+json; charset=utf-8
  Access-Control-Allow-Origin: *
/provenance.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
/ask-index.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
/feed.xml
  Content-Type: application/atom+xml; charset=utf-8
  Access-Control-Allow-Origin: *
/.well-known/mcp.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
/definitions/*
  Access-Control-Allow-Origin: *
`;

// ── build ────────────────────────────────────────────────────────────────────
function write(path: string, content: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  const out = typeof content === "string" ? content : JSON.stringify(content, jsonReplacer, 2) + "\n";
  writeFileSync(path, out);
}

async function main(): Promise<void> {
  const origin = loadYaml(join(ROOT, "origin.yaml"));
  const defs = loadDefinitions();
  const corpus = loadCorpus();
  const posts = loadPosts();

  if (existsSync(DIST)) rmSync(DIST, { recursive: true });
  mkdirSync(DIST);

  // canonical roots
  write(join(DIST, "origin.yaml"), readFileSync(join(ROOT, "origin.yaml"), "utf8"));
  write(join(DIST, "origin.md"), readFileSync(join(ROOT, "origin.md"), "utf8"));
  write(join(DIST, "origin.json"), origin);
  write(join(DIST, "origin.jsonld"), jsonld(origin, defs));

  // the stylesheet, minified and external (cached across pages)
  write(join(DIST, "styles.css"), minifyCss(CSS));

  // homepage (HTML projection of the origin)
  write(join(DIST, "index.html"), minifyHtml(homeHtml(origin, defs, posts)));

  // 404 (served by the Worker's not_found_handling)
  write(join(DIST, "404.html"), minifyHtml(page("Not found · Heliacon",
    `<h1 style="margin-top:8px">Not found</h1>
     <p class="lede">That projection does not exist yet.</p>
     <p>Every consumer negotiates a projection of the same origin. This path isn't one of them.</p>`,
    "/404", {})));

  // definitions: html, json and markdown projections, plus a browsable index
  for (const d of defs) {
    write(join(DIST, "definitions", d.id, "index.html"), minifyHtml(definitionHtml(d)));
    write(join(DIST, "definitions", `${d.id}.json`), d);
    write(join(DIST, "definitions", `${d.id}.md`), definitionMarkdown(d));
  }
  write(join(DIST, "definitions", "index.json"), defs);
  const defsCards = defs.map((d) =>
    `<a class="card" href="/definitions/${d.id}/"><span class="k">Definition</span>` +
    `<h3>${esc(d.title)}</h3><p>${esc(collapse(d.summary))}</p></a>`).join("");
  write(join(DIST, "definitions", "index.html"), minifyHtml(page("Definitions · Heliacon",
    `<h1 style="margin-top:8px">Definitions</h1>
     <p class="lede">The canonical vocabulary. Each term defined once, versioned, and carrying its provenance.</p>
     ${defsCards}`,
    "/definitions/", { description: "The Heliacon origin vocabulary. Canonical, versioned definitions." })));

  // corpus: html and markdown projections
  for (const c of corpus) {
    const htmlBody = await marked.parse(c.body_md);
    const pg = page(`${c.title} · Heliacon`,
      `<article>${htmlBody}</article>`,
      `/corpus/${c.slug}/`, {
        description: collapse(c.body_md.replace(/^#.*$/m, "").replace(/[#*_`>-]/g, "")).slice(0, 155),
        alternates: { "text/markdown": `${CANON}/corpus/${c.slug}.md` },
        jsonld: corpusJsonld(c),
      });
    write(join(DIST, "corpus", c.slug, "index.html"), minifyHtml(pg));
    write(join(DIST, "corpus", `${c.slug}.md`), c.body_md);
  }
  const corpusCards = corpus.map((c) =>
    `<a class="card" href="/corpus/${c.slug}/"><span class="k">Essay</span><h3>${esc(c.title)}</h3></a>`).join("");
  write(join(DIST, "corpus", "index.html"), minifyHtml(page("Corpus · Heliacon",
    `<h1 style="margin-top:8px">Corpus</h1>
     <p class="lede">The essays behind the work. The research the consulting applies and the ask endpoint retrieves.</p>
     ${corpusCards}`,
    "/corpus/", { description: "The Heliacon corpus. Essays on origin, projection, provenance and the rest." })));

  // root documents: manifesto (philosophy) and architecture (spec), rendered like the corpus
  for (const doc of [
    { slug: "manifesto", src: "manifesto.md", title: "Manifesto", desc: "The Heliacon manifesto. A studio and a consultancy, built on a canonical origin." },
    { slug: "architecture", src: join("docs", "architecture.md"), title: "Architecture", desc: "How Heliacon is built. One canonical origin, many projections, negotiated for whoever asks." },
    { slug: "consulting", src: "consulting.md", title: "Services", desc: "Origin-first consulting. Be found, trusted and invoked. The shift underneath SEO, AEO and GEO, for a world where the reader is often a machine." },
    { slug: "products", src: "products.md", title: "Products", desc: "Apps, tools and games that prove the research. Each a projection of the same origin." },
  ]) {
    const md = readFileSync(join(ROOT, doc.src), "utf8");
    const htmlBody = await marked.parse(md);
    write(join(DIST, doc.slug, "index.html"), minifyHtml(page(`${doc.title} · Heliacon`,
      `<article>${htmlBody}</article>`,
      `/${doc.slug}/`, { description: doc.desc, alternates: { "text/markdown": `${CANON}/${doc.slug}.md` } })));
    write(join(DIST, `${doc.slug}.md`), md);
  }

  // notes: the posts stream (index + each post, html and markdown projections)
  const notesCards = posts.map((p) =>
    `<a class="card" href="/notes/${p.slug}/"><span class="k">${fmtDate(p.published)}</span>` +
    `<h3>${esc(p.title)}</h3><p>${esc(collapse(p.summary ?? ""))}</p></a>`).join("");
  write(join(DIST, "notes", "index.html"), minifyHtml(page("Research · Heliacon",
    `<h1 style="margin-top:8px">Research</h1>
     <p class="lede">The lab behind the work. Field notes and essays, the vocabulary they build on, and the corpus the ask endpoint retrieves. Published here first, and canonical here always.</p>
     <p class="proj"><a href="/corpus/">Corpus</a> · <a href="/definitions/">Definitions</a> · <a href="/feed.xml">Feed</a></p>
     ${notesCards}`,
    "/notes/", { description: "Research from Heliacon. Field notes, essays, the corpus and the origin vocabulary." })));

  for (const p of posts) {
    const htmlBody = await marked.parse(p.body_md.replace(/^#\s+.*\n/, ""));
    const syn = Array.isArray(p.syndicated) && p.syndicated[0]
      ? ` · originally on <a href="${p.syndicated[0]}" rel="noopener">LinkedIn</a>` : "";
    write(join(DIST, "notes", p.slug, "index.html"), minifyHtml(page(`${p.title} · Heliacon`,
      `<a class="back" href="/notes/">&larr; Notes</a>
       <article class="post"><h1>${esc(p.title)}</h1>
       <p class="post-meta">${fmtDate(p.published)} · ${esc(p.author ?? "Pete Dainty")}${syn}</p>
       ${htmlBody}</article>`,
      `/notes/${p.slug}/`, {
        description: collapse(p.summary ?? "").slice(0, 155),
        alternates: { "text/markdown": `${CANON}/notes/${p.slug}.md` },
        jsonld: postJsonld(p, origin),
        extraMeta: `<meta property="article:published_time" content="${p.published}">\n<meta property="article:modified_time" content="${p.updated ?? p.published}">\n<meta property="article:author" content="${esc(p.author ?? origin.author?.name ?? "Pete Dainty")}">`,
      })));
    write(join(DIST, "notes", `${p.slug}.md`), p.body_md);
  }

  // discovery + crawl projections
  write(join(DIST, "sitemap.xml"), sitemapXml(defs, corpus, posts));
  write(join(DIST, "robots.txt"), robotsTxt());
  write(join(DIST, "_headers"), HEADERS_FILE);
  write(join(DIST, "provenance.json"), provenanceIndex(defs, corpus));
  write(join(DIST, "ask-index.json"), askIndex(defs, corpus));
  write(join(DIST, "feed.xml"), atomFeed(origin, posts));
  write(join(DIST, ".well-known", "mcp.json"), mcpManifest(origin));
  write(join(DIST, "schemas", "definition.schema.json"),
    readFileSync(join(ROOT, "schemas", "definition.schema.json"), "utf8"));

  // static assets (logo etc.)
  if (existsSync(join(ROOT, "assets"))) cpSync(join(ROOT, "assets"), join(DIST, "assets"), { recursive: true });

  const n = 1 + defs.length * 3 + corpus.length * 2 + 6;
  console.log(`built dist/ (${n} files, ${defs.length} definitions, ${corpus.length} corpus entries)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
