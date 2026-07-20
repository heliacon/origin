/**
 * Studio — the hire-us hub. Redesigned (2026-07): the title sits in a sheet over the masthead, then
 * the page flows on the paper in distinct, varied sections rather than one glass box of identical
 * icon-grids. Capabilities are cards with generative art; the engagement is a real process; the
 * rest are left-aligned editorial sections and principle grids. Copy from consulting.md / voice.
 *
 * Anchor ids (#strategy … #how-we-work) are preserved for home/footer deep links. British English,
 * no Oxford comma, no em dash. `_htmlBody` (consulting.md rendered) is unused: structure is composed
 * here so the facets keep stable anchor ids a flat prose render cannot provide.
 */
import { CANON } from "../util";
import { page } from "../layout/shell";
import { marketingPage } from "../layout/article";
import { ctaLink, sectionHead, featureGrid, processSteps, projectCard } from "../components";

const CAPABILITIES = [
  { id: "strategy", title: "Strategy", caption: "Clarity of direction where search, AI and intent collide. We help you decide what to be found for, and build the plan to get there." },
  { id: "research", title: "Research", caption: "Working at the edge of search and AI, in the open. We publish what we learn, and apply the same research to your problem." },
  { id: "products", title: "Products", caption: "Tools that turn what we learn into something you can use. Built to be run and inspected, not just demoed." },
  { id: "partnerships", title: "Partnerships", caption: "A few engagements at a time. Senior attention does not scale, so we take on a handful of clients and do them properly." },
  { id: "studio", title: "Studio", caption: "The craft of building it. Legible, owned and provenance-first, so what we make outlasts the next model." },
];

export function studio(_htmlBody: string, jsonld: unknown): string {
  const shift = `
<section class="section"><div class="container">
  ${sectionHead("The shift we lead", "Be found, trusted and invoked")}
  <div class="prose-cols">
    <p>Search is no longer the only front door. People ask an assistant. Agents assemble answers from many sources and cite the ones they can verify. If your work is not legible to those systems then you are invisible to them, however good it is.</p>
    <p>Call it SEO, AEO or GEO. They are the same move under new names: be the source a machine trusts enough to quote. We take it a level deeper, to the thing underneath all three. We make you origin-first: your knowledge and capabilities live as one canonical source of truth, projected for whoever asks, each projection carrying its own provenance.</p>
  </div>
  ${featureGrid([
    { title: "Be found and cited", body: "The source an assistant quotes, retrievable and verifiable by the models that now summarise the web." },
    { title: "Be invocable", body: "Your capabilities exposed as things an agent can call, grounded and provenance-first, not just pages it can read." },
  ], 2)}
</div></section>`;

  const whatWeDo = `
<section class="section section--sunk"><div class="container">
  ${sectionHead("What we do", "Five ways we work", "One studio, one team. Each is a way in; most engagements braid a few together.")}
  <div class="grid-3 cardgrid">
    ${CAPABILITIES.map((c) =>
      `<div class="anchor" id="${c.id}">${projectCard({ kicker: "Capability", title: c.title, caption: c.caption })}</div>`).join("")}
  </div>
</div></section>`;

  const alsoHelp = `
<section class="section"><div class="container">
  ${sectionHead("We also help with", "The problems next to it")}
  ${featureGrid([
    { title: "Experimentation and measurement", body: "Designing, running and reading tests, and building the velocity to ship far more of them.", icon: "measurement" },
    { title: "Search, discovery and personalisation", body: "Ranking, relevance and recommendations at scale.", icon: "navigation" },
    { title: "AI product and agentic workflows", body: "Putting models and agents to work in a product, without the theatre.", icon: "connections" },
    { title: "Fractional product leadership", body: "Senior product and engineering leadership, by the engagement.", icon: "strategy" },
  ], 2)}
</div></section>`;

  const whoFor = `
<section class="section section--sunk"><div class="container">
  ${sectionHead("Who it is for", "Who we work with")}
  ${featureGrid([
    { kicker: "Your content is strong but the machines miss it", title: "Teams that should be cited and are not", body: "Content, products or data that should be discovered and cited by AI, and is not. We make your knowledge legible to the systems that now read the web." },
    { kicker: "You are building an agentic experience", title: "Teams putting agents to work", body: "Who want them grounded, provenance-first and privacy-respecting, not a demo that falls over on the wire." },
    { kicker: "You need senior product leadership for a stretch", title: "Founders and teams mid-build", body: "Who need experienced product and engineering leadership by the engagement, not another full-time hire." },
  ], 3)}
</div></section>`;

  const howWeWork = `
<section class="section" id="how-we-work"><div class="container">
  ${sectionHead("How we work", "What you can hold us to")}
  ${featureGrid([
    { kicker: "Measured by invocation", title: "Not vanity traffic", body: "We move the metric a machine acts on, and we prove it on the wire." },
    { kicker: "Substance over spin", title: "What can be proven wins", body: "What sounds good in a slide loses to one inspectable fact. Ten adjectives lose to one receipt." },
    { kicker: "You keep the source", title: "Yours to run and inspect", body: "You get the research, the reference implementation and the tools behind it, and you own them." },
  ], 3)}
</div></section>`;

  const engagement = `
<section class="section section--sunk"><div class="container">
  ${sectionHead("Engagement model", "What you get, in what order", "Every engagement is scoped to the work, but the shape is consistent.")}
  ${processSteps([
    { n: "01", title: "Orientation", body: "A short, focused discovery. We map your machine surface, agree the metric that matters and confirm we are the right fit." },
    { n: "02", title: "Build", body: "We implement the origin and its projections against that metric, working in the open with you." },
    { n: "03", title: "Handover", body: "You keep the source, the reference implementation and the tools. What we build is yours to run and inspect." },
  ])}
  <p class="engagement__note">We scope and price each engagement to the work. Start a conversation and we will be honest fast about fit, shape and cost.</p>
</div></section>`;

  const cta = `
<section class="cta-band"><div class="container">
  <h2>Ready to be found, trusted and invoked?</h2>
  <div class="cta-band__act">${ctaLink("Start a conversation", "/contact/")}</div>
</div></section>`;

  const body = marketingPage(
    { title: "Studio", lede: "What we do and how we work. The offer, the method and the engagement model that get you found, trusted and invoked.", eyebrow: "Studio", section: "studio" },
    shift + whatWeDo + alsoHelp + whoFor + howWeWork + engagement + cta,
  );

  return page("Studio · Heliacon", body, "/studio/", {
    section: "studio", overHero: true, jsonld,
    description: "Be found, trusted and invoked in a world where the reader is as often a machine as a person. Origin-first strategy, research and products.",
    alternates: { "text/markdown": `${CANON}/studio.md` },
  });
}
