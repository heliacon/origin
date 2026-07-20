# Heliacon hero — "Data terrain" parallax layers

Abstract Prussian wireframe data-mesh, built as five separate images that stack and parallax.
Each layer is generated independently, isolated on a transparent background (except Layer 0), with
palette, line style and vertical placement locked so any probabilistic output still composites.

**How to run**
- Generate each layer from its own prompt below. Generate several candidates per layer.
- The terrain undulation is allowed to vary between candidates. The locked constraints
  (palette hexes, line weight, the vertical band the crest sits in, transparent background, no text)
  must hold. Pick the candidates whose crests read well together back-to-front.
- Output each as a PNG, **2880 × 1620**, 16:9, with a genuine alpha channel (transparent), except
  Layer 0 which is opaque. Terrain must bleed off the left and right edges (no border, no vignette).
- Stack order back → front: L0, L1, L2, L3, L4. Parallax factors are applied in CSS, not here.

**Locked palette (use ONLY these values, no others)**
- Atmosphere deep: `#0A1524`  · atmosphere mid: `#12273F`  · horizon glow: `#16304E`
- Far mesh line: `#6E93BC`  · mid mesh line: `#4E75A0`  · near mesh line: `#3B5E88`
- Brass accent: `#CDA765`  · brass highlight: `#E9CE93`
- Data point pale: `#8FA9C8`

**Locked style (every layer)**
Flat, crisp, technical vector wireframe. Thin uniform strokes equivalent to 1.25px at this
resolution, hairline-sharp, no anti-alias haze beyond a single pixel. Infographic / topographic
clarity. No photographic texture, no material shading, no gloss, no bevel, no 3D lighting, no
gradients on the lines. Dark mode. No text, no numbers, no labels, no logo, no watermark, no
people, no recognisable objects, no sky bodies, no sun, no stars-as-scenery. Purely an abstract
data surface.

---

## Layer 0 — Atmosphere (opaque background)

> Flat abstract dark-mode background, 2880×1620, 16:9. A smooth vertical Prussian-blue gradient:
> deep near-black navy `#0A1524` at the top, easing to `#12273F` at the middle, and a slightly
> lifted `#16304E` glow across the lower third to suggest a distant horizon, with no hard line.
> Over it, an extremely faint large-scale coordinate lattice: sparse thin `#16304E` lines on a wide
> grid, barely visible, plus a scatter of tiny `#8FA9C8` data points at about 12% opacity, evenly
> distributed, like distant readings. No terrain, no mesh ridges, nothing in the foreground. Calm,
> minimal, matte. Crisp flat vector, no photographic texture, no vignette, no border. No text, no
> people, no sun or stars, no objects. Opaque background, fills the whole frame.

## Layer 1 — Far data mesh (transparent)

> Transparent PNG, 2880×1620, 16:9, genuine alpha. A single distant abstract wireframe terrain
> occupying only the lower-middle band of the frame: its crest ridge sits at roughly 50% of the
> frame height and the surface descends from there. Draw it as a fine triangulated / isoline contour
> mesh, thin uniform `#6E93BC` pale-steel strokes at about 55% opacity to read as atmospheric haze,
> gently undulating low hills, nothing jagged. Everything above the crest is fully transparent. The
> mesh fades to transparent at its lower edge. The surface runs off both the left and right edges of
> the frame with no border. No brass, no data points, no text, no other colours. Flat crisp vector
> wireframe, hairline strokes, no shading, no photographic texture, dark-mode line art on
> transparency.

## Layer 2 — Mid data mesh with brass seam (transparent)

> Transparent PNG, 2880×1620, 16:9, genuine alpha. A mid-distance abstract wireframe terrain, crest
> ridge at roughly 60% of the frame height. Triangulated / isoline contour mesh in thin uniform
> `#4E75A0` Prussian strokes, slightly denser than a far layer, gently rolling. Along the very crest
> of the ridge, trace ONE continuous brass `#CDA765` contour line, the single lit data-path following
> the skyline of the mesh, plus two or three small brass `#CDA765` filled dots sitting exactly on that
> seam as waypoints. Everything above the crest is fully transparent; the mesh fades to transparent
> at its lower edge and runs off both side edges with no border. Only the colours `#4E75A0`, `#CDA765`
> and `#E9CE93` (a faint highlight on the seam) appear. No text, no grid, no other colours. Flat crisp
> vector wireframe, hairline strokes, no shading, no photographic texture, on transparency.

