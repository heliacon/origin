# Heliacon design system

Dark-first design system for the site revamp. Every value here is grounded in the four
approved images: the hero artwork, the palette board plus homepage mock, the six-template
grid and the full article page. Where a mock and STYLE.md disagree on prose, STYLE.md wins.
British English throughout. No Oxford comma. No em dash.

Source images:
- `Heliacon hero background.png` — hero artwork.
- `site palette.png` — palette board plus homepage mock.
- image-cache `1.jpeg` — six page templates.
- image-cache `2.jpeg` — full article page.

Status: **finalised for build**, except the two items flagged `ITERATING` (body-serif-vs-sans
final call, and the bespoke-icon draw pass which is a later phase).

---

## 1. Colour system

### 1.1 Reading the mocks

The mock background is a warm neutral near-black, not the current blue-navy. It sits darker
than every swatch on the board, so the page base is a derived neutral tuned between Stone
`#2B2A2B` (too light) and the deep swatches. The four board palettes map to roles like this:

- **Stone Neutral** is the entire neutral UI system: text, muted text, borders, the near-black
  base. This is the workhorse.
- **Dawn Warm** is the single action-and-brand accent: CTAs, links, icons, the star bullets,
  the sun. `#E3A868` is the amber you see on every "VIEW CASE STUDY →".
- **Glacial Cool** is the secondary machine-and-data accent: the blue signal beams in the hero,
  code strings, the little bar-graph diagrams, charts. Warm sun plus cool data is the whole
  picture, so the token system keeps that split.
- **Forest Deep** is tertiary: the live-status dot, success, and the faint topographic textures
  on the About page and in footers.

This is a deliberate two-accent system. Amber is human, warm, the thing to click. Blue is
machine, data, signal. Everything else is Stone.

### 1.2 Migration from current tokens

| Current | Value | New token | Value | Why |
|---|---|---|---|---|
| `--ink` | `#0B1029` | `--bg-base` | `#0F0F12` | Page base moves from blue-navy to warm neutral near-black to match the mock. |
| `--navy` | `#0E1533` | `--bg-elevated` | `#17161A` | Cards and panels; a warm step up from base, not blue. |
| `--cream` | `#F4ECD8` | `--text` | `#D7D2C7` | Body text is Stone-1, a touch less yellow than the old cream. |
| — | — | `--text-strong` | `#ECE6D8` | New. Bright warm stone for the wordmark and hero H1 only. |
| `--gold` | `#E7B23C` | `--accent` | `#E3A868` | Accent shifts from yellow-gold to Dawn amber. |
| `--dim` | `#9aa0b8` | `--text-muted` | `#A9A59B` | Muted text loses its blue cast and becomes neutral warm Stone-2. |
| `#2a3050` (inline) | blue border | `--border` | `#2A2822` | Hairlines become warm neutral, not blue. |

Cinzel is retired (see §2). Border radius drops hard (see §4.1): the current 12–14px rounded
cards become 2–4px near-square. This is the single biggest visual shift after colour.

### 1.3 Semantic tokens (authoritative)

```css
:root{
  /* surfaces — Stone, warm neutral near-black */
  --bg-base:      #0F0F12;  /* page background */
  --bg-sunk:      #0A0A0C;  /* code blocks, footer well, deepest insets */
  --bg-elevated:  #17161A;  /* cards, panels, form fields */
  --bg-elevated-2:#201E22;  /* hover / nested surface */
  --bg-overlay:   #121115;  /* mobile nav sheet, backdrops (pair with blur) */

  /* text — Stone */
  --text:         #D7D2C7;  /* body, Stone-1 */
  --text-strong:  #ECE6D8;  /* wordmark, hero H1, headings over image */
  --text-muted:   #A9A59B;  /* captions, meta, secondary — Stone-2 */
  --text-faint:   #726F66;  /* Stone-3. LARGE / decorative only, never body */

  /* accent — Dawn Warm */
  --accent:       #E3A868;  /* links, CTAs, icons, star bullets, active nav */
  --accent-strong:#D46D37;  /* hover, the sun, emphasis */
  --accent-deep:  #9C4A20;  /* pressed / rare */
  --accent-ink:   #221606;  /* text on an amber fill (Dawn-4 darkened) */

  /* secondary accent — Glacial Cool (data / signal / machine) */
  --signal:       #8FB7D1;  /* charts, the beam motif, code strings */
  --signal-mid:   #5E7F9C;  /* chart gridlines, secondary data */
  --signal-deep:  #2E4960;  /* data surface fills */

  /* tertiary — Forest Deep */
  --ok:           #6FA678;  /* live dot, success (brightened Forest for contrast) */
  --forest-tint:  #1B2A1C;  /* rare nature-accent fill */

  /* lines and states */
  --border:       #2A2822;  /* hairline */
  --border-strong:#3A382F;  /* card hover border base, dividers under labels */
  --focus:        #E3A868;  /* focus ring = accent */
  --selection:    rgba(227,168,104,.24);

  /* links */
  --link:         var(--accent);
  --link-hover:   var(--accent-strong);

  /* code syntax (see §4.12) */
  --code-bg:      #0B0B0D;
  --code-text:    #D7D2C7;
  --code-key:     #E3A868;  /* keyword */
  --code-str:     #8FB7D1;  /* string — Glacial */
  --code-num:     #D46D37;  /* number, boolean */
  --code-func:    #A9C7B0;  /* function, identifier — Forest-light */
  --code-comment: #726F66;  /* Stone-3 */
  --code-punct:   #A9A59B;  /* Stone-2 */
}
```

