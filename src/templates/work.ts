/**
 * Work index — proof, built to ia-and-ux §2.3 with copy from voice-and-copy §2 and work.md.
 * Section order: page head -> Case Study Zero featured full-width (the one real inspectable
 * engagement) -> filter tabs -> project grid (REAL projects as "View project", the four OFFER
 * areas as "Capability" cards, never case studies) -> honest client-work note -> CTA band.
 *
 * Honesty rules (ia §3.3, voice F7): no card carries a fabricated client metric; the four offer
 * areas are capabilities not case studies; Topkay is renamed Kenovar. Structured markup is
 * composed here rather than rendered from the work.md prose blob (that narrative is promoted to
 * the Case Study Zero detail page). build.ts passes the rendered blob positionally, so the first
 * parameter is kept for signature compatibility and deliberately unused.
 */
import { CANON } from "../util";
import { page } from "../layout/shell";
import { pageHead, projectCard, filterTabs, ctaLink, sectionLabel, tagChip } from "../components";
import type { ProjectCardOpts } from "../components";

const TABS = [
  { label: "All", value: "all", href: "/work/" },
  { label: "Strategy", value: "strategy", href: "/work/?type=strategy" },
  { label: "Research", value: "research", href: "/work/?type=research" },
  { label: "Products", value: "products", href: "/work/?type=products" },
  { label: "Studio", value: "studio", href: "/work/?type=studio" },
];

// Case Study Zero is the featured band above, not a grid card. Real projects carry "View project"
// and link to their detail page; capability cards carry "Capability" and link to the Studio facet
// that explains them (they are offer areas, not client case studies).
const REAL: ProjectCardOpts[] = [
  { kicker: "Research", title: "ARMX Framework", iconName: "connections", dataType: "research", href: "/work/armx/", ctaLabel: "View project", caption: "Agent Readiness and Machine eXperience. The five-pillar model behind how we measure being found, trusted, selected and invoked." },
  { kicker: "Products", title: "Kenovar", iconName: "products", dataType: "products", href: "/work/kenovar/", ctaLabel: "View project", caption: "Our SEO, AEO and GEO platform. A verified-owner digital twin of your site, inspectable from every machine viewpoint on one graph." },
];

const CAPABILITIES: ProjectCardOpts[] = [
  { kicker: "Capability", title: "AI Search Strategy", iconName: "focus", dataType: "strategy", href: "/studio/#strategy", ctaLabel: "How we help", caption: "Decide what to be found for, then build the plan to be cited and invoked across search, assistants and agents." },
  { kicker: "Capability", title: "Content Intelligence", iconName: "research", dataType: "research", href: "/studio/#research", ctaLabel: "How we help", caption: "Make your knowledge legible and verifiable, so the models that now read the web can quote it with confidence." },
  { kicker: "Capability", title: "Agent Experience Design", iconName: "connections", dataType: "products", href: "/studio/#agentic", ctaLabel: "How we help", caption: "Design experiences an agent can invoke, grounded and provenance-first, not a demo that falls over on the wire." },
  { kicker: "Capability", title: "Data & Signal Strategy", iconName: "signals", dataType: "research", href: "/studio/#discovery", ctaLabel: "How we help", caption: "Turn measurement, experimentation and signal into decisions you can act on and defend." },
];

const CHIPS = ["Working MCP", "Citation-first /ask", "Provenance API", "Source-available"];

/** `_htmlBody` is work.md rendered to HTML by build.ts. Unused: see file header. */
export function work(_htmlBody: string, jsonld: unknown): string {
  const cards = [...REAL, ...CAPABILITIES].map((c) => projectCard(c)).join("");
  const chips = CHIPS.map((c) => tagChip(c)).join("");

  const featured = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("Case study zero", true)}</div>
  <h2 style="max-width:760px">The clearest proof is the site you are on</h2>
  <p class="lede" style="max-width:760px;margin-top:16px">One canonical source, served to browsers, agents and crawlers alike, every claim inspectable. This is the one real, inspectable engagement, built the way we build for clients.</p>
  <div class="chips" style="margin-top:24px">${chips}</div>
  <p style="margin-top:24px">${ctaLink("Inspect it", "/work/case-study-zero/")}</p>
</div></section>`;

  const grid = `
<section class="section--tight"><div class="container">
  <div class="section-head">${sectionLabel("Explore the work")}</div>
  ${filterTabs(TABS, "all")}
  <div class="grid-3" data-filter-grid style="margin-top:40px">${cards}</div>
</div></section>`;

  const clientNote = `
<section class="section--tight"><div class="container container--text">
  ${sectionLabel("Client work")}
  <p style="margin-top:16px;color:var(--text-muted)">Client engagements are underway. As each one lands it will appear here with the metric we moved and its provenance, on the same terms as everything else on this site. Shown, not claimed.</p>
</div></section>`;

  const cta = `
<section class="cta-band"><div class="container">
  <h2 style="margin-bottom:24px">Want this for your origin?</h2>
  ${ctaLink("Work with us", "/contact/")}
</div></section>`;

  const body =
    pageHead("Our Work", "We help organisations be found, trusted and invoked in a world where the reader is as often a machine as a person. The clearest proof is this site.", "Work") +
    featured + grid + clientNote + cta;

  return page("Our Work · Heliacon", body, "/work/", {
    section: "work", jsonld,
    description: "Proof of origin-first, built and running. Case Study Zero is this site: a working MCP server, citation-first ask and a provenance API, all source-available.",
    alternates: { "text/markdown": `${CANON}/work.md` },
  });
}
