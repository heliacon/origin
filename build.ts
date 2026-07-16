/**
 * Heliacon origin build (orchestrator). Projects the canonical source into the deployable site
 * plus every machine projection:
 *
 *     origin.yaml + definitions/*.yaml + corpus/*.md + posts/*.md
 *         -> dist/   (HTML site on the greenfield URL tree + json/jsonld/markdown/mcp projections)
 *
 * Design system, components, templates and schema live under src/. This file loads data, calls the
 * renderers and writes dist/. The origin-first machine spine is preserved at the new paths
 * (seo-continuity I-1..I-6). Run:  npm run build
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { marked } from "marked";

import { CANON, Dict, esc, collapse } from "./src/util";
import { css } from "./src/design/css";
import { page } from "./src/layout/shell";
import { pageHead } from "./src/components";
import { home } from "./src/templates/home";
import { studio } from "./src/templates/studio";
import { work } from "./src/templates/work";
import { workDetail } from "./src/templates/workDetail";
import { research } from "./src/templates/research";
import { journal } from "./src/templates/journal";
import { about } from "./src/templates/about";
import { contact } from "./src/templates/contact";
import { products } from "./src/templates/products";
import { corpusEssay } from "./src/templates/corpus";
import { definitionPage } from "./src/templates/definition";
import { post } from "./src/templates/post";
import { doc } from "./src/templates/doc";
import * as S from "./src/schema";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");

// ── loading ────────────────────────────────────────────────────────────────
function normDates(v: any): any {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (Array.isArray(v)) return v.map(normDates);
  if (v && typeof v === "object") { for (const k in v) v[k] = normDates(v[k]); return v; }
  return v;
}
const loadYaml = (p: string): Dict => normDates((yaml.load(readFileSync(p, "utf8")) as Dict) ?? {});

function parseFrontmatter(text: string): { meta: Dict; body: string } {
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

// ── minifiers (HEL-030: do NOT collapse >\s+< — keeps inline spacing) ────────
const jsonReplacer = (_k: string, v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v);
const minifyCss = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").replace(/\s+/g, " ").trim();
function minifyHtml(html: string): string {
  const keep: string[] = [];
  const stashed = html.replace(/<(pre|code|textarea|script)[\s\S]*?<\/\1>/gi, (m) => `\x00${keep.push(m) - 1}\x00`);
  const min = stashed.replace(/<!--[\s\S]*?-->/g, "").replace(/\s{2,}/g, " ").trim();
  return min.replace(/\x00(\d+)\x00/g, (_, i) => keep[Number(i)]);
}

function write(path: string, content: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  const out = typeof content === "string" ? content : JSON.stringify(content, jsonReplacer, 2) + "\n";
  writeFileSync(path, out);
}
const stripH1 = (md: string): string => md.replace(/^#\s+.*\n/, "");

// Migrate internal links in authored content to the greenfield tree, and swap every mailto CTA
// for /contact/ (ia §5.2). Applied to rendered HTML and to the .md projections so both agree.
const rewriteHtml = (h: string): string => h
  .replace(/\s*—\s*/g, ", ")   // STYLE: no em dash anywhere, gentlest fix is a comma
  .replace(/href="\/notes\//g, 'href="/journal/')
  .replace(/href="\/consulting\//g, 'href="/studio/')
  .replace(/href="\/definitions\//g, 'href="/research/definitions/')
  .replace(/href="\/corpus\//g, 'href="/research/corpus/')
  .replace(/href="mailto:hello@heliacon\.com[^"]*"/g, 'href="/contact/"');
const rewriteMd = (m: string): string => m
  .replace(/\s*—\s*/g, ", ")
  .replace(/\(mailto:hello@heliacon\.com[^)]*\)/g, "(/contact/)")
  .replace(/href="mailto:hello@heliacon\.com[^"]*"/g, 'href="/contact/"')
  .replace(/\]\(\/notes\//g, "](/journal/")
  .replace(/\]\(\/consulting\//g, "](/studio/")
  .replace(/\]\(\/definitions\//g, "](/research/definitions/")
  .replace(/\]\(\/corpus\//g, "](/research/corpus/");
const md2html = async (md: string): Promise<string> => rewriteHtml(await marked.parse(md));
const readMd = (p: string): string => rewriteMd(readFileSync(p, "utf8"));

// ── real, honesty-safe write-ups for the two own-projects (ia §3.2) ──────────
const ARMX_MD = `## The problem

"SEO", "AEO" and "GEO" name three slices of the same shift: the reader is now as often a machine as a person. Teams optimise for one slice and miss the system underneath.

## What ARMX is

ARMX, Agent Readiness and Machine eXperience, is Heliacon's model for the whole machine surface. Five pillars:

- **Discoverability.** Can a crawler and an agent find and fetch you cleanly?
- **Understanding.** Can a model read your entities, provenance and structure?
- **Trust.** Is the source verifiable, canonical and safe to cite?
- **Selection.** Are you the answer an engine actually picks?
- **Execution.** Can an agent invoke you, not just read you?

## How we use it

We audit a site or entity from every machine viewpoint, ground the findings in a crawl, and lead the fixes by business outcome, not a vanity score. SEO, AEO and GEO all fall out of the five pillars as special cases.`;

const KENOVAR_MD = `## What it is

Kenovar is Heliacon's SEO, AEO and GEO platform. It builds a verified-owner digital twin of your site: one graph, inspectable from every consumer viewpoint, browser, crawler, LLM, agent, CLI and MCP.

## Why a twin

Most tools check one viewpoint at a time. Kenovar crawls once and reuses the result across viewpoints, so a change is measured everywhere at once, and an analyst agent reads the same graph you do.

## Status

In active development. Verified-owner gating is the core. You prove you own the origin, then Kenovar measures it from every viewpoint and improves it over time.`;

// ── build ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const origin = loadYaml(join(ROOT, "origin.yaml"));
  const defs = loadDefinitions();
  const corpus = loadCorpus();
  const posts = loadPosts();
  const defIds = new Set(defs.map((d) => d.id));

  if (existsSync(DIST)) rmSync(DIST, { recursive: true });
  mkdirSync(DIST);

  // canonical roots
  write(join(DIST, "origin.yaml"), readFileSync(join(ROOT, "origin.yaml"), "utf8"));
  write(join(DIST, "origin.md"), readFileSync(join(ROOT, "origin.md"), "utf8"));
  write(join(DIST, "origin.json"), origin);
  write(join(DIST, "origin.jsonld"), S.homeGraph(origin, defs));

  // stylesheet (minified, external, cached across pages)
  write(join(DIST, "styles.css"), minifyCss(css));

  // homepage
  write(join(DIST, "index.html"), minifyHtml(home(origin, defs, posts, S.homeGraph(origin, defs))));

  // 404 (served by the Worker's not_found_handling)
  write(join(DIST, "404.html"), minifyHtml(page("Not found · Heliacon",
    `${pageHead("Not found", "That projection does not exist yet.")}` +
    `<section class="section"><div class="container container--text"><p class="prose">Every consumer negotiates a projection of the same origin. This path is not one of them.</p></div></section>`,
    "/404", {})));

  // ── STUDIO / WORK / ABOUT / PRODUCTS (root-doc templates + .md alternates) ──
  write(join(DIST, "studio", "index.html"), minifyHtml(studio(await md2html(stripH1(readFileSync(join(ROOT, "consulting.md"), "utf8"))), S.studioGraph())));
  write(join(DIST, "studio.md"), readMd(join(ROOT, "consulting.md")));

  const workBody = await md2html(stripH1(readFileSync(join(ROOT, "work.md"), "utf8")));
  write(join(DIST, "work", "index.html"), minifyHtml(work(workBody, S.workIndexGraph([{ slug: "case-study-zero" }, { slug: "armx" }, { slug: "kenovar" }]))));
  write(join(DIST, "work.md"), readMd(join(ROOT, "work.md")));

  write(join(DIST, "about", "index.html"), minifyHtml(about(await md2html(stripH1(readFileSync(join(ROOT, "about.md"), "utf8"))), S.aboutGraph())));
  write(join(DIST, "about.md"), readMd(join(ROOT, "about.md")));

  write(join(DIST, "products", "index.html"), minifyHtml(products(await md2html(stripH1(readFileSync(join(ROOT, "products.md"), "utf8"))), S.productsGraph())));
  write(join(DIST, "products.md"), readMd(join(ROOT, "products.md")));

  // ── WORK detail pages (article template) ──
  const wUpdated = String(origin.updated ?? origin.published ?? "2026-07-05");
  write(join(DIST, "work", "case-study-zero", "index.html"), minifyHtml(workDetail({
    slug: "case-study-zero", title: "Case Study Zero", kicker: "The live origin",
    sub: "This site, built the way we build for clients, inspectable end to end.",
    htmlBody: await md2html(stripH1(readFileSync(join(ROOT, "work.md"), "utf8"))),
    description: "The live origin as proof: a working MCP server, citation-first ask and a provenance API, all source-available.",
    jsonld: S.workDetailGraph("case-study-zero", "Case Study Zero", "AI search visibility", wUpdated, origin),
    related: [{ href: "/work/armx/", title: "ARMX Framework" }, { href: "/work/kenovar/", title: "Kenovar" }],
  })));
  write(join(DIST, "work", "armx", "index.html"), minifyHtml(workDetail({
    slug: "armx", title: "ARMX Framework", kicker: "Framework",
    sub: "Agent Readiness and Machine eXperience. The five-pillar model behind the work.",
    htmlBody: await md2html(ARMX_MD),
    description: "ARMX: Agent Readiness and Machine eXperience. Five pillars, Discoverability, Understanding, Trust, Selection and Execution, that absorb SEO, AEO and GEO.",
    jsonld: S.workDetailGraph("armx", "ARMX Framework", "AI search visibility", wUpdated, origin),
    related: [{ href: "/work/case-study-zero/", title: "Case Study Zero" }, { href: "/work/kenovar/", title: "Kenovar" }],
  })));
  write(join(DIST, "work", "kenovar", "index.html"), minifyHtml(workDetail({
    slug: "kenovar", title: "Kenovar", kicker: "Platform",
    sub: "Our SEO, AEO and GEO platform. A verified-owner digital twin on one graph.",
    htmlBody: await md2html(KENOVAR_MD),
    description: "Kenovar: a verified-owner digital twin of your site, inspectable from every machine viewpoint on one graph.",
    jsonld: S.workDetailGraph("kenovar", "Kenovar", "AI search visibility", wUpdated, origin),
    related: [{ href: "/work/case-study-zero/", title: "Case Study Zero" }, { href: "/work/armx/", title: "ARMX Framework" }],
  })));

  // ── RESEARCH hub + collections ──
  write(join(DIST, "research", "index.html"), minifyHtml(research(corpus, defs, S.researchGraph())));

  // definitions: html + json + md, under /research/definitions/
  for (const d of defs) {
    write(join(DIST, "research", "definitions", d.id, "index.html"), minifyHtml(definitionPage(d, S.definitionGraph(d))));
    write(join(DIST, "research", "definitions", `${d.id}.json`), d);
    write(join(DIST, "research", "definitions", `${d.id}.jsonld`), S.definitionGraph(d));
    write(join(DIST, "research", "definitions", `${d.id}.md`), S.definitionMarkdown(d));
  }
  write(join(DIST, "research", "definitions", "index.json"), defs);
  const defCards = defs.map((d) =>
    `<a class="card" href="/research/definitions/${d.id}/"><div class="card__body"><span class="eyebrow card__kicker">Definition</span>` +
    `<h3 class="card__title">${esc(d.title)}</h3><p class="card__cap">${esc(collapse(d.summary))}</p></div></a>`).join("");
  write(join(DIST, "research", "definitions", "index.html"), minifyHtml(page("Definitions · Heliacon",
    pageHead("Definitions", "The canonical vocabulary. Each term defined once, versioned, and carrying its provenance.", "Research") +
    `<section class="section"><div class="container"><div class="grid-3">${defCards}</div></div></section>`,
    "/research/definitions/", { section: "research", description: "The Heliacon origin vocabulary. Canonical, versioned definitions.", jsonld: S.collectionGraph("/research/definitions/", "Definitions", [["Heliacon", "/"], ["Research", "/research/"], ["Definitions", "/research/definitions/"]]) })));

  // corpus: html + md, under /research/corpus/
  for (const c of corpus) {
    const body = await md2html(c.body_md);
    const related = corpus.filter((o) => o.slug !== c.slug && (c.related ?? []).includes(o.slug))
      .map((o) => ({ href: S.corpusPath(o.slug), title: o.title }));
    write(join(DIST, "research", "corpus", c.slug, "index.html"),
      minifyHtml(corpusEssay(c, body, S.corpusGraph(c), defIds.has(c.slug), related)));
    write(join(DIST, "research", "corpus", `${c.slug}.md`), rewriteMd(c.body_md));
  }
  const corpusCards = corpus.map((c) =>
    `<a class="card" href="/research/corpus/${c.slug}/"><div class="card__body"><span class="eyebrow card__kicker">Essay</span>` +
    `<h3 class="card__title">${esc(c.title)}</h3><p class="card__cap">${esc(collapse(c.summary ?? ""))}</p></div></a>`).join("");
  write(join(DIST, "research", "corpus", "index.html"), minifyHtml(page("Corpus · Heliacon",
    pageHead("Corpus", "The essays behind the work. The research the consulting applies and the ask endpoint retrieves.", "Research") +
    `<section class="section"><div class="container"><div class="grid-3">${corpusCards}</div></div></section>`,
    "/research/corpus/", { section: "research", description: "The Heliacon corpus. Essays on origin, projection, provenance and the rest.", jsonld: S.collectionGraph("/research/corpus/", "Corpus", [["Heliacon", "/"], ["Research", "/research/"], ["Corpus", "/research/corpus/"]]) })));

  // ── landmark docs: manifesto + architecture (light RESEARCH) ──
  write(join(DIST, "manifesto", "index.html"), minifyHtml(doc({
    slug: "manifesto", title: "Manifesto", eyebrow: "Research",
    lede: "The belief. A studio and a consultancy, built on a canonical origin.",
    htmlBody: await md2html(stripH1(readFileSync(join(ROOT, "manifesto.md"), "utf8"))),
    description: "The Heliacon manifesto. A studio and a consultancy, built on a canonical origin.",
    jsonld: S.docGraph("manifesto", "Manifesto"), mdAlternate: "/manifesto.md",
  })));
  write(join(DIST, "manifesto.md"), readMd(join(ROOT, "manifesto.md")));
  write(join(DIST, "architecture", "index.html"), minifyHtml(doc({
    slug: "architecture", title: "Architecture", eyebrow: "Research",
    lede: "How Heliacon is built. One canonical origin, many projections, negotiated for whoever asks.",
    htmlBody: await md2html(stripH1(readFileSync(join(ROOT, "docs", "architecture.md"), "utf8"))),
    description: "How Heliacon is built. One canonical origin, many projections, negotiated for whoever asks.",
    jsonld: S.docGraph("architecture", "Architecture"), mdAlternate: "/architecture.md",
  })));
  write(join(DIST, "architecture.md"), readMd(join(ROOT, "docs", "architecture.md")));

  // ── JOURNAL index + posts ──
  write(join(DIST, "journal", "index.html"), minifyHtml(journal(posts, S.journalIndexGraph(posts))));
  for (const p of posts) {
    const body = await md2html(p.body_md.replace(/^#\s+.*\n/, ""));
    const related = posts.filter((o) => o.slug !== p.slug).slice(0, 3).map((o) => ({ href: S.journalPath(o.slug), title: o.title }));
    write(join(DIST, "journal", p.slug, "index.html"), minifyHtml(post(p, body, S.postGraph(p, origin), related)));
    write(join(DIST, "journal", `${p.slug}.md`), rewriteMd(p.body_md));
  }

  // ── CONTACT ──
  write(join(DIST, "contact", "index.html"), minifyHtml(contact(S.contactGraph())));

  // ── discovery + crawl projections ──
  write(join(DIST, "sitemap.xml"), S.sitemapXml(defs, corpus, posts));
  write(join(DIST, "robots.txt"), S.robotsTxt());
  write(join(DIST, "_headers"), S.HEADERS_FILE);
  write(join(DIST, "provenance.json"), S.provenanceIndex(defs, corpus));
  write(join(DIST, "ask-index.json"), S.askIndex(defs, corpus));
  write(join(DIST, "feed.xml"), S.atomFeed(origin, posts));
  write(join(DIST, ".well-known", "mcp.json"), S.mcpManifest(origin));
  write(join(DIST, "schemas", "definition.schema.json"),
    readFileSync(join(ROOT, "schemas", "definition.schema.json"), "utf8"));

  // static assets
  if (existsSync(join(ROOT, "assets"))) cpSync(join(ROOT, "assets"), join(DIST, "assets"), { recursive: true });

  console.log(`built dist/ (${defs.length} definitions, ${corpus.length} corpus, ${posts.length} posts) on the greenfield tree`);
}

main().catch((e) => { console.error(e); process.exit(1); });
