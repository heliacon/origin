/**
 * Self-hosted webfonts. Two families, four files, all font-display:swap.
 *
 *   Spectral       400/500  the mixed-case display / lede serif (design-system §2.2)
 *   IBM Plex Mono  400/500  the "machine voice": nav, labels, meta, tags, CTAs, code
 *
 * Cinzel is retired (design-system §2.1). Body sans is the system stack, no webfont.
 *
 * Files live at /assets/fonts/. Fetched from Google Fonts (SIL OFL) as latin-subset woff2.
 * If a file is ever missing the @font-face simply fails and the fallback stack renders, so a
 * missing font never blocks the build or a paint.
 */

export const fontFace = `@font-face{font-family:Spectral;font-style:normal;font-weight:400;font-display:swap;src:url(/assets/fonts/spectral-400.woff2) format("woff2")}
@font-face{font-family:Spectral;font-style:normal;font-weight:500;font-display:swap;src:url(/assets/fonts/spectral-500.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:400;font-display:swap;src:url(/assets/fonts/ibm-plex-mono-400.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:500;font-display:swap;src:url(/assets/fonts/ibm-plex-mono-500.woff2) format("woff2")}`;

/**
 * Preload the two fonts that carry the above-the-fold text so the LCP heading and the nav do
 * not reflow on swap: Spectral-500 (hero / page H1) and IBM Plex Mono-500 (nav + wordmark).
 * Emitted into <head> via the page() extraMeta hook.
 */
export const fontPreload =
  `<link rel="preload" href="/assets/fonts/spectral-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-mono-500.woff2" as="font" type="font/woff2" crossorigin>`;