## Layer 3 — Near data mesh (transparent)

> Transparent PNG, 2880×1620, 16:9, genuine alpha. A large near-foreground abstract wireframe terrain,
> crest ridge at roughly 72% of the frame height, filling the lower quarter of the frame. Coarser,
> larger-scale triangulation than the mid layer, thin uniform `#3B5E88` deeper-Prussian strokes at
> full opacity so it reads as the closest surface, more defined and higher contrast, with a few
> steeper folds. Everything above the crest is fully transparent. No fade at the bottom, the mesh is
> solid line work to the frame's lower edge and runs off both side edges with no border. No brass, no
> data points, no text, no other colours. Flat crisp vector wireframe, hairline strokes, no shading,
> no photographic texture, dark-mode line art on transparency.

## Layer 4 — Foreground data motes (transparent)

> Transparent PNG, 2880×1620, 16:9, genuine alpha. Very sparse foreground overlay, mostly empty
> transparent frame. Scatter roughly eight to twelve small points across the frame: most are pale
> `#8FA9C8` dots, two or three are brass `#CDA765`, sizes 3 to 7 px, slightly larger and brighter
> than distant points to read as nearest. Add three or four short thin `#4E75A0` tick marks, like the
> start of a measurement scale, near the lower-left, nothing more. No connecting lines, no terrain, no
> grid, no text, no other colours. Extremely restrained, at least 90% of the frame is empty
> transparency. Flat crisp vector, hairline strokes, no shading, no photographic texture, on
> transparency.

---

### Notes for compositing
- The crest bands (50% → 60% → 72%) are deliberately staggered so the three mesh layers read as
  receding depth. If a candidate's crest lands outside its band, discard it.
- Atmospheric perspective is carried by the line colour and opacity above, so no per-layer blur is
  needed. Keep every layer hairline-sharp; softness reads as "AI photo," which we do not want.
- If the model cannot emit true transparency, generate the layer on flat `#0A1524` instead and it can
  be knocked out to alpha on that exact key colour.

---

# v2 — Complete single-image scenes (no overlay compositing)

Each of these is one self-contained hero image: the full data-terrain, dark sky baked in, the
object composed in, ready to drop straight in as a single parallax plane. No transparency, no
screen-blend. Generate several candidates and pick.

**Shared, non-negotiable in both prompts**
- Output 2880 × 1620, 16:9, opaque.
- Dark-mode. Palette ONLY: sky `#0A1524`→`#12273F`→`#16304E`; mesh lines `#4E75A0` / `#3B5E88` /
  `#6E93BC`; brass `#CDA765` and highlight `#E9CE93`; pale data point `#8FA9C8`. No other colours.
- Crisp, flat, technical / architectural clarity. Matte. No photographic grain, no lens blur, no
  film noise, no bokeh. Hairline-sharp edges.
- The LEFT THIRD of the frame stays quiet and dark (empty Prussian sky with at most a few faint
  data points), reserved for a headline. The object sits centre-right. Terrain occupies the lower
  40–45%. Generous negative space up top.
- No text, no numbers, no logo, no watermark, no people, no photorealistic sun or clouds, no
  recognisable landscape, no vegetation.

## Scene A — The monolith (Mt Umunhum cube / radar station)

