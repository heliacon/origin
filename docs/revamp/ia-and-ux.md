# Heliacon revamp — information architecture and UX spec

Owner: Pete Dainty. Author: UX/IA pass, Phase 0. Date: 2026-07-15.
Status: decision-grade. Feeds BUILD-SPEC.md. Voice per STYLE.md (British English, no Oxford comma, no em dash). Where a mock shows American spelling or a long dash, convert it.

Measured against one goal: the site must read primarily as a studio and consultancy you can hire, and a research lab second. Every decision below is taken in that order. The machine spine (MCP, /ask, /provenance, five projections, entity schema) is preserved untouched.

---

## 0. Decisions at a glance

| Question | Decision |
|---|---|
| What is STUDIO? | The hire-us hub. Absorbs `consulting.md` (Services) plus how-we-work and the engagement model. The primary buyer destination. Not the home page. |
| Home page | Reached by the wordmark, as convention. Not a nav label. |
| WORK vs STUDIO | STUDIO says what you can hire. WORK shows proof. Work leads with Case Study Zero (this site), the one real inspectable engagement. |
| RESEARCH vs JOURNAL | JOURNAL = the four dated posts (timely, personal). RESEARCH = the durable body of work: corpus essays, definitions, architecture, manifesto. |
| ABOUT | Founder Pete Dainty, plus mission, approach and values. The founder is the product. |
| CONTACT | New real page. Copyable email, a form with real states, optional booking link. Replaces the silent-failing mailto. |
| Products | Demoted. No nav slot (the mock agrees). Folded into WORK as a facet and kept as a light page at `/products/`. |
| Nav-label collisions | "Research" and "Studio" appear as both nav destinations and Work facet tags. Resolved in section 4. |
| URLs | Fully greenfield. The site holds no URL equity, so paths are designed clean from scratch with no obligation to old ones. Collections nest under their hub. See section 5. |

---

## 1. Sitemap and navigation

### 1.1 Primary navigation (final)

Six items, buyer-first left to right, exactly as the approved mock:

```
STUDIO · WORK · RESEARCH · JOURNAL · ABOUT · CONTACT
```

| Label | Destination | H1 | Role |
|---|---|---|---|
| STUDIO | `/studio/` | Studio | What you can hire. The offer, how we work, the engagement model. |
| WORK | `/work/` | Our Work | Proof. Case Study Zero plus real projects. |
| RESEARCH | `/research/` | Research | The durable body of work: corpus, definitions, architecture, manifesto. |
| JOURNAL | `/journal/` | Journal | The dated stream of four posts. |
| ABOUT | `/about/` | About Heliacon | Founder, mission, approach, values. |
| CONTACT | `/contact/` | Get in Touch | Convert. Email, form, booking. |

The wordmark (top-left) always links home. Home is not a nav label, so STUDIO is free to be the hire-us page. This is the single most important IA move: it gives the buyer a named front door that is not the philosophy.

### 1.2 Site map

```
/ (home)
├── /studio/                     STUDIO — the offer, how we work, engagement, who it is for
├── /work/                       WORK index — Case Study Zero + project cards, filterable
│   ├── /work/case-study-zero/   the live origin, this site, as a case study
│   ├── /work/armx/              ARMX Framework (real, Heliacon's own)
│   └── /work/topkay/            Topkay/Kenovar platform (real, Heliacon's own)
├── /research/                   RESEARCH hub — collections nest, landmark docs stay top-level
│   ├── /research/corpus/        seven essays
│   │   └── /research/corpus/{slug}/
│   └── /research/definitions/   seven canonical definitions
│       └── /research/definitions/{slug}/
├── /manifesto/                  the belief — top-level landmark, surfaced in Research
├── /architecture/               the spec — top-level landmark, surfaced in Research
├── /journal/                    JOURNAL index — four dated posts
│   └── /journal/{slug}/
├── /about/                      ABOUT — founder + mission/approach/values
├── /contact/                    CONTACT — email, form, booking
├── /products/                   light page, footer + Work facet only (no nav slot)
└── machine spine (unchanged)
    ├── /.well-known/mcp.json
    ├── /ask
    ├── /provenance  /provenance.json
    ├── /origin.json  /origin.yaml
    ├── /feed.xml  /sitemap.xml  /robots.txt  /llms.txt
    └── *.md alternates for every human page
```