### 1.4 Contrast (WCAG, computed on `--bg-base` `#0F0F12`)

| Foreground | Ratio | Verdict |
|---|---|---|
| `--text` `#D7D2C7` | ~12.7:1 | AAA body |
| `--text-strong` `#ECE6D8` | ~15:1 | AAA |
| `--text-muted` `#A9A59B` | ~7.5:1 | AAA body, AA any |
| `--accent` `#E3A868` | ~8.4:1 | AAA text, safe for links |
| `--signal` `#8FB7D1` | ~8:1 | AAA text (code strings) |
| `--text-faint` `#726F66` | ~2.9:1 | **fails body.** Decorative and large-only. |
| `--accent-ink` on `--accent` fill | ~6.7:1 | AA for button labels |

Rule: never set body copy in `--text-faint`. It is for hairline dividers, disabled states,
and 24px+ decorative marks. Meta labels use `--text-muted`, not faint.

---

## 2. Type system

### 2.1 What the mock actually uses

Three roles, three families:

- **Display serif, mixed case.** "Navigate uncertainty. Build with confidence.", "Our Work",
  "Some of What I Learnt by Building My Own AI Stack", "Introduction", "Closing Thoughts". This
  is a warm bookish transitional serif with calligraphic bracketed serifs and moderate stroke
  contrast. It is **mixed case**, so it is categorically not Cinzel, which is inscriptional
  all-caps. It reads like Iowan Old Style / Palatino.
- **Mono, letterspaced uppercase.** The nav, every eyebrow label ("WHAT WE DO", "ON THIS PAGE",
  "COLOUR PALETTES"), the post meta ("JUN 28, 2025 • ENGINEERING • 8 MIN READ"), the CTA links
  ("VIEW CASE STUDY →"), the tag chips, the palette hexes and the code. The even tracking and
  the slab digits read as a monospace, not a sans. This is the site's "machine voice", which
  suits an origin-first studio.
- **Body sans.** The hero sub, article body and card captions render as a neutral sans, not a
  serif. Small, quiet, high legibility.

### 2.2 Recommended faces

**Cinzel: retire.** All-caps Cinzel matches none of the mixed-case display in the mock, and the
mock wordmark "HELIACON" is letterspaced caps in the mono/sans idiom, not Cinzel's flared Roman
serifs. Remove both `@font-face` rules and every `Cinzel` in the stack. Do not keep it even for
the wordmark: render the wordmark in the mono uppercase treatment (§4.2), which is what the mock
shows.

**Display / lede serif: bundle Spectral.** Spectral (SIL OFL, screen-optimised, variable-ish
across weights) is the closest open face to the mock's warm bookish serif and gives every
visitor the same rendering, which the current Iowan/Palatino system stack cannot (Iowan is
Apple-only). Self-host woff2 at weights **400 and 500** (add 600 only if a heavier headline is
wanted). Fallback stack chosen for near metrics so the swap is quiet:

```
--font-serif: "Spectral", "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif;
```

**Mono: bundle IBM Plex Mono.** Used for every letterspaced label, nav, meta, tag, CTA and code
block. It carries the machine-voice story and pairs cleanly with a warm serif. Self-host woff2
at **400 and 500**. This is the one distinctive UI face, so it is worth bundling rather than
relying on a system mono.

```
--font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
```