> A wide 2880×1620 dark-mode abstract scene, flat crisp technical style, matte, no photographic
> texture. A deep Prussian-blue night sky, `#0A1524` at the top easing to `#16304E` near the
> horizon, with a scatter of faint `#8FA9C8` data points. Across the lower 42% of the frame, an
> abstract triangulated wireframe data-terrain in thin `#4E75A0` and `#3B5E88` Prussian lines,
> gently undulating, its crest around 55% of the frame height, running off both side edges. Standing
> upright on the crest of the terrain, positioned centre-right of the frame, a single stark
> rectangular monolith: a tall, blank, windowless vertical block like a decommissioned concrete
> radar-station tower, several times taller than it is wide, matte dark Prussian `#12273F` faces,
> its left vertical edge and top edge catching a crisp thin brass `#CDA765` rim-light, a faint
> `#4E75A0` wireframe grid subtly wrapping its surface to tie it to the terrain. From the top of the
> monolith, two or three very faint concentric brass `#CDA765` signal rings expand outward and fade,
> a quiet echo of its radar past. The left third of the frame is empty dark Prussian sky. Monumental,
> still, a little mysterious. Crisp flat vector-technical rendering, hairline edges, no grain, no
> lens blur. Opaque, fills the frame.

## Scene B — Projection planes

> A wide 2880×1620 dark-mode abstract scene, flat crisp technical style, matte, no photographic
> texture. A deep Prussian-blue night sky, `#0A1524` at the top easing to `#16304E` near the
> horizon, with a scatter of faint `#8FA9C8` data points. Across the lower 42% of the frame, an
> abstract triangulated wireframe data-terrain in thin `#4E75A0` and `#3B5E88` Prussian lines,
> gently undulating, its crest around 55% of the frame height, running off both side edges. Hovering
> in the sky above the terrain, positioned centre-right, a small ordered cluster of five or six
> thin, flat, translucent rectangular planes, like weightless glass screens, each tilted at a
> slightly different angle and floating at a different depth, arranged as if projected from one
> shared point low on the terrain. Each plane is a fine `#6E93BC` wireframe outline with a very faint
> `#12273F` translucent fill; ONE plane, nearest the front, is outlined in brass `#CDA765` and holds
> a single brass `#CDA765` node. Thin faint `#4E75A0` connector lines run from a single bright point
> on the terrain up to each plane, showing they share one origin. The left third of the frame is
> empty dark Prussian sky. Calm, precise, weightless. Crisp flat vector-technical rendering, hairline
> edges, no grain, no lens blur. Opaque, fills the frame.

## Frame 2 — Foreground ridge (front parallax plane, pairs with Scene A or B)

The only layer that overlays. It is a hard-edged solid silhouette, so it occludes cleanly with no
blend and no fog. Transparent (or flat pure black `#000000` for a clean knockout) everywhere above
the crest.

> Transparent PNG, 2880 × 1620, 16:9, genuine alpha (or a flat pure black `#000000` background for
> knockout). A single near-foreground abstract terrain ridge occupying ONLY the bottom 22% of the
> frame. Everything above the ridge crest is fully transparent (or pure black), with nothing in it.
> The ridge is a solid, hard-edged silhouette filled deep Prussian `#0A192C`, its crest a crisp
> clean line at roughly 78% of the frame height with a few gentle undulations, running off both the
> left and right edges. Along the crest run a thin `#3B5E88` wireframe edge and three or four small
> `#8FA9C8` data points, plus exactly one brass `#CDA765` point. No soft gradient, no glow, no fog,
> no haze, no fill of any kind above the crest, no texture. Crisp hard edges only. Flat, matte,
> technical. No text, no people. This is a foreground occluding layer.

---

# v3 — Multi-layer parallax, corrected (flat pure-black backgrounds)

Six layers, real depth. The fix over v1: every layer except the atmosphere is drawn on a **flat
pure black `#000000`** background, not a gradient. Black adds nothing under a `screen` blend, so all
layers stack over the atmosphere with no fog and no halo. The content stays luminous line-art, so
the object reads by its lit edges, not as a solid cut-out.

Each prompt below is fully self-contained (one-shot). Generate a few candidates of each, pick the
ones whose crests sit in their band (50 / 58 / 72), name them `L0.png`–`L5.png`.