### 1.3 Footer navigation

The article mock shows three columns plus a brand blurb. Populated, with the honesty and machine notes applied:

**WORK** (the five capability facets, each a filtered Work view)
- Strategy → `/work/?type=strategy`
- Research → `/work/?type=research`
- Products → `/products/`
- Partnerships → `/studio/#partnerships`
- Studio → `/studio/`

**RESOURCES**
- Journal → `/journal/`
- Research → `/research/`
- Case Studies → `/work/`
- Tools → `/products/` (and see the machine row below)

**COMPANY**
- About → `/about/`
- Values → `/about/#values`
- ~~Careers~~ → drop. A solo studio has no careers page. Replace with **Approach → `/studio/#how-we-work`**, or omit. Flagged as a gap decision.
- Contact → `/contact/`

**For machines** (a fourth affordance, small, below the columns — keeps the machine spine discoverable and is on-brand)
- MCP → `/.well-known/mcp.json` · JSON → `/origin.json` · Provenance → `/provenance` · Ask → `/ask` · Feed → `/feed.xml`

Brand blurb (left of columns): "We help organisations navigate uncertainty and build with confidence at the intersection of search, AI and human intent." Plus © 2026 Heliacon LLC and social links (LinkedIn, X).

Footer rationale: the current footer is a flat 11-link run. Grouping into WORK / RESOURCES / COMPANY / FOR MACHINES gives scent, demotes the philosophy pages off the buyer path, and keeps every machine endpoint one click away.

---

## 2. Per-page wireframes (section order)

Notation: each block is a full-bleed or contained section, top to bottom. CTA = call to action.

### 2.1 Home `/`

```
[ HEADER ] wordmark + nav (STUDIO WORK RESEARCH JOURNAL ABOUT CONTACT)
[ HERO ] full-bleed dawn art
   H1  Navigate uncertainty. Build with confidence.
   sub Strategy, research and products at the intersection of search, AI and human intent.
   CTA Explore our work →  (/work/)
   secondary CTA (quiet) Talk to us → (/contact/)
[ WHAT WE DO ] label + 5 icon facets, each a one-line offer:
   Strategy · Research · Products · Partnerships · Studio
   each links to /studio/#{facet} or /work/?type={facet}
[ EXPLORE OUR WORK ] label + filter tabs (All Strategy Research Products Studio)
   3 project cards (Case Study Zero, ARMX, Topkay) with "View project →"
   link: View all work → (/work/)
[ ASK STRIP ] the /ask box, server-rendered canonical Q&A beneath (crawlable)
   after an answer renders → BRIDGE CTA "Want this for your origin? Start a conversation →"
[ LATEST FROM THE JOURNAL ] 3 most recent posts (date · title · category)
   link: About Heliacon → (/about/)  |  Read the journal → (/journal/)
[ FOOTER ]
```

Changes from today: the seven-pillar definitions glossary leaves the homepage (it was manifesto voice on the buyer path, HEL-013). The homepage now leads with buyer-legible capability facets. The green "Origin online" status dot leaves the nav (HEL-055); machine status, if kept at all, moves to the For-machines footer affordance.

### 2.2 Studio `/studio/` (the hire-us hub, absorbs Services)