**Body sans: system stack, no webfont.** Body is the least distinctive role and the mock body
is a neutral grotesque, so the system UI stack keeps webfont payload to two families and protects
CWV. `ITERATING`: if Pete prefers a serif reading experience for the corpus, swap body to
`--font-serif` at 18px/1.7 - the tokens below carry a `--font-body` indirection so this is a
one-line change.

```
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-body: var(--font-sans);   /* switch to var(--font-serif) to make body serif */
```

Total bundled webfont payload: 4 woff2 files (Spectral 400/500, Plex Mono 400/500), all
`font-display:swap`, preload Spectral-500 (hero H1) and Plex-Mono-500 (nav).

### 2.3 Type scale

Sizes in px with rem in parentheses at a 16px root. Fluid values use `clamp(min, vw, max)`.

| Token / role | Family | Size | Line-height | Weight | Tracking | Case |
|---|---|---|---|---|---|---|
| Hero H1 | serif | `clamp(40, 6vw, 64)` (2.5–4) | 1.05 | 500 | -0.01em | mixed |
| Page H1 | serif | `clamp(32, 4vw, 40)` | 1.12 | 500 | -0.005em | mixed |
| H2 content | serif | 27 (1.6875) | 1.25 | 500 | -0.005em | mixed |
| H3 content | serif | 21 (1.3125) | 1.3 | 500 | 0 | mixed |
| Lede / dek | sans | `clamp(18, 2vw, 21)` | 1.5 | 400 | 0 | mixed |
| Body | body | 17 (1.0625) | 1.7 | 400 | 0 | mixed |
| Body small | sans | 15 (0.9375) | 1.6 | 400 | 0 | mixed |
| Caption | sans | 13 (0.8125) | 1.5 | 400 | 0 | mixed |
| Eyebrow / section label | mono | 12 (0.75) | 1 | 500 | 0.16em | UPPER |
| Post meta | mono | 12 | 1.4 | 400 | 0.08em | UPPER |
| Nav link | mono | 13 (0.8125) | 1 | 500 | 0.14em | UPPER |
| CTA link | mono | 12–13 | 1 | 500 | 0.12em | UPPER |
| Tag chip | mono | 11 (0.6875) | 1 | 500 | 0.1em | UPPER |
| Wordmark | mono | 16 (1) | 1 | 500 | 0.28em | UPPER |
| Code | mono | 13.5 (0.84) | 1.6 | 400 | 0 | as-is |
| Stat number | serif | `clamp(30, 4vw, 40)` | 1 | 500 | -0.01em | mixed |

Notes. The current build conflates the section-eyebrow (mono UPPER) with content H2. In the new
system these are two distinct things: **eyebrow labels** ("WHAT WE DO", "ON THIS PAGE") are mono
uppercase, and **content H2** ("Introduction", "1. Start Local, Stay Local") is mixed-case serif.
Never style a content heading as the mono eyebrow again.

---

## 3. Spacing, measure and layout

