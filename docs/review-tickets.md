# Heliacon website review — ticket ledger

Multi-disciplinary review (IA, UX, design, art, marketing, product, engineering, finance, analyst), 2026-07-11. Seven discipline agents produced ~77 findings, deduped below. Status: OPEN / DOING / DONE / NEEDS-PETE (a decision or content only Pete can supply).

Goal it is measured against: read primarily as a studio/agency/professional-services firm you can hire; research lab second.

---

## Cycle 1 — worked this pass (engineering, SEO schema, IA structure, safety)

| ID | Title | Disc | Sev | Status |
|----|-------|------|-----|--------|
| HEL-030 | `minifyHtml` collapses significant whitespace between inline elements (LIVE bug: homepage `.proj` links render `AskMCPProvenance…`) | eng | high | DONE |
| HEL-032 | JSON-LD block not escaped against `</script>` breakout | eng | med | DONE |
| HEL-033 | `parseFrontmatter` split-based; missing closing fence silently swallows body | eng | med | DONE |
| HEL-035 | Worker `/ask` throws on non-string `q`; no top-level error boundary | eng | low | DONE |
| HEL-036 | Build aborts on one malformed file with no filename in the error | eng | low | DONE |
| HEL-029 | Definition pages emit `<h2>` metadata before `<h1>` (heading-order a11y) | eng/ux | med | DONE |
| HEL-019 | `/corpus/` and `/definitions/` 404 for humans — 14 items unbrowsable; add index pages + a Research hub | ux/seo | high | DONE |
| HEL-021 | Redundant `← Heliacon` back-link on every page now carrying the nav (regression from the nav change) | ux | med | DONE |
| HEL-020 | Nav label ↔ destination ↔ H1 ↔ footer mismatch (Services/Consulting, Research/Notes); no active state | ux/pm | med | DONE |
| HEL-023 | Contact is bare `mailto:` (silent-fails without a mail client); add copyable fallback + contextual subject | ux/analyst | med | OPEN |
| HEL-039 | Notes ship zero structured data — add `BlogPosting` (author entity, dates, publisher) | seo | high | DONE |
| HEL-041 | `inDefinedTermSet` points at a `#corpus` node that does not exist | seo | med | DONE |
| HEL-042 | `ProfessionalService` under-modelled — no `knowsAbout`, `areaServed`, `foundingDate`, `logo` | seo | high | DONE |
| HEL-043 | Founder `Person` thin — add `worksFor`, GitHub `sameAs`, `knowsAbout` | seo | med | DONE |
| HEL-044 | Sitemap has no `<lastmod>` despite dates being in hand | seo | high | DONE |
| HEL-045 | MCP `definitions` tool endpoint returns HTML, not JSON | seo | med | DONE |
| HEL-047 | No `BreadcrumbList` on interior pages | seo | low | DONE |
| HEL-048 | `Accept: text/markdown` not negotiated by the worker | seo | low | DONE |
| HEL-049 | OG/Twitter metadata incomplete (no `og:site_name`, `og:locale`, twitter title/desc, `article:*`) | seo | low | DONE |
| HEL-040 | Corpus pages carry no `Article`/`CreativeWork` schema | seo | med | DONE |
| HEL-061 | A11y: `#answers` has no `aria-live`; no skip link; no `:focus-visible`; no `prefers-reduced-motion` | ux/eng | med | DONE |

## Cycle 2 — visual/design (need a browser to verify; webapp-testing skill loads next session)

| ID | Title | Disc | Sev | Status |
|----|-------|------|-----|--------|
| HEL-022 | Mobile nav overflow — 5 links + status dot wrap raggedly at 375px; no disclosure menu | ux/design | high | OPEN |
| HEL-055 | "Origin online" green status dot in hero reads as dev-tool/lab, and is the only green in the palette | design | med | OPEN |
| HEL-052 | Hero H1/sub sit over the photo's bright flare where the gradient is near-transparent — weak contrast | design | high | OPEN |
| HEL-053 | Section headings inverted — 15px grey label smaller than the 22px lede beneath; no display anchor | design | high | OPEN |
| HEL-057 | Surface depth flat — card fill barely separates from page bg | design | med | OPEN |
| HEL-060 | Hero 94vh buries the first service section; fragile `-44px` margin hack | design | med | OPEN |
| HEL-054 | Card/pillar/row/answer all share one identical treatment — tier hierarchy flattened | design | med | OPEN |
| HEL-031 | Add CSP + Permissions-Policy (needs browser verify that inline JSON-LD survives script-src) | eng | high | OPEN |
| HEL-038 | CWV — preload hero/fonts, AVIF/WebP hero, `Cache-Control: immutable` on hashed assets | eng/design | med | OPEN |

