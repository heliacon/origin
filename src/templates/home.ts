/**
 * Homepage. Built to ia-and-ux §2.1 and the approved mock, with copy from voice-and-copy §2.
 * Sections: hero -> what we do (5 facets) -> ask strip (server-rendered canonical Q&A + bridge
 * CTA, machine spine preserved) -> latest journal -> footer. The hero already carries the one
 * link to the work index; the capability facets appear in "What we do", so home does not repeat
 * them as project cards.
 *
 * British English, no em dash, no fabricated proof.
 */
import { CANON, Dict, esc, collapse, fmtDate } from "../util";
import { page } from "../layout/shell";
import { navBar } from "../layout/shell";
import {
  heroPicture, sectionLabel, ctaLink, whatWeDoRow, journalRow,
} from "../components";

const FACETS = [
  { icon: "strategy", title: "Strategy", caption: "Clarity of direction where search, AI and intent collide.", href: "/studio/#strategy" },
  { icon: "research", title: "Research", caption: "Working at the edge of search and AI, in the open.", href: "/studio/#research" },
  { icon: "products", title: "Products", caption: "Tools that turn what we learn into something you can use.", href: "/products/" },
  { icon: "partnerships", title: "Partnerships", caption: "A few engagements at a time, given senior attention.", href: "/studio/#partnerships" },
  { icon: "studio", title: "Studio", caption: "The craft of building it. Legible, owned, provenance-first.", href: "/studio/" },
];

/** Server-render a few real, cited Q&A pairs from the definitions so crawlers see them without JS
 *  (seo HEL-046). Each answer is a canonical definition summary and links to its page. */
function canonicalQA(defs: Dict[]): string {
  const byId = Object.fromEntries(defs.map((d) => [d.id, d]));
  const pick = ["origin", "provenance", "invocation"].map((id) => byId[id]).filter(Boolean);
  if (!pick.length) return "";
  return pick.map((d) =>
    `<a class="ask__ans" href="/research/definitions/${d.id}/">` +
    `<span class="ask__ans-t">${esc(d.title)}</span>` +
    `<span class="ask__ans-x">${esc(collapse(d.summary))}</span></a>`).join("");
}

export function home(origin: Dict, defs: Dict[], posts: Dict[], graph: unknown): string {
  const facets = whatWeDoRow(FACETS);
  const latest = posts.slice(0, 3).map((p) =>
    journalRow({
      href: `/journal/${p.slug}/`,
      meta: fmtDate(p.published),
      title: p.title,
      summary: collapse(p.summary ?? ""),
      iconName: "signals",
    })).join("");

  const body = `
<section class="hero hero--home">
  ${heroPicture("Dawn over a valley with a river and radio dish, blue signal beams rising from the forest")}
  <div class="hero__overlay"></div>
  ${navBar("", true)}
  <div class="hero__inner">
    <div class="hero__block">
      <h1 class="hero__h1">Navigate uncertainty. Build with confidence.</h1>
      <hr class="hero__rule">
      <p class="hero__sub">Strategy, research and products at the intersection of search, AI and human intent.</p>
      <div class="hero__ctas">
        ${ctaLink("Explore our work", "/work/")}
        ${ctaLink("Talk to us", "/contact/", { quiet: true })}
      </div>
    </div>
  </div>
</section>

<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("What we do")}</div>
  ${facets}
</div></section>

<section class="section"><div class="container">
  <div class="section-head">${sectionLabel("Ask our origin")}<h2 style="margin-top:16px">We practise what we sell</h2></div>
  <p class="lede" style="max-width:640px;margin-bottom:32px">Do not take our word for it. Ask our own origin a question. It answers from our corpus and every answer cites its source. This is exactly what we build for clients: knowledge a machine can find, trust and invoke.</p>
  <form class="ask__box" id="ask" action="/ask" method="get" role="search">
    <label class="sr-only" for="q">Ask the origin a question</label>
    <input id="q" name="q" placeholder="What is an origin? How do I become invocable?" autocomplete="off">
    <button class="btn btn--icon" type="submit" aria-label="Ask">&rarr;</button>
  </form>
  <div class="ask__answers" id="answers" role="status" aria-live="polite">${canonicalQA(defs)}</div>
  <div class="ask__bridge" id="ask-bridge">${ctaLink("Want this for your origin? Start a conversation", "/contact/?ref=ask")}</div>
  <p class="machine-row">Or call it directly, no browser required:
    <a href="/ask?q=what+is+an+origin">Ask</a><a href="/.well-known/mcp.json">MCP</a><a href="/provenance">Provenance</a><a href="/origin.md">Markdown</a><a href="/origin.json">JSON</a><a href="/origin.jsonld">JSON-LD</a><a href="/feed.xml">Feed</a>
  </p>
</div></section>

<section class="section"><div class="container">
  <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap">
    <div>${sectionLabel("Latest from the journal")}</div>
    ${ctaLink("Read the journal", "/journal/")}
  </div>
  <div class="jlist">${latest}</div>
  <p style="margin-top:32px">${ctaLink("About Heliacon", "/about/")}</p>
</div></section>`;

  return page("Heliacon · Origin-first for AI search visibility", body, "/", {
    overHero: true,
    description: origin.description,
    jsonld: graph,
    alternates: {
      "text/markdown": `${CANON}/origin.md`,
      "application/json": `${CANON}/origin.json`,
      "application/ld+json": `${CANON}/origin.jsonld`,
      "application/atom+xml": `${CANON}/feed.xml`,
    },
  });
}
