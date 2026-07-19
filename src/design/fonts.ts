/**
 * Self-hosted webfonts. Three families, seven files, all font-display:swap.
 *
 *   EB Garamond    400/600/italic  the reading + display serif — light, timeless, built to hold
 *                                  long-form (design-language §04). Runs a size up.
 *   IBM Plex Sans  400/500         the interface voice: nav sheet, ledes, captions, form fields
 *   IBM Plex Mono  400/500         the "machine voice": nav, labels, meta, tags, CTAs, code
 *
 * Spectral is retired (superseded by EB Garamond, design-language §04). Cinzel retired earlier.
 *
 * Files live at /assets/fonts/. Latin-subset woff2. If a file is ever missing the @font-face
 * simply fails and the fallback stack renders, so a missing font never blocks a build or a paint.
 */

export const fontFace = `@font-face{font-family:"EB Garamond";font-style:normal;font-weight:400;font-display:swap;src:url(/assets/fonts/eb-garamond-400.woff2) format("woff2")}
@font-face{font-family:"EB Garamond";font-style:normal;font-weight:600;font-display:swap;src:url(/assets/fonts/eb-garamond-600.woff2) format("woff2")}
@font-face{font-family:"EB Garamond";font-style:italic;font-weight:400;font-display:swap;src:url(/assets/fonts/eb-garamond-italic-400.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans";font-style:normal;font-weight:400;font-display:swap;src:url(/assets/fonts/ibm-plex-sans-400.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans";font-style:normal;font-weight:500;font-display:swap;src:url(/assets/fonts/ibm-plex-sans-500.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:400;font-display:swap;src:url(/assets/fonts/ibm-plex-mono-400.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:500;font-display:swap;src:url(/assets/fonts/ibm-plex-mono-500.woff2) format("woff2")}`;

/**
 * Preload the three files that carry above-the-fold text so the LCP heading, the ledes and the nav
 * do not reflow on swap: EB Garamond-600 (hero / page H1), IBM Plex Sans-400 (sub / lede body) and
 * IBM Plex Mono-500 (nav + wordmark). Emitted into <head> via the page() extraMeta hook.
 */
export const fontPreload =
  `<link rel="preload" href="/assets/fonts/eb-garamond-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-mono-500.woff2" as="font" type="font/woff2" crossorigin>`;
