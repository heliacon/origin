# Heliacon Design Language

The canonical visual and interaction specification for Heliacon. Source of truth for the
component build. Modelled on the Kenovar guide (topkay/docs/brand), grounded in Heliacon.

- **Spec artifact:** `heliacon-design-language.html` (this directory) — a single self-contained
  HTML document, dual light/dark theme, fonts inlined as base64, no external requests.
- **Foundations study (type + colour exploration):** `heliacon-foundations.html`.
- **Status:** v1, complete. All 19 sections, both themes, every component in every state.

## The two laws

1. **Colour only ever means something.** Chrome is warm neutral ink on paper; Prussian blue = the human
   signature (the thing to act on); brass = the machine (data, signal); green/amber/red = status only.
2. **Every claim carries its provenance.** The design leaves room for the receipt: source, version,
   date, cited answers, set in the machine voice. Provenance is structural.

## Type & colour (locked)

- Serif (reading + display): **EB Garamond** — light, timeless, holds up to long-form.
- Interface: **IBM Plex Sans**. Machine voice: **IBM Plex Mono**.
- Palette: dual **Prussian** — Prussian blue (human/act) and brass (machine) on warm ink-and-paper
  chrome, cartographic art direction. Light is the reading default, dark the equal second world.
- Logo shape fixed; its colour adopts the Prussian blue.

## Passes

- [x] Pass 1 — Foundations: two laws, palette, semantic tokens, typography, space & shape, layout & grid.
- [x] Pass 2 — Brand & structure: logo & lockups, iconography, nav & IA, imagery & atmosphere.
- [x] Pass 3 — Components: actions & CTA, cards, the ask experience, article & reading kit, forms & states.
- [x] Pass 4 — Quality & reference: tone of voice, accessibility & state matrix, provenance patterns, token reference.

## Rollout

Every page now renders on the Prussian kit. `marketingPage` (masthead, title sheet, sections
flowing on the paper) is the shell for **all** index pages: studio, work, research, about, products,
journal, contact, the definitions collection and 404. The article family (post, corpus, workDetail,
doc, definition) sits on `articleLayout`. The old `pageHero` glass box and `pageHead` were removed
2026-07-20 along with `.section-head` and `.pagehead`; there is one section-head component,
`sectionHead`, and one body-only card, `linkCard`, shared by the research hub and the collection.

Note: `docs/revamp/PLAN.md` still describes the retired dawn direction (amber, Cinzel, photo hero)
and its checkboxes were never ticked. It is stale, not a live plan.

## Editing note

Built by string-injection (`inject_guide.py`) and rendered/verified with headless Chromium in
both themes before each publish. Republish updates the same artifact URL.