## Cycle 2+ — creative / art direction (needs Pete's eye or a creative pass)

| ID | Title | Disc | Sev | Status |
|----|-------|------|-----|--------|
| HEL-051 | Hero is a recognisable stock sunrise-over-Earth photo — the most median tell on the site | design/art | high | NEEDS-PETE |
| HEL-058 | `privacy` (padlock) and `provenance` (shield-check) pillar icons are clip-art clichés | art | low | NEEDS-PETE |
| HEL-059 | Dark-only; the brand owns a cream that is unused as a surface — try one cream band | design | low-med | NEEDS-PETE |
| HEL-056 | Single 760px column throughout — spatially flat, reads like a blog not a studio | design | med | NEEDS-PETE |

## Cycle 2+ — content, positioning, commercial (Pete's calls)

| ID | Title | Disc | Sev | Status |
|----|-------|------|-----|--------|
| HEL-001 | No About/Founder page — a founder-led firm selling fractional leadership; the founder IS the product | mkt/ux/pm | critical | DOING (about.md drafted, awaiting your content) |
| HEL-002 | No Work/Proof — zero outcome evidence; make the live origin "Case Study Zero" | mkt/pm/analyst | critical | NEEDS-PETE |
| HEL-005 | Conversion is mailto-only — add a booking link + qualifying form (mailto fallback improved in HEL-023) | mkt/ux/pm/analyst | critical | NEEDS-PETE |
| HEL-009 | Hero fails the 5-second test — "Be the first light" carries no buyer meaning cold | mkt/pm/design | critical | DONE (category-led hero live) |
| HEL-010 | Leads with the invented category ("origin-first") not the one buyers know (AI search visibility / GEO) | mkt | critical | NEEDS-PETE |
| HEL-003 | No engagement model — what you get, in what order, by when | pm/analyst | high | NEEDS-PETE |
| HEL-004 | No pricing/packaging signal — add named tiers with a "from" floor | mkt/pm/analyst | high | NEEDS-PETE |
| HEL-006 | ICP too broad to self-select — name 2-3 concrete buyer situations | mkt/pm | high | NEEDS-PETE |
| HEL-007 | Offer is a laundry list — lead with the AI-visibility wedge, demote the rest | mkt/pm | high | NEEDS-PETE |
| HEL-011 | Value prop is mechanism ("one origin, many projections") not outcome (pipeline, being the named vendor) | mkt | high | NEEDS-PETE |
| HEL-015 | No analytics — add Cloudflare Workers Analytics Engine (server-side, cookieless, privacy-safe) | analyst | high | NEEDS-PETE |
| HEL-016 | Ask-box queries are the richest demand signal and are discarded — log them aggregate/blind | analyst | high | NEEDS-PETE |
| HEL-046 | Homepage answers are JS-only + no `FAQPage` — server-render canonical Q&A for crawlers | seo | med | NEEDS-PETE |
| HEL-008 | Warmest moment (after an answer) has no path to contact — add a bridge CTA | analyst | med | NEEDS-PETE |
| HEL-012 | "Invocation over attention" metric is ahead of the market — lead with visibility today | mkt | med | NEEDS-PETE |
| HEL-013 | Manifesto voice bleeds into the sell (7-pillar glossary on the buyer path) | mkt | med | NEEDS-PETE |
| HEL-014 | Products "in development, nothing to name" is a promissory note on a hire-me page | mkt/ux/pm/analyst | med | NEEDS-PETE |
| HEL-017 | No funnel/scroll/per-CTA measurement | analyst | med | NEEDS-PETE |
| HEL-018 | Cloudflare bot-detection JS beacon is visible in view-source on a "no tracking" site — audit/document | analyst | low | NEEDS-PETE |
| HEL-050 | `status: draft` / `version: 0.1` on the org's own machine identity reads provisional | seo | low-med | NEEDS-PETE |
| HEL-034 | marked emits raw HTML unsanitised (first-party today; no guardrail) — decide trust boundary | eng | med | NEEDS-PETE |
| HEL-037 | CSS lives as one template string in build.ts — move to a real source file | eng | low | OPEN |
