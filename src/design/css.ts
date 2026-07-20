/**
 * The Heliacon stylesheet, built from docs/revamp/design-system.md. One exported string, written
 * once to /styles.css and linked, so the browser fetches and caches it across every page.
 *
 * Order: @font-face (imported) -> tokens §1.3 -> reset/base -> type §2.3 -> layout §3 ->
 * components §4 -> icons §6 -> motion + a11y §7 -> responsive §3.4. build.ts minifies it.
 *
 * Radius is near-square (2-4px, §4). Surfaces are flat: elevation is colour + hairline border,
 * never a drop shadow (the one exception is the floating mobile nav sheet, §4.1).
 */
import { fontFace } from "./fonts";

export const css = `${fontFace}

/* ── tokens (design-language: Prussian, dual theme) ──────────────────────── */
/* Colour only ever means something: warm neutral chrome, Prussian = the human act,
   brass = the machine, green/amber/red = status. Names are stable across both themes;
   only the values flip. Light is the reading default; dark is the equal second world. */
:root{
  color-scheme:light dark;
  /* surfaces — warm ink-on-paper */
  --bg-base:#F3F3EF; --bg-sunk:#EAEAE4; --bg-elevated:#FBFBF8;
  --bg-elevated-2:#FFFFFF; --bg-overlay:rgba(251,251,248,.92);
  /* text — warm ink */
  --text:#2C2D31; --text-strong:#17181B; --text-muted:#6E6F73; --text-faint:#9A9B9F;
  /* accent — Prussian: the human signature, the thing to act on */
  --accent:#1E3D63; --accent-strong:#16314F; --accent-deep:#0F2138; --accent-ink:#F7F8FA;
  /* secondary — Brass: the machine voice, data and signal */
  --signal:#8A6E3C; --signal-mid:#A98B52; --signal-deep:#6E5A30;
  /* status */
  --ok:#3F7A55; --forest-tint:#E7F0E9;
  /* lines and states */
  --border:#E1E1DA; --border-strong:#CDCDC5; --focus:#1E3D63;
  --selection:rgba(30,61,99,.16);
  --link:var(--accent); --link-hover:var(--accent-strong);
  /* always light: text and chrome that sit over the hero image, in either theme */
  --on-image:#F6F6F1;
  /* the over-hero content sheet (interior pages): glass that flips with the theme */
  /* light is the reading default, so the sheet must read as one flat plane: at .86 the blur let the
     hero mesh through the top and not the bottom, swinging 27 luminance points and shifting hue
     between the H1 and the lede. .97 keeps a hint of the art without the gradient. */
  --sheet-bg:rgba(251,251,248,.97); --sheet-solid:rgba(251,251,248,.98); --sheet-border:rgba(23,24,27,.10);
  /* code syntax (§4.12) */
  --code-bg:#EAEAE4; --code-text:#2C2D31; --code-key:#1E3D63; --code-str:#3F7A55;
  --code-num:#8A6E3C; --code-func:#33557E; --code-comment:#9A9B9F; --code-punct:#6E6F73;

  /* type */
  --font-serif:"EB Garamond","Iowan Old Style",Palatino,Georgia,"Times New Roman",serif;
  --font-mono:"IBM Plex Mono",ui-monospace,"SF Mono","Cascadia Code",Menlo,monospace;
  --font-sans:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --font-body:var(--font-sans); /* interface body is Plex Sans; long-form prose is serif (§2.2) */

  /* spacing (§3.1) */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:20px;
  --space-6:24px; --space-8:32px; --space-10:40px; --space-12:48px; --space-16:64px;
  --space-20:80px; --space-24:96px; --space-32:128px;
  /* radii (§4) */
  --r-0:0; --r-1:2px; --r-2:4px; --r-3:8px;
  /* layout (§3.2) */
  --container:1200px; --container-text:760px; --measure:640px; --sidebar:300px;
  --gutter:clamp(20px,4vw,40px);
}

/* dark: the equal second world. Same names, flipped values. prefers-color-scheme is the
   OS signal; [data-theme] (set by the toggle) overrides it in both directions. */
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
  --bg-base:#0F1218; --bg-sunk:#0A0C10; --bg-elevated:#171B22;
  --bg-elevated-2:#1E232B; --bg-overlay:rgba(15,18,24,.92);
  --text:#CDCFD6; --text-strong:#E7E8EC; --text-muted:#8C8F98; --text-faint:#6C6F78;
  --accent:#6E9BD1; --accent-strong:#86ADDD; --accent-deep:#5A82AF; --accent-ink:#0C1017;
  --signal:#C9A464; --signal-mid:#A98B52; --signal-deep:#8A6E3C;
  --ok:#6FBE86; --forest-tint:#16261A;
  --border:#242832; --border-strong:#333846; --focus:#6E9BD1;
  --selection:rgba(110,155,209,.26);
  --sheet-bg:rgba(15,18,24,.84); --sheet-solid:rgba(15,18,24,.97); --sheet-border:rgba(231,232,236,.10);
  --code-bg:#0A0C10; --code-text:#CDCFD6; --code-key:#6E9BD1; --code-str:#6FBE86;
  --code-num:#C9A464; --code-func:#86ADDD; --code-comment:#6C6F78; --code-punct:#8C8F98;
}}
:root[data-theme=dark]{
  --bg-base:#0F1218; --bg-sunk:#0A0C10; --bg-elevated:#171B22;
  --bg-elevated-2:#1E232B; --bg-overlay:rgba(15,18,24,.92);
  --text:#CDCFD6; --text-strong:#E7E8EC; --text-muted:#8C8F98; --text-faint:#6C6F78;
  --accent:#6E9BD1; --accent-strong:#86ADDD; --accent-deep:#5A82AF; --accent-ink:#0C1017;
  --signal:#C9A464; --signal-mid:#A98B52; --signal-deep:#8A6E3C;
  --ok:#6FBE86; --forest-tint:#16261A;
  --border:#242832; --border-strong:#333846; --focus:#6E9BD1;
  --selection:rgba(110,155,209,.26);
  --sheet-bg:rgba(15,18,24,.84); --sheet-solid:rgba(15,18,24,.97); --sheet-border:rgba(231,232,236,.10);
  --code-bg:#0A0C10; --code-text:#CDCFD6; --code-key:#6E9BD1; --code-str:#6FBE86;
  --code-num:#C9A464; --code-func:#86ADDD; --code-comment:#6C6F78; --code-punct:#8C8F98;
}

/* ── reset + base ───────────────────────────────────────────────────────── */
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg-base);color:var(--text);
  font:400 17px/1.7 var(--font-body);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
::selection{background:var(--selection)}
img,svg,picture{max-width:100%;display:block}
a{color:var(--link);text-decoration:none}
a:hover{color:var(--link-hover)}
main{display:block}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* ── type (§2.3) ────────────────────────────────────────────────────────── */
h1,h2,h3,h4{font-family:var(--font-serif);font-weight:500;color:var(--text);margin:0;text-wrap:balance}
h1{font-size:clamp(32px,4vw,40px);line-height:1.12;letter-spacing:-.005em}
h2{font-size:27px;line-height:1.25;letter-spacing:-.005em}
h3{font-size:21px;line-height:1.3}
p{margin:0 0 18px}
.lede{font-family:var(--font-sans);font-size:clamp(18px,2vw,21px);line-height:1.5;color:var(--text-muted)}
.small{font-size:15px;line-height:1.6}
.caption{font-size:13px;line-height:1.5;color:var(--text-muted)}
/* widow / orphan control (§2): balance short display, pretty for body and ledes */
p,.lede,.small,.hero__sub,.card__cap,.jrow__sum,.wwd__cap,.footer__mission{text-wrap:pretty}
.hero__h1,.jrow__title,.card__title,.stat__n,.newsletter h2,.newsletter h3,.pullquote p,.ask__ans-x{text-wrap:balance}
.eyebrow{font-family:var(--font-mono);font-weight:500;font-size:12px;line-height:1;
  letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted);display:block}
.eyebrow--accent{color:var(--accent)}

/* ── layout (§3) ────────────────────────────────────────────────────────── */
.container{max-width:var(--container);margin:0 auto;padding-inline:var(--gutter);width:100%}
.container--text{max-width:var(--container-text)}
.section{padding-block:var(--space-16)}
.hero--home + .section{margin-top:calc(var(--space-20) * -1);position:relative;z-index:3}
.section--tight{padding-block:var(--space-10)}
.stack>*+*{margin-top:var(--space-4)}

/* ── nav (§4.2) ─────────────────────────────────────────────────────────── */
.siteheader{background:var(--bg-base);border-bottom:1px solid var(--border);position:relative;z-index:6}
.nav{display:flex;align-items:center;justify-content:space-between;gap:var(--space-6);
  height:72px;max-width:var(--container);margin:0 auto;padding-inline:var(--gutter)}
.nav--over{position:absolute;top:0;left:0;right:0;z-index:4}
.nav__brand{display:flex;align-items:center;gap:8px;flex:none}
.nav__logo{height:24px;width:auto;color:var(--text-strong)}
.nav__end{display:flex;align-items:center;gap:var(--space-6)}
.nav__links{display:flex;align-items:center;gap:28px;list-style:none;margin:0;padding:0}
.nav__link{font-family:var(--font-mono);font-weight:500;font-size:13px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--text);opacity:.82;position:relative;padding:6px 0;display:inline-block}
.nav__link:hover{color:var(--accent);opacity:1}
.nav__link[aria-current=page]{color:var(--accent);opacity:1}
.nav__link[aria-current=page]::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--accent)}
.nav--over .nav__link{color:var(--on-image);opacity:1;text-shadow:0 1px 3px rgba(0,0,0,.85),0 1px 16px rgba(0,0,0,.55)}
/* over the bright image the active/hover link must stay light in either theme; the underline is
   the affordance, given a dark halo so it reads against the sky. */
.nav--over .nav__link:hover,.nav--over .nav__link[aria-current=page]{color:var(--on-image)}
.nav--over .nav__link[aria-current=page]::after{height:2px;background:var(--on-image);box-shadow:0 0 0 1px rgba(0,0,0,.45),0 1px 5px rgba(0,0,0,.7)}
.nav--over .nav__link:hover::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--on-image);opacity:.85}
.nav__toggle{display:none;width:44px;height:44px;align-items:center;justify-content:center;
  background:none;border:0;cursor:pointer;flex:none}
.nav__toggle span{display:block;width:22px;height:1.5px;background:var(--text);position:relative}
.nav--over .nav__toggle span{background:var(--on-image)}
.nav__toggle span::before,.nav__toggle span::after{content:"";position:absolute;left:0;width:22px;height:1.5px;background:inherit}
.nav__toggle span::before{top:-7px}.nav__toggle span::after{top:7px}
/* over the hero the wordmark goes to a single light tone — letters and O together (§07) */
.nav--over .nav__logo{color:var(--on-image)}
.nav--over .nav__logo .wm-o{fill:var(--on-image)}
/* theme toggle (light/dark). Shows the icon for the theme you would switch to. */
.theme-toggle{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;
  background:none;border:0;cursor:pointer;color:var(--text-muted);border-radius:var(--r-2);flex:none}
.theme-toggle:hover{color:var(--accent)}
.theme-toggle svg{width:19px;height:19px;stroke:currentColor;stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round}
.nav--over .theme-toggle{color:var(--on-image)}
.theme-toggle__sun{display:none}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .theme-toggle__sun{display:block}
  :root:not([data-theme=light]) .theme-toggle__moon{display:none}}
:root[data-theme=dark] .theme-toggle__sun{display:block}
:root[data-theme=dark] .theme-toggle__moon{display:none}
.nav__sheet{display:none;position:absolute;left:0;right:0;top:100%;z-index:20;
  background:var(--bg-overlay);backdrop-filter:blur(8px);border-top:1px solid var(--border);
  box-shadow:0 8px 32px rgba(0,0,0,.5)}
.nav__sheet.open{display:block}
.nav__sheet ul{list-style:none;margin:0;padding:0}
.nav__sheet li{border-bottom:1px solid var(--border)}
.nav__sheet a{display:flex;align-items:center;min-height:48px;padding:0 var(--gutter);
  font-family:var(--font-mono);font-weight:500;font-size:16px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--text)}
.nav__sheet a[aria-current=page]{color:var(--accent)}
.nav__sheet a.is-cta{color:var(--accent)}

/* ── hero (§4.3) ────────────────────────────────────────────────────────── */
.hero{position:relative;overflow:hidden;background:var(--bg-base);display:flex;flex-direction:column}
.hero::after{content:"";position:absolute;inset-inline:0;bottom:0;height:120px;z-index:1;pointer-events:none;
  background:linear-gradient(0deg,var(--bg-base) 0%,rgba(15,15,18,0) 100%)}
/* The home hero is TALLER than the viewport on purpose: parallax reads as depth only when the
   layers have real distance to travel, and a one-screen hero gives them none. The extra 32vh is
   travel room, not more art above the fold, so the content block is pushed up by the same 32vh and
   lands exactly where it did against the first screen. */
.hero--home{min-height:120vh}
/* interior banners: no text on the image (the heading lives in the sheet pulled up over it) */
.hero--page,.hero--article{min-height:min(56vh,520px)}
.hero--page .hero__media img{object-position:center 91%}
/* interior banners carry no text, so the image stays bright (comparable to home): only the home
   top band survives for over-hero nav legibility (a11y-validated), plus the .hero::after blend.
   Higher specificity than base .hero__overlay so it wins regardless of source order. */
.hero--page .hero__overlay,.hero--article .hero__overlay{background:
  linear-gradient(180deg,rgba(6,7,9,.82) 0,rgba(6,7,9,.40) 72px,rgba(6,7,9,.10) 132px,rgba(6,7,9,0) 186px)}
/* the media box overscans 35% above the hero so the parallax translate (app.js, scrollY*0.35,
   clamped to hero height) never reveals a gap. object-position is retuned for the taller box so
   the at-rest framing matches the pre-parallax crop. Static (no-JS/reduced-motion) stays correct. */
.hero__media{position:absolute;inset:-35% 0 0 0;will-change:transform}
.hero__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 44%}
.hero__overlay{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(6,7,9,.82) 0,rgba(6,7,9,.40) 72px,rgba(6,7,9,.10) 132px,rgba(6,7,9,0) 186px),
             linear-gradient(90deg,rgba(9,10,12,.82) 0%,rgba(9,10,12,.62) 22%,rgba(9,10,12,.34) 48%,rgba(9,10,12,.12) 68%,rgba(9,10,12,0) 82%),
             linear-gradient(0deg,rgba(9,10,12,.52) 0%,rgba(9,10,12,0) 42%)}
.hero__inner{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;
  max-width:var(--container);width:100%;margin:0 auto;padding-inline:var(--gutter)}
.hero--home .hero__inner{justify-content:flex-end;
  padding-block:var(--space-16) calc(32vh + clamp(48px,13vh,150px))}
.hero__block{max-width:620px}
.hero__h1{font-size:clamp(40px,6vw,64px);line-height:1.05;letter-spacing:-.01em;color:var(--on-image);
  text-shadow:0 1px 3px rgba(0,0,0,.65),0 2px 30px rgba(0,0,0,.82);margin:0}
.hero__rule{width:40px;height:2px;background:var(--accent);border:0;margin:var(--space-6) 0}
.hero__sub{font-family:var(--font-sans);font-size:clamp(18px,2vw,21px);line-height:1.5;color:var(--on-image);
  opacity:1;text-shadow:0 1px 3px rgba(0,0,0,.7),0 2px 24px rgba(0,0,0,.7);margin:0 0 var(--space-8);max-width:34em}
.hero__ctas{display:flex;align-items:center;gap:var(--space-8);flex-wrap:wrap}
/* hero CTAs sit over the image, so they stay light in either theme (the Prussian accent is too
   dark over the sky in the light theme). The arrow and hover-underline carry the affordance. */
.hero__ctas .ctalink{color:var(--on-image);text-shadow:0 1px 4px rgba(0,0,0,.55)}
.hero__ctas .ctalink:hover{color:var(--on-image);text-decoration:underline;text-underline-offset:3px}

/* ── hero mesh: the generated data-terrain, screened + cooled to Prussian ──────── */
.hero__mesh{position:absolute;inset:0;overflow:hidden;z-index:0}
/* Each layer OVERSCANS above the hero so the parallax translate has material to reveal. Without
   this the layers slid down out of their own frame and emptied the top of the hero: at 400px of
   scroll the sky, the star and the orbit rings were gone and the monolith was beheaded.
   The budget must cover the largest translate (max factor x PARALLAX_RANGE in app.js).
   object-position is pushed down by half the overscan so the at-rest framing is unchanged. */
.hero__mesh .hm{position:absolute;left:0;right:0;top:calc(var(--px-overscan) * -1);
  width:100%;height:calc(100% + var(--px-overscan));object-fit:cover;
  object-position:center calc(50% + (var(--px-overscan) / 2))}
.hm-scr{mix-blend-mode:screen}
.hm-al{mix-blend-mode:normal}
/* ── the section subject: parametric motif drawn at hero scale (components.ts heroMotif) ──
   The subject is line art over the sky, and the sky flips with the theme, so its ink must flip
   too: dark Prussian on the pale light sky, pale steel on the navy dark sky. Brass stays the
   machine colour in both, darkened in light so it holds contrast on paper. */
:root{--motif-line:#3B5E88; --motif-dot:#4E75A0; --motif-acc:#8A6522}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
  --motif-line:#6E93BC; --motif-dot:#8FA9C8; --motif-acc:#CDA765}}
:root[data-theme=dark]{--motif-line:#6E93BC; --motif-dot:#8FA9C8; --motif-acc:#CDA765}
.hm-subject{display:block}
.hmo{width:100%;height:100%;display:block}
.hmo-line{fill:none;stroke:var(--motif-line);stroke-width:1.25;opacity:.62}
.hmo-acc{fill:none;stroke:var(--motif-acc);stroke-width:1.6;opacity:.95}
.hmo-acc-s{fill:none;stroke:var(--motif-acc);stroke-width:1.25;opacity:.5}
.hmo-dot{fill:var(--motif-dot);opacity:.8}
.hmo-dot-acc{fill:var(--motif-acc);opacity:1}
/* Light theme swaps only the sky (L0): a paper sky with the dark terrain and monolith silhouetted
   against it. Dark theme keeps the navy atmosphere. Terrain planes are unchanged in both. */
.hero__mesh{background:linear-gradient(180deg,#F4F4F0 0%,#E9ECEF 58%,#DEE3E9 100%)}
.hero__mesh .hm-base{opacity:0}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .hero__mesh{background:#0A1524}
  :root:not([data-theme=light]) .hero__mesh .hm-base{opacity:1}}
:root[data-theme=dark] .hero__mesh{background:#0A1524}
:root[data-theme=dark] .hero__mesh .hm-base{opacity:1}
/* light theme: the home hero sky is light, so its over-hero chrome (nav, wordmark, toggle) is ink */
.hero .nav--over .nav__link,.hero .nav--over .nav__link:hover,
.hero .nav--over .nav__link[aria-current=page]{color:#222F3E;text-shadow:none}
.hero .nav--over .nav__link[aria-current=page]::after{background:#222F3E;box-shadow:none}
.hero .nav--over .nav__logo{color:#17181B}
.hero .nav--over .nav__logo .wm-o{fill:#1E3D63}
.hero .nav--over .theme-toggle{color:#4A5A6E}
.hero .nav--over .nav__toggle span{background:#222F3E}
.hero .hero__star{mix-blend-mode:multiply}
.hero .hero__star svg{fill:#8A6522;filter:none}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .hero .nav--over .nav__link,
  :root:not([data-theme=light]) .hero .nav--over .nav__link:hover,
  :root:not([data-theme=light]) .hero .nav--over .nav__link[aria-current=page]{color:var(--on-image);text-shadow:0 1px 3px rgba(0,0,0,.85),0 1px 16px rgba(0,0,0,.55)}
  :root:not([data-theme=light]) .hero .nav--over .nav__link[aria-current=page]::after{background:var(--on-image)}
  :root:not([data-theme=light]) .hero .nav--over .nav__logo{color:var(--on-image)}
  :root:not([data-theme=light]) .hero .nav--over .nav__logo .wm-o{fill:var(--on-image)}
  :root:not([data-theme=light]) .hero .nav--over .theme-toggle{color:var(--on-image)}
  :root:not([data-theme=light]) .hero .nav--over .nav__toggle span{background:var(--on-image)}
  :root:not([data-theme=light]) .hero .hero__star{mix-blend-mode:normal}
  :root:not([data-theme=light]) .hero .hero__star svg{fill:#E9CE93;filter:drop-shadow(0 0 6px rgba(233,206,147,.8))}}
:root[data-theme=dark] .hero .nav--over .nav__link,
:root[data-theme=dark] .hero .nav--over .nav__link:hover,
:root[data-theme=dark] .hero .nav--over .nav__link[aria-current=page]{color:var(--on-image);text-shadow:0 1px 3px rgba(0,0,0,.85),0 1px 16px rgba(0,0,0,.55)}
:root[data-theme=dark] .hero .nav--over .nav__link[aria-current=page]::after{background:var(--on-image)}
:root[data-theme=dark] .hero .nav--over .nav__logo{color:var(--on-image)}
:root[data-theme=dark] .hero .nav--over .nav__logo .wm-o{fill:var(--on-image)}
:root[data-theme=dark] .hero .nav--over .theme-toggle{color:var(--on-image)}
:root[data-theme=dark] .hero .nav--over .nav__toggle span{background:var(--on-image)}
:root[data-theme=dark] .hero .hero__star{mix-blend-mode:normal}
:root[data-theme=dark] .hero .hero__star svg{fill:#E9CE93;filter:drop-shadow(0 0 6px rgba(233,206,147,.8))}
/* the heliacal star: first light, high in the sky, brass point + soft glow (echoes the logo O) */
.hero__star{position:absolute;left:47%;top:22%;width:150px;height:150px;margin:-75px 0 0 -75px;z-index:1;
  display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle,rgba(233,206,147,.42) 0%,rgba(205,167,101,.13) 34%,transparent 62%)}
.hero__star svg{width:46px;height:46px;fill:#E9CE93;filter:drop-shadow(0 0 6px rgba(233,206,147,.8))}

/* ── hero scene: flat vector parallax landscape, the chart as landscape (§10) ── */
/* Theme-independent Prussian atmosphere: deep navy near, pale steel far, one brass light. Each
   layer is a parallax plane driven by app.js; still and correct with no JS or reduced motion. */
.hero__scene{position:absolute;inset:0;overflow:hidden;z-index:0}
.hero__sky{position:absolute;inset:0;background:linear-gradient(180deg,#0A1524 0%,#122740 40%,#1C3A5E 72%,#2C5078 100%)}
.hero__stars{position:absolute;inset:0;width:100%;height:100%}
.hero__stars circle{fill:#B4C4D8;opacity:.62}
.hero__sun{position:absolute;border-radius:50%;
  background:radial-gradient(circle,#EAD199 0%,#CDA765 40%,rgba(205,167,101,0) 72%);
  box-shadow:0 0 100px 26px rgba(205,167,101,.15)}
.hero__motif{position:absolute;inset:0;width:100%;height:100%}
.hero__ridge{position:absolute;inset:0;width:100%;height:100%}
.hero__ridge--far path{fill:#33567A}
.hero__ridge--mid path{fill:#20406A}
.hero__ridge--near path{fill:#152E4D}
.hero__ridge--fore path{fill:#0A192C}
.hero__line{fill:none;stroke:#4E75A0;stroke-width:1.3;opacity:.55;stroke-linecap:round}
.hero__contour{fill:none;stroke:#CDA765;stroke-width:1.4;opacity:.4;stroke-linecap:round}
.hero__trail{fill:none;stroke:#CDA765;stroke-width:1.5;opacity:.55;stroke-dasharray:2 9;stroke-linecap:round}
.hero__node{fill:#89A6CA;opacity:.82}
.hero__mk{fill:#CDA765}
.hero__mk-ring{fill:none;stroke:#CDA765;stroke-width:1.4;opacity:.5}

/* ── content sheet (interior pages: the solid container pulled up over the banner) ── */
.sheet-wrap{max-width:var(--container);margin:0 auto;padding-inline:var(--gutter);position:relative;z-index:3}
.sheet-wrap--text{max-width:var(--container-text)}
/* the article/page card: glassy, rounded, floated high over the hero like a normal article
   position. The image glows through the translucent top; below the banner it sits on base. */
/* no drop shadow: §1 of the system says never one (the floating mobile nav sheet is the single
   exception). The 64px smear was the loudest thing on the page in light theme. The border and the
   plane change carry the lift instead. */
.sheet{background:var(--sheet-bg);
  -webkit-backdrop-filter:blur(18px) saturate(1.15);backdrop-filter:blur(18px) saturate(1.15);
  border:1px solid var(--sheet-border);border-radius:16px;
  margin-top:-300px;padding:var(--space-12) clamp(24px,4vw,var(--space-16)) var(--space-12)}
@supports not (backdrop-filter:blur(1px)){.sheet{background:var(--sheet-solid)}}
/* sections flowing inside the sheet already sit in its padding: neutralise their own gutter */
.sheet .container{padding-inline:0}
.sheet .section:last-child,.sheet .cta-band:last-child{padding-bottom:0}
.sheet__head{margin-bottom:var(--space-8)}
/* a title-only sheet (marketingPage) holds nothing after the head, so the head's trailing margin
   is dead space stacked on the sheet's own bottom padding */
.sheet--head .sheet__head{margin-bottom:0}
.sheet__head .eyebrow{margin-bottom:var(--space-4)}
.sheet__head h1{margin:0}
/* the head shares the page's left axis: the sheet, the sections below it and the footer all start
   at the gutter, so a marketing page reads on one edge from masthead to footer. The measure is
   capped so the lede never runs the full 1120 of the sheet. */
.sheet__head .lede{margin:var(--space-6) 0 0;max-width:58ch}
.sheet__rule{width:40px;height:2px;background:var(--accent);border:0;margin:var(--space-6) 0}
/* article heading block: first row of the article grid, so it aligns with the reading column */
.article__head{grid-column:1/-1}
/* outside the article grid (narrow definition sheet) the head provides its own gap */
.sheet>.article__head{margin-bottom:var(--space-8)}
.article__head .backlink{margin-bottom:var(--space-8)}
.article__meta{font-family:var(--font-mono);font-weight:400;font-size:12px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--text-muted);margin:0 0 var(--space-4)}
.article__h1{font-size:clamp(32px,4vw,44px);max-width:22em;margin:0}
.article__dek{max-width:38em;margin:0}

/* ── CTAs (§4.4) ────────────────────────────────────────────────────────── */
.ctalink{font-family:var(--font-mono);font-weight:500;font-size:13px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--accent);display:inline-flex;align-items:center;gap:6px}
.ctalink:hover{color:var(--accent-strong)}
.ctalink .arw{transition:transform .14s ease;display:inline-block}
.ctalink:hover .arw{transform:translateX(4px)}
/* In dense reading contexts (article aside, prose) give CTAs a non-colour indicator for WCAG
   1.4.1; marketing sections keep the clean arrow-only treatment from the mock (§4.4). */
.article__aside .ctalink,.prose .ctalink{display:inline;text-decoration:underline;text-underline-offset:3px}
/* WCAG 1.4.1: links sitting inside running text need a non-colour cue. Marketing feature rows keep
   the arrow-only treatment (§4.4); the closing cta-band CTA and any bare inline link get an underline. */
.cta-band .ctalink{text-decoration:underline;text-underline-offset:3px}
p:not(.machine-row) a:not([class]){text-decoration:underline;text-underline-offset:2px}
.ctalink--quiet{color:var(--text);opacity:.82}
.ctalink--quiet:hover{color:var(--accent);opacity:1}
.ctalink[aria-disabled=true]{color:var(--text-faint);pointer-events:none}
.btn{font-family:var(--font-mono);font-weight:500;font-size:13px;letter-spacing:.1em;text-transform:uppercase;
  background:var(--accent);color:var(--accent-ink);border:0;border-radius:var(--r-2);
  padding:12px 22px;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.btn:hover{background:var(--accent-strong);color:var(--accent-ink)}
.btn:active{background:var(--accent-deep)}
.btn:disabled{background:var(--border-strong);color:var(--text-faint);cursor:not-allowed}
.btn--icon{width:40px;height:40px;padding:0;justify-content:center;background:none;
  border:1px solid var(--accent);color:var(--accent);font-size:18px}
.btn--icon:hover{background:var(--accent);color:var(--accent-ink)}

/* ── what we do row (§4.5) ──────────────────────────────────────────────── */
.wwd{display:grid;grid-template-columns:repeat(5,1fr);column-gap:var(--space-8);row-gap:var(--space-10)}
.wwd__cell{display:block;color:inherit}
.wwd__icon{color:var(--accent);margin-bottom:var(--space-4)}
.wwd__icon .ico{width:28px;height:28px}
.wwd__title{font-family:var(--font-serif);font-weight:500;font-size:18px;color:var(--text);margin:0 0 var(--space-2);display:block}
a.wwd__cell:hover .wwd__title{color:var(--accent)}
.wwd__cap{color:var(--text-muted);font-size:13px;line-height:1.5;display:block}

/* star-bullet list variant (§4.5, About/values) */
.starlist{list-style:none;margin:0;padding:0}
.starlist li{position:relative;padding-left:24px;margin:0 0 var(--space-3)}
.starlist li::before{content:"";position:absolute;left:0;top:.35em;width:12px;height:12px;
  background:var(--accent);clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)}
.starlist strong{color:var(--text)}

/* ── project / work card (§4.6) ─────────────────────────────────────────── */
.card{display:flex;flex-direction:column;background:var(--bg-elevated);border:1px solid var(--border);
  border-radius:var(--r-1);overflow:hidden;color:inherit;transition:border-color .16s ease}
.card:hover{border-color:var(--accent)}
.card__media{aspect-ratio:16/9;overflow:hidden;background:var(--bg-sunk)}
.card__media img,.card__media .ico{width:100%;height:100%;object-fit:cover;transition:transform .16s ease}
.card:hover .card__media img{transform:scale(1.03)}
/* image placeholder: the cartographic Prussian wash (design-language §10), a light survey icon
   floated over it — theme-independent atmosphere, never muddy brass */
.card__ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--on-image);background:linear-gradient(140deg,#16314F,#1E3D63 55%,#33557E)}
/* generative card art: the hero's motif kit scaled down, one brass accent per card (§10) */
.card__media--art{aspect-ratio:16/9;overflow:hidden}
.cardart{width:100%;height:100%;display:block}
.cardart .ca-bg{fill:#122740}
.cardart .ca-r1{fill:#0E2540}.cardart .ca-r2{fill:#1A3860}.cardart .ca-r3{fill:#284F7C}
.cardart .ca-sun{fill:#CDA765}
.cardart .ca-line{fill:none;stroke:#4E75A0;stroke-width:1.2;opacity:.75}
.cardart .ca-node{fill:#7FA0C6}
.cardart .ca-bar{fill:#325682}
.cardart .ca-acc,.cardart .ca-acc-f{fill:#CDA765}
.card__ph .ico{width:44px;height:44px;transform:none}
.card__body{padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-2);flex:1}
.card--wide .card__body{max-width:760px;padding:var(--space-6)}
.card__kicker{margin-bottom:var(--space-1)}
.card__title{font-family:var(--font-serif);font-weight:500;font-size:18px;color:var(--text);margin:0}
.card:hover .card__title{color:var(--accent)}
.card__cap{color:var(--text-muted);font-size:15px;line-height:1.5;margin:0;flex:1}
.card__cta{margin-top:var(--space-2)}
/* non-link card: identical chrome, hover-neutral (no border light-up, title shift or image scale) */
.card--static:hover{border-color:var(--border)}
.card--static:hover .card__title{color:var(--text)}
.card--static:hover .card__media img{transform:none}

/* ── journal row (§4.7) ─────────────────────────────────────────────────── */
.jlist{border-top:1px solid var(--border)}
.jrow{display:flex;gap:var(--space-5);align-items:flex-start;padding-block:var(--space-6);
  border-bottom:1px solid var(--border);color:inherit;transition:padding-left .12s ease}
.jrow:hover{padding-left:8px}
.jrow__thumb{width:120px;height:80px;flex:none;border-radius:var(--r-1);overflow:hidden;background:var(--bg-elevated)}
.jrow__thumb img,.jrow__thumb .card__ph{width:100%;height:100%;object-fit:cover}
.jrow__body{min-width:0;display:flex;flex-direction:column}
.jrow__meta{font-family:var(--font-mono);font-weight:400;font-size:12px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--text-muted);margin:0 0 var(--space-2)}
.jrow__title{font-family:var(--font-serif);font-weight:500;font-size:20px;line-height:1.25;color:var(--text);margin:0 0 var(--space-2)}
.jrow:hover .jrow__title{color:var(--accent)}
.jrow__sum{color:var(--text-muted);font-size:15px;line-height:1.5;margin:0}

/* ── filter tabs (§4.8) ─────────────────────────────────────────────────── */
.tabs{display:flex;gap:var(--space-6);border-bottom:1px solid var(--border);
  overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{font-family:var(--font-mono);font-weight:500;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--text-muted);padding:0 0 var(--space-3);position:relative;white-space:nowrap;background:none;border:0;cursor:pointer}
.tab:hover{color:var(--text)}
.tab--active,.tab[aria-selected=true]{color:var(--accent)}
.tab--active::after,.tab[aria-selected=true]::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}

/* ── on-this-page TOC (§4.9) ────────────────────────────────────────────── */
.toc__head{margin-bottom:var(--space-4)}
.toc__list{list-style:none;margin:0;padding:0;border-left:2px solid var(--border)}
.toc__item{display:block;padding:var(--space-3) 0 var(--space-3) 12px;margin-left:-2px;
  border-left:2px solid transparent;font-family:var(--font-sans);font-size:14px;line-height:1.4;color:var(--text-muted)}
.toc__item:hover{color:var(--text)}
.toc__item.is-active{color:var(--accent);border-left-color:var(--accent)}
.toc__item--sub{padding-left:28px}
details.toc-collapse summary{cursor:pointer}

/* ── pullquote (§4.10) ──────────────────────────────────────────────────── */
.pullquote{border-left:3px solid var(--accent);padding:var(--space-2) 0 var(--space-2) var(--space-5);margin:var(--space-8) 0}
.pullquote p{font-family:var(--font-serif);font-weight:500;font-size:clamp(18px,2vw,20px);line-height:1.4;color:var(--accent);margin:0}
.pullquote cite{display:block;font-family:var(--font-mono);font-style:normal;font-size:12px;color:var(--text-muted);margin-top:var(--space-3)}

/* ── code (§4.12) ───────────────────────────────────────────────────────── */
.codeblock{background:var(--code-bg);border:1px solid var(--border);border-radius:var(--r-1);overflow:hidden;margin:var(--space-6) 0}
.codeblock__label{font-family:var(--font-mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--text-muted);padding:var(--space-3) var(--space-5);border-bottom:1px solid var(--border)}
.codeblock pre{margin:0;padding:var(--space-5);overflow-x:auto}
.codeblock code,pre code{font-family:var(--font-mono);font-size:13.5px;line-height:1.6;color:var(--code-text)}
:not(pre)>code{font-family:var(--font-mono);font-size:.9em;color:var(--accent);
  background:var(--bg-elevated);border-radius:var(--r-1);padding:1px 6px}

/* ── tag chip (§4.11) ───────────────────────────────────────────────────── */
.chips{display:flex;flex-wrap:wrap;gap:var(--space-2)}
.chip{font-family:var(--font-mono);font-weight:500;font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--text-muted);border:1px solid var(--border);border-radius:var(--r-1);padding:5px 9px;background:none;display:inline-block}
a.chip:hover,.chip.is-active{border-color:var(--accent);color:var(--text)}

/* ── related list (§4.14) ───────────────────────────────────────────────── */
.related__item{display:flex;gap:var(--space-3);align-items:flex-start;margin-bottom:var(--space-4);color:inherit}
.related__thumb{width:64px;height:48px;flex:none;border-radius:var(--r-1);overflow:hidden;background:var(--bg-elevated)}
.related__thumb img,.related__thumb .card__ph{width:100%;height:100%;object-fit:cover}
.related__title{font-family:var(--font-sans);font-size:14px;line-height:1.35;color:var(--text);margin:0}
.related__item:hover .related__title{color:var(--accent)}

/* ── newsletter (§4.15) ─────────────────────────────────────────────────── */
.newsletter{border:1px solid var(--border);border-radius:var(--r-2);padding:var(--space-5);background:var(--bg-elevated)}
.newsletter__icon{color:var(--accent);margin-bottom:var(--space-3)}
.newsletter__icon .ico{width:22px;height:22px}
.newsletter h2,.newsletter h3{font-size:16px;line-height:1.3;letter-spacing:0;color:var(--accent);margin:0 0 var(--space-2)}
.newsletter__row{display:flex;gap:var(--space-2);margin-top:var(--space-4)}

/* ── stat block (§4.18) ─────────────────────────────────────────────────── */
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-10)}
.stat__n{font-family:var(--font-serif);font-weight:500;font-size:clamp(30px,4vw,40px);line-height:1;color:var(--accent);letter-spacing:-.01em;display:block}
.stat__c{color:var(--text-muted);font-size:13px;line-height:1.5;margin-top:var(--space-3);display:block}

/* ── contact fields (§4.17) ─────────────────────────────────────────────── */
.field{display:block;margin-bottom:var(--space-4)}
.field label{font-family:var(--font-mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:var(--space-2)}
.field input,.field textarea{width:100%;background:var(--bg-elevated);border:1px solid var(--border);
  border-radius:var(--r-2);padding:13px 16px;color:var(--text);font:400 16px/1.5 var(--font-sans)}
.field input::placeholder,.field textarea::placeholder{color:var(--text-muted)}
.field input:focus,.field textarea:focus{border-color:var(--accent);outline:none}
.field textarea{min-height:120px;resize:vertical}
.field[data-error] input,.field[data-error] textarea{border-color:var(--accent-strong)}
.field__err{color:var(--accent-strong);font-size:13px;margin-top:var(--space-2);display:block}
.contact-rail__row{display:flex;gap:var(--space-3);align-items:flex-start;margin-bottom:var(--space-6)}
.contact-rail__icon{color:var(--accent);flex:none}.contact-rail__icon .ico{width:20px;height:20px}
.contact-rail__label{font-family:var(--font-mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:2px}
.contact-rail__more{display:block;margin-top:6px}
.contact-rail__more .ctalink{text-decoration:underline;text-underline-offset:3px}
/* the two columns are the rail and the form: give the form the wider share and align their tops */
.contact-grid{grid-template-columns:minmax(0,4fr) minmax(0,5fr);gap:var(--space-16);align-items:start}
.contact-col__h{font-family:var(--font-serif);font-weight:500;font-size:19px;color:var(--text);margin:0 0 var(--space-5)}
.contact-form__note{margin-top:var(--space-4)}
.contact-form__act{margin-top:var(--space-4)}
.contact-form__alt{margin-top:var(--space-4)}
.copybtn{background:none;border:0;color:var(--accent);cursor:pointer;font:inherit;padding:0;display:inline-flex;gap:6px;align-items:center}
.copybtn:hover{color:var(--accent-strong)}

/* ── ask strip (machine spine, §5) ──────────────────────────────────────── */
/* a centred reading-width feature column, so a narrow block reads as intentional,
   not stranded left in a wide container (§3.2) */
.feature-col{max-width:640px;margin-inline:auto}
.ask__box{display:flex;align-items:center;gap:var(--space-2);width:100%;max-width:640px;
  background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--r-2);padding:6px 6px 6px 18px}
.ask__box:focus-within{border-color:var(--accent)}
.ask__box input{flex:1;min-width:0;background:none;border:0;outline:0;color:var(--text);
  font:400 16px/1.4 var(--font-sans);padding:12px 0}
.ask__box input::placeholder{color:var(--text-muted)}
.ask__answers{max-width:640px;margin-top:var(--space-5);display:grid;gap:var(--space-3)}
.ask__ans{display:block;padding:var(--space-4);border:1px solid var(--border);border-radius:var(--r-1);background:var(--bg-elevated);color:inherit}
.ask__ans:hover{border-color:var(--accent)}
.ask__ans-t{font-family:var(--font-mono);font-weight:500;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:var(--space-2)}
.ask__ans-x{color:var(--text);font-size:15px;line-height:1.5;display:block}
.ask__bridge{margin-top:var(--space-5)}
.ask__hint{color:var(--text-muted);font-size:14px}
.machine-row{font-family:var(--font-mono);font-size:12px;color:var(--text-muted);margin-top:var(--space-5)}
.machine-row a{color:var(--text-muted);border:1px solid var(--border);border-radius:var(--r-1);padding:4px 10px;margin:0 6px 8px 0;display:inline-block}
.machine-row a:hover{color:var(--accent);border-color:var(--accent)}

/* ── prose (markdown bodies) — long-form reads in the serif at a size up (§2.2) ──────── */
.prose{font-family:var(--font-serif);font-size:19px;line-height:1.72;color:var(--text)}
.prose h2{margin:var(--space-10) 0 var(--space-4)}
.prose h3{margin:var(--space-6) 0 var(--space-3)}
.prose p{margin:0 0 18px}
.prose ul,.prose ol{padding-left:1.3em;margin:0 0 18px}
.prose li{margin:6px 0}
.prose a{text-decoration:underline;text-underline-offset:2px}
.prose blockquote{border-left:3px solid var(--accent);padding:var(--space-2) 0 var(--space-2) var(--space-5);margin:var(--space-6) 0}
.prose blockquote p{font-family:var(--font-serif);font-size:19px;line-height:1.4;color:var(--accent);margin:0}
.prose img{border-radius:var(--r-1);border:1px solid var(--border);margin:var(--space-6) 0}
.prose figure{margin:var(--space-8) 0}
.prose figcaption{color:var(--text-muted);font-size:14px;line-height:1.55;margin-top:var(--space-3)}
.prose figcaption strong{color:var(--text)}
.prose table{width:100%;border-collapse:collapse;font-size:15px;margin:var(--space-6) 0}
.prose .tablewrap{overflow-x:auto;border:1px solid var(--border);border-radius:var(--r-1)}
.prose th{text-align:left;font-family:var(--font-mono);font-weight:500;font-size:12px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--accent);background:var(--bg-elevated);padding:12px 16px;border-bottom:1px solid var(--border)}
.prose td{padding:12px 16px;border-bottom:1px solid var(--border);vertical-align:top}
.prose pre{background:var(--code-bg);border:1px solid var(--border);border-radius:var(--r-1);padding:var(--space-5);overflow-x:auto;margin:var(--space-6) 0}

/* ── article two-column layout (§3.3): lives inside the sheet, which owns width and padding ── */
.article{display:grid;grid-template-columns:minmax(0,var(--measure)) var(--sidebar);
  column-gap:var(--space-16);row-gap:var(--space-10);justify-content:center}
.article__body{min-width:0}
.article__aside{position:sticky;top:96px;align-self:start;display:flex;flex-direction:column;gap:var(--space-8)}
.backlink{font-family:var(--font-mono);font-weight:500;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);display:inline-block;margin-bottom:var(--space-6);text-decoration:underline;text-underline-offset:3px}

/* ── grids ──────────────────────────────────────────────────────────────── */
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6)}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-6)}
.cta-band{text-align:center;padding-block:var(--space-16);border-top:1px solid var(--border)}
.cta-band__sub{color:var(--text-muted);font-size:15px;line-height:1.55;max-width:52ch;margin:var(--space-4) auto 0}
.cta-band__act{margin-top:var(--space-6)}

/* ── marketing sections (studio/work/research redesign) ─────────────────────── */
/* the sheet's -300px pull drags the whole following flow up into the hero's box, and .hero is
   positioned, so an unpositioned .marketing paints UNDER it and the first line of the first section
   gets clipped. Sit above the hero (z 1) and below the sheet (z 3). */
.marketing{position:relative;z-index:2}
.marketing .section{border-bottom:1px solid var(--border)}
.marketing .section:last-of-type{border-bottom:0}
/* a narrow reading measure inside a marketing page keeps the measure but NOT the centring: centred,
   it introduced a third left edge (gutter 160, prose 380, next section back to 160) and the reader
   reset their margin twice on one page. The container keeps the page's own width and gutter, so it
   starts on the same edge as every other section; the MEASURE is capped on the content instead. */
.marketing .container--text{max-width:var(--container)}
.marketing .container--text>*{max-width:var(--container-text)}
.section--sunk{background:var(--bg-sunk)}
.anchor{scroll-margin-top:88px}
/* left-aligned editorial section head (mono eyebrow + Garamond h2 + lede) */
.shead{max-width:var(--container-text);margin-bottom:var(--space-10)}
.shead--center{text-align:center;margin-inline:auto}
.shead__k{margin-bottom:var(--space-3)}
.shead__h{font-size:clamp(26px,3.4vw,36px);line-height:1.12;margin:0}
.shead__lede{margin-top:var(--space-4);max-width:58ch}
.shead--center .shead__lede{margin-inline:auto}
/* a section head with a trailing link on the same baseline (index -> "read all") */
.shead-row{display:flex;justify-content:space-between;align-items:flex-end;gap:var(--space-6);
  flex-wrap:wrap;margin-bottom:var(--space-10)}
.shead-row .shead{margin-bottom:0}
/* a closing link that follows a section's content */
.section__after{margin-top:var(--space-8)}
/* two-column reading block for a section intro */
.prose-cols{columns:2;column-gap:var(--space-16);max-width:900px;margin-bottom:var(--space-12)}
.prose-cols p{margin:0 0 1em;break-inside:avoid;font-family:var(--font-serif);font-size:18px;line-height:1.62;color:var(--text)}
.cardgrid{margin-top:8px}
/* feature / principle cards (text-forward counterpart to the art cards) */
.features{display:grid;gap:var(--space-6)}
.features--2{grid-template-columns:repeat(2,1fr)}
.features--3{grid-template-columns:repeat(3,1fr)}
.feature{border:1px solid var(--border);border-radius:var(--r-3);background:var(--bg-elevated);padding:var(--space-6)}
.feature__icon{color:var(--accent);display:block;margin-bottom:var(--space-4)}
.feature__icon .ico{width:26px;height:26px}
.feature__k{margin-bottom:var(--space-3)}
.feature__title{font-family:var(--font-serif);font-weight:500;font-size:19px;color:var(--text);margin:0 0 var(--space-2)}
.feature__body{color:var(--text-muted);font-size:15px;line-height:1.55;margin:0}
/* process: numbered stages on a connecting line */
.process{list-style:none;margin:var(--space-8) 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-10);position:relative}
.process::before{content:"";position:absolute;top:15px;left:0;right:0;height:1px;background:var(--border-strong)}
.process__step{position:relative;padding-top:var(--space-12)}
.process__n{position:absolute;top:0;left:0;width:32px;height:32px;border-radius:50%;background:var(--bg-sunk);border:1px solid var(--accent);
  color:var(--accent);font-family:var(--font-mono);font-size:12px;display:flex;align-items:center;justify-content:center}
.process__title{font-family:var(--font-serif);font-weight:500;font-size:20px;margin:0 0 var(--space-2)}
.process__body{color:var(--text-muted);font-size:15px;line-height:1.55;margin:0}
.engagement__note{color:var(--text-muted);font-size:15px;max-width:58ch;margin:var(--space-10) 0 0}
.prose-ctas{display:flex;gap:var(--space-8);flex-wrap:wrap;margin-top:var(--space-10)}
@media(max-width:820px){.features--2,.features--3,.process{grid-template-columns:1fr;gap:var(--space-6)}
  .process::before{display:none}.process__step{padding-top:var(--space-10)}.prose-cols{columns:1}}

/* ── footer (§4.16) ─────────────────────────────────────────────────────── */
.footer{background:var(--bg-sunk);border-top:1px solid var(--border);padding-block:var(--space-16) var(--space-10);margin-top:var(--space-16)}
.footer__grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:var(--space-10)}
.footer__brand-mark{display:flex;align-items:center;gap:8px;margin-bottom:var(--space-4)}
.footer__logo{height:22px;width:auto;color:var(--text-strong)}
.footer__mission{color:var(--text-muted);font-size:14px;line-height:1.6;max-width:280px}
.footer__col-h{font-family:var(--font-mono);font-weight:500;font-size:12px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-muted);margin:0 0 var(--space-4)}
.footer__col ul{list-style:none;margin:0;padding:0}
.footer__col li{margin-bottom:var(--space-2)}
.footer__col a{font-family:var(--font-sans);font-size:14px;color:var(--text-muted)}
.footer__col a:hover{color:var(--accent)}
.footer__machines{margin-top:var(--space-12);padding-top:var(--space-6);border-top:1px solid var(--border);
  display:flex;flex-wrap:wrap;gap:var(--space-4);align-items:center;
  font-family:var(--font-mono);font-size:12px;color:var(--text-muted)}
.footer__machines a{color:var(--text-muted)}.footer__machines a:hover{color:var(--accent)}
.footer__base{margin-top:var(--space-8);display:flex;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);
  font-family:var(--font-mono);font-size:12px;color:var(--text-muted)}
.footer__base a{color:var(--text-muted)}

/* ── icons (§6) ─────────────────────────────────────────────────────────── */
.ico{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;display:block}

/* ── skip link + focus (§7) ─────────────────────────────────────────────── */
.skip{position:absolute;left:-9999px;top:0;z-index:50;background:var(--accent);color:var(--accent-ink);
  padding:10px 16px;font-family:var(--font-mono);font-weight:500;font-size:13px;border-radius:0 0 var(--r-2) 0}
.skip:focus{left:0}
a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,
.card:focus-visible,.tab:focus-visible,.jrow:focus-visible,.nav__link:focus-visible{
  outline:2px solid var(--focus);outline-offset:3px;border-radius:4px}

/* ── responsive (§3.4) ──────────────────────────────────────────────────── */
@media(max-width:960px){
  .wwd{grid-template-columns:repeat(3,1fr)}
  .grid-3{grid-template-columns:repeat(2,1fr)}
  .article{grid-template-columns:minmax(0,1fr);row-gap:var(--space-10)}
  .article__aside{position:static;top:auto}
  .footer__grid{grid-template-columns:1fr 1fr}
}
@media(max-width:720px){
  .nav__links{display:none}
  .nav__toggle{display:flex}
  /* narrow home hero: the left-heavy desktop gradient leaves the wrapped H1/sub crossing bright sky,
     so switch to a full-width vertical scrim (top band keeps the over-hero brand + toggle legible) */
  .hero--home .hero__overlay{background:
    linear-gradient(180deg,rgba(6,7,9,.82) 0,rgba(6,7,9,.40) 70px,rgba(6,7,9,0) 152px),
    linear-gradient(0deg,rgba(9,10,12,.74) 0%,rgba(9,10,12,.62) 40%,rgba(9,10,12,.5) 60%,rgba(9,10,12,.5) 100%)}
}
@media(max-width:640px){
  .section{padding-block:var(--space-12)}
  /* the sheet spans nearly full width and the pull-up shrinks gracefully */
  .hero--page,.hero--article{min-height:min(44vh,400px)}
  .sheet-wrap{padding-inline:10px}
  .sheet{margin-top:-160px;border-radius:12px;padding:var(--space-8) var(--space-5) var(--space-8)}
  .wwd{grid-template-columns:repeat(2,1fr)}
  .grid-3,.grid-2{grid-template-columns:1fr}
  .stats{grid-template-columns:1fr;gap:var(--space-6)}
  .footer__grid{grid-template-columns:1fr}
  .jrow__thumb{width:88px;height:64px}
  .hero__ctas{gap:var(--space-5)}
}

/* ── motion (§7) ────────────────────────────────────────────────────────── */
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *{transition:none !important;animation:none !important}
  .card:hover .card__media img{transform:none}
  .ctalink:hover .arw{transform:none}
  .jrow:hover{padding-left:0}
}`;