```
[ HEADER ]
[ PAGE HEAD ] H1 Studio | lede: what we do and how we work
[ THE SHIFT WE LEAD ] the AI-visibility wedge first (be found, trusted, invoked)
   two disciplines: Be found and cited · Be invocable
[ WHAT WE DO ] the 5 facets expanded (Strategy, Research, Products, Partnerships, Studio)
   each with a paragraph and an anchor id (for footer/home deep links)
[ WE ALSO HELP WITH ] the adjacent problems (experimentation, search/discovery, agentic product, fractional leadership)
[ WHO IT IS FOR ] 2-3 concrete buyer situations (ICP, self-select)
[ HOW WE WORK ] measured by invocation, substance over spin, you keep the source
[ ENGAGEMENT MODEL ] what you get, in what order (placeholder-safe: describe stages, not fixed prices)
[ CTA BAND ] Start a conversation → (/contact/)
[ FOOTER ]
```

Note: engagement model and pricing tiers are NEEDS-PETE (HEL-003, HEL-004). Spec the section; leave the content as a stub Pete fills. Do not invent prices.

### 2.3 Work index `/work/`

```
[ HEADER ]
[ PAGE HEAD ] H1 Our Work | lede: we partner with organisations to solve problems at the intersection of search, AI and human intent
[ CASE STUDY ZERO ] featured, full-width — the live origin as proof (this is the one real, inspectable engagement)
   inline chips: working MCP · citation-first /ask · provenance API · source-available
   CTA Inspect it → (/work/case-study-zero/)
[ FILTER TABS ] All · Strategy · Research · Products · Studio
[ PROJECT GRID ] cards. REAL projects labelled "View project". Offer areas labelled "Capability".
   Real:   ARMX Framework, Topkay Platform
   Offer:  AI Search Strategy, Content Intelligence, Agent Experience Design, Data & Signal Strategy
[ CLIENT WORK ] honest note: engagements underway, outcomes shown not claimed as they complete
[ CTA BAND ] Work with us → (/contact/)
[ FOOTER ]
```

Honesty rule (hard): no card carries a fabricated client metric. See section 3.3.

### 2.4 Work case-study detail `/work/{slug}/`

Reuses the article template with a case-study spine (from `work.md`):

```
[ HEADER ]
[ HERO ] ← Back to Work | category chip | H1 project name | one-line sub
[ BODY (2-col: content + sticky "On this page" TOC) ]
   The problem
   What we built
   What it does, live and inspectable (bullets, each linking to the live endpoint)
   The shape of it / outcome + provenance (only real metrics; for Case Study Zero these are counts, not client KPIs)
[ RELATED ] other projects · relevant research
[ CTA ] Want this for your origin? Start a conversation → (/contact/)
[ FOOTER ]
```

### 2.5 Research hub `/research/`

```
[ HEADER ]
[ PAGE HEAD ] H1 Research | lede: the canonical body of work behind the studio. the research the consulting applies and the ask endpoint retrieves.
[ CORPUS ] label + grid of 7 essay cards → /research/corpus/{slug}/
[ DEFINITIONS ] label + grid of 7 definition cards → /research/definitions/{slug}/
[ FOUNDATIONS ] two cards: Architecture (/architecture/) · Manifesto (/manifesto/)
[ MACHINE NOTE ] quiet line: this corpus is what /ask retrieves; every answer is cited. links to /ask and /.well-known/mcp.json
[ FOOTER ]
```

Collections (corpus, definitions) nest under the hub so breadcrumbs and the active state fall out naturally (Research > Corpus > Origin). The two landmark documents, Manifesto and Architecture, stay top-level for shareability and are surfaced as Foundations cards on the hub. All four light RESEARCH in the nav.

### 2.6 Definition page `/research/definitions/{slug}/`

```
[ HEADER ]
[ ← Back to Research ]
[ H1 term ]  (H1 FIRST — heading-order fix HEL-029 already DONE; keep it)
[ canonical definition ] single sentence, the contract
[ detail ] expanded meaning
[ PROVENANCE ] version, source, date — the point of the page
[ RELATED ] the corpus essay of the same name · other definitions
[ ALTERNATES ] this page as JSON, JSON-LD, Markdown (machine projections)
[ FOOTER ]
```

