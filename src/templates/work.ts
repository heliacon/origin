/**
 * Work index — the capability offer. Redesigned (2026-07) onto the marketing kit: title sheet over
 * the masthead, then the capabilities as cards carrying their generative art, an honest client-work
 * note on a sunk ground, and a CTA. Copy from work.md / voice-and-copy §2.
 *
 * Honesty rules (ia §3.3, voice F7): the four areas are capabilities not case studies, and there is
 * no client proof yet, so the page reads "what we can do + shown, not claimed". `_htmlBody` (work.md
 * rendered) is unused: structure is composed here for stable markup.
 */
import { CANON } from "../util";
import { page } from "../layout/shell";
import { marketingPage } from "../layout/article";
import { projectCard, ctaLink, sectionHead } from "../components";
import type { ProjectCardOpts } from "../components";

const CAPABILITIES: ProjectCardOpts[] = [
  { kicker: "Capability", title: "AI search strategy", dataType: "strategy", caption: "Decide what to be found for, then build the plan to be cited and invoked across search, assistants and agents." },
  { kicker: "Capability", title: "Content intelligence", dataType: "research", caption: "Make your knowledge legible and verifiable, so the models that now read the web can quote it with confidence." },
  { kicker: "Capability", title: "Agent experience design", dataType: "products", caption: "Design experiences an agent can invoke, grounded and provenance-first, not a demo that falls over on the wire." },
  { kicker: "Capability", title: "Data and signal strategy", dataType: "research", caption: "Turn measurement, experimentation and signal into decisions you can act on and defend." },
];

/** `_htmlBody` is work.md rendered to HTML by build.ts. Unused: see file header. */
export function work(_htmlBody: string, jsonld: unknown): string {
  const grid = `
<section class="section"><div class="container">
  ${sectionHead("What we can do", "Four ways in", "Offer areas, not case studies. Most engagements braid a few together.")}
  <div class="grid-2 cardgrid">${CAPABILITIES.map((c) => projectCard(c)).join("")}</div>
</div></section>`;

  const clientNote = `
<section class="section section--sunk"><div class="container">
  ${sectionHead("Client work", "Shown, not claimed")}
  <p class="engagement__note">Client engagements are underway. As each one lands it will appear here with the metric we moved and its provenance, on the same terms as everything else on this site. Nothing is claimed until it can be shown.</p>
</div></section>`;

  const cta = `
<section class="cta-band"><div class="container">
  <h2>Want this for your origin?</h2>
  <div class="cta-band__act">${ctaLink("Work with us", "/contact/")}</div>
</div></section>`;

  const body = marketingPage(
    { title: "Our work", lede: "We help organisations be found, trusted and invoked in a world where the reader is as often a machine as a person.", eyebrow: "Work", section: "work" },
    grid + clientNote + cta,
  );

  return page("Our work · Heliacon", body, "/work/", {
    section: "work", overHero: true, jsonld,
    description: "How Heliacon helps: AI search strategy, content intelligence, agent experience design and data and signal strategy. Client work is shown, not claimed.",
    alternates: { "text/markdown": `${CANON}/work.md` },
  });
}
