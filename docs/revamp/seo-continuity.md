# SEO / machine-spine continuity spec — Heliacon revamp

Owner of this spec: seo (ARMX analyst). Status: Phase 0 foundation. Source of truth read
2026-07-15 from `build.ts`, `worker.ts`, `origin.yaml`, `docs/review-tickets.md`,
`docs/positioning.md`, and the six-template grid plus full-article mock (image cache 1.jpeg,
2.jpeg). Every "evidence" line below is grounded in those files at that fetched_at.

This is the one document Phase 1 to 4 verify the machine spine against. It does not change
source. It tells the build.ts refactor and the template work exactly which machine outputs must
survive, and what new schema each new page type must emit.

Framing note. The buyer-legible terms are SEO, AEO and GEO. The reasoning here is ARMX: five
pillars — Discoverability, Understanding, Trust, Selection, Execution. The differentiator being
protected is the origin-first machine spine: one canonical source projected to many viewpoints,
content-negotiated, provenance-first, invocable. A redesign that makes the site prettier for the
browser while degrading any other viewpoint has failed the doctrine. The browser is not
privileged. Neither is the agent.

---

## 1. Inventory of the current machine surface, and the invariants

The build projects one origin (`origin.yaml` + `definitions/*.yaml` + `corpus/*.md` + `posts/*.md`)
into `dist/`. The worker adds content negotiation and three live capability endpoints on top of
the static assets. Below is everything that exists today and the invariant that must still hold
after the redesign.

### 1a. Structured-data entities (JSON-LD)

All emitted inline as `<script type="application/ld+json">`, escaped against `</script>`
breakout (HEL-032, DONE). Node `@id`s are the load-bearing part of the graph — they must stay
byte-stable because every other node references them.

| Entity | `@id` | Where emitted | Invariant |
|---|---|---|---|
| Organization + ProfessionalService | `https://heliacon.com/#organization` | homepage graph (`jsonld()`), also `origin.jsonld` | Keep the dual `@type`. Keep `knowsAbout`, `areaServed`, `foundingDate`, `logo`, `hasOfferCatalog`, `founder` ref (HEL-042, DONE). |
| WebSite + SearchAction | `https://heliacon.com/#website` | homepage graph | Keep. `SearchAction.target` = `/ask?q={search_term_string}`. This is the advertised query capability — see 1b and 5. |
| Person (Pete Dainty) | `https://heliacon.com/#pete-dainty` | homepage graph | Keep `worksFor`, `sameAs`, `knowsAbout`, `jobTitle` (HEL-043, DONE). Slug derives from `origin.author.name`; do not rename the author without updating every `founderRef`. |
| DefinedTermSet | `https://heliacon.com/#corpus` | homepage graph | Node must exist (HEL-041, DONE). Every `inDefinedTermSet` and corpus `isPartOf` points here. |
| DefinedTerm (per definition) | `https://heliacon.com/definitions/{id}/` | homepage graph + each definition page | Keep. |
| BlogPosting + BreadcrumbList | `https://heliacon.com/notes/{slug}/` | each note page (`postJsonld`) | Keep author entity ref, `datePublished`, `dateModified`, `publisher`, `mainEntityOfPage`, `isPartOf #website` (HEL-039, DONE). |
| Article + BreadcrumbList | `https://heliacon.com/corpus/{slug}/` | each corpus page (`corpusJsonld`) | Keep (HEL-040, DONE). |
| BreadcrumbList | inline on notes and corpus | `breadcrumb()` | Keep (HEL-047, DONE). |

Invariant I-1. The homepage `@graph` keeps all five node types and their `@id`s. New page types
add nodes, they do not renumber or rename these.

Invariant I-2. `origin.json` and `origin.jsonld` remain the canonical roots and stay byte-for-byte
derivable from `origin.yaml`. The deterministic build is preserved (dates normalised to
`YYYY-MM-DD` via `normDates`).

### 1b. Live capability endpoints (worker.ts)

These are the invocable surface. They are not static files — they are the "Execution" pillar made
real, and the reason the SearchAction and MCP claims are honest rather than decorative.

