/**
 * Studio — the hire-us hub, built to ia-and-ux §2.2 with copy from voice-and-copy §2 and
 * consulting.md. Section order: page head -> the shift we lead (be found / be invocable) ->
 * what we do (the 5 facets expanded, each with an anchor id for home/footer deep links) ->
 * we also help with -> who it is for -> how we work (#how-we-work) -> engagement model
 * (placeholder-safe, no invented prices) -> CTA band.
 *
 * British English, no Oxford comma, no em dash. Structured markup is composed here rather than
 * rendered from the consulting.md prose blob because the facets need stable anchor ids
 * (#strategy, #research, #products, #partnerships, #studio, #how-we-work) that a flat prose
 * render cannot provide. build.ts still passes the rendered blob positionally, so the first
 * parameter is kept for signature compatibility and deliberately unused.
 */
import { CANON } from "../util";
import { page } from "../layout/shell";
import { pageHero } from "../layout/article";
import { ctaLink, sectionLabel } from "../components";
import { icon } from "../icons";

/** A facet / capability block: optional icon, an id-anchored heading, one paragraph. */
function block(id: string, title: string, body: string, iconName?: string): string {
  return `<div id="${id}" style="scroll-margin-top:96px">` +
    (iconName ? `<span class="wwd__icon">${icon(iconName)}</span>` : "") +
    `<h3 style="margin-bottom:8px">${title}</h3>` +
    `<p style="margin:0">${body}</p>` +
    `</div>`;
}

/** An ordered engagement stage: numbered eyebrow, heading, paragraph. No price. */
function stage(n: string, title: string, body: string): string {
  return `<div>` +
    `<span class="eyebrow eyebrow--accent">Stage ${n}</span>` +
    `<h3 style="margin:16px 0 8px">${title}</h3>` +
    `<p style="margin:0">${body}</p>` +
    `</div>`;
}

const GRID2 = `class="grid-2" style="gap:48px 40px;margin-top:8px"`;
const GRID3 = `class="grid-3" style="gap:48px 40px;margin-top:8px"`;

/** `_htmlBody` is consulting.md rendered to HTML by build.ts. Unused: see file header. */
export function studio(_htmlBody: string, jsonld: unknown): string {
  const shift = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("The shift we lead", true)}<h2 style="margin-top:16px;max-width:760px">Be found, trusted and invoked</h2></div>
  <div class="container--text" style="padding:0">
    <p style="margin:0 0 18px">Search is no longer the only front door. People ask an assistant. Agents assemble answers from many sources and cite the ones they can verify. If your work is not legible to those systems then you are invisible to them, however good it is.</p>
    <p style="margin:0">Call it SEO, AEO or GEO. They are the same move under new names: be the source a machine trusts enough to quote. We take it a level deeper, to the thing underneath all three. We make you origin-first. Your knowledge and capabilities live as one canonical source of truth, projected for whoever asks, each projection carrying its own provenance. You stop optimising to rank on a page and become the origin a machine cites and invokes.</p>
  </div>
  <div ${GRID2} style="gap:32px 40px;margin-top:40px">
    ${block("found", "Be found and cited", "The source an assistant quotes, retrievable and verifiable by the models that now summarise the web.", "observation")}
    ${block("invocable", "Be invocable", "Your capabilities exposed as things an agent can call, grounded and provenance-first, not just pages it can read.", "connections")}
  </div>
</div></section>`;

  const whatWeDo = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("What we do")}<h2 style="margin-top:16px">Five ways we work</h2></div>
  <div ${GRID2}>
    ${block("strategy", "Strategy", "Clarity of direction where search, AI and intent collide. We help you decide what to be found for, and build the plan to get there.", "strategy")}
    ${block("research", "Research", "Working at the edge of search and AI, in the open. We publish what we learn, and apply the same research to your problem.", "research")}
    ${block("products", "Products", "Tools that turn what we learn into something you can use. Built to be run and inspected, not just demoed.", "products")}
    ${block("partnerships", "Partnerships", "A few engagements at a time. Senior attention does not scale, so we take on a handful of clients and do them properly.", "partnerships")}
    ${block("studio", "Studio", "The craft of building it. Legible, owned and provenance-first, so what we make outlasts the next model.", "studio")}
  </div>
</div></section>`;

  const alsoHelp = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("We also help with")}<h2 style="margin-top:16px">The problems next to it</h2></div>
  <div ${GRID2}>
    ${block("experimentation", "Experimentation and measurement", "Designing, running and reading tests, and building the velocity to ship far more of them.", "measurement")}
    ${block("discovery", "Search, discovery and personalisation", "Ranking, relevance and recommendations at scale.", "navigation")}
    ${block("agentic", "AI product and agentic workflows", "Putting models and agents to work in a product, without the theatre.", "connections")}
    ${block("fractional", "Fractional product leadership", "Senior product and engineering leadership, by the engagement.", "strategy")}
  </div>