### 3.1 Spacing scale (4px base)

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10:40px;
--space-12:48px;  --space-16:64px;  --space-20:80px;  --space-24:96px;
--space-32:128px;
```

Vertical rhythm: section-to-section gap on marketing pages is `--space-20` (80px) desktop,
`--space-12` (48px) mobile. Paragraph gap is 18px. Heading top-margin is `--space-10` (H2),
`--space-6` (H3).

### 3.2 Measure and containers

The current site is a single 760px column. The mock is wider and multi-column. Three container
widths:

```css
--container:      1200px;  /* marketing pages, work grid, footer */
--container-text: 720px;   /* legacy single-column reading, standalone prose */
--measure:        640px;   /* article body column — reading measure */
--sidebar:        300px;   /* article "on this page" + tags + related */
--gutter:         clamp(20px, 4vw, 40px);  /* page side padding */
```

### 3.3 Grid

Base grid: 12 columns, `--gutter` side padding, 24px column gap, max `--container`.

- **Marketing / home / work index:** full-width sections within `--container`. Icon rows and
  card grids use `repeat(auto-fit, minmax(...))` (see components).
- **Article page:** two-column CSS grid, `grid-template-columns: minmax(0, var(--measure)) var(--sidebar)`,
  column gap `--space-16` (64px), the pair centred in `--container`. The reading column never
  exceeds 640px even when the viewport is wide. The right column holds "on this page", tags,
  related and newsletter, and is `position: sticky; top: 96px` from `>=960px`.
- **Hero:** full-bleed 100vw, breaks out of the container.

### 3.4 Breakpoints

```css
--bp-sm: 640px;   /* below: single column, stacked nav */
--bp-md: 960px;   /* below: article sidebar drops below content, work grid → 2-up */
--bp-lg: 1200px;  /* container max reached */
```

- `<640`: one column everywhere, nav collapses to a disclosure, card grids single-column,
  work cards full-width, footer columns stack.
- `640–960`: work/card grids 2-up, icon row wraps to 2–3 per row, article sidebar moves below
  the body as a plain block (not sticky).
- `>=960`: full multi-column, sticky article sidebar.

---

## 4. Component specs

Conventions: all radii from the scale `--r-0:0; --r-1:2px; --r-2:4px; --r-3:8px`. The mock is
near-square monumental-modern, so **default card/panel/chip radius is `--r-1` (2px)**, buttons
and inputs `--r-2` (4px). No 12–14px rounding anywhere. Transitions are 120–160ms ease, and all
are disabled under reduced-motion (§7).

### 4.1 Shadows

The mock is flat. Elevation comes from surface colour and hairline borders, not drop shadows.
The only shadow permitted is on floating UI (mobile nav sheet): `0 8px 32px rgba(0,0,0,.5)`.
Hero text uses a text-shadow for contrast (§4.3), not a box shadow.

### 4.2 Top nav

- Layout: flex row, space-between, height 72px desktop / 60px mobile, side padding `--gutter`.
- Left: mark (28px tall) + 8px gap + wordmark "HELIACON" (mono, 16px, 500, tracking 0.28em,
  `--text-strong`).
- Right: nav links (mono nav-link spec), gap 28px, `--text` at 82% opacity.
- **Over-hero pages (home, article):** nav is transparent, `position: absolute`, sits on the
  image. Links use `--text-strong` with the hero text-shadow for legibility.
- **Interior pages:** solid bar, `--bg-base`, hairline `--border` bottom.
- **Active state:** current section link is `--accent` (full opacity), plus a 2px `--accent`
  underline offset 6px below the label. In the mock WORK is amber on the work page and JOURNAL
  amber on the journal page.
- **Hover:** `--accent`, opacity 1, no underline (reserve underline for active).
- **Focus:** `:focus-visible` ring (§7).
- **Mobile (`<640`):** links collapse behind a disclosure button (three 1.5px `--text` bars,
  44×44px hit area, `aria-expanded`, `aria-controls`). Open state slides down a full-width sheet
  `--bg-overlay` with `backdrop-filter: blur(8px)`, links stacked, mono, 16px, 44px min row
  height, `--border` dividers. Escape and outside-tap close it.

### 4.3 Hero

The current hero has a contrast bug: the overlay is too weak on the text side. Fix with a
directional overlay tuned to the left-aligned text block seen in the mock.

- Full-bleed 100vw. Min-height: `88vh` home, `min(60vh, 520px)` article.
- Background: the artwork, `center 25% / cover`, on `--bg-base`.
- **Overlay (two stacked gradients), strong enough for AA on the sub text:**
  ```css
  background:
    linear-gradient(90deg,
      rgba(9,10,12,.94) 0%, rgba(9,10,12,.78) 32%,
      rgba(9,10,12,.30) 66%, rgba(9,10,12,0) 100%),
    linear-gradient(0deg,
      rgba(9,10,12,.85) 0%, rgba(9,10,12,.15) 40%, rgba(9,10,12,0) 70%),
    url(/assets/hero.avif) center 25% / cover no-repeat;
  ```
  The 90deg gradient darkens the left third where the text sits, the 0deg gradient darkens the
  base under the CTA. Serve AVIF with WebP and JPEG fallbacks.
- Content block: left-aligned, max 620px, padded `--gutter` left and vertically centred (home)
  or bottom-anchored (article).
- **Home:** H1 (hero-H1 spec, `--text-strong`), then a 40px × 2px `--accent` rule under it,
  then the sub (lede, `--text`, ~90% opacity), then the CTA link (§4.4). Text-shadow on H1 and
  sub: `0 1px 24px rgba(0,0,0,.6)` to guarantee contrast over the mid-tone sky.
- **Article header over image:** "← BACK TO JOURNAL" (mono eyebrow, `--accent`) top; meta line
  (post-meta spec) with `•` separators; H1 (page-H1 spec, `--text-strong`); 40px × 2px `--accent`
  rule; dek (lede). All bottom-left, over the darkened lower band.
- Contrast target: hero sub (small text) must clear 4.5:1 against the pixels behind it in the
  darkened zone; H1 (large) must clear 3:1 and should aim for 4.5:1. The overlay above achieves
  this in the left third. If a future hero image is brighter on the left, raise the 90deg stops.

### 4.4 CTAs

Two forms. The dominant one in the mock is the inline link with arrow.

- **Link-CTA (primary, everywhere):** mono, uppercase, CTA-link spec, `--accent`, trailing
  " →" glyph with a 6px gap. Examples: "EXPLORE OUR WORK →", "VIEW CASE STUDY →",
  "VIEW PROJECT →", "VIEW ALL ARTICLES →", "ABOUT HELIACON →", "SEND MESSAGE →".
  - Hover: colour `--accent-strong`, arrow translates +4px right (`transform`), no underline.
  - Focus: ring (§7).
  - Disabled: `--text-faint`, no arrow motion.
- **Filled button (rare, form submit / newsletter):** `--accent` background, `--accent-ink`
  label (mono UPPER 13px 500 tracking 0.1em), padding 12px 22px, radius `--r-2`, no shadow.
  - Hover: background `--accent-strong`.
  - Active: background `--accent-deep`.
  - Disabled: background `--border-strong`, label `--text-faint`.
  - Icon-only variant (newsletter arrow): 40×40px, `--accent` arrow on transparent inside a
    1px `--accent` border, radius `--r-2`, `aria-label` required.

### 4.5 "What we do" icon row (home)

Five cells: Strategy, Research, Products, Partnerships, Studio.

- Layout: `repeat(5, 1fr)` desktop, `repeat(3,1fr)` at `<960`, `repeat(2,1fr)` at `<640`,
  column gap `--space-8`, row gap `--space-10`. Left-aligned cells.
- Cell: icon (28px, `--accent` line, §6) → `--space-4` gap → title (serif H3-ish, 18px, 500,
  `--text`) → `--space-2` → caption (caption spec, `--text-muted`, ~2 lines).
- No card chrome, no border. This is a plain icon row, not cards.
- Note: `site palette.png` also shows a "WHAT WE DO" text list with amber star bullets. That
  variant (star-bullet list) is the About/values treatment; the homepage uses the 5-icon row
  from `1.jpeg`. Star bullet = the compass mark glyph in `--accent` at 14px, hanging in a 24px
  indent.

### 4.6 Project / work card

- Structure: image (16:9, `object-fit: cover`, radius `--r-1` top only or full-card `--r-1`)
  → body padded `--space-5`.
- Body: title (serif, 18px, 500, `--text`) → `--space-2` → caption (body-small,
  `--text-muted`, ~2 lines) → `--space-4` → link-CTA "VIEW CASE STUDY →".
- Container: `--bg-elevated`, 1px `--border`, radius `--r-1`.
- Grid: `repeat(3, 1fr)` desktop, 2-up `<960`, 1-up `<640`, gap `--space-6`.
- **Hover:** border `--accent`, image scales `1.03` inside `overflow:hidden`, 160ms. Under
  reduced-motion, border-only change, no scale.
- **Focus:** whole card is the link target; ring on `:focus-visible`.

### 4.7 Journal list row

- Layout: flex row, thumbnail (120×80, `--r-1`) + `--space-5` + text block, `--border` bottom
  divider, padding `--space-6` vertical.
- Text block: post-meta line (mono, `--text-muted`, date) → title (serif, 20px, 500, `--text`)
  → category tag chip (§4.11) or mono category label `--text-muted`.
- **Hover:** title → `--accent`; whole row nudges `padding-left: 8px`, 120ms; thumbnail
  brightness +6%.
- `<640`: thumbnail shrinks to 88×64 or hides, text stacks.

### 4.8 Filter tabs

"ALL · STRATEGY · RESEARCH · PRODUCTS · STUDIO".

- Row of mono UPPER labels, 12px, tracking 0.12em, gap `--space-6`, on a `--border` bottom rule.
- Inactive: `--text-muted`. Hover: `--text`.
- **Active:** `--accent`, plus a 2px `--accent` underline flush to the container rule
  (so the active tab "owns" its slice of the line).
- Implement as links (filter by URL) for no-JS resilience; if JS-enhanced, `role="tab"` +
  `aria-selected`.
- `<640`: horizontal scroll, `overflow-x:auto`, no wrap, momentum scroll.

### 4.9 "On this page" TOC sidebar

- Header: "ON THIS PAGE" eyebrow (mono, `--text-muted`).
- Items: sans, 14px, `--text-muted`, line-height 1.7, `--space-3` block padding. Nested
  sub-items indent `--space-4`.
- **Active item** (scroll-spy): `--accent` text plus a 2px `--accent` left border in a 12px
  gutter; the border runs the full TOC as a faint `--border` rail with the active segment lit.
- Hover: `--text`.
- Sticky `top: 96px` at `>=960`; below that it renders as a collapsible block above the article
  body (`<details>` is acceptable and no-JS friendly).

### 4.10 Pullquote

Grounded on `2.jpeg`: compass-star glyph, gold left border, serif amber text.

- Container: 3px `--accent` left border, `--space-5` inset, `--bg-elevated` optional (the mock
  uses base with the border; keep base for the lighter variant, elevated for the heavier).
- Glyph: the compass mark at 20px in `--accent`, hanging at top-left with `--space-4` gap.
- Quote: serif, `clamp(18, 2vw, 20)`, line-height 1.4, `--accent` (not `--accent-strong`, keep
  it readable), weight 500. Roman not italic (the mock is upright).
- Attribution (optional): "— Pete Dainty" as mono, 12px, `--text-muted`, `--space-3` above.
- Two instances in the article: one attributed ("Owning the full stack..."), one bare
  ("Build systems that outlast model churn."). Same component, attribution optional.

### 4.11 Tag chip

- Mono UPPER, 11px, tracking 0.1em, `--text-muted`.
- 1px `--border`, radius `--r-1`, padding 5px 9px, transparent background.
- **Hover / active** (if links): border `--accent`, text `--text`.
- Grouped in a `--space-2` flex-wrap cluster under a "TAGS" eyebrow.

### 4.12 Code block

- Container: `--code-bg` `#0B0B0D`, 1px `--border`, radius `--r-1`, `overflow-x:auto`, padding
  `--space-5`.