| Endpoint | Method | Backed by | Invariant |
|---|---|---|---|
| `/ask?q=` | GET, POST, OPTIONS | `dist/ask-index.json` (`askIndex()`) | Lexical retrieval, no generation, every answer carries `citation{id,title,url,source}`. Rate-limited per IP. Must keep working and keep returning citations. |
| `/mcp` | POST (JSON-RPC 2.0) | `MCP_TOOLS` + capability cores | Streamable HTTP. Tools: `ask`, `definitions`, `provenance`. Read-only, own-data only, never fetches a caller URL. Keep. |
| `/provenance` and `/provenance/{id}` | GET | `dist/provenance.json` (`provenanceIndex()`) | Whole record or one item. Keep. |
| `/.well-known/mcp.json` | GET | `mcpManifest()` | Discovery manifest. `Content-Type: application/json`, CORS `*`. Keep the path exactly. |

Invariant I-3. `/ask`, `/mcp`, `/provenance`, `/.well-known/mcp.json` resolve after the redesign
with the same contracts. The homepage (or wherever the ask affordance lives) still POSTs/GETs
`/ask` and still renders the returned citations. If the ask box is removed from the page entirely,
the `SearchAction` and the "we practise what we sell" claim become unbacked — see 5.

### 1c. Content negotiation (the five projections)

`origin.yaml` declares the projections: `html, markdown, json, jsonld, mcp`. The worker negotiates
by `Accept` from the same canonical URL (HEL-048, DONE for markdown).

| Accept | Resolves to | Paths currently negotiable |
|---|---|---|
| default / `text/html` | HTML | all |
| `application/ld+json` | `.jsonld` | `/` only (`jsonProjection`) |
| `application/json` | `.json` | `/`, `/definitions/{id}/` |
| `text/markdown` / `text/x-markdown` | `.md` | `/`, `/definitions/{id}/`, `/corpus/{slug}/`, `/notes/{slug}/`, `/manifesto`, `/architecture`, `/consulting`, `/products` |

Every HTML page advertises its alternates via `<link rel="alternate">`, and the worker resolves
them. `Vary: Accept` is set on negotiated responses and appended on the fallthrough.

Invariant I-4 (the one most likely to break). If a new page type advertises a `.md` (or `.json`)
alternate in its `<head>`, the worker's `mdProjection`/`jsonProjection` regex MUST be extended in
the same change so the alternate actually resolves. An advertised alternate that 404s breaks the
"negotiate by Accept" claim — that regression is precisely what HEL-048 fixed. Conversely, do not
advertise an alternate you have not wired into the worker. Twin consistency across viewpoints
(doctrine section 2) is checked here.

Invariant I-5 (doctrine, house stance). `llmsTxt()` is defined in `build.ts` but is NOT called in
`main()` and NOT written to `dist/`. This is correct and deliberate: the house line is that
llms.txt is not a standard and is a penalty waiting to happen (armx-doctrine section 6). Keep it
dormant. The redesign must not start emitting `llms.txt`, and must not add it to nav, footer,
sitemap or the MCP manifest. The five real projections are html, markdown, json, jsonld, mcp.

### 1d. Discovery and crawl projections

| File | Producer | Invariant |
|---|---|---|
| `sitemap.xml` | `sitemapXml()` | Every URL real and 200. `<lastmod>` present where a date is in hand (HEL-044, DONE). New page types get added here; retired paths get removed. |
| `robots.txt` | `robotsTxt()` | `Allow: /`, `Sitemap:` line. Keep open. |
| `feed.xml` (Atom) | `atomFeed()` | Notes stream. Keep. Extend if the journal template adds entries. |
| `_headers` | `HEADERS_FILE` | HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`; per-type Content-Type + CORS `*` on the machine files. CSP and Permissions-Policy are ADDED here in Phase 3 — see 4. |
| `origin.json`, `origin.jsonld`, `origin.md`, `origin.yaml` | `main()` | Canonical roots. Keep at root. |
| `provenance.json`, `ask-index.json` | as above | Keep at root, CORS `*`. |
| `schemas/definition.schema.json` | copied | Keep. |

### 1e. Per-page metadata (every HTML page)

From `page()`: `<title>`, `<meta name="description">`, `<link rel="canonical">` (absolute),
favicon + apple-touch-icon, OG (`og:type`, `og:site_name` = Heliacon, `og:locale` = en_GB,
title, description, url, image), Twitter (`summary_large_image`, title, description), and per-note
`article:published_time` / `article:modified_time` / `article:author` (HEL-049, DONE).

Invariant I-6. Every page keeps exactly one self-referential absolute `<link rel="canonical">`, a
unique `<title>`, and a unique keyword-bearing `<meta name="description">`. Heading order stays
`<h1>` before any `<h2>` (HEL-029, DONE). Skip link, `:focus-visible`, `aria-live` on the answers
region, and `prefers-reduced-motion` survive (HEL-061, DONE).

---

## 2. Schema for each new or changed page type

Types chosen to extend the existing graph, reuse the stable `@id`s, and keep every content page
carrying its own author, dates and hierarchy (not only the homepage graph). Author for studio
content is the Organization; author for signed writing is the Person. Publisher is always
`#organization`.