### 2.7 Corpus essay `/research/corpus/{slug}/`

Article template. Body from the essay markdown. Sidebar: On this page (if long), the matching definition, alternates (`.md`). Related essays. Newsletter block optional.

### 2.8 Journal index `/journal/`

```
[ HEADER ]
[ PAGE HEAD ] H1 Journal | lede: thoughts, learnings and research at the intersection of search, AI and human intent
[ FILTER TABS ] All · Strategy · Engineering · Research · Insights   (post categories, from post frontmatter)
[ POST LIST ] rows: date · title · category, most recent first (4 posts today)
[ NEWSLETTER ] optional signup band
[ FOOTER ]
```

The filter tabs read from a `category` frontmatter field on each post. Four posts today, so tabs are honest only if categories exist. If a tab would be empty, hide it (do not show a dead filter). See gaps, section 3.4.

### 2.9 Article / post `/journal/{slug}/`

Matches the full article mock (2.jpeg):

```
[ HEADER ]  (JOURNAL active)
[ HERO ] ← Back to Journal | date · category · read-time | H1 | one-line sub | over dawn art
[ BODY (2-col) ]
   left: article prose (H2 sections, pull-quotes, code blocks, inline diagrams)
   right (sticky): On this page (TOC) · Tags · Related articles (3) · Newsletter block
[ SHARE ] this article (LinkedIn, X, copy link)
[ FOOTER ]
```

Read-time and category come from frontmatter. TOC is generated from H2s. Related articles are the other posts (or tag-matched). Newsletter needs a handler (gap).

### 2.10 About `/about/`

```
[ HEADER ]
[ PAGE HEAD ] H1 About Heliacon | lede: we help organisations navigate uncertainty and build with confidence
[ WHO ] Heliacon is Pete Dainty — one headline line (NEEDS-PETE)
[ WHY I STARTED ] the origin-first thesis, first-hand
[ WHAT I HAVE BUILT ] track record — roles, companies, outcomes with numbers (NEEDS-PETE; the single most important block for a solo-firm buyer)
[ MISSION / APPROACH / VALUES ] the three-panel block from the mock, with the topographic side-art
[ STATS ] 10+ / 50+ / ∞ — PLACEHOLDER, do not ship as fact (see 3.3). Replace with real, verifiable figures or remove.
[ CTA ] Work with me → (/contact/)
[ FOOTER ]
```

### 2.11 Contact `/contact/`

```
[ HEADER ]
[ PAGE HEAD ] H1 Get in Touch | lede: let's build clarity together
[ TWO COLUMN ]
   left (details):
     Email    hello@heliacon.com  [copy]   (click-to-copy, not mailto-only)
     Location Remote-first
     Follow   LinkedIn · X
     Book      a call → (optional booking link, Pete decides)
   right (form): Name · Email · Company · Message · [Send message]
     states: idle → submitting → success (confirmation) / error (show email fallback)
[ FOOTER ]
```

Form needs a Worker POST handler. Until then, the form degrades to a `mailto:` with a prefilled subject, and the copyable email is the reliable path. See section 6.4.

---

## 3. Content inventory

### 3.1 Existing content → new home

The site holds no URL equity, so this maps existing content to its cleanest new home. There is nothing to redirect.

