// About page. Redesigned (2026-07) onto the marketing kit: title sheet over the masthead, then the
// narrative on the paper, the mission / approach / values as feature cards, the inspectable receipts
// stat block, and a CTA. Copy from about.md (rendered so the HTML and /about.md stay one source).
//
// NEEDS-PETE: the WHO headline and the WHAT-I-HAVE-BUILT track record are the clearly-marked
// [PETE: ...] stubs authored in about.md. No bio, role or number is invented here.
import { CANON } from "../util";
import { page } from "../layout/shell";
import { marketingPage } from "../layout/article";
import { ctaLink, statBlock, sectionHead, starList } from "../components";

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

/** htmlBody is about.md rendered to HTML with its leading <h1> removed. */
export function about(htmlBody: string, jsonld: unknown): string {
  const narrative = `
<section class="section"><div class="container container--text">
  <div class="prose">${htmlBody}</div>
</div></section>`;

  const mvv = `
<section class="section section--sunk"><div class="container">
  ${sectionHead("Mission, approach, values", "What Heliacon is for")}
  <div class="features features--3">
    <div class="feature"><h3 class="feature__title">Our mission</h3>
      <p class="feature__body">To make knowledge legible, verifiable and owned, so the people who create it are found and trusted by the machines that now read the web. And to build software that gets better for the people who use it, not worse.</p></div>
    <div class="feature"><h3 class="feature__title">Our approach</h3>
      <p class="feature__body">Research led. Evidence over opinion. Built to be inspected. We measure by what can be proven on the wire, not what sounds good in a slide.</p></div>
    <div class="feature" id="values"><h3 class="feature__title">Our values</h3>${starList(VALUES)}</div>
  </div>
</div></section>`;

  const receipts = `
<section class="section"><div class="container">
  ${sectionHead("The proof is inspectable", "Receipts, not vanity")}
  ${statBlock(RECEIPTS)}
</div></section>`;

  const cta = `
<section class="cta-band"><div class="container">
  <h2>Work with a studio that shows its receipts</h2>
  <div class="cta-band__act">${ctaLink("Work with me", "/contact/")}</div>
</div></section>`;

  const body = marketingPage(
    { title: "About Heliacon", lede: "We help organisations navigate uncertainty and build with confidence.", section: "about" },
    narrative + mvv + receipts + cta,
  );

  return page("About · Heliacon", body, "/about/", {
    section: "about", overHero: true, jsonld, ogType: "profile",
    description: "Heliacon is a studio and consultancy led by Pete Dainty. Founder-led, deliberately small, origin-first for the machines that now read the web.",
    alternates: { "text/markdown": `${CANON}/about.md` },
  });
}