### 2a. Home (`/`) — changed layout, same graph

Keep the homepage `@graph` as-is: Organization+ProfessionalService, WebSite+SearchAction, Person,
DefinedTermSet, DefinedTerm[]. No new types needed. The new "WHAT WE DO" five-capability block and
"EXPLORE OUR WORK" cards are presentational; they map to `hasOfferCatalog` which already exists.

- Outcome at stake: the entity graph the assistants read to know who Heliacon is and that it is
  askable. Pillars: Understanding + Selection.
- Requirement: the ask affordance stays on the page (or the SearchAction is demoted). See 5.
- Watch-out (Trust/Selection): the mock H1 "Navigate uncertainty. Build with confidence." carries
  no buyer or entity meaning cold. That is a marketing call, but from an ARMX view it regresses
  HEL-009 (the category-led hero, DONE). Keep the real keyword-bearing text somewhere above the
  fold and keep the `<meta name="description">` explicitly about AI search visibility / being
  cited. Do not let the softer headline strip the page of its entity signal. Flag to marketing.

### 2b. Work index (`/work/`) — CollectionPage

`/work/` is today a single markdown page. It becomes an index of case studies.

```
{ "@context":"https://schema.org", "@graph":[
  { "@type":"CollectionPage", "@id":"https://heliacon.com/work/",
    "name":"Work", "isPartOf":{"@id":"https://heliacon.com/#website"},
    "about":{"@id":"https://heliacon.com/#organization"},
    "mainEntity":{ "@type":"ItemList", "itemListElement":[
      { "@type":"ListItem", "position":1, "url":"https://heliacon.com/work/{slug}/" } ] } },
  breadcrumb(["Heliacon","/"],["Work","/work/"]) ] }
```

- Outcome: the journey from "what have they actually done" to a qualified enquiry. Pillar:
  Selection + Trust.
- Honesty constraint (PLAN): the mock's named case studies and "10+/50+" stats are PLACEHOLDERS.
  Do not emit `ItemList` entries, sitemap URLs or schema for case studies that do not exist as
  real pages. Ship `/work/` with Case Study Zero (this site) only until Pete supplies real
  engagements. A schema claim the page cannot back is a Trust regression and a doctrine red flag.

### 2c. Case-study detail (`/work/{slug}/`) — CreativeWork, subtype chosen below

Decision: use `CreativeWork` with `@type` refined to `Article` when the piece is a written
narrative, and add a `mainEntity` of `Service` linking back to the offer it evidences. Justification:

- A case study is primarily a *narrative of work done*, read and cited like an article, so `Article`
  earns the AEO/Selection surface (author, dates, headline, passages). This is the CreativeWork
  family, matching how `corpus` essays are modelled — one consistent pattern for long-form.
- It is NOT a `Service` page. The Services live in `hasOfferCatalog` on `#organization` and on
  `/consulting/`. Modelling a case study as `Service` would duplicate the offer entity and muddy
  Selection. Instead the case study *references* the service it proves via `about` / `mainEntity`,
  which strengthens the offer's evidence without duplication.

```
{ "@type":"Article", "@id":"https://heliacon.com/work/{slug}/",
  "headline":"...", "author":{"@id":"https://heliacon.com/#organization"},
  "publisher":{"@id":"https://heliacon.com/#organization"},
  "datePublished":"YYYY-MM-DD", "dateModified":"YYYY-MM-DD",
  "mainEntityOfPage":"https://heliacon.com/work/{slug}/",
  "about":{"@type":"Service","name":"AI search visibility"},
  "isPartOf":{"@id":"https://heliacon.com/#website"} }
+ breadcrumb(["Heliacon","/"],["Work","/work/"],[title,"/work/{slug}/"])
```