| Existing content (source file) | New URL | New section / role |
|---|---|---|
| Homepage | `/` | Home, rebuilt to mock |
| `consulting.md` (Services) | `/studio/` | STUDIO hub (the offer) |
| `work.md` | `/work/` | WORK index + Case Study Zero |
| `about.md` | `/about/` | ABOUT |
| `products.md` | `/products/` | Light page, footer + Work facet |
| `manifesto.md` | `/manifesto/` | RESEARCH → Foundations (top-level landmark) |
| `docs/architecture.md` | `/architecture/` | RESEARCH → Foundations (top-level landmark) |
| 4 posts | `/journal/{slug}/` | JOURNAL |
| Journal index | `/journal/` | JOURNAL index |
| 7 corpus essays | `/research/corpus/{slug}/` | RESEARCH → Corpus |
| Corpus index | `/research/corpus/` | Feeds `/research/` |
| 7 definitions | `/research/definitions/{slug}/` | RESEARCH → Definitions |
| Definitions index | `/research/definitions/` | Feeds `/research/` |
| Machine spine | unchanged endpoints | preserved as the product thesis |

### 3.2 New pages to create

| New page | URL | Source | Status |
|---|---|---|---|
| Research hub | `/research/` | new aggregator over corpus + definitions + architecture + manifesto | build |
| Contact | `/contact/` | new; replaces mailto | build (form handler is a dependency) |
| Case Study Zero detail | `/work/case-study-zero/` | promote the `work.md` case-study section to its own page | build |
| ARMX project | `/work/armx/` | real, from ARMX doctrine | needs a short write-up |
| Topkay project | `/work/topkay/` | real, Topkay/Kenovar | needs a short write-up or outbound link |

### 3.3 Real vs placeholder (honesty ledger — do not ship placeholders as fact)

