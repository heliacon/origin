/**
 * Machine projections and structured data: JSON-LD graphs, the MCP manifest, sitemap, feed,
 * provenance and ask indexes, robots and _headers. Pure data in, string/object out.
 *
 * Every path here is the greenfield tree (ia §5.2): definitions nest under /research/,
 * the posts stream is /journal/. The load-bearing fragment @ids are unchanged (#organization,
 * #website, #pete-dainty, #corpus, the vocabulary DefinedTermSet) so the graph stays coherent
 * (seo-continuity I-1). Per-page
 * @ids are URLs and move with their page, updated consistently across every reference.
 */
import { CANON, Dict, collapse } from "./util";

// ── path helpers (single source of truth for the new tree) ───────────────────
export const defPath = (id: string) => `/research/definitions/${id}/`;
export const defJson = (id: string) => `/research/definitions/${id}.json`;
export const defMd = (id: string) => `/research/definitions/${id}.md`;
export const journalPath = (slug: string) => `/journal/${slug}/`;
export const journalMd = (slug: string) => `/journal/${slug}.md`;

const founderSlug = (origin: Dict): string =>
  (origin.author?.name ?? "founder").toLowerCase().replace(/\s+/g, "-");
const founderRef = (origin: Dict): string => `${CANON}/#${founderSlug(origin)}`;

export const breadcrumb = (trail: [string, string][]): Dict => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${CANON}${url}` })),
});

// ── homepage graph (unchanged nodes + @ids, definition URLs moved) ───────────
export function homeGraph(origin: Dict, defs: Dict[]): Dict {
  const termRefs = defs.map((d) => ({ "@id": `${CANON}${defPath(d.id)}` }));
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
        founder: { "@id": founderRef(origin) },
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
        "@id": founderRef(origin),
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
        "@id": `${CANON}${defPath(d.id)}`,
        name: d.title,
        description: collapse(d.summary),
        inDefinedTermSet: `${CANON}/#corpus`,
        version: String(d.version ?? "0.1"),
      })),
    ],
  };
}

// ── per-page graphs ──────────────────────────────────────────────────────────
const ctx = "https://schema.org";

export const definitionGraph = (d: Dict): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "DefinedTerm",
      "@id": `${CANON}${defPath(d.id)}`,
      name: d.title,
      description: collapse(d.summary),
      inDefinedTermSet: `${CANON}/#corpus`,
      version: String(d.version ?? "0.1"),
    },
    breadcrumb([["Heliacon", "/"], ["Research", "/research/"], ["Definitions", "/research/definitions/"], [d.title, defPath(d.id)]]),
  ],
});

const wordCount = (md: string): number => (collapse(md).match(/\s+/g)?.length ?? 0) + 1;

export const postGraph = (p: Dict, origin: Dict): Dict => {
  const wc = wordCount(String(p.body_md ?? ""));
  const mins = Math.max(1, Math.round(wc / 220));
  return {
    "@context": ctx,
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${CANON}${journalPath(p.slug)}`,
        headline: p.title,
        datePublished: p.published,
        dateModified: p.updated ?? p.published,
        author: { "@id": founderRef(origin), name: p.author ?? origin.author?.name },
        publisher: { "@id": `${CANON}/#organization` },
        mainEntityOfPage: `${CANON}${journalPath(p.slug)}`,
        image: `${CANON}/assets/logo/og.png`,
        ...(p.summary ? { description: collapse(p.summary) } : {}),
        ...(Array.isArray(p.tags) && p.tags.length ? { keywords: p.tags.join(", ") } : {}),
        ...(p.category ? { articleSection: p.category } : {}),
        wordCount: wc,
        timeRequired: `PT${mins}M`,
        isPartOf: { "@id": `${CANON}/#website` },
      },
      breadcrumb([["Heliacon", "/"], ["Journal", "/journal/"], [p.title, journalPath(p.slug)]]),
    ],
  };
};

