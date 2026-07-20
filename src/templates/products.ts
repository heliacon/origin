// Products: a light page per ia-and-ux.md §2.2 / §3.1 (demoted, no nav slot, footer + Work facet
// only). Renders products.md (apps prove, games explore, tools expose, research explains, plus the
// honest "in development, not ready to name" note) and points back to Work and Research so the page
// is a leaf, not a dead end. Deliberately minimal; on the marketing kit for consistency.
import { CANON } from "../util";
import { page } from "../layout/shell";
import { marketingPage } from "../layout/article";
import { ctaLink } from "../components";

/** htmlBody is products.md rendered to HTML with its leading <h1> removed. */
export function products(htmlBody: string, jsonld: unknown): string {
  const body = marketingPage(
    { title: "Products", lede: "Apps, tools and games that prove the research. Each a projection of the same origin.", eyebrow: "Products", section: "" },
    `<section class="section"><div class="container container--text">` +
      `<div class="prose">${htmlBody}</div>` +
      `<div class="prose-ctas">${ctaLink("See our work", "/work/")}${ctaLink("Read the research", "/research/")}</div>` +
    `</div></section>`,
  );
  return page("Products · Heliacon", body, "/products/", {
    section: "", overHero: true, jsonld,
    description: "Apps, tools and games that prove the research. Each a projection of the same origin.",
    alternates: { "text/markdown": `${CANON}/products.md` },
  });
}
