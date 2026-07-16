# Heliacon site revamp — plan

Owner: Pete Dainty. Driver: Claude (orchestrating discipline subagents).
Started: 2026-07-15.

## Goal
Rebuild the Heliacon site to the new art direction (dawn hero, warm palette, plain
studio voice, real page templates) **while keeping the origin-first machine spine intact**
(MCP at /.well-known/mcp.json, /ask citation endpoint, /provenance, five projections,
entity schema). Reads primarily as a studio/consultancy you can hire; research second.

## Source of truth for the design
- `Heliacon hero background.png` — hero art (dawn valley, river, dish, blue signal beams).
- `site palette.png` — palette board + homepage mock.
- Template grid (6 pages) + full article mock — supplied by Pete (image cache 1.jpeg, 2.jpeg).
- Palettes: Dawn Warm #E3A868 #D46D37 #9C4A20 #3B2A1F · Stone Neutral #D7D2C7 #A9A59B #726F66 #2B2A2B
  · Forest Deep #344B3A #264B2B #1B2A1C #0E1510 · Glacial Cool #8FB7D1 #5E7F9C #2E4960 #15232E.
- Mark: KEEP the original `assets/logo/mark.svg` (compass star). Recolour to the palette allowed.

## Hard constraints
- IA IS GREENFIELD. The site is not meaningfully live, so there is NO URL equity to preserve,
  NO 301-redirect burden, and no obligation to keep the existing sitemap. Restructure freely.
- Keep the origin-first machine spine (MCP, /ask, provenance, projections, entity schema) as the
  PRODUCT THESIS and differentiator - not to protect a live site. Cycle-1 a11y/quality still applies.
- Voice: STYLE.md rules win over the mockups. British English, no Oxford comma, no em dash.
  Convert the mockups' American spelling and any em dashes.
- Honesty: no fabricated proof. The "10+ years / 50+ partners" stats and named case studies in
  the mock are PLACEHOLDERS. Client work is "underway, shown not claimed" until Pete supplies real.
- Deterministic build preserved.

## Phases
- [ ] **Phase 0 — foundations (parallel, spec + assets).** designer → design-system.md;
      ux/ia → ia-and-ux.md; marketing → voice-and-copy.md; seo → seo-continuity.md;
      asset pass → recoloured mark + optimised responsive hero. Synthesise into BUILD-SPEC.md.
- [ ] **CHECK-IN with Pete** on the synthesised build spec before touching build.ts.
- [ ] **Phase 1 — refactor build.ts** into modules (CSS → source file; template modules; data).
      Tester verifies build output parity (endpoints, schema, projections unchanged).
- [ ] **Phase 2 — implement templates** to the design system: home, work, article/post,
      about, journal index, contact. Icon system (visual language). Tester after.
- [ ] **Phase 3 — SEO/schema/a11y/perf + content migration** (IA moves, redirects, new page
      schema, CWV: AVIF/WebP hero, preload, CSP). Tester after.
- [ ] **Phase 4 — live verify** (webapp-testing / build+preview across breakpoints), then deploy.

## Open decisions for Pete (surfaced at check-in)
- Display font: keep Cinzel (all-caps) or move to a mixed-case serif to match the mock.
- Nav: STUDIO vs WORK vs ABOUT boundaries; do RESEARCH and JOURNAL both stay?
- Case studies: real engagements to name, or keep Work as "case study zero = this site".
- American→British spelling conversion (assumed yes).
- Contact: keep mailto or add a form (form needs a handler in the worker).
