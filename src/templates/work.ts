/**
 * Work index — built to ia-and-ux §2.3 with copy from voice-and-copy §2 and work.md.
 * Section order: page head -> capability grid (the four OFFER areas as "Capability" cards, each
 * linking to the Studio facet that explains it) -> honest client-work note -> CTA band.
 *
 * Honesty rules (ia §3.3, voice F7): no card carries a fabricated client metric; the four offer
 * areas are capabilities not case studies, and there is no client proof to show yet, so the page
 * reads as "what we can do + shown, not claimed". Structured markup is composed here rather than
 * rendered from the work.md prose blob. build.ts passes the rendered blob positionally, so the
 * first parameter is kept for signature compatibility and deliberately unused.
 */
import { CANON } from "../util";
import { page } from "../layout/shell";
import { pageHero } from "../layout/article";
import { projectCard, ctaLink, sectionLabel } from "../components";
import type { ProjectCardOpts } from "../components";

// The four offer areas carry "Capability" and link to the Studio facet that explains them. They
// are offer areas, not client case studies.
const CAPABILITIES: ProjectCardOpts[] = [
  { kicker: "Capability", title: "AI search strategy", iconName: "focus", dataType: "strategy", href: "/studio/#strategy", ctaLabel: "How we help", caption: "Decide what to be found for, then build the plan to be cited and invoked across search, assistants and agents." },
  { kicker: "Capability", title: "Content intelligence", iconName: "research", dataType: "research", href: "/studio/#research", ctaLabel: "How we help", caption: "Make your knowledge legible and verifiable, so the models that now read the web can quote it with confidence." },
  { kicker: "Capability", title: "Agent experience design", iconName: "connections", dataType: "products", href: "/studio/#agentic", ctaLabel: "How we help", caption: "Design experiences an agent can invoke, grounded and provenance-first, not a demo that falls over on the wire." },
  { kicker: "Capability", title: "Data and signal strategy", iconName: "signals", dataType: "research", href: "/studio/#discovery", ctaLabel: "How we help", caption: "Turn measurement, experimentation and signal into decisions you can act on and defend." },
];

/** `_htmlBody` is work.md rendered to HTML by build.ts. Unused: see file header. */
export function work(_htmlBody: string, jsonld: unknown): string {
  const cards = CAPABILITIES.map((c) => projectCard(c)).join("");

  const grid = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("What we can do")}</div>
  <div class="grid-2" style="max-width:960px;margin:40px auto 0">${cards}</div>
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
    pageHero({ title: "Our work", lede: "We help organisations be found, trusted and invoked in a world where the reader is as often a machine as a person.", eyebrow: "Work", section: "work" }) +
    grid + clientNote + cta;

  return page("Our work · Heliacon", body, "/work/", {
    section: "work", overHero: true, jsonld,
    description: "How Heliacon helps: AI search strategy, content intelligence, agent experience design and data and signal strategy. Client work is shown, not claimed.",
    alternates: { "text/markdown": `${CANON}/work.md` },
  });
}