## L0 — Atmosphere (opaque base)
> Opaque digital artwork, 2880×1620, 16:9, dark mode. A calm abstract background: a smooth vertical
> Prussian-blue gradient running from deep near-black navy `#0A1524` at the top, through `#12273F` at
> the middle, to a faint `#16304E` horizon glow across the lower third, with no hard line anywhere.
> Over it lay a very faint wide-spaced coordinate lattice in `#16304E`, barely visible, and a sparse
> even scatter of tiny `#8FA9C8` data points at about 12% opacity, like distant readings. Nothing
> else: no terrain, no ridges, no objects, no foreground. Crisp, flat, matte, technical. No
> photographic texture, no grain, no vignette, no border, no text, no numbers, no people. Use only
> the colours `#0A1524`, `#12273F`, `#16304E` and `#8FA9C8`. Opaque, fills the entire frame.

## L1 — Far mesh
> Digital line-art, 2880×1620, 16:9. A single distant triangulated wireframe terrain sitting across
> the lower-middle of the frame, its crest ridge at roughly 50% of the frame height, made of gently
> rolling low hills, drawn in thin uniform pale steel-blue `#6E93BC` hairline strokes, softly thinning
> out toward the bottom edge. The background is FLAT PURE BLACK `#000000`, absolutely uniform edge to
> edge: no gradient, no lighter patch, no vignette, no glow bleed. Only the wireframe terrain is
> drawn; everything above the crest and around the terrain is pure black. Crisp, flat, matte,
> technical; hairline strokes, no fill, no shading, no photographic grain, no lens blur, no haze, no
> brass. Use only `#6E93BC` on `#000000`. No text, no numbers, no people. The terrain runs off both
> the left and right edges of the frame; keep the left third sparse.

## L2 — Mid mesh + brass seam
> Digital line-art, 2880×1620, 16:9. A mid-distance triangulated wireframe terrain, its crest ridge at
> roughly 58% of the frame height, slightly denser and more defined than a distant one, drawn in thin
> uniform Prussian `#4E75A0` hairline strokes. One continuous brass `#CDA765` line traces the very
> crest of the ridge like a single lit data-path, with two or three small brass `#CDA765` filled dots
> as waypoints sitting on that crest. The background is FLAT PURE BLACK `#000000`, absolutely uniform
> edge to edge: no gradient, no lighter patch, no vignette, no glow bleed. Only the terrain and its
> brass seam are drawn; everything else is pure black. Crisp, flat, matte, technical; hairline
> strokes, no fill, no shading, no photographic grain, no lens blur, no haze. Use only `#4E75A0`,
> `#CDA765` and a faint `#E9CE93` highlight on `#000000`. No text, no numbers, no people. The terrain
> runs off both side edges; keep the left third sparse.

## L3 — Object · MONOLITH (pick this or planes)
> Digital line-art, 2880×1620, 16:9. A single tall rectangular monolith, like a decommissioned
> concrete radar-station tower, several times taller than it is wide, standing upright centre-right of
> the frame on an implied ridge at about 58% of the frame height. Draw it as luminous line-art: its
> outer silhouette and vertical edges in crisp brass `#CDA765` rim-light, a faint `#4E75A0` wireframe
> grid over its faces, and its interior faces left near-black so that against the black background it
> reads as a glowing wireframe monolith rather than a solid block. Two or three faint concentric brass
> `#CDA765` signal rings expand outward from the top of the monolith and fade, a quiet echo of a radar
> dish. The background is FLAT PURE BLACK `#000000`, absolutely uniform edge to edge: no gradient, no
> lighter patch, no vignette, no glow bleed. Only the monolith and its rings are drawn; everything
> else is pure black. Crisp, flat, matte, technical; hairline edges, no photographic grain, no lens
> blur, no haze. Use only `#CDA765`, `#E9CE93` and `#4E75A0` on `#000000`. No text, no numbers, no
> people. Monumental and still; keep the left third empty black.

