// Journal article, to ia-and-ux §2.9 and the article mock (2.jpeg). Over-image hero with the nav
// inside (← Back to Journal, meta line, H1, amber rule, dek), then the shared two-column body:
// prose left, sticky sidebar right (On this page TOC · Tags · Related articles · subscribe), and a
// Share row under the prose (LinkedIn, X, copy link).
//
// Honesty notes (ia gaps 4 and 6):
//   - Posts carry no `category` frontmatter, so the hero meta is date · read-time. Category is
//     rendered only if a post ever gains one. Read-time is computed from the body word count.
//   - Posts carry no `tags` frontmatter, so the Tags block is omitted rather than fabricated. It
//     lights up automatically once a post carries `tags:` (array or comma-separated string).
//   - The newsletter has no POST handler, so the subscribe block degrades to the working Atom feed
//     (/feed.xml) instead of shipping a dead email input.
import { CANON, Dict, esc, fmtDate, collapse } from "../util";
import { page } from "../layout/shell";
import { articleHero, withHeadingIds, articleLayout } from "../layout/article";
import { tocSidebar, relatedList, chipCluster, ctaLink } from "../components";
import { icon } from "../icons";

export interface PostRelated { href: string; title: string; }

/** Minutes to read, from the rendered body word count (~200 wpm), floored at 1. */
function readMinutes(html: string): number {
  const words = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Tags from frontmatter only: an array, or a comma-separated string. Never derived/fabricated. */
function postTags(p: Dict): string[] {
  if (Array.isArray(p.tags)) return p.tags.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof p.tags === "string") return p.tags.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

/** Honest subscribe block: the real Atom feed, styled as the §4.15 newsletter box (no dead input). */
function subscribeBox(): string {
  return `<div class="newsletter">` +
    `<span class="newsletter__icon">${icon("evidence")}</span>` +
    `<h3>Like what you read?</h3>` +
    `<p class="caption">New field notes and research as they publish. Follow the feed, no inbox required.</p>` +
    `<p style="margin-top:var(--space-4)">${ctaLink("Subscribe by feed", "/feed.xml")}</p>` +
    `</div>`;
}

const GLYPH = {
  linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`,
  x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>`,
  link: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
};

const SHARE_BTN =
  "display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;color:var(--text-muted);text-decoration:none";

/** Share row (mock: bottom of the reading column). LinkedIn + X open share intents; copy uses the
 *  existing [data-copy] handler in app.js and degrades to a no-op button with JS off. */
function shareRow(url: string, title: string): string {
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const x = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const link = (href: string, label: string, glyph: string) =>
    `<a href="${esc(href)}" target="_blank" rel="noopener" aria-label="${esc(label)}" style="${SHARE_BTN}">${glyph}</a>`;
  return `<div class="share" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:1px solid var(--border);margin-top:var(--space-16);padding-top:var(--space-6)">` +
    `<span class="eyebrow">Share this article</span>` +
    `<span style="display:flex;align-items:center;gap:4px">` +
      link(li, "Share on LinkedIn", GLYPH.linkedin) +
      link(x, "Share on X", GLYPH.x) +
      `<span style="position:relative;display:inline-flex;align-items:center">` +
        `<button type="button" data-copy="${esc(url)}" aria-label="Copy link to this article" style="${SHARE_BTN};background:none;border:0;cursor:pointer">${GLYPH.link}</button>` +
        `<span data-copy-flag hidden class="caption" style="position:absolute;right:calc(100% + 8px);top:50%;transform:translateY(-50%);white-space:nowrap">Copied</span>` +
      `</span>` +
    `</span>` +
  `</div>`;
}

export function post(p: Dict, htmlBody: string, jsonld: unknown, related: PostRelated[]): string {
  const { html, toc } = withHeadingIds(htmlBody);
  const url = `${CANON}/journal/${p.slug}/`;

  // meta line: date · [category] · read-time (category only if a post ever carries one)
  const parts = [fmtDate(p.published)];
  if (p.category) parts.push(String(p.category));
  parts.push(`${readMinutes(html)} min read`);
  const meta = parts.join(" · ");

  const hero = articleHero({
    section: "journal", backLabel: "Back to Journal", backHref: "/journal/",
    meta, title: p.title, sub: collapse(p.summary ?? ""),
  });

  const tags = postTags(p);
  const aside =
    tocSidebar(toc) +
    (tags.length ? chipCluster(tags) : "") +
    relatedList(
      related.map((r) => ({ href: r.href, title: r.title, iconName: "signals" })),
      "/journal/", "View all articles",
    ) +
    subscribeBox() +
    `<div><span class="eyebrow">This page as</span><p class="machine-row" style="margin-top:12px"><a href="/journal/${esc(p.slug)}.md">Markdown</a></p></div>`;

  const content = articleLayout({ hero, body: html + shareRow(url, String(p.title)), aside });

  return page(`${p.title} · Heliacon`, content, `/journal/${p.slug}/`, {
    section: "journal", overHero: true, jsonld, ogType: "article",
    description: collapse(p.summary ?? "").slice(0, 155),
    alternates: { "text/markdown": `${CANON}/journal/${p.slug}.md` },
    extraMeta:
      `<meta property="article:published_time" content="${esc(p.published)}">\n` +
      `<meta property="article:modified_time" content="${esc(p.updated ?? p.published)}">\n` +
      `<meta property="article:author" content="${esc(p.author ?? "Pete Dainty")}">`,
  });
}
