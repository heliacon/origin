/**
 * Definition page (/research/definitions/{id}/), to ia-and-ux §2.6.
 *
 * Order is load-bearing for accessibility and for the wireframe: back link, then the H1 term FIRST
 * (heading order, HEL-029), then the canonical one-sentence contract, the expanded detail, the
 * PROVENANCE block (the point of the page), RELATED (sibling terms, when the definition names any),
 * and the machine ALTERNATES (.json, .jsonld, .md).
 *
 * The DefinedTerm/DefinedTermSet schema and stable @ids are emitted by src/schema.ts and passed in
 * as `jsonld`; this template keeps H1-first and advertises the alternates.
 */
import { CANON, Dict, esc, collapse, titleCase, fmtDate } from "../util";
import { page } from "../layout/shell";
import { heroBanner, articleHead } from "../layout/article";
import { sectionLabel } from "../components";

export function definitionPage(d: Dict, jsonld: unknown): string {
  const listSec = (label: string, items?: unknown[]): string =>
    !Array.isArray(items) || !items.length ? "" :
      `<h2>${esc(label)}</h2><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

  const provRows = [
    ["Version", String(d.version ?? "0.1")],
    ["Status", titleCase(String(d.status ?? "draft"))],
    ["Author", String(d.author ?? "Heliacon")],
    ["Updated", fmtDate(d.updated)],
  ].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");
  const provSource =
    `<tr><th scope="row">Source</th><td>Canonical origin. See its <a href="/provenance/${esc(d.id)}">provenance record</a>.</td></tr>`;

  const relDefs = (d.related ?? [])
    .map((r: string) => `<a class="chip" href="/research/definitions/${esc(r)}/">${esc(titleCase(r))}</a>`)
    .join("");

  const body =
    heroBanner("research", "hero--article") +

    // narrow sheet: the heading block and the definition read as one centred text column
    `<div class="sheet-wrap sheet-wrap--text"><div class="sheet">` +
      articleHead({
        section: "research",
        backLabel: "Back to Research", backHref: "/research/",
        title: String(d.title),
        sub: collapse(d.summary),
      }) +

      `<div class="prose">` +
        `<p><strong>${esc(collapse(d.definition ?? d.summary))}</strong></p>` +
        listSec("Why it matters", d.rationale) +
        listSec("In practice", d.examples) +
        listSec("Not this", d.antipatterns) +
        `<h2>Provenance</h2>` +
        `<div class="tablewrap"><table><tbody>${provRows}${provSource}</tbody></table></div>` +
      `</div>` +

      (relDefs
        ? `<div style="margin-top:48px">${sectionLabel("Related")}` +
            `<div class="chips" style="margin-top:16px">${relDefs}</div>` +
          `</div>`
        : "") +

      `<div style="margin-top:40px">${sectionLabel("This page as")}` +
        `<p class="machine-row" style="margin-top:12px">` +
          `<a href="/research/definitions/${esc(d.id)}.json">JSON</a>` +
          `<a href="/research/definitions/${esc(d.id)}.jsonld">JSON-LD</a>` +
          `<a href="/research/definitions/${esc(d.id)}.md">Markdown</a></p>` +
      `</div>` +

    `</div></div>`;

  return page(`${d.title} · Heliacon`, body, `/research/definitions/${d.id}/`, {
    section: "research", overHero: true, jsonld,
    description: collapse(d.summary),
    alternates: {
      "application/json": `${CANON}/research/definitions/${d.id}.json`,
      "application/ld+json": `${CANON}/research/definitions/${d.id}.jsonld`,
      "text/markdown": `${CANON}/research/definitions/${d.id}.md`,
    },
  });
}