Author/date/publisher: author = Organization (studio work, not a signed byline) unless Pete signs
it, in which case author = `#pete-dainty`. `datePublished` and `dateModified` required. If a case
study advertises a `.md` alternate, extend the worker (I-4).

### 2d. About (`/about/`) — AboutPage + enriched Person

`/about/` exists (`about.md`, HEL-001 DOING). The founder IS the product for a firm selling
fractional leadership, so the Person entity is the highest-value node on this page.

```
{ "@type":"AboutPage", "@id":"https://heliacon.com/about/",
  "isPartOf":{"@id":"https://heliacon.com/#website"},
  "mainEntity":{"@id":"https://heliacon.com/#pete-dainty"},
  "about":{"@id":"https://heliacon.com/#organization"} }
+ breadcrumb(["Heliacon","/"],["About","/about/"])
```

Enrich the Person node (keep the `@id` `#pete-dainty`): add `description`, `image`, `alumniOf`
if Pete supplies it, and keep `sameAs` (LinkedIn from `origin.yaml`, GitHub). The mock's "Our
Mission / Approach / Values" become page sections with anchor ids (`#mission`, `#values`) so a
model can cite the exact passage — Understanding win. The "10+/50+" stat tiles are PLACEHOLDERS
(PLAN); do not mark them up as anything factual.

- Outcome: E-E-A-T and the founder journey to a hire. Pillars: Trust + Selection.

### 2e. Journal index — Blog, and post — keep BlogPosting

The mock's "JOURNAL" nav is the posts stream (`posts/*.md`, the current `/notes/` tree). Section 3
picks the canonical path (`/journal/` recommended, `/notes/` the current token) — use the SAME
token in every `@id`, breadcrumb, feed and worker regex below. The index currently emits no schema;
add `Blog`/`CollectionPage`:

```
{ "@type":"Blog", "@id":"https://heliacon.com/notes/",
  "name":"Journal", "isPartOf":{"@id":"https://heliacon.com/#website"},
  "publisher":{"@id":"https://heliacon.com/#organization"},
  "blogPost":[ {"@id":"https://heliacon.com/notes/{slug}/"} ... ] }
+ breadcrumb(["Heliacon","/"],["Journal","/notes/"])
```

Post pages keep `postJsonld()` (BlogPosting + breadcrumb, HEL-039 DONE) unchanged, but the mock
adds real fields — fold them in as they strengthen Understanding and Selection:

- Category chip (ENGINEERING): add `articleSection`.
- Tags (AI, INFRASTRUCTURE, LOCAL-FIRST, SYSTEMS): add `keywords` (comma-joined). Source from a
  new `tags:` frontmatter key on `posts/*.md`.
- "8 MIN READ": add `timeRequired` as ISO-8601 (`PT8M`), and `wordCount`. Compute at build.
- "Related articles": internal links — a real PageRank/journey win (Discoverability). Optionally
  add `relatedLink`. Prefer honest relatedness (shared tags) over a random three.
- "On this page" TOC: give each `<h2>` a stable `id` so passages are deep-linkable
  (`/notes/{slug}/#section`). This is the cheapest Selection win in the whole revamp — it lets an
  answer engine cite a passage, not just the page.
- Breadcrumb label: the mock says "back to journal". The breadcrumb name may read "Journal" while
  the canonical path stays `/notes/`. Keep the trail `["Heliacon","/"],["Journal","/notes/"],
  [title,"/notes/{slug}/"]`.
- Tags as pages: only create `/notes/tag/{tag}/` if each tag has real content behind it, modelled
  as `CollectionPage` and added to the sitemap. If tags are just labels, render them as
  non-linked chips. Do NOT ship thin tag pages to inflate a count — doctrine red flag
  (proxy-gaming, thin pages).
- Newsletter signup in the article: if built, handle it server-side in the worker (privacy
  doctrine, HEL-018). No third-party tracker, no external `connect-src`. Until there is a handler,
  do not render a form that silently fails.

### 2f. Research hub (`/research/`) and Definitions (keep) and Corpus (keep)

The mock's "RESEARCH" nav is distinct from "JOURNAL". Research is the hub over the vocabulary and
the essays; Journal is the dated stream. Build a `/research/` hub page:

```
{ "@type":"CollectionPage", "@id":"https://heliacon.com/research/",
  "name":"Research", "isPartOf":{"@id":"https://heliacon.com/#website"},
  "hasPart":[ {"@id":"https://heliacon.com/#corpus"} ],
  "significantLink":["https://heliacon.com/corpus/","https://heliacon.com/definitions/"] }
+ breadcrumb(["Heliacon","/"],["Research","/research/"])
```

Definitions (`DefinedTermSet` + `DefinedTerm`, HEL-041 DONE) and corpus essays
(`Article` + breadcrumb, HEL-040 DONE) are kept exactly. `/corpus/` and `/definitions/` index
pages stay browsable (HEL-019 DONE). The `/research/` hub links to both — it does not replace
them and does not change their canonicals.

### 2g. Contact (`/contact/`) — ContactPage + ContactPoint

The mock replaces the bare `mailto:` (HEL-023 OPEN) with a dedicated contact page and a form.

```
{ "@type":"ContactPage", "@id":"https://heliacon.com/contact/",
  "isPartOf":{"@id":"https://heliacon.com/#website"},
  "mainEntity":{"@id":"https://heliacon.com/#organization"} }
+ breadcrumb(["Heliacon","/"],["Contact","/contact/"])
```

`#organization` already carries `email` and a `ContactPoint` (`contactType:"business"`) — keep
it, and this page becomes its canonical home. Add `Remote-first` as `areaServed` context if
desired. The form needs a real handler: a `POST /contact` route in `worker.ts` (validate,
rate-limit, forward to `hello@heliacon.com` or a queue). Keep a copyable `hello@heliacon.com` and
a `mailto:` as the no-JS fallback so contact never silently fails (closes HEL-023, supports
HEL-005). Do not point `<form action>` at `mailto:` — that is the silent-fail being removed.

- Outcome: the conversion event. Pillars: Execution (a form an agent could complete) + Trust.
- Anti-spam: honeypot or turnstile server-side, never a third-party script that phones home.

---

## 3. Clean canonical URL scheme (designed from scratch, no redirects)

Constraint (Pete, 2026-07-15): the site is not meaningfully live, there is no URL equity to
preserve, so there are no 301s. Design one clean canonical URL per page type from scratch. The only
rule inherited from the current build is the trailing-slash directory form (`/thing/`), which the
worker's negotiation regexes already assume — keep it for consistency, not for equity.

One canonical per page. Every `<link rel="canonical">` is self-referential and absolute. No page is
reachable at two canonical URLs, no alias needs redirecting, and the nav label may differ from the
path (the label is cosmetic, the URL is the identity).

| Nav label | Canonical URL | Page type | Schema (see 2) |
|---|---|---|---|
| — (logo) | `/` | Home | Org+ProfessionalService, WebSite+SearchAction, Person, DefinedTermSet, DefinedTerm[] |
| Studio | `/studio/` | Services / studio overview | ProfessionalService context + `hasOfferCatalog` |
| Work | `/work/` | Case-study index | CollectionPage + ItemList |
| Work (detail) | `/work/{slug}/` | Case study | Article, `about` a Service |
| Research | `/research/` | Vocabulary + essays hub | CollectionPage |
| — | `/corpus/`, `/corpus/{slug}/` | Essays | Article + breadcrumb |
| — | `/definitions/`, `/definitions/{id}/` | Vocabulary | DefinedTermSet / DefinedTerm |
| Journal | `/journal/` | Posts stream index | Blog / CollectionPage |
| Journal (post) | `/journal/{slug}/` | Post | BlogPosting + breadcrumb |
| About | `/about/` | Founder + firm | AboutPage + Person |
| Contact | `/contact/` | Contact + form | ContactPage + ContactPoint |
| — (footer/machine) | `/manifesto/`, `/architecture/`, `/products/` | Root docs | WebPage/Article as today |

Naming decisions made here, since there is no legacy to honour:

- Journal at `/journal/`, not `/notes/`. The mock's nav says "Journal" and the label should match
  the path when nothing forces otherwise. This renames the current `/notes/` tree. Because there is
  no equity, this is a free rename — but it is a coordinated one: `build.ts` post writers, the
  `feed.xml`/sitemap paths, `postJsonld` `@id`s, the breadcrumb trail, and the worker's
  `mdProjection` regex (`notes` → `journal`) all change together in one commit, or the machine
  spine breaks (Invariant I-4). Pick `/journal/` or `/notes/` once and use it everywhere.