- Optional label row: eyebrow "EXAMPLE ROUTING RULE" (mono, `--text-muted`) with `--border`
  bottom, then the code.
- Code: mono, 13.5px, line-height 1.6, `--code-text` default.
- **Syntax colours** (from the article code sample):
  - keyword (`if`, `else`) → `--code-key` `#E3A868`
  - string (`'local-large-9b'`) → `--code-str` `#8FB7D1`
  - number / boolean → `--code-num` `#D46D37`
  - function / identifier (`route`) → `--code-func` `#A9C7B0`
  - comment → `--code-comment` `#726F66`
  - punctuation / operators → `--code-punct` `#A9A59B`
- Inline code: mono, 0.9em, `--accent` on a `--bg-elevated` chip, radius `--r-1`, padding 1px 6px.

### 4.13 Data / diagram blocks

The article shows small bar-graph diagrams and a "LOCAL-FIRST PIPELINE" flow (Input → Model →
Context → Tools → Response) with a house icon. These use the **Glacial** signal palette, echoing
the hero beams.

- Bars / nodes: `--signal` `#8FB7D1`, gridlines `--signal-mid`, on `--bg-elevated` or base.
- Flow diagram: 1.5px `--accent` line icons and connectors, node dots `--accent`, labels mono
  `--text-muted`. Label eyebrow "LOCAL-FIRST PIPELINE" mono `--accent`.
