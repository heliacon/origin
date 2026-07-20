/**
 * Heliacon origin build (orchestrator). Projects the canonical source into the deployable site
 * plus every machine projection:
 *
 *     origin.yaml + definitions/*.yaml + posts/*.md
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
import { marketingPage } from "./src/layout/article";
import { linkCard, ctaLink } from "./src/components";
import { home } from "./src/templates/home";
import { studio } from "./src/templates/studio";
import { work } from "./src/templates/work";
import { research } from "./src/templates/research";
import { journal } from "./src/templates/journal";
import { about } from "./src/templates/about";
import { contact } from "./src/templates/contact";
import { products } from "./src/templates/products";
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
  .replace(/href="mailto:hello@heliacon\.com[^"]*"/g, 'href="/contact/"');
const rewriteMd = (m: string): string => m
  .replace(/\s*—\s*/g, ", ")
  .replace(/\(mailto:hello@heliacon\.com[^)]*\)/g, "(/contact/)")
  .replace(/href="mailto:hello@heliacon\.com[^"]*"/g, 'href="/contact/"')
  .replace(/\]\(\/notes\//g, "](/journal/")
  .replace(/\]\(\/consulting\//g, "](/studio/")
  .replace(/\]\(\/definitions\//g, "](/research/definitions/");
const md2html = async (md: string): Promise<string> => rewriteHtml(await marked.parse(md));
const readMd = (p: string): string => rewriteMd(readFileSync(p, "utf8"));

// ── build ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const origin = loadYaml(join(ROOT, "origin.yaml"));
  const defs = loadDefinitions();
  const posts = loadPosts();
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

  // 404 (served by the Worker's not_found_handling). On the marketing shell like every other
  // interior page, so a wrong turn still lands somewhere that looks like the site.
  write(join(DIST, "404.html"), minifyHtml(page("Not found · Heliacon",
    marketingPage(
      { title: "Not found", lede: "That projection does not exist yet.", eyebrow: "404", section: "" },
      `<section class="section"><div class="container container--text">` +
        `<p class="prose">Every consumer negotiates a projection of the same origin. This path is not one of them.</p>` +
        `<p class="section__after">${ctaLink("Back to the origin", "/")}</p>` +
      `</div></section>`,
    ),
    "/404", { overHero: true })));

  // ── STUDIO / WORK / ABOUT / PRODUCTS (root-doc templates + .md alternates) ──
  write(join(DIST, "studio", "index.html"), minifyHtml(studio(await md2html(stripH1(readFileSync(join(ROOT, "consulting.md"), "utf8"))), S.studioGraph())));
  write(join(DIST, "studio.md"), readMd(join(ROOT, "consulting.md")));

  const workBody = await md2html(stripH1(readFileSync(join(ROOT, "work.md"), "utf8")));
  write(join(DIST, "work", "index.html"), minifyHtml(work(workBody, S.workIndexGraph())));
  write(join(DIST, "work.md"), readMd(join(ROOT, "work.md")));

  write(join(DIST, "about", "index.html"), minifyHtml(about(await md2html(stripH1(readFileSync(join(ROOT, "about.md"), "utf8"))), S.aboutGraph())));
  write(join(DIST, "about.md"), readMd(join(ROOT, "about.md")));

  write(join(DIST, "products", "index.html"), minifyHtml(products(await md2html(stripH1(readFileSync(join(ROOT, "products.md"), "utf8"))), S.productsGraph())));
  write(join(DIST, "products.md"), readMd(join(ROOT, "products.md")));

  // ── RESEARCH hub + collections ──
  write(join(DIST, "research", "index.html"), minifyHtml(research(defs, S.researchGraph())));

  // definitions: html + json + md, under /research/definitions/
  for (const d of defs) {
    write(join(DIST, "research", "definitions", d.id, "index.html"), minifyHtml(definitionPage(d, S.definitionGraph(d))));
    write(join(DIST, "research", "definitions", `${d.id}.json`), d);
    write(join(DIST, "research", "definitions", `${d.id}.jsonld`), S.definitionGraph(d));
    write(join(DIST, "research", "definitions", `${d.id}.md`), S.definitionMarkdown(d));
  }
  write(join(DIST, "research", "definitions", "index.json"), defs);
  // same linkCard and same Origin-keystone composition as the research hub, so the collection and
  // the hub read as one system. Card titles are h2: on this page they sit directly under the page
  // h1 with no section head between them (WCAG 1.3.1).
  const defCard = (d: Dict, wide = false) => linkCard({
    kicker: wide ? "The keystone definition" : "Definition", title: d.title,
    href: `/research/definitions/${d.id}/`, caption: collapse(d.summary),
    ctaLabel: "Read the definition", titleTag: "h2", wide,
  });
  const defOrigin = defs.find((d) => d.id === "origin");
  const defRest = defs.filter((d) => d.id !== "origin").map((d) => defCard(d)).join("");
  write(join(DIST, "research", "definitions", "index.html"), minifyHtml(page("Definitions · Heliacon",
    marketingPage(
      { title: "Definitions", lede: "The canonical vocabulary. Each term defined once, versioned, and carrying its provenance.", eyebrow: "Research", section: "research" },
      `<section class="section"><div class="container">` +
        (defOrigin ? defCard(defOrigin, true) : "") +
        `<div class="grid-3 cardgrid">${defRest}</div>` +
      `</div></section>`,
    ),
    "/research/definitions/", { section: "research", overHero: true, description: "The Heliacon origin vocabulary. Canonical, versioned definitions.", jsonld: S.collectionGraph("/research/definitions/", "Definitions", [["Heliacon", "/"], ["Research", "/research/"], ["Definitions", "/research/definitions/"]]) })));

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
  write(join(DIST, "sitemap.xml"), S.sitemapXml(defs, posts));
  write(join(DIST, "robots.txt"), S.robotsTxt());
  write(join(DIST, "_headers"), S.HEADERS_FILE);
  write(join(DIST, "provenance.json"), S.provenanceIndex(defs));
  write(join(DIST, "ask-index.json"), S.askIndex(defs));
  write(join(DIST, "feed.xml"), S.atomFeed(origin, posts));
  write(join(DIST, ".well-known", "mcp.json"), S.mcpManifest(origin));
  write(join(DIST, "schemas", "definition.schema.json"),
    readFileSync(join(ROOT, "schemas", "definition.schema.json"), "utf8"));

  // static assets
  if (existsSync(join(ROOT, "assets"))) cpSync(join(ROOT, "assets"), join(DIST, "assets"), { recursive: true });

  console.log(`built dist/ (${defs.length} definitions, ${posts.length} posts) on the greenfield tree`);
}

main().catch((e) => { console.error(e); process.exit(1); });