- Studio at `/studio/`, not `/consulting/`. Same free-rename logic: the mock's first nav item is
  "Studio". If chosen, update the worker `mdProjection` root regex (`consulting` → `studio`) and the
  homepage/footer links in lockstep. Keep the `.md` alternate wired.
- Research (`/research/`) is a genuinely new hub over `/corpus/` and `/definitions/`; it does not
  replace either, and both keep their own canonical index pages (HEL-019 stays satisfied).
- Case studies (`/work/{slug}/`) and Contact (`/contact/`) are new paths with no predecessor.

Footer placeholders in the mock (Careers, Values, Tools, Partnerships, Case Studies): do NOT ship
links to pages that do not exist. A nav or footer link to a 404 is a Discoverability and Trust
regression and a wasted crawl path. Map or drop:

- "Case Studies" → `/work/`.
- "Tools" → `/products/` (or omit until there are tools).
- "Values" → `/about/#values` (anchor, not a new page).
- "Careers", "Partnerships" → omit until real.

Sitemap rule: `sitemap.xml` lists only canonical 200 URLs, each with `<lastmod>` from its source
date (HEL-044 pattern). New page types are added to `sitemapXml()`; placeholder case studies are
NOT added until they are real 200s.

---

## 4. Perf / Core Web Vitals tickets to fold into the rebuild

These were deferred to the visual cycle. The rebuild is the moment to land them. All three are
also non-SEO wins: LCP and CWV are conversion factors for every human visitor, not just a ranking
signal (doctrine: surface the business impact beyond SEO).

### HEL-038 — hero and asset delivery (LCP)

- Full-bleed hero is the LCP element. Serve it as AVIF with a WebP and JPEG fallback via
  `<picture>`, sized with responsive `srcset`/`sizes` for mobile vs desktop. The current
  `background-image` on `.hero` (build.ts CSS) cannot be preloaded or `srcset`-served — move the
  hero image to a real `<img>` in a `<picture>` (or keep it decorative background but then preload
  the exact file). LCP on a CSS background is the harder-to-optimise path.
- `<link rel="preload">` the chosen hero source and the two Cinzel woff2 fonts in `<head>` (add via
  the `extraMeta` hook in `page()` for the home template only, so interior pages do not preload the
  hero they never show).
- Fonts already use `font-display: swap` (build.ts `@font-face`) — keep it. Preload prevents the
  swap flash on the LCP text.
- Content-hash the long-lived assets (hero, fonts, `styles.css`, `app.js`, `diagram.svg`) and set
  `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` (and on the hashed CSS/JS) in
  `_headers`. Do NOT set `immutable` on unhashed filenames like `/styles.css` — either hash it or
  give it a short max-age, otherwise you cannot ship a CSS fix. HTML gets a short/`no-cache` TTL so
  content updates are seen.
- Outcome: LCP under 2.5s on the hero, faster first paint, better conversion and better CWV
  ranking input. Pillar: Discoverability (page experience) + the human journey.
- Owner: frontend + devops (`_headers`), asset pass produces the responsive hero.

### HEL-031 — CSP + Permissions-Policy that still allows inline JSON-LD

The inline `<script type="application/ld+json">` blocks are DATA, not executable JavaScript, so a
`script-src` directive does not block them — the graph survives a strict CSP. The real constraints
are the inline `style="..."` attributes in the markup and the single external `app.js`.

Recommended header set in `_headers` (applies to HTML; harmless on the JSON files):

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self' mailto:; base-uri 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()
```

- `script-src 'self'` works because `app.js` is external and JSON-LD is non-executable. Verify in a
  browser that the JSON-LD still parses (Rich Results test) and `app.js` still loads.
- `style-src 'self'` requires removing the inline `style="..."` attributes (hero, `h1
  style="margin-top:8px"`, etc.) into utility classes in `styles.css`. Prefer this over adding
  `'unsafe-inline'`. If time-boxed, `style-src 'self' 'unsafe-inline'` is the pragmatic fallback,
  but note it in the ticket as debt.
- `connect-src 'self'` keeps the `/ask` fetch working and blocks any third-party beacon — aligns
  with the no-tracking claim (HEL-018). If a newsletter or contact form is added, keep it
  same-origin (`POST /contact`, `POST /subscribe`) rather than widening `connect-src`.
- `form-action 'self' mailto:` allows the ask form (`/ask`), the contact form (`/contact`) and any
  `mailto:` fallback.
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'none'` are free hardening.
- Keep the existing HSTS, `X-Content-Type-Options`, `Referrer-Policy`.
- Outcome: Trust/security posture (a hardening signal and a real XSS reduction) with no loss of the
  entity graph. Pillar: Trust. Owner: frontend (inline-style refactor) + devops (`_headers`),
  verified by tester in a browser.