- Any real inline SVG bar chart uses `--signal` for data, `--text-faint` for axes.

### 4.14 Related-articles list (sidebar)

- Vertical stack, each: thumbnail (64×48, `--r-1`) + `--space-3` + title (sans, 14px, `--text`,
  up to 3 lines, no meta).
- Divider: `--space-4` gap, no rules between (the mock is airy here).
- Hover: title `--accent`.
- Footer of the group: "VIEW ALL ARTICLES →" link-CTA.

### 4.15 Newsletter box

- Container: 1px `--border`, radius `--r-2`, `--space-5` inset, `--bg-elevated`.
- Icon (badge/seal, 22px `--accent` line) → title "Like what you read?" (serif, 16px, 500,
  `--accent`) → caption (caption, `--text-muted`) → input row.
- Input row: email field (§4.17 field style) + icon-only filled arrow button (§4.4).
- The heading is decorative; the field needs a visually-hidden `<label>` ("Email address").

### 4.16 Footer

Multi-column, grounded on `2.jpeg`.

- Top border `--border`, background `--bg-base` (or `--bg-sunk` for a slight well), padded
  `--space-16` top.
- Column 1 (brand): mark + wordmark, then the mission line (body-small, `--text-muted`,
  max 280px).
- Columns 2–4: WORK / RESOURCES / COMPANY. Header = eyebrow (mono, `--text-muted`); links =
  sans, 14px, `--text-muted`, `--space-2` rows, hover `--accent`.
