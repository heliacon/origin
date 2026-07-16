// About page, built to ia-and-ux.md §2.10 and voice-and-copy §2 (About).
// Section order: page head -> narrative (who / why I started / what I have built / how I work,
// rendered from about.md so the HTML and the /about.md alternate stay one source) -> the
// mission / approach / values three-panel with the topographic side-art motif -> honest receipts
// stat block (never fabricated figures, design-system §4.18) -> CTA to /contact/.
//
// NEEDS-PETE: the WHO headline line and the WHAT-I-HAVE-BUILT track record are carried as the
// clearly-marked [PETE: ...] stubs authored in about.md. No bio, role or number is invented here.
import { CANON } from "../util";
import { page } from "../layout/shell";
import { pageHero } from "../layout/article";
import { ctaLink, statBlock, sectionLabel, starList } from "../components";
import { icon } from "../icons";

// Honest, inspectable receipts, not vanity metrics (voice-and-copy §2, design-system §4.18).
const RECEIPTS = [
  { n: "5", c: "Projections from one source: HTML, JSON, JSON-LD, Markdown, MCP.", href: "/provenance" },
  { n: "Every answer cited", c: "Nothing generated, so nothing invented.", href: "/ask?q=what+is+an+origin" },
  { n: "100% source-available", c: "Read it, run it, check it.", href: "https://github.com/heliacon" },
];

const VALUES = [
  "<strong>Curiosity.</strong> We work at the edge and follow the question.",
  "<strong>Clarity.</strong> We turn complexity into something you can act on.",
  "<strong>Provenance.</strong> Every claim traces back to what substantiates it.",
  "<strong>Sovereignty.</strong> You hold your origin. No one rents it to you.",
];

/** A borderless panel with a top rule, echoing the stat-block / mock design language. */
function panel(label: string, inner: string, id?: string): string {
  return `<div${id ? ` id="${id}"` : ""} style="border-top:1px solid var(--border-strong);padding-top:24px">` +
    sectionLabel(label) + `<div style="height:16px"></div>${inner}</div>`;
}

/** htmlBody is about.md rendered to HTML with its leading <h1> removed. */
export function about(htmlBody: string, jsonld: unknown): string {
  // The topographic side-art motif (design-system §2.10 / §4.16). Full contour texture is a
  // deferred CSS/asset enhancement; here it is a faint mapping-icon accent, aria-hidden.
  const topoArt = icon("mapping").replace('class="ico"', 'class="ico" style="width:72px;height:72px"');

  const missionPanel = panel("Our mission",
    `<p>To make knowledge legible, verifiable and owned, so the people who create it are found ` +
    `and trusted by the machines that now read the web. And to build software that gets better ` +
    `for the people who use it, not worse.</p>`);

  const approachPanel = panel("Our approach",
    `<p><strong style="color:var(--text)">Research led. Evidence over opinion. Built to be inspected.</strong></p>` +
    `<p style="color:var(--text-muted);margin-bottom:0">We measure by what can be proven on the wire, ` +
    `not what sounds good in a slide.</p>`);

  const valuesPanel = panel("Our values", starList(VALUES), "values");

  const body =
    pageHero({ title: "About Heliacon", lede: "We help organisations navigate uncertainty and build with confidence.", eyebrow: "About", section: "about" }) +

    `<section class="section"><div class="container container--text">` +
      `<div class="prose">${htmlBody}</div>` +
    `</div></section>` +

    `<section class="section" style="border-top:1px solid var(--border)"><div class="container">` +
      `<div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;flex-wrap:wrap">` +
        `<div>${sectionLabel("Mission, approach, values")}<h2 style="margin-top:16px">What Heliacon is for</h2></div>` +
        `<span aria-hidden="true" style="color:var(--text-faint);flex:none">${topoArt}</span>` +
      `</div>` +
      `<div class="grid-3">${missionPanel}${approachPanel}${valuesPanel}</div>` +
    `</div></section>` +

    `<section class="section--tight"><div class="container">` +
      `${sectionLabel("The proof is inspectable")}<div style="height:32px"></div>` +
      statBlock(RECEIPTS) +
    `</div></section>` +

    `<div class="cta-band"><div class="container">${ctaLink("Work with me", "/contact/")}</div></div>`;

  return page("About Heliacon · Heliacon", body, "/about/", {
    section: "about", overHero: true, jsonld, ogType: "profile",
    description: "Heliacon is a studio and consultancy led by Pete Dainty. Founder-led, deliberately small, origin-first for the machines that now read the web.",
    alternates: { "text/markdown": `${CANON}/about.md` },
  });
}
