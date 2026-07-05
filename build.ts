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
  if (text.startsWith("---")) {
    const parts = text.split("---");
    const meta = normDates((yaml.load(parts[1]) as Dict) ?? {});
    return { meta, body: parts.slice(2).join("---").trim() };
  }
  return { meta: {}, body: text.trim() };
}

function listFiles(dir: string, ext: string): string[] {
  const d = join(ROOT, dir);
  return existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(ext)).sort() : [];
}

function loadCorpus(): Dict[] {
  return listFiles("corpus", ".md").map((f) => {
    const { meta, body } = parseFrontmatter(readFileSync(join(ROOT, "corpus", f), "utf8"));
    return { ...meta, body_md: body, slug: meta.id ?? f.replace(/\.md$/, "") };
  });
}

const loadDefinitions = (): Dict[] =>
  listFiles("definitions", ".yaml").map((f) => loadYaml(join(ROOT, "definitions", f)));

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
h2{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);font-family:ui-sans-serif,system-ui,sans-serif;margin:56px 0 18px}
h3{font-size:24px;margin:0 0 6px}
p{margin:0 0 18px}
.lede{font-size:22px;color:var(--cream)}
ul{padding-left:1.1em}li{margin:6px 0}
.card{display:block;padding:20px 22px;margin:10px 0;border:1px solid #2a3050;border-radius:14px;background:#141a38;transition:border-color .15s,transform .1s}
.card:hover{border-color:var(--gold);transform:translateY(-1px);text-decoration:none}
.card .k{font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.card h3{margin:8px 0 4px;color:var(--cream)}
.card p{margin:0;color:var(--dim);font-size:16px}
.proj{font:500 13px/1.8 ui-sans-serif,system-ui,sans-serif;color:var(--dim)}
.proj a{color:var(--dim);border:1px solid #2a3050;border-radius:999px;padding:4px 12px;margin:0 6px 8px 0;display:inline-block}
.proj a:hover{color:var(--gold);border-color:var(--gold);text-decoration:none}
footer{margin-top:72px;padding-top:24px;border-top:1px solid #2a3050;font:400 14px/1.7 ui-sans-serif,system-ui,sans-serif;color:var(--dim)}
.back{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}
article h2{font-family:ui-sans-serif,system-ui,sans-serif}`;

// Dependency-free minifiers. Safe for this project's hand-written CSS and generated markup.
const minifyCss = (css: string): string =>
  css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").replace(/\s+/g, " ").trim();

function minifyHtml(html: string): string {
  const keep: string[] = [];
  const stashed = html.replace(/<(pre|code|textarea|script)[\s\S]*?<\/\1>/gi, (m) => `\x00${keep.push(m) - 1}\x00`);
  const min = stashed.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
  return min.replace(/\x00(\d+)\x00/g, (_, i) => keep[Number(i)]);
}

interface PageOpts { description?: string; jsonld?: unknown; alternates?: Record<string, string>; }

const DEFAULT_DESC = "Heliacon is a trusted origin for knowledge, capability and provenance.";

function page(title: string, body: string, canonicalPath: string, opts: PageOpts = {}): string {
  const { description = DEFAULT_DESC, jsonld, alternates = {} } = opts;
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
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${CANON}/assets/logo/og.png">
<meta name="twitter:card" content="summary_large_image">
    ${alt}
<link rel="stylesheet" href="/styles.css">${jsonld ? `\n<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body>
<div class="wrap">
<main>${body}</main>
<footer>
  <strong>Heliacon</strong>. A trusted origin for knowledge, capability and provenance.<br>
  One origin, many projections · © 2026 Heliacon LLC ·
  <a href="/llms.txt">llms.txt</a> ·
  <a href="/.well-known/mcp.json">MCP</a> ·
  <a href="/origin.json">JSON</a>
</footer>
</div>
</body>
</html>`;
}

// Reference the wordmark as an external image so the browser caches it once, rather than
// inlining ~12KB of SVG into the homepage HTML.
const logoImg = (): string => '<img src="/assets/logo/wordmark.svg" alt="Heliacon">';

function homeHtml(origin: Dict, defs: Dict[]): string {
  const caps = (origin.capabilities ?? []).map((c: string) => `<li><code>${esc(c)}</code></li>`).join("");
  const prin = ["Provenance by default.", "Privacy by architecture.", "Capability over content.",
    "Invocation over attention.", "One origin. Many projections."]
    .map((x) => `<li>${esc(x)}</li>`).join("");
  const byId = Object.fromEntries(defs.map((d) => [d.id, d]));
  const cards = ["origin", "projection", "invocation", "capability", "provenance", "privacy", "sovereignty"]
    .map((id) => byId[id]).filter(Boolean)
    .map((d) =>
      `<a class="card" href="/definitions/${d.id}/"><span class="k">Definition</span>` +
      `<h3>${esc(d.title)}</h3><p>${esc(collapse(d.summary))}</p></a>`).join("");
  const body = `
<h1 class="sr-only">Heliacon: a trusted origin for knowledge, capability and provenance</h1>
<header class="mast">
  <a href="/" aria-label="Heliacon" style="display:block">${logoImg()}</a>
  <div class="tag">Be first light</div>
</header>

<p class="lede">Heliacon is a trusted origin for knowledge, capability and provenance. It is the
canonical source from which every projection is derived.</p>
<p>The browser is not privileged. Neither is the agent. Every consumer negotiates the
projection most appropriate for its capabilities, from one source of truth.</p>

<h2>The definitions</h2>
${cards}

<h2>Principles</h2>
<ul>${prin}</ul>

<h2>Capabilities</h2>
<ul>${caps}</ul>

<h2>Projections</h2>
<p class="proj">The same origin, negotiated for whoever asks:
  <a href="/origin.md">Markdown</a>
  <a href="/origin.json">JSON</a>
  <a href="/origin.jsonld">JSON-LD</a>
  <a href="/llms.txt">llms.txt</a>
  <a href="/.well-known/mcp.json">MCP</a>
</p>`;
  return page("Heliacon · Be first light", body, "/", {
    description: collapse(origin.description),
    jsonld: jsonld(origin, defs),
    alternates: {
      "text/markdown": `${CANON}/origin.md`,
      "application/json": `${CANON}/origin.json`,
      "application/ld+json": `${CANON}/origin.jsonld`,
    },
  });
}

function definitionHtml(d: Dict): string {
  const sec = (label: string, items?: unknown[]) =>
    !items?.length ? "" : `<h2>${label}</h2><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const rel = (d.related ?? []).map((r: string) =>
    `<a href="/definitions/${r}/">${esc(r[0].toUpperCase() + r.slice(1))}</a> `).join("");
  const body = `
<a class="back" href="/">&larr; Heliacon</a>
<article>
<h2 style="margin-top:32px">Definition · v${d.version ?? "0.1"} · ${esc(d.status ?? "draft")}</h2>
<h1>${esc(d.title)}</h1>
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
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${CANON}/#organization`,
        name: origin.name,
        url: CANON,
        slogan: origin.tagline,
        description: collapse(origin.description),
        founder: { "@type": "Person", name: origin.author?.name },
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

function llmsTxt(origin: Dict, defs: Dict[], corpus: Dict[]): string {
  const l: string[] = [
    `# ${origin.name}`, "",
    `> ${collapse(origin.description)}`, "",
    `Tagline: ${origin.tagline}`,
    `Canonical: ${CANON}`, "",
    "One origin, many projections. This file is the projection for language models.",
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

function mcpManifest(origin: Dict): Dict {
  const desc: Record<string, string> = {
    ask: "Resolve a question against the Heliacon corpus and return a cited answer.",
    definitions: "Return a canonical definition and its relationships.",
    citations: "Return the citation and source for a claim.",
    provenance: "Return the verifiable provenance of a claim or capability.",
    research: "Retrieve a body of research for reasoning.",
  };
  return {
    schema_version: "2026-03-01",
    name: "heliacon-origin",
    description: collapse(origin.description),
    canonical: CANON,
    tools: (origin.capabilities ?? []).map((c: string) => ({ name: c, description: desc[c] ?? c })),
  };
}

function sitemapXml(defs: Dict[], corpus: Dict[]): string {
  const urls = ["/", ...defs.map((d) => `/definitions/${d.id}/`), ...corpus.map((c) => `/corpus/${c.slug}/`)];
  const items = urls.map((u) => `  <url><loc>${CANON}${u}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

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
/llms.txt
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *
/.well-known/mcp.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *
/.well-known/llms.txt
  Content-Type: text/plain; charset=utf-8
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
  write(join(DIST, "index.html"), minifyHtml(homeHtml(origin, defs)));

  // 404 (served by the Worker's not_found_handling)
  write(join(DIST, "404.html"), minifyHtml(page("Not found · Heliacon",
    `<a class="back" href="/">&larr; Heliacon</a>
     <h1 style="margin-top:40px">Not found</h1>
     <p class="lede">That projection does not exist yet.</p>
     <p>Every consumer negotiates a projection of the same origin. This path isn't one of them.</p>`,
    "/404", {})));

  // definitions: html, json and markdown projections
  for (const d of defs) {
    write(join(DIST, "definitions", d.id, "index.html"), minifyHtml(definitionHtml(d)));
    write(join(DIST, "definitions", `${d.id}.json`), d);
    write(join(DIST, "definitions", `${d.id}.md`), definitionMarkdown(d));
  }
  write(join(DIST, "definitions", "index.json"), defs);

  // corpus: html and markdown projections
  for (const c of corpus) {
    const htmlBody = await marked.parse(c.body_md);
    const pg = page(`${c.title} · Heliacon`,
      `<a class="back" href="/">&larr; Heliacon</a><article>${htmlBody}</article>`,
      `/corpus/${c.slug}/`, {
        description: collapse(c.body_md.replace(/^#.*$/m, "").replace(/[#*_`>-]/g, "")).slice(0, 155),
        alternates: { "text/markdown": `${CANON}/corpus/${c.slug}.md` },
      });
    write(join(DIST, "corpus", c.slug, "index.html"), minifyHtml(pg));
    write(join(DIST, "corpus", `${c.slug}.md`), c.body_md);
  }

  // discovery + crawl projections
  write(join(DIST, "sitemap.xml"), sitemapXml(defs, corpus));
  write(join(DIST, "robots.txt"), robotsTxt());
  write(join(DIST, "_headers"), HEADERS_FILE);
  write(join(DIST, "llms.txt"), llmsTxt(origin, defs, corpus));
  write(join(DIST, ".well-known", "mcp.json"), mcpManifest(origin));
  write(join(DIST, ".well-known", "llms.txt"), llmsTxt(origin, defs, corpus));
  write(join(DIST, "schemas", "definition.schema.json"),
    readFileSync(join(ROOT, "schemas", "definition.schema.json"), "utf8"));

  // static assets (logo etc.)
  if (existsSync(join(ROOT, "assets"))) cpSync(join(ROOT, "assets"), join(DIST, "assets"), { recursive: true });

  const n = 1 + defs.length * 3 + corpus.length * 2 + 6;
  console.log(`built dist/ (${n} files, ${defs.length} definitions, ${corpus.length} corpus entries)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
