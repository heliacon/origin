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

/* ── tokens (design-system §1.3) ─────────────────────────────────────────── */
:root{
  /* surfaces — Stone, warm neutral near-black */
  --bg-base:#0F0F12; --bg-sunk:#0A0A0C; --bg-elevated:#17161A;
  --bg-elevated-2:#201E22; --bg-overlay:#121115;
  /* text — Stone */
  --text:#D7D2C7; --text-strong:#ECE6D8; --text-muted:#A9A59B; --text-faint:#726F66;
  /* accent — Dawn Warm */
  --accent:#E3A868; --accent-strong:#D46D37; --accent-deep:#9C4A20; --accent-ink:#221606;
  /* secondary accent — Glacial Cool */
  --signal:#8FB7D1; --signal-mid:#5E7F9C; --signal-deep:#2E4960;
  /* tertiary — Forest Deep */
  --ok:#6FA678; --forest-tint:#1B2A1C;
  /* lines and states */
  --border:#2A2822; --border-strong:#3A382F; --focus:#E3A868;
  --selection:rgba(227,168,104,.24);
  --link:var(--accent); --link-hover:var(--accent-strong);
  /* code syntax (§4.12) */
  --code-bg:#0B0B0D; --code-text:#D7D2C7; --code-key:#E3A868; --code-str:#8FB7D1;
  --code-num:#D46D37; --code-func:#A9C7B0; --code-comment:#726F66; --code-punct:#A9A59B;

  /* type */
  --font-serif:"Spectral","Iowan Old Style",Palatino,"Palatino Linotype",Georgia,serif;
  --font-mono:"IBM Plex Mono",ui-monospace,"SF Mono","Cascadia Code",Menlo,monospace;
  --font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --font-body:var(--font-sans); /* swap to var(--font-serif) to make body serif (§2.2) */

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
.section-head{margin-bottom:var(--space-8);text-align:center}
.section-head .eyebrow{margin-bottom:var(--space-4)}
.pagehead{padding-block:var(--space-16) var(--space-10);border-bottom:1px solid var(--border);text-align:center}
.pagehead h1{margin-bottom:var(--space-4)}
.pagehead .lede,.pagehead p{max-width:640px;margin-inline:auto}
.stack>*+*{margin-top:var(--space-4)}

/* ── nav (§4.2) ─────────────────────────────────────────────────────────── */
.siteheader{background:var(--bg-base);border-bottom:1px solid var(--border);position:relative;z-index:6}
.nav{display:flex;align-items:center;justify-content:space-between;gap:var(--space-6);
  height:72px;max-width:var(--container);margin:0 auto;padding-inline:var(--gutter)}
.nav--over{position:absolute;top:0;left:0;right:0;z-index:4}
.nav__brand{display:flex;align-items:center;gap:8px;flex:none}
.nav__logo{height:26px;width:auto}
.nav__wordmark{font-family:var(--font-mono);font-weight:500;font-size:16px;letter-spacing:.28em;
  text-transform:uppercase;color:var(--text-strong)}
.nav__links{display:flex;align-items:center;gap:28px;list-style:none;margin:0;padding:0}
.nav__link{font-family:var(--font-mono);font-weight:500;font-size:13px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--text);opacity:.82;position:relative;padding:6px 0;display:inline-block}
.nav__link:hover{color:var(--accent);opacity:1}
.nav__link[aria-current=page]{color:var(--accent);opacity:1}
.nav__link[aria-current=page]::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--accent)}
.nav--over .nav__link{color:var(--text-strong);opacity:1;text-shadow:0 1px 3px rgba(0,0,0,.85),0 1px 16px rgba(0,0,0,.55)}
/* over the bright sky the active/hover link must stay light — gold text washes out against orange.
   the gold underline is the affordance, given a dark halo so it reads against the sunset. */
.nav--over .nav__link:hover,.nav--over .nav__link[aria-current=page]{color:var(--text-strong)}
.nav--over .nav__link[aria-current=page]::after{height:2px;background:var(--accent);box-shadow:0 0 0 1px rgba(0,0,0,.45),0 1px 5px rgba(0,0,0,.7)}
.nav--over .nav__link:hover::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--text-strong);opacity:.85}
.nav--over .nav__wordmark{text-shadow:0 1px 3px rgba(0,0,0,.85),0 1px 16px rgba(0,0,0,.55)}
.nav__toggle{display:none;width:44px;height:44px;align-items:center;justify-content:center;
  background:none;border:0;cursor:pointer;flex:none}