export const workIndexGraph = (): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${CANON}/work/`,
      name: "Work",
      isPartOf: { "@id": `${CANON}/#website` },
      about: { "@id": `${CANON}/#organization` },
    },
    breadcrumb([["Heliacon", "/"], ["Work", "/work/"]]),
  ],
});

export const researchGraph = (): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${CANON}/research/`,
      name: "Research",
      isPartOf: { "@id": `${CANON}/#website` },
      hasPart: [{ "@id": `${CANON}/#corpus` }],
      significantLink: [`${CANON}/research/definitions/`],
    },
    breadcrumb([["Heliacon", "/"], ["Research", "/research/"]]),
  ],
});

export const journalIndexGraph = (posts: Dict[]): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${CANON}/journal/`,
      name: "Journal",
      isPartOf: { "@id": `${CANON}/#website` },
      publisher: { "@id": `${CANON}/#organization` },
      blogPost: posts.map((p) => ({ "@id": `${CANON}${journalPath(p.slug)}` })),
    },
    breadcrumb([["Heliacon", "/"], ["Journal", "/journal/"]]),
  ],
});

export const aboutGraph = (): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${CANON}/about/`,
      isPartOf: { "@id": `${CANON}/#website` },
      mainEntity: { "@id": `${CANON}/#pete-dainty` },
      about: { "@id": `${CANON}/#organization` },
    },
    breadcrumb([["Heliacon", "/"], ["About", "/about/"]]),
  ],
});

export const contactGraph = (): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${CANON}/contact/`,
      isPartOf: { "@id": `${CANON}/#website` },
      mainEntity: { "@id": `${CANON}/#organization` },
    },
    breadcrumb([["Heliacon", "/"], ["Contact", "/contact/"]]),
  ],
});

export const studioGraph = (): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANON}/studio/`,
      name: "Studio",
      isPartOf: { "@id": `${CANON}/#website` },
      about: { "@id": `${CANON}/#organization` },
      mainEntity: { "@id": `${CANON}/#organization` },
    },
    breadcrumb([["Heliacon", "/"], ["Studio", "/studio/"]]),
  ],
});

export const productsGraph = (): Dict => ({
  "@context": ctx,
  "@graph": [
    { "@type": "CollectionPage", "@id": `${CANON}/products/`, name: "Products", isPartOf: { "@id": `${CANON}/#website` }, about: { "@id": `${CANON}/#organization` } },
    breadcrumb([["Heliacon", "/"], ["Products", "/products/"]]),
  ],
});

// Landmark docs (manifesto, architecture): Article + Research breadcrumb.
export const docGraph = (slug: string, name: string): Dict => ({
  "@context": ctx,
  "@graph": [
    {
      "@type": "Article",
      "@id": `${CANON}/${slug}/`,
      headline: name,
      author: { "@id": `${CANON}/#organization` },
      publisher: { "@id": `${CANON}/#organization` },
      mainEntityOfPage: `${CANON}/${slug}/`,
      isPartOf: { "@id": `${CANON}/#website` },
    },
    breadcrumb([["Heliacon", "/"], ["Research", "/research/"], [name, `/${slug}/`]]),
  ],
});

// Index pages (research/corpus, research/definitions).
export const collectionGraph = (path: string, name: string, trail: [string, string][]): Dict => ({
  "@context": ctx,
  "@graph": [
    { "@type": "CollectionPage", "@id": `${CANON}${path}`, name, isPartOf: { "@id": `${CANON}/#website` } },
    breadcrumb(trail),
  ],
});

// ── markdown projection for a definition ─────────────────────────────────────
export function definitionMarkdown(d: Dict): string {
  const out: string[] = [`# ${d.title}`, "", `> ${collapse(d.summary)}`, "", collapse(d.definition), ""];
  for (const [label, key] of [["Why it matters", "rationale"], ["Examples", "examples"], ["Not this", "antipatterns"]]) {
    if (d[key]?.length) out.push(`## ${label}`, "", ...d[key].map((x: string) => `- ${x}`), "");
  }
  if (d.related?.length) out.push("## Related", "", d.related.join(", "), "");
  out.push("---", `id: ${d.id} · version: ${d.version} · status: ${d.status} · source: ${CANON}${defPath(d.id)}`);
  return out.join("\n");
}

