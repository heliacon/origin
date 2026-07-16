# Heliacon revamp — build spec (synthesis)

Consolidates the five Phase 0 specs into one execution plan. Detail lives in the source docs;
this is the decision log + phase plan the build follows.

- Design system → `design-system.md`
- IA / UX / product → `ia-and-ux.md`
- Voice / copy → `voice-and-copy.md`
- SEO / machine spine → `seo-continuity.md`
- Assets (done) → recoloured mark + optimised hero in `assets/`, notes in `assets/logo/RECOLOUR-NOTES.md`

## Consolidated direction (one paragraph)
Rebuild Heliacon to the dawn art direction: warm near-black base, Stone neutrals, Dawn amber as
the single human/action accent, Glacial blue as the machine/data accent, near-square 2-4px radii,
flat (no shadows). Retire Cinzel; bundle Spectral (mixed-case display serif) + IBM Plex Mono (the
"machine voice" for nav/labels/meta/code) + system sans body. Voice runs at two altitudes: plain
buyer-outcome language on the surface, the origin/sovereignty method underneath. IA is greenfield:
STUDIO (hire-us hub) · WORK (proof) · RESEARCH (durable corpus) · JOURNAL (dated posts) · ABOUT
(founder) · CONTACT. The origin-first machine spine (MCP, /ask, provenance, five projections,
entity schema) is preserved as the product thesis, not restyled away.

## Decisions made from the approved mockups (vetoable)
1. Type: Spectral + IBM Plex Mono + system sans. Cinzel retired. Body defaults to sans, wired
   through `--font-body` for a one-line swap to serif.
2. Colour: the token block in design-system.md §1.3 is authoritative. Base `#0F0F12`, accent
   `#E3A868`, text `#D7D2C7`. Blue-navy is gone.
3. Radius drops to 2-4px site-wide; flat, hairline-bordered surfaces, no drop shadows.
4. IA + nav + URL tree per ia-and-ux.md §1 and §5. Home reached by the wordmark; STUDIO is the
   hire-us page.
5. Voice: British English enforced over the mock (convert American spelling + em dashes). Two-
   altitude model per voice-and-copy.md.
6. Honesty guardrails (hard): no fabricated stats or client outcomes. "50+ partners" etc are
   stubbed with inspectable receipts or removed. The four non-real project cards ship as
   capability areas, not case studies. Topkay is renamed Kenovar.
7. Hero copy: keep the mock's emotional H1 ("Navigate uncertainty. Build with confidence.") as the
   visible headline, AND keep a keyword-bearing meta description + the on-page /ask box so the
   search-category signal and SearchAction claim (SEO's concern) still stand. Both/and, not either.

## Decisions needing Pete (surface at check-in)
- Build sequencing: homepage-first (validate the look on the flagship page, then fan out) vs full
  six-template build in one pass. Recommendation: homepage-first.
- Contact/conversion: copyable email + mailto for v1 (no backend) vs a working form (needs an
  email-delivery integration via the Worker, e.g. MailChannels/Resend, and a delivery target) and
  whether to add a booking link (Cal.com/Calendly).
- Content Pete must supply later (build ships honest stubs until then): About headline + track
  record + real stats; Studio engagement model + any pricing signal; Journal post categories;
  ARMX + Kenovar project write-ups.
- Optional: regenerate the hero art at ~2560px+ for crisp full-bleed on large displays (current
  source is 1535px wide).

## Phase plan
- [x] Phase 0 — foundations (specs + assets). DONE.
- [x] CHECK-IN on this spec. DONE (full build in one pass; contact = copyable email + mailto v1).
- [x] Phase 1 — design foundations + module refactor + greenfield URL migration + homepage.
      DONE + verified: build green, deterministic, machine spine intact, homepage to mock (desktop+mobile).
- [x] Phase 2 — remaining templates (Studio, Work index + detail, Research hub + definition +
      corpus, Journal + article, About, Contact, Products) + 15-icon system. DONE (4 parallel agents),
      integrated, screenshot-reviewed. Shared fixes applied: definition .jsonld wired (was breaking
      I-4), journal-row collision, guessed X handle -> LinkedIn+GitHub, about.md mailto -> /contact/,
      app.js mailto-form + ask-bridge prefill. Build green, deterministic, typecheck clean.
- [ ] Phase 3 — hardening: CSP + Permissions-Policy (HEL-031), Cache-Control immutable + hashed
      assets (HEL-038), broad a11y sweep across all templates, Lighthouse/CWV. Tester gate.
- [ ] Phase 4 — Pete review + deploy decision (push to main auto-deploys).

## Outstanding (surfaced to Pete)
- NEEDS-PETE content (renders as visible stubs until filled): About headline + track record;
  Studio engagement/pricing; post `category`/`tags`/`image` frontmatter (tabs/chips/thumbnails
  are wired and dormant).
- Optional polish: per-project/post imagery (currently clean icon panels); `.share` hover CSS;
  `.feature` panel for the Case Study Zero band; empty filter tabs (Strategy/Studio have no cards).

## Acceptance criteria (per phase, tester-checked)
- Phase 1: homepage renders to the mock at 3 breakpoints; new tokens/fonts load; hero passes AA
  contrast in the text zone; deterministic build still green; no machine endpoint touched.
- Phase 2: every template matches its mock; nav active-state + mobile disclosure work; filter tabs
  work no-JS; article two-column sticky sidebar works.
- Phase 3: all SEO invariants hold (schema entities, /ask, /provenance, MCP, projections, sitemap);
  a11y (focus-visible, skip link, reduced-motion, aria-current) intact; CSP allows inline JSON-LD.
- Phase 4: passes on mobile + desktop; Lighthouse/CWV acceptable; deploy verified live.