### font-display and LCP text

`font-display: swap` is already set. Ensure the hero H1 uses a preloaded font so the LCP text does
not reflow. Keep `prefers-reduced-motion` (HEL-061) honoured by any new hero animation.

---

## 5. ARMX / house-doctrine framing (the invocable story)

The redesign's job, in ARMX terms, is to keep the entity graph coherent and the invocable story
true while the browser viewpoint gets prettier. The defensible value sits in Trust, Selection and
Execution — protect those first.

- Discoverability: clean 200s, no links to non-existent footer pages, sitemap of canonicals only,
  feed intact, hashed-asset caching. The redesign must not add crawl traps or 404 nav links.
- Understanding: the graph's stable `@id`s, per-page author/date/hierarchy, deep-linkable `<h2>`
  anchors on posts and about-page sections, self-contained passages. Tags and `articleSection`
  add entity context. This is where the new page types earn their schema.
- Trust: HTTPS + HSTS + the new CSP, one canonical per page, provenance API and the source-available
  claim, real author entity. The honesty constraint is a Trust rule: placeholder stats and unbuilt
  case studies do not get marked up as fact. Positioning ("found and cited *without being
  extracted*", positioning.md) is a Trust story the provenance and no-tracking posture must keep
  backing.
- Selection: being the answer an engine cites. The `/ask` endpoint, the citation-first design, the
  corpus passages, deep anchors and clean BlogPosting/Article markup are the machinery. The
  softened hero must not strip the page of the entity/keyword signal that makes Heliacon
  retrievable for "AI search visibility" intents.
- Execution / Invoke: this is the differentiator and the frontier. `/mcp` (real WebMCP-adjacent
  server), `/.well-known/mcp.json`, the `SearchAction` pointing at `/ask`, and the future
  `POST /contact` are all invocable affordances an agent can act on. The house stance holds:
  favour these real HTTP/structured signals and WebMCP, and do NOT add llms.txt (I-5). The honest
  agentic metric is whether agents actually invoke, not whether the page merely looks ready.

The one hard ARMX requirement on the visual team: keep an ask affordance on a crawlable page. The
`SearchAction` in `#website` advertises `/ask?q=` as a live query capability. If the ask box is
deleted from the homepage, either (a) relocate it to `/research/` or keep a compact version on
home, or (b) demote the `SearchAction` — but option (b) throws away the single clearest "we are
invocable, not just readable" proof on the entire site. Recommendation: keep it. It is the
"practise what we sell" evidence and it is cheap to keep.

Note on HEL-046 (NEEDS-PETE): homepage answers are JS-only and there is no `FAQPage`. The rebuild
is a chance to server-render a few canonical Q&A pairs from the corpus so crawlers see them without
JS. Only do this with genuine questions and genuine cited answers — real Q&A, not answer-bait.
That is a Selection win that also fixes a Discoverability gap. Left as Pete's call.

---

## 6. Do-not-regress checklist (mapped to DONE cycle-1 tickets)

Phase 1 (build.ts refactor) and every later phase verify against this. Each line is a DONE ticket
whose behaviour must still hold. Tester: diff the new `dist/` against these assertions.

- [ ] HEL-030 — `minifyHtml` still preserves the single space between adjacent inline elements
  (the `.proj`/footer link rows do not run together). Do not "improve" the minifier to collapse
  `>\s+<`.
- [ ] HEL-032 — every inline JSON-LD block still escapes `</script>` (`.replace(/</g,"\\u003c")`).
- [ ] HEL-033 — frontmatter still parsed by the explicit fenced regex; a missing closing fence does
  not swallow the body. New `tags:` frontmatter parses without breaking this.
- [ ] HEL-035 — worker `/ask` still guards non-string `q` and the top-level try/catch stays.
- [ ] HEL-036 — build still names the offending file on a malformed source.
- [ ] HEL-029 — every page emits `<h1>` before any `<h2>`; new templates included.
- [ ] HEL-019 — `/corpus/` and `/definitions/` index pages still resolve for humans; the new
  `/research/` hub links them, does not replace them.
- [ ] HEL-021 — no redundant back-link on pages that already carry the nav (the article mock's
  "back to journal" is the intended single breadcrumb, not a second stray link).
- [ ] HEL-020 — nav label ↔ destination ↔ H1 ↔ footer are consistent, with an active state. The
  new six-item nav (Studio, Work, Research, Journal, About, Contact) must each resolve to a real
  200 whose H1 matches the label intent.
- [ ] HEL-039 — notes still emit `BlogPosting` with author entity, `datePublished`, `dateModified`,
  `publisher`. New fields (`keywords`, `articleSection`, `timeRequired`, `wordCount`) are additive.
- [ ] HEL-041 — `inDefinedTermSet` / `#corpus` DefinedTermSet node still exists and is referenced.
- [ ] HEL-042 — Organization+ProfessionalService keeps `knowsAbout`, `areaServed`, `foundingDate`,
  `logo`, `hasOfferCatalog`, `founder`.
- [ ] HEL-043 — Person keeps `worksFor`, `sameAs`, `knowsAbout`, `jobTitle`; enrichment is additive
  and the `@id` `#pete-dainty` is unchanged.
- [ ] HEL-044 — sitemap carries `<lastmod>` for every dated URL; new URLs follow the pattern; only
  canonical 200s are listed.
- [ ] HEL-045 — MCP `definitions` tool still returns JSON (`/definitions/{id}.json`), not HTML.
- [ ] HEL-047 — `BreadcrumbList` on every interior page, including the new page types.
- [ ] HEL-048 — `Accept: text/markdown` (and json/jsonld) still negotiate. Any new advertised
  alternate is wired into the worker regex (I-4). No advertised alternate 404s.
- [ ] HEL-049 — OG/Twitter complete (`og:site_name`, `og:locale` en_GB, twitter title/desc) and
  `article:*` on posts.
- [ ] HEL-040 — corpus pages still carry `Article` + breadcrumb.
- [ ] HEL-061 — skip link, `:focus-visible`, `aria-live` on the answers region, and
  `prefers-reduced-motion` survive in the new templates.

Machine-spine assertions (not a single ticket, but the differentiator):

- [ ] `/ask`, `/mcp`, `/provenance`, `/.well-known/mcp.json` all resolve with unchanged contracts.
- [ ] `origin.json`, `origin.jsonld`, `origin.md`, `origin.yaml`, `provenance.json`,
  `ask-index.json`, `feed.xml`, `robots.txt`, `sitemap.xml` all still emit at their paths with
  CORS `*` on the machine files.
- [ ] The homepage `@graph` still contains Organization+ProfessionalService, WebSite+SearchAction,
  Person, DefinedTermSet and DefinedTerm nodes with their existing `@id`s.
- [ ] No `llms.txt` is emitted, linked or advertised (I-5, house stance).
- [ ] The build stays deterministic: same inputs → byte-identical `dist/` (dates normalised).
- [ ] An ask affordance remains on a crawlable page so the `SearchAction` claim is backed.

---

## Handoffs

- Frontend: templates for the six page types plus `/research/` hub and `/work/{slug}/`; move
  inline `style=""` to classes for CSP; `<picture>` hero with preload; deep-link `<h2>` ids on
  posts. Flag: keep every advertised `.md`/`.json` alternate wired to the worker (I-4), keep the
  ask affordance on-page.
- Backend (worker.ts): extend `mdProjection`/`jsonProjection` for any new negotiable path and
  rename the `notes`/`consulting` tokens if section 3's paths are adopted; add `POST /contact` (and
  `POST /subscribe` only if the newsletter ships), same-origin, rate-limited, no third-party calls.
  No redirects — the URL scheme is clean from scratch.
- Devops: `_headers` gains CSP, Permissions-Policy and `Cache-Control: immutable` on hashed assets;
  hash long-lived asset filenames in the build.
- Content (Pete/marketing): real case studies before `/work/{slug}/` schema goes live; keep the
  keyword-bearing entity signal in the hero/description; decide FAQ server-render (HEL-046); supply
  post `tags:`. Flag: no stat or case-study claim gets marked up until it is provable on-page.
```