## L3 — Object · PLANES (alternative)
> Digital line-art, 2880×1620, 16:9. Hovering centre-right in the frame, a small ordered cluster of
> five or six thin flat rectangular planes, like weightless glass screens, each tilted at a slightly
> different angle and floating at a different depth, arranged as if projected from one shared point
> lower in the frame. Each plane is a fine `#6E93BC` wireframe outline with no fill; ONE plane nearest
> the front is outlined in brass `#CDA765` and carries a single brass `#CDA765` node. Thin faint
> `#4E75A0` connector lines run from one bright point at about 60% of the frame height up to each
> plane, showing they share a single origin. The background is FLAT PURE BLACK `#000000`, absolutely
> uniform edge to edge: no gradient, no lighter patch, no vignette, no glow bleed. Only the planes and
> their connectors are drawn; everything else is pure black. Crisp, flat, matte, technical; hairline
> edges, no photographic grain, no lens blur, no haze. Use only `#6E93BC`, `#4E75A0` and `#CDA765` on
> `#000000`. No text, no numbers, no people. Calm and weightless; keep the left third empty black.

## L4 — Near mesh
> Digital line-art, 2880×1620, 16:9. A large near-foreground triangulated wireframe terrain, its crest
> ridge at roughly 72% of the frame height, made of coarser, larger triangles than a distant one,
> drawn in thin uniform deep Prussian `#3B5E88` hairline strokes at full strength so it reads as the
> closest, most defined surface, with a few steeper folds. Solid, continuous line-work from the crest
> down to the bottom edge of the frame. The background is FLAT PURE BLACK `#000000`, absolutely uniform
> edge to edge: no gradient, no lighter patch, no vignette, no glow bleed. Only the near terrain is
> drawn; everything above its crest is pure black. Crisp, flat, matte, technical; hairline strokes, no
> fill, no shading, no photographic grain, no lens blur, no haze, no brass. Use only `#3B5E88` on
> `#000000`. No text, no numbers, no people. The terrain runs off both side edges; keep the left third
> sparse.

## L5 — Foreground motes
> Digital artwork, 2880×1620, 16:9. A very sparse foreground overlay: eight to twelve small points
> scattered across the frame, most of them pale `#8FA9C8`, two or three of them brass `#CDA765`, each
> between 3 and 7 pixels, slightly larger and brighter than distant points so they read as nearest;
> plus three or four short thin `#4E75A0` tick marks, like the start of a measurement scale, near the
> lower-left. Nothing else at all. The background is FLAT PURE BLACK `#000000`, absolutely uniform edge
> to edge: no gradient, no lighter patch, no vignette, no glow bleed. At least 90% of the frame is pure
> black. Crisp, flat, matte, technical; no photographic grain, no lens blur, no haze, no lines
> connecting the points, no terrain, no grid. Use only `#8FA9C8`, `#CDA765` and `#4E75A0` on `#000000`.
> No text, no numbers, no people.

### Compositing (for reference, not part of the prompts)
L0 opaque base, then L1–L5 each `mix-blend-mode: screen` over it, each its own parallax factor
(farther = higher factor, slower). Pure-black areas vanish under screen, so no fog, no knockout, no
alpha needed.

---

# v4 — SOLID occluding set (one-shot prompts)

For proper Firewatch-style depth: each terrain is a solid, opaque, flat-shaded plane that OCCLUDES
what's behind it, wireframe drawn on its surface, hard crest edge. The sky above each crest can't be
knocked out of black (the terrain fill is dark too), so it is a **flat pure magenta `#FF00FF`
chroma-key** — a colour used nowhere else — which knocks out cleanly to transparency. (If your model
emits genuine alpha, output real transparency above the crest instead of magenta.)

Atmospheric depth: far plane lightest, near plane darkest. Each prompt is self-contained.

L0 atmosphere is unchanged — reuse the v3 L0 (opaque Prussian sky).

## L1 — Far terrain (solid)
> Digital flat-shaded artwork, 2880×1620, 16:9. A single solid terrain plane filling the lower-middle
> of the frame, its crest a crisp hard silhouette edge at roughly 50% of the frame height, gently
> rolling low hills. The terrain body is 100% opaque, a solid flat fill of steel Prussian `#2E4E74`,
> with a subtle triangulated wireframe drawn on its surface in a slightly lighter `#43648E`, and its
> crest edge picked out as one fine `#6E93BC` line. Everything ABOVE the crest is FLAT PURE MAGENTA
> `#FF00FF`, absolutely uniform edge to edge, no gradient, appearing nowhere except above the crest
> (or output genuine transparency there instead). The terrain is not see-through, no glow, no fog, no
> haze, no gradient on the fill. Flat, matte, technical; crisp hard crest edge. Use only `#2E4E74`,
> `#43648E`, `#6E93BC` and the magenta key. No text, no people. Terrain runs off both side edges.