| Item in mock | Reality | Handling |
|---|---|---|
| Case Study Zero (this site) | REAL, live, inspectable | Hero of Work. The one true proof. |
| ARMX Framework | REAL (Heliacon's own framework) | "View project", links to a real explainer. No client metric. |
| Topkay Platform | REAL (Heliacon's own product, now Kenovar) | "View project", real product page or outbound link. |
| AI Search Strategy | Offer area, not a client case study | Show as a capability card, not a case study. |
| Content Intelligence | Offer area | Capability card, or omit until real. |
| Agent Experience Design | Offer area | Capability card, or omit until real. |
| Data & Signal Strategy | Offer area | Capability card, or omit until real. |
| Client engagements | None nameable yet | Honest note only: "underway, shown not claimed". No logos, no invented outcomes. |
| About stats 10+ / 50+ / ∞ | PLACEHOLDER | Replace with real verifiable numbers or remove. Never ship as fact. |
| "VIEW CASE STUDY" label on offer cards | Misleading if no case exists | Use "Capability" or "View project" only where a real project exists. |

### 3.4 Gaps (need content or a handler before the page is honest and complete)

1. About track record and headline line — NEEDS-PETE. The most load-bearing missing content.
2. Real About stats, or remove the stat band.
3. Engagement model and pricing signal on Studio — NEEDS-PETE.
4. Post `category` frontmatter for Journal filter tabs. Without it, ship Journal with no tabs rather than empty tabs.
5. Contact form Worker handler (and success/error responses). Until built, degrade to copyable email + mailto.
6. Newsletter handler (article + journal signup blocks). Until built, hide the block rather than ship a dead input.
7. Booking link (Cal.com/Calendly) — Pete decides yes/no.
8. ARMX and Topkay project write-ups.

---

## 4. Nav model details

### 4.1 The label collision (must resolve)

"Research" and "Studio" appear both as top-nav destinations and as Work-facet tags. This is a recognition risk (Nielsen: consistency and standards). Resolution:

- Top nav = destinations (sections of the site). Rendered as the header nav.
- Work facets = tags describing a kind of engagement. Rendered as filter chips inside `/work/` and as the footer WORK column, visually distinct from nav (smaller, chip styling, never in the header).
- Because a facet chip never sits next to a nav item, the two "Research" labels never appear in the same control. Acceptable, and the mock supports it.
- Watch-out for the designer: give facet chips and nav links clearly different visual treatments so a user never reads a chip as navigation.

### 4.2 Mobile disclosure (fixes HEL-022)

Current bug: five links plus a status dot wrap raggedly at 375px with no menu.

- Breakpoint: collapse the nav to a hamburger below ~720px (tune to where the six labels stop fitting on one line).
- Control: a button with `aria-expanded`, `aria-controls`, `aria-label="Menu"`, minimum 44x44px touch target.
- Panel: a slide-down or full-height sheet with the six links stacked, generous 48px row height, the current page marked, and CONTACT visually promoted (it is the conversion).
- Behaviour: opening traps focus inside the panel; Esc closes; selecting a link closes; clicking the scrim closes; body scroll locks while open. Respect `prefers-reduced-motion` for the open/close transition.
- Remove the status dot from the nav entirely. Machine status, if wanted, lives in the For-machines footer row.

### 4.3 Active state

- The nav item for the current section carries `aria-current="page"` and a visible gold underline or fill, as the mock shows (JOURNAL active on the article page, WORK active on the Work subpage).
- Section membership: `/work/*` lights WORK; `/journal/*` lights JOURNAL; `/research/*`, `/architecture/`, `/manifesto/` all light RESEARCH; `/studio/` lights STUDIO. Corpus and definitions nest under `/research/`, so they light RESEARCH automatically; the two landmark docs are mapped in explicitly.

### 4.4 Label ↔ destination ↔ H1 consistency (fixes HEL-020)

Rule: for every nav item, the visible label, the page title, the H1 stem and the footer label must agree. The current failure was "Research" in nav pointing to a page titled "Notes", and "Services"/"Consulting" drift.

| Nav label | Title / H1 | Must not read as |
|---|---|---|
| STUDIO | Studio | Services, Consulting |
| WORK | Our Work | Portfolio, Projects |
| RESEARCH | Research | Notes, Corpus |
| JOURNAL | Journal | Notes, Blog, Research |
| ABOUT | About Heliacon | Team |
| CONTACT | Get in Touch | Services |

With greenfield URLs there is no label/URL divergence to manage: JOURNAL is `/journal/`, RESEARCH is `/research/`, STUDIO is `/studio/`. Slug, label, title and H1 all agree.

---

## 5. URL structure (greenfield)

The site holds no meaningful URL equity, so there is nothing to redirect and no obligation to keep old paths. The structure below is designed clean from scratch for the clearest possible IA. There is no old→new map and no 301 section, by decision.

### 5.1 Principles

- Nav destinations are short and top-level: `/studio/`, `/work/`, `/research/`, `/journal/`, `/about/`, `/contact/`.
- Collections nest under their hub, so the URL expresses the hierarchy and breadcrumbs and active-state fall out for free: `/research/corpus/{slug}/`, `/research/definitions/{slug}/`.
- Singular landmark documents stay top-level for shareability: `/manifesto/`, `/architecture/`. They belong to Research in the IA (they light RESEARCH and appear as Foundations cards) without being buried.
- The machine spine keeps its conventional, discoverable endpoints unchanged as the product thesis: `/.well-known/mcp.json`, `/ask`, `/provenance` (+ `/provenance.json`), `/origin.json`, `/origin.yaml`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`.
- Every human page offers a `.md` alternate at the same path plus `.md`, negotiated by `Accept: text/markdown`. This is the reader-and-machine contract and it is uniform across the new tree.
- Trailing slashes on directory-style URLs; one canonical form per page; lower-case, hyphenated slugs.

### 5.2 The full path list

| Path | Page |
|---|---|
| `/` | Home |
| `/studio/` | Studio (the offer) |
| `/work/` | Work index |
| `/work/case-study-zero/` | Case Study Zero detail |
| `/work/armx/` | ARMX project |
| `/work/topkay/` | Topkay project |
| `/research/` | Research hub |
| `/research/corpus/` and `/research/corpus/{slug}/` | Corpus index and 7 essays |
| `/research/definitions/` and `/research/definitions/{slug}/` | Definitions index and 7 definitions |
| `/manifesto/` | Manifesto |
| `/architecture/` | Architecture |
| `/journal/` and `/journal/{slug}/` | Journal index and 4 posts |
| `/about/` | About |
| `/contact/` | Contact |
| `/products/` | Products (light, footer + Work facet) |
| machine spine | unchanged endpoints per 5.1 |

Implementation note: all `mailto:hello@heliacon.com?subject=...` CTAs across the current source are replaced by links to `/contact/`. The contact page carries the copyable email and the form.

---

## 6. Product and requirements layer

Per page: primary purpose, primary CTA, conversion path.

### 6.1 Purpose and CTA per page

| Page | Primary purpose | Primary CTA | Conversion path |
|---|---|---|---|
| Home | Orient in 5 seconds; route buyer to proof, reader to research | Explore our work → | Home → Work → Contact |
| Studio | Convince a buyer this is hireable and worth it | Start a conversation → | Studio → Contact |
| Work | Prove it with the live origin | Work with us → / Inspect it → | Work → Case Study Zero → Contact |
| Work detail | Deep proof on one project | Want this for your origin? → | detail → Contact |
| Research hub | Establish credibility; feed readers and machines | Read an essay / Ask the corpus | hub → corpus → newsletter |
| Definition | Be the canonical, citable source | (machine) alternates; (human) related essay | reader/machine, low commercial intent |
| Journal | Freshness and voice; SEO and social landing | Read more / Subscribe | post → Research or Contact |
| Article | Hold the reader; capture the interested | Subscribe / bridge to Contact | article → newsletter or Contact |
| About | Make the founder trustable | Work with me → | About → Contact |
| Contact | Convert | Send message | the end of every path |

### 6.2 The bridge CTA (fixes HEL-008)

The warmest moment on the site is immediately after `/ask` returns a cited answer. Today it dead-ends. Add, directly beneath the rendered answer:

> Want this for your origin? Start a conversation →  (links to `/contact/`, carrying the query as context, e.g. `/contact/?ref=ask&q=...`)

This turns the demo into a lead. It appears on the home ask strip and anywhere `/ask` renders. Keep it quiet and honest, one line, no hard sell.

### 6.3 Simple vs complex interactions (frontend flag)

- Simple (CSS or tiny JS): nav active state, footer, filter tabs (client-side show/hide of cards by `data-type`), click-to-copy email, share buttons.
- Complex (needs a handler and real states): contact form (POST, validation, success/error), newsletter signup (POST), the bridge CTA query hand-off. These need optimistic-but-honest states and must never silently fail (the current mailto failure mode).

### 6.4 Contact conversion spec (fixes HEL-023, HEL-005)

```
# Screen: Contact
## User goal
Reach Pete with low friction and get a confirmation it worked.

## Interactive elements
| Element | Action | Result |
| Email address | click / tap | copies hello@heliacon.com to clipboard, shows "Copied" |
| Book a call | click | opens booking link in new tab (if enabled) |
| Form: Send message | submit | POST to Worker → success or error state |
| mailto fallback link | click | opens mail client with prefilled subject (progressive enhancement) |

## States
- Idle: form ready, email copyable, booking visible.
- Submitting: button disabled, spinner, inputs locked.
- Success: replace form with a confirmation ("Thanks, I'll reply within N working days"), keep the copyable email visible.
- Error: inline message + the copyable email as the guaranteed fallback ("Something went wrong, email me directly at hello@heliacon.com"). Never a silent fail.
- No-JS: form degrades to a mailto with prefilled subject; copyable email still shown as plain text.

## Edge cases
- Empty required field → inline validation before submit, no round-trip.
- Bot spam → honeypot field + server-side check (no captcha; keep it frictionless).
- Query carried from /ask (?q=) → prefill the message with "I asked: ...".
```

Requirement: the form is not shippable until the Worker handler exists. Until then, the page is honest with copyable email plus mailto, and the form is either hidden or clearly a mailto. This is a dependency, not a nice-to-have.

---

## 7. Three journeys kept legible

### 7.1 Buyer (wants to hire)

- Enters: home hero, or a search/social landing on Studio or a post.
- Path: Home → Studio (what) → Work (proof, Case Study Zero) → About (who) → Contact (convert).
- Must not break: a hire-oriented CTA on every page; the contact form must actually send; the bridge CTA after `/ask`; nothing on the buyer path should read as pure philosophy (the seven-pillar glossary is gone from home).
- Warmest moment: after an `/ask` answer. Instrumented with the bridge CTA.

### 7.2 Reader (wants the research)

- Enters: a post via SEO, syndication or social, at `/journal/{slug}/`; or a corpus essay; or a definition an LLM cited.
- Path: post → Related articles → Research hub → corpus and definitions → newsletter.
- Must work: `feed.xml` covers the journal; every human page has a `.md` alternate at path + `.md`; article TOC, tags and related links resolve; JSON-LD `BlogPosting`/`Article` schema is carried on posts and corpus. Because URLs are greenfield, these are set once, cleanly, and self-consistent from launch.

### 7.3 Machine (agent or crawler)

- Enters: `/.well-known/mcp.json`, `/ask`, `/provenance`, `/origin.json`, `Accept: text/markdown` negotiation, `sitemap.xml`, JSON-LD in page head.
- Path: discover via MCP or sitemap → negotiate a projection → call `ask`/`definitions`/`provenance` → cite with provenance.
- Must not break: every machine endpoint and content-negotiation path is preserved verbatim. The revamp is HTML-template and IA only. Keep the For-machines footer affordance so a human can find the machine layer. The machine and buyer journeys meet at `/ask`; the bridge CTA serves the human without touching the machine response.

---

## 8. Heuristic pass (Nielsen, the ones this revamp touches)

- Visibility of system status: add real form states (fixes the silent mailto); nav active state; copied-to-clipboard feedback.
- Match to the real world: nav labels are buyer words (Studio, Work, Contact), not house jargon (Origin, Invocation) on the primary path. The vocabulary lives in Research where it belongs.
- User control and freedom: back links (← Back to Work / Journal); mobile menu closes on Esc and scrim; no dead-end after `/ask`.
- Consistency and standards: label↔destination↔H1 rule (section 4.4); facet chips visually distinct from nav (section 4.1).
- Error prevention: inline form validation; hide empty Journal filter tabs and dead newsletter inputs rather than ship them.
- Recognition over recall: filter tabs and grouped footer give scent; the five What-we-do facets recur as Work filters and footer, one mental model.
- Aesthetic and minimalist design: demote Products and the definitions glossary off the buyer path; four grouped footer columns instead of an 11-link run.
- Help users recover from errors: contact error state always exposes the copyable email fallback.

---

## 9. Handoff

To Designer: the sitemap (1.2), per-page section order (2), footer structure (1.3), the facet-vs-nav visual distinction (4.1), and the mobile menu behaviour (4.2). Validated: nav model and IA. Hypothetical until Pete supplies content: About track record, stats, engagement/pricing, the four offer cards.

To Frontend: the greenfield URL structure (5.2), the interaction specs (6.3, 6.4), the state machine for Contact and newsletter, the filter-tab client behaviour, the bridge CTA query hand-off. Flag: contact and newsletter need Worker handlers before they ship; degrade honestly until then. Every human page needs its `.md` alternate wired at path + `.md` with `Accept: text/markdown` negotiation, uniform across the new tree.

Open decisions for Pete (surface at check-in): (a) booking link yes/no; (b) drop or repurpose the footer Careers link; (c) supply About content and real stats, or agree to remove the stat band; (d) supply post categories or ship Journal without filter tabs; (e) confirm the four offer cards are shown as capabilities, not case studies, until real client work exists.
