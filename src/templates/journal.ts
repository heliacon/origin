// Journal index, to ia-and-ux §2.8 and the article family. Page head (H1 Journal + lede), then the
// posts as journalRow items, most recent first (build.ts sorts by published desc), then an honest
// subscribe band.
//
// No filter tabs (ia gap 4): posts carry no `category` frontmatter, so tabs would be empty/dead.
// We ship no tabs rather than fake categories; they light up only when posts gain a category field.
//
// Subscribe band (ia gap 6): the newsletter has no POST handler, so this degrades to the real Atom
// feed (/feed.xml) rather than shipping a dead email input.
import { Dict, fmtDate, collapse } from "../util";
import { page } from "../layout/shell";
import { pageHero } from "../layout/article";
import { journalRow, ctaLink } from "../components";
import { icon } from "../icons";

/** Minutes to read, from the source markdown word count (~200 wpm), floored at 1. */
function readMinutes(md: string): number {
  const words = String(md).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Row meta: date · [category] · read-time. Category only if a post ever carries one. */
function rowMeta(p: Dict): string {
  const parts = [fmtDate(p.published)];
  if (p.category) parts.push(String(p.category));
  parts.push(`${readMinutes(p.body_md ?? "")} min read`);
  return parts.join(" · ");
}

/** Honest subscribe band: the real Atom feed, styled as the §4.15 newsletter box (no dead input). */
function subscribeBand(): string {
  return `<section class="section section--tight"><div class="container">` +
    `<div class="newsletter" style="max-width:520px;margin:0 auto">` +
      `<span class="newsletter__icon">${icon("evidence")}</span>` +
      `<h2>Keep up with the journal</h2>` + // h2: it follows the page h1 directly (WCAG 1.3.1)
      `<p class="caption">New field notes and research as they publish. Follow the feed, no inbox required.</p>` +
      `<p style="margin-top:var(--space-4)">${ctaLink("Subscribe by feed", "/feed.xml")}</p>` +
    `</div>` +
  `</div></section>`;
}

export function journal(posts: Dict[], jsonld: unknown): string {
  const rows = posts.map((p) =>
    journalRow({
      href: `/journal/${p.slug}/`,
      meta: rowMeta(p),
      title: p.title,
      summary: collapse(p.summary ?? ""),
      iconName: "signals",
    })).join("");

  const body =
    pageHero(
      {
        title: "Journal",
        lede: "Field notes and research on being found, trusted and invoked in an agentic web. Engineering, strategy and the occasional argument. Every post carries its receipts.",
        eyebrow: "Journal", section: "journal",
      },
      `<section class="section"><div class="container"><div class="jlist">${rows}</div></div></section>` +
      subscribeBand(),
    );

  return page("Journal · Heliacon", body, "/journal/", {
    section: "journal", overHero: true, jsonld,
    description: "Field notes and research from Heliacon on being found, trusted and invoked in an agentic web. Engineering, strategy and the occasional argument.",
  });
}