- Right block: "© 2025 Heliacon LLC / All rights reserved." (mono, 12px, `--text-faint`) and
  social icons (20px, `--text-muted`, hover `--accent`).
- Faint topographic contour texture (`--text-faint` at ~6% opacity) may sit behind, as in the
  mock. Purely decorative, `aria-hidden`.
- `<640`: columns stack, brand first.

### 4.17 Contact form fields

- Field: `--bg-elevated`, 1px `--border`, radius `--r-2`, padding 13px 16px, text `--text`
  (sans, 16px so mobile does not zoom), placeholder `--text-muted`.
- **Focus:** border `--accent`, plus the focus ring; no glow.
- **Error:** border `--accent-strong`, helper text `--accent-strong` below, `aria-invalid`,
  `aria-describedby`.
- Fields from the mock: Your Name, Email Address, Company, Message (textarea, min 120px).
  Every field needs a real `<label>` (visually hidden is acceptable since the mock uses
  placeholders, but the label must exist for a11y).
- Left rail: Email / Location / Follow rows, each a 20px `--accent` line icon + label
  (eyebrow) + value (sans). Submit: "SEND MESSAGE →" link-CTA or the filled button.

### 4.18 Stat blocks (About)

- Big number (stat-number spec, serif, `--accent`) + caption (caption, `--text-muted`) beneath.
- Row of 3, gap `--space-10`, on `--border` top rule or bare.
- **HONESTY FLAG (from PLAN.md):** "10+ years", "50+ partners", "∞" and the named case studies
  are placeholders. Build the component, but do not populate with unverified figures. Until Pete
  supplies real numbers, use honest values ("Founder-led", "Source-available", "Origin-first")
  or omit the block. The component must not become a vehicle for fabricated proof.

---

## 5. Logo recolour

The mark is kept. It has two paths: a large star (currently cream `#F4ECD8`) and an inner
four-point star plus horizon scatter (currently gold `#E7B23C`).

Recommended fills on the dark site:

| Element | Current | New | Note |
|---|---|---|---|
| Outer star (large path) | `#F4ECD8` | `#ECE6D8` (`--text-strong`) | Bright warm stone, matches the wordmark. |
| Inner star + horizon (gold path) | `#E7B23C` | `#E3A868` (`--accent`) | Unifies with the new amber accent. |

Variants to produce:
- **Primary (dark bg):** outer `#ECE6D8`, inner `#E3A868`. This is the nav and hero lockup.
- **Monochrome amber:** entire mark `#E3A868` on transparent - favicon, OG, small sizes where
  two-tone muddies. Update `/assets/logo/mark.svg` usage accordingly or ship a second file.
- **Monochrome stone:** entire mark `#D7D2C7` - watermark, footer, disabled contexts.
- **On light (if ever needed):** outer `#2B2A2B`, inner `#9C4A20`.

Do not recolour the horizon dots differently from the inner star; they share the gold path and
should stay one accent colour.

---

## 6. Icon system

Fifteen icons: ten "visual language" (Mapping, Signals, Focus, Exploration, Measurement,
Navigation, Connections, Observation, Evidence, Journey) and five "what we do" (Strategy,
Research, Products, Partnerships, Studio).

### 6.1 Drawing spec (applies to all 15)

- **Grid / viewBox:** `0 0 24 24`, keyline within a 20px live area (2px padding).
- **Stroke:** `1.5` at 24px. Never filled - `fill: none`.
- **Caps / joins:** `stroke-linecap: round`, `stroke-linejoin: round`, corners softened
  (no mitred points).
- **Colour:** `currentColor`, set to `--accent` by default; inherits so hover states are free.
- **Optical weight:** geometric with a light observational/hand quality (compass, contour,
  waveform, eye), not pictographic clip-art. Match the existing `.pillar svg` conventions in
  build.ts (24px, stroke 1.6, round) - tighten to 1.5 for the new set.
- **No rounded background tile.** Icons sit bare on the surface.

### 6.2 Bespoke vs off-the-shelf

**Recommendation: bespoke SVG, using an open geometric set (Lucide) as the metric baseline.**
Several icons are brand-specific and carry the hero's motifs, so they should be drawn, not
borrowed:

- **Signals** = the hero's vertical beam clusters (a group of vertical bars of varying height).
- **Mapping** = topographic contour lines (echoes the About-page topo texture).
- **Focus** = a crosshair/reticle target.
- **Observation** = an eye.
- **Connections** = a node graph (central node, radiating linked dots).
- **Navigation** = a route/waypoint path with a node.
- **Journey** = a dotted ascending path with an end flag/node.

Draw all 15 on the same 24px grid at 1.5 stroke so they read as one family. Use Lucide only as a
proportion reference (its grid and stroke logic), not as shipped assets, to guarantee the
distinctive ones match the generic ones. One-line briefs for the draw pass:

| Icon | Brief |
|---|---|
| Mapping | 3–4 stacked contour lines, terrain-like |
| Signals | 5 vertical bars, varied heights (the beam motif) |
| Focus | crosshair reticle in a thin ring |
| Exploration | compass rose / looping search arc |
| Measurement | vertical ruler with tick marks |
| Navigation | waypoint path with a located node |
| Connections | central node, 4 linked satellite dots |
| Observation | open eye, small pupil |
| Evidence | ordered list / checked lines |
| Journey | dotted ascending path to a flag node |
| Strategy | branching decision lines from a point |
| Research | magnifier over a small graph |
| Products | stacked layers / cube in outline |
| Partnerships | two overlapping/linked figures or rings |
| Studio | compass-and-pen, or the mark abstracted |

Deliver as a single sprite (`<symbol>` set) or individual optimised SVGs; strip metadata, no
inline styles, `stroke` via CSS so `currentColor` works.

---

## 7. Motion and accessibility

- **Reduced motion:** keep the existing block, extend it. Under
  `@media (prefers-reduced-motion: reduce)` disable `scroll-behavior`, all transitions, all
  transforms (card scale, arrow nudge, row nudge) and any scroll-spy animation. Border-colour
  and colour changes on hover may remain (they are not motion).
- **Focus ring:** `:focus-visible` → `outline: 2px solid var(--focus); outline-offset: 3px;
  border-radius: 4px`. Applies to links, buttons, inputs, cards, tabs, nav. The ring is
  `--accent` (8.4:1 on base, visible over the hero too because of the text-shadow zone). Never
  remove outlines without a replacement.
- **Skip link:** keep the current skip-to-content, recoloured to `--accent` bg / `--accent-ink`
  text.
- **Hover treatments (summary):** links → colour to `--accent-strong`; cards → border `--accent`
  (+ optional image scale); rows → colour + slight padding nudge; tabs/TOC → colour. All calm,
  120–160ms, all motion-gated.
- **Hit areas:** 44×44px minimum for nav toggle, form controls and icon buttons on touch.
- **Hero contrast (restates §4.3):** the two-gradient overlay must hold the sub text at 4.5:1
  and H1 at 3:1+ against the artwork in the text zone. This is the fix for the current hero
  contrast bug. Verify with a contrast checker against the actual rendered pixels, not just the
  overlay colour, at each breakpoint (the image crop shifts).
- **Colour is never the only signal:** active nav has an underline as well as amber; filter tabs
  have an underline; form errors have text as well as border colour; the live-status dot pairs
  with its label.
- **Motion budget:** no autoplay, no parallax, no scroll-jacking. Scroll-spy for the TOC updates
  a class only; it must degrade to a plain anchor list with JS off.

---

## 8. Handoff to Frontend

- **Provide:** the token block (§1.3), type scale (§2.3), spacing/layout (§3), component specs
  (§4), logo fills (§5), icon spec (§6), motion/a11y (§7).
- **Finalised:** colour system, type roles and scale, spacing, layout grid, all component specs,
  logo recolour, icon drawing spec.
- **Iterating:** body serif-vs-sans final call (default sans via `--font-body` indirection);
  the actual bespoke icon artwork (a later phase - this doc specs the rules, not the paths).
- **Flag for Frontend:**
  - Radius drops from 12–14px to 2–4px site-wide. This touches almost every current rule.
  - Border and text colours lose their blue cast. Search build.ts CSS for `#2a3050`, `#141a38`,
    `#9aa0b8`, `--navy`, `--ink` and migrate per §1.2.
  - The hero overlay is a real behavioural fix, not a restyle. Test contrast at every breakpoint.
  - Article page is a genuine two-column sticky-sidebar layout, new to the codebase.
  - Nav is transparent over image on home/article, solid on interior pages - two states.
  - Stat blocks and named case studies are placeholders (§4.18). Do not ship fabricated figures.
  - Convert any American spelling and em dashes from the mock copy per STYLE.md.
```