</div></section>`;

  const whoFor = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("Who it is for")}<h2 style="margin-top:16px">Who we work with</h2></div>
  <div ${GRID3}>
    ${block("", "Your content is strong but the machines miss it", "Teams whose content, products or data should be discovered and cited by AI, and are not. We make your knowledge legible to the systems that now read the web.", "observation")}
    ${block("", "You are building an agentic experience", "Teams putting agents to work who want them grounded, provenance-first and privacy-respecting, not a demo that falls over on the wire.", "connections")}
    ${block("", "You need senior product leadership for a stretch", "Founders and teams who need experienced product and engineering leadership by the engagement, not another full-time hire.", "strategy")}
  </div>
</div></section>`;

  const howWeWork = `
<section class="section" id="how-we-work" style="scroll-margin-top:96px"><div class="container">
  <div class="section-head">${sectionLabel("How we work")}<h2 style="margin-top:16px">What you can hold us to</h2></div>
  <div ${GRID3}>
    ${block("", "Measured by invocation", "Not vanity traffic. We move the metric a machine acts on, and we prove it on the wire.", "measurement")}
    ${block("", "Substance over spin", "What can be proven beats what sounds good in a slide. One inspectable fact beats ten adjectives.", "evidence")}
    ${block("", "You keep the source", "You get the research, the reference implementation and the tools behind it, and you own them.", "products")}
  </div>
</div></section>`;

  // Engagement model: stages only, no invented prices (ia §2.2 note, HEL-003/HEL-004 NEEDS-PETE).
  const engagement = `
<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("Engagement model")}<h2 style="margin-top:16px">What you get, in what order</h2></div>
  <div class="container--text" style="padding:0"><p style="margin:0 0 40px">Every engagement is scoped to the work, but the shape is consistent.</p></div>
  <div ${GRID3} style="gap:40px">
    ${stage("01", "Orientation", "A short, focused discovery. We map your machine surface, agree the metric that matters and confirm we are the right fit.")}
    ${stage("02", "Build", "We implement the origin and its projections against that metric, working in the open with you.")}
    ${stage("03", "Handover", "You keep the source, the reference implementation and the tools. What we build is yours to run and inspect.")}
  </div>
  <div class="container--text" style="padding:0"><p style="margin:40px 0 0;color:var(--text-muted)">We scope and price each engagement to the work. Start a conversation and we will be honest fast about fit, shape and cost.</p></div>
  <!-- NEEDS-PETE: engagement pricing and tiers (ia HEL-003, HEL-004). No prices invented here. -->
</div></section>`;

  const cta = `
<section class="cta-band"><div class="container">
  <h2 style="margin-bottom:24px">Ready to be found, trusted and invoked?</h2>
  ${ctaLink("Start a conversation", "/contact/")}
</div></section>`;

  const body =
    pageHero({ title: "Studio", lede: "What we do and how we work. The offer, the method and the engagement model that get you found, trusted and invoked.", eyebrow: "Studio", section: "studio" }) +
    shift + whatWeDo + alsoHelp + whoFor + howWeWork + engagement + cta;

  return page("Studio · Heliacon", body, "/studio/", {
    section: "studio", overHero: true, jsonld,
    description: "Be found, trusted and invoked in a world where the reader is as often a machine as a person. Origin-first strategy, research and products.",
    alternates: { "text/markdown": `${CANON}/studio.md` },
  });
}