## L2 — Mid terrain + brass seam (solid)
> Digital flat-shaded artwork, 2880×1620, 16:9. A single solid terrain plane, its crest a crisp hard
> silhouette edge at roughly 58% of the frame height. The body is 100% opaque, a solid flat fill of
> Prussian `#1E3D63`, with a subtle triangulated wireframe on its surface in `#33557E`. Along the very
> crest runs one continuous brass `#CDA765` line, with two or three small brass `#CDA765` waypoint
> dots on it. Everything ABOVE the crest is FLAT PURE MAGENTA `#FF00FF`, absolutely uniform edge to
> edge, no gradient, nowhere else (or genuine transparency). Not see-through, no glow, no fog, no
> gradient on the fill. Flat, matte, technical; crisp hard crest edge. Use only `#1E3D63`, `#33557E`,
> `#CDA765`, `#E9CE93` and the magenta key. No text, no people. Terrain runs off both side edges.

## L3 — Object · MONOLITH (solid)
> Digital flat-shaded artwork, 2880×1620, 16:9. A single tall rectangular monolith, like a
> decommissioned concrete radar-station tower, several times taller than it is wide, standing upright
> centre-right on an implied crest at about 58% of the frame height. The tower is a SOLID opaque
> block, a flat dark Prussian `#14263D` fill, its vertical and top edges picked out in crisp brass
> `#CDA765` rim-light, with a faint `#33557E` wireframe grid on its faces. Two or three thin concentric
> brass `#CDA765` signal rings expand from the top of the tower and fade. Everything that is NOT the
> tower or its rings is FLAT PURE MAGENTA `#FF00FF`, absolutely uniform edge to edge, no gradient (or
> genuine transparency) — including the sky, and the thin gaps the rings pass through. The tower is not
> see-through. Flat, matte, technical; crisp hard edges, no glow bleed, no fog. Use only `#14263D`,
> `#CDA765`, `#E9CE93`, `#33557E` and the magenta key. No text, no people. Monumental and still; keep
> the left third pure magenta.

## L4 — Near terrain (solid)
> Digital flat-shaded artwork, 2880×1620, 16:9. A large near-foreground solid terrain plane, its crest
> a crisp hard silhouette edge at roughly 72% of the frame height, coarser and larger-scaled than a
> distant one, filling the lower quarter of the frame down to the bottom edge. The body is 100% opaque,
> the darkest solid flat fill of deep Prussian `#122741`, with a subtle triangulated wireframe on its
> surface in `#274768`. Everything ABOVE the crest is FLAT PURE MAGENTA `#FF00FF`, absolutely uniform
> edge to edge, no gradient, nowhere else (or genuine transparency). Not see-through, no glow, no fog,
> no gradient on the fill. Flat, matte, technical; crisp hard crest edge, solid to the bottom edge. Use
> only `#122741`, `#274768` and the magenta key. No text, no people. Terrain runs off both side edges.

## L5 — Foreground motes (solid dots)
> Digital flat-shaded artwork, 2880×1620, 16:9. Eight to twelve small solid dots scattered across the
> frame, most pale `#8FA9C8`, two or three brass `#CDA765`, 3–7px, plus three or four short thin
> `#4E75A0` tick marks near the lower-left. Everything else is FLAT PURE MAGENTA `#FF00FF`, absolutely
> uniform edge to edge, no gradient (or genuine transparency), at least 90% of the frame. Flat, matte;
> no glow, no lines between dots, no terrain, no grid. Use only `#8FA9C8`, `#CDA765`, `#4E75A0` and the
> magenta key. No text, no people.

### Compositing
L0 opaque base; knock the magenta `#FF00FF` out of L1–L5 to transparency, then stack them normally
(no screen) so near occludes far. Each layer keeps its own parallax factor (farther = higher/slower).