// ── MCP manifest ─────────────────────────────────────────────────────────────
export function mcpManifest(origin: Dict): Dict {
  return {
    schema_version: "2026-03-01",
    name: "heliacon-origin",
    description: collapse(origin.description),
    canonical: CANON,
    mcp: { endpoint: `${CANON}/mcp`, transport: "streamable-http" },
    tools: [
      { name: "ask", description: "Retrieve the passages of the Heliacon corpus that answer a question, each with its citation.", endpoint: `${CANON}/ask`, method: "GET", params: { q: "the question" } },
      { name: "definitions", description: "Return a canonical definition as JSON.", endpoint: `${CANON}/research/definitions/{id}.json`, method: "GET", params: { id: "definition id" } },
      { name: "provenance", description: "Return the source and version of any item.", endpoint: `${CANON}/provenance/{id}`, method: "GET", params: { id: "item id" } },
    ],
  };
}

// ── sitemap (canonical 200s only, new tree) ──────────────────────────────────
export function sitemapXml(defs: Dict[], posts: Dict[]): string {
  const entries: { loc: string; lastmod?: string }[] = [
    { loc: "/" }, { loc: "/studio/" }, { loc: "/work/" },
    { loc: "/research/" }, { loc: "/research/definitions/" },
    { loc: "/manifesto/" }, { loc: "/architecture/" },
    { loc: "/journal/" }, { loc: "/about/" }, { loc: "/contact/" }, { loc: "/products/" },
    ...posts.map((p) => ({ loc: journalPath(p.slug), lastmod: (p.updated ?? p.published) as string })),
    ...defs.map((d) => ({ loc: defPath(d.id), lastmod: d.updated as string })),
  ];
  const items = entries.map((e) =>
    `  <url><loc>${CANON}${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

// ── provenance (new canonical + source paths) ────────────────────────────────
export function provenanceIndex(defs: Dict[]): Dict {
  const items = defs.map((d) => ({
    id: d.id, kind: "definition", title: d.title,
    version: String(d.version ?? "0.1"), status: d.status ?? "draft",
    author: d.author ?? "Heliacon", updated: d.updated ?? null,
    canonical: `${CANON}${defPath(d.id)}`, source: `${CANON}${defMd(d.id)}`,
  }));
  return { origin: "heliacon", count: items.length, items };
}

// ── ask index (new citation urls) ────────────────────────────────────────────
export function askIndex(defs: Dict[]): Dict {
  const passages: Dict[] = [];
  for (const d of defs) {
    const text = [collapse(d.summary), collapse(d.definition), ...(d.rationale ?? [])].filter(Boolean).join(" ");
    passages.push({ id: d.id, kind: "definition", title: d.title, url: `${CANON}${defPath(d.id)}`, source: `${CANON}${defMd(d.id)}`, text });
  }
  return { count: passages.length, passages };
}

// ── atom feed (journal) ──────────────────────────────────────────────────────
const esc = (s: unknown): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function atomFeed(origin: Dict, posts: Dict[]): string {
  const latest = posts.map((p) => p.updated ?? p.published).filter(Boolean).sort().pop() ?? "2026-01-01";
  const summary = (p: Dict) => collapse(String(p.summary ?? (p.body_md ?? "").replace(/^#.*$/m, "").replace(/[#*_`>-]/g, ""))).slice(0, 240);
  const entries = posts.map((p) => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${CANON}${journalPath(p.slug)}"/>
    <id>${CANON}${journalPath(p.slug)}</id>
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

export const robotsTxt = () => `User-agent: *\nAllow: /\n\nSitemap: ${CANON}/sitemap.xml\n`;

// Security headers on everything; content types + CORS for the machine projections.
export const HEADERS_FILE = `/*
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
/research/definitions/*.jsonld
  Content-Type: application/ld+json; charset=utf-8
  Access-Control-Allow-Origin: *
/research/definitions/*
  Access-Control-Allow-Origin: *
`;