.nav__toggle span{display:block;width:22px;height:1.5px;background:var(--text);position:relative}
.nav--over .nav__toggle span{background:var(--text-strong)}
.nav__toggle span::before,.nav__toggle span::after{content:"";position:absolute;left:0;width:22px;height:1.5px;background:inherit}
.nav__toggle span::before{top:-7px}.nav__toggle span::after{top:7px}
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
.hero--home{min-height:88vh}
/* interior banners: no text on the image (the heading lives in the sheet pulled up over it) */
.hero--page,.hero--article{min-height:min(56vh,520px)}
.hero--page .hero__media img{object-position:center 88%}
/* interior banners carry no text, so the image stays bright (comparable to home): only the home
   top band survives for over-hero nav legibility (a11y-validated), plus the .hero::after blend.
   Higher specificity than base .hero__overlay so it wins regardless of source order. */
.hero--page .hero__overlay,.hero--article .hero__overlay{background:
  linear-gradient(180deg,rgba(6,7,9,.82) 0,rgba(6,7,9,.40) 72px,rgba(6,7,9,.10) 132px,rgba(6,7,9,0) 186px)}
.hero__media,.hero__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 25%}
.hero__overlay{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(6,7,9,.82) 0,rgba(6,7,9,.40) 72px,rgba(6,7,9,.10) 132px,rgba(6,7,9,0) 186px),
             linear-gradient(90deg,rgba(9,10,12,.82) 0%,rgba(9,10,12,.62) 22%,rgba(9,10,12,.34) 48%,rgba(9,10,12,.12) 68%,rgba(9,10,12,0) 82%),
             linear-gradient(0deg,rgba(9,10,12,.52) 0%,rgba(9,10,12,0) 42%)}
.hero__inner{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;
  max-width:var(--container);width:100%;margin:0 auto;padding-inline:var(--gutter)}
.hero--home .hero__inner{justify-content:center;padding-block:var(--space-24)}
.hero__block{max-width:620px}
.hero__h1{font-size:clamp(40px,6vw,64px);line-height:1.05;letter-spacing:-.01em;color:var(--text-strong);
  text-shadow:0 1px 3px rgba(0,0,0,.65),0 2px 30px rgba(0,0,0,.82);margin:0}
.hero__rule{width:40px;height:2px;background:var(--accent);border:0;margin:var(--space-6) 0}
.hero__sub{font-family:var(--font-sans);font-size:clamp(18px,2vw,21px);line-height:1.5;color:var(--text-strong);
  opacity:1;text-shadow:0 1px 3px rgba(0,0,0,.7),0 2px 24px rgba(0,0,0,.7);margin:0 0 var(--space-8);max-width:34em}
.hero__ctas{display:flex;align-items:center;gap:var(--space-8);flex-wrap:wrap}

/* ── content sheet (interior pages: the solid container pulled up over the banner) ── */
.sheet-wrap{max-width:var(--container);margin:0 auto;padding-inline:var(--gutter);position:relative;z-index:3}
.sheet-wrap--text{max-width:var(--container-text)}
/* the article/page card: glassy, rounded, floated high over the hero like a normal article
   position. The image glows through the translucent top; below the banner it sits on base. */
.sheet{background:rgba(15,15,18,.84);
  -webkit-backdrop-filter:blur(18px) saturate(1.15);backdrop-filter:blur(18px) saturate(1.15);
  border:1px solid rgba(236,230,216,.09);border-radius:16px;
  box-shadow:0 24px 64px rgba(0,0,0,.38);
  margin-top:-300px;padding:var(--space-12) clamp(24px,4vw,var(--space-16)) var(--space-12)}
@supports not (backdrop-filter:blur(1px)){.sheet{background:rgba(15,15,18,.97)}}
/* sections flowing inside the sheet already sit in its padding: neutralise their own gutter */
.sheet .container{padding-inline:0}
.sheet .section:last-child,.sheet .cta-band:last-child{padding-bottom:0}
.sheet__head{margin-bottom:var(--space-8)}
.sheet__head--center{text-align:center}
.sheet__head--center .sheet__rule{margin-inline:auto}
.sheet__head--center .lede{max-width:640px;margin-inline:auto}
.sheet__head .eyebrow{margin-bottom:var(--space-4)}
.sheet__head h1{margin:0}
.sheet__head .lede{margin:0}
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
.card__ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--signal);background:linear-gradient(135deg,var(--signal-deep),var(--bg-sunk))}
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

/* ── prose (markdown bodies) ────────────────────────────────────────────── */
.prose{font-size:17px;line-height:1.7;color:var(--text)}
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

/* ── footer (§4.16) ─────────────────────────────────────────────────────── */
.footer{background:var(--bg-sunk);border-top:1px solid var(--border);padding-block:var(--space-16) var(--space-10);margin-top:var(--space-16)}
.footer__grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:var(--space-10)}
.footer__brand-mark{display:flex;align-items:center;gap:8px;margin-bottom:var(--space-4)}
.footer__brand-mark img{height:24px}
.footer__brand-mark .nav__wordmark{font-size:14px;color:var(--text)}
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
