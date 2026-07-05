#!/usr/bin/env python3
"""
Heliacon origin build — projects the canonical source into many representations.

    origin.yaml + definitions/*.yaml + corpus/*.md
        -> dist/                     (the deployable site + machine projections)

One source of truth, many projections. The browser is not privileged; neither is the
agent. Run:  python build.py   (outputs to ./dist)
"""
from __future__ import annotations
import json, shutil, html, re
from pathlib import Path
import yaml
import markdown as md

ROOT = Path(__file__).parent
DIST = ROOT / "dist"
CANON = "https://heliacon.com"
PROJECTIONS = ["html", "markdown", "json", "jsonld", "llms", "mcp"]


# ── loading ────────────────────────────────────────────────────────────────
def load_yaml(p: Path) -> dict:
    return yaml.safe_load(p.read_text()) or {}


def parse_frontmatter(text: str):
    """Split a Markdown file into (frontmatter dict, body)."""
    if text.startswith("---"):
        _, fm, body = text.split("---", 2)
        return yaml.safe_load(fm) or {}, body.strip()
    return {}, text.strip()


def load_corpus() -> list[dict]:
    items = []
    for p in sorted((ROOT / "corpus").glob("*.md")):
        meta, body = parse_frontmatter(p.read_text())
        meta["body_md"] = body
        meta["slug"] = meta.get("id", p.stem)
        items.append(meta)
    return items


def load_definitions() -> list[dict]:
    return [load_yaml(p) for p in sorted((ROOT / "definitions").glob("*.yaml"))]


# ── html projection ──────────────────────────────────────────────────────────
def page(title: str, body: str, canonical_path: str, alternates: dict[str, str]) -> str:
    alt = "\n    ".join(
        f'<link rel="alternate" type="{t}" href="{href}">' for t, href in alternates.items()
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<link rel="canonical" href="{CANON}{canonical_path}">
<link rel="icon" href="/assets/logo/mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/logo/icon-180.png">
    {alt}
<style>
:root{{--navy:#0E1533;--ink:#0B1029;--cream:#F4ECD8;--gold:#E7B23C;--dim:#9aa0b8}}
*{{box-sizing:border-box}}
html{{scroll-behavior:smooth}}
body{{margin:0;background:var(--ink);color:var(--cream);
  font:400 18px/1.65 "Iowan Old Style",Palatino,"Palatino Linotype",Georgia,serif;
  -webkit-font-smoothing:antialiased}}
.wrap{{max-width:760px;margin:0 auto;padding:64px 24px 96px}}
a{{color:var(--gold);text-decoration:none}} a:hover{{text-decoration:underline}}
header.mast{{display:flex;flex-direction:column;gap:14px;margin-bottom:56px}}
.logo{{width:min(460px,86%)}}
.tag{{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.32em;
  text-transform:uppercase;color:var(--gold)}}
h1,h2,h3{{font-weight:600;letter-spacing:-.01em;line-height:1.15}}
h1{{font-size:40px;margin:0 0 8px}}
h2{{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);
  font-family:ui-sans-serif,system-ui,sans-serif;margin:56px 0 18px}}
h3{{font-size:24px;margin:0 0 6px}}
p{{margin:0 0 18px}}
.lede{{font-size:22px;color:var(--cream)}}
ul{{padding-left:1.1em}} li{{margin:6px 0}}
.card{{display:block;padding:20px 22px;margin:10px 0;border:1px solid #2a3050;
  border-radius:14px;background:#141a38;transition:border-color .15s,transform .1s}}
.card:hover{{border-color:var(--gold);transform:translateY(-1px);text-decoration:none}}
.card .k{{font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.18em;
  text-transform:uppercase;color:var(--gold)}}
.card h3{{margin:8px 0 4px;color:var(--cream)}}
.card p{{margin:0;color:var(--dim);font-size:16px}}
.proj{{font:500 13px/1.8 ui-sans-serif,system-ui,sans-serif;color:var(--dim)}}
.proj a{{color:var(--dim);border:1px solid #2a3050;border-radius:999px;
  padding:4px 12px;margin:0 6px 8px 0;display:inline-block}}
.proj a:hover{{color:var(--gold);border-color:var(--gold);text-decoration:none}}
footer{{margin-top:72px;padding-top:24px;border-top:1px solid #2a3050;
  font:400 14px/1.7 ui-sans-serif,system-ui,sans-serif;color:var(--dim)}}
.back{{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;
  text-transform:uppercase}}
article :is(h1,h2,h3){{font-family:inherit}}
article h2{{font-family:ui-sans-serif,system-ui,sans-serif}}
</style>
</head>
<body>
<div class="wrap">
{body}
<footer>
  <strong>Heliacon</strong> — a trusted origin for knowledge, capability, and provenance.<br>
  One origin, many projections · © 2026 Heliacon LLC ·
  <a href="/llms.txt">llms.txt</a> ·
  <a href="/.well-known/mcp.json">MCP</a> ·
  <a href="/origin.json">JSON</a>
</footer>
</div>
</body>
</html>"""


def logo_svg() -> str:
    p = ROOT / "assets" / "logo" / "wordmark.svg"
    return p.read_text() if p.exists() else (
        '<span style="font:600 40px/1 serif;letter-spacing:.04em">HELIAC&#9679;N</span>'
    )


def home_html(origin: dict, defs: list[dict], corpus: list[dict]) -> str:
    caps = "".join(f"<li><code>{html.escape(c)}</code></li>" for c in origin.get("capabilities", []))
    prin = "".join(
        f"<li>{html.escape(x)}</li>" for x in [
            "Provenance by default.", "Privacy by architecture.",
            "Capability over content.", "Invocation over attention.",
            "One origin. Many projections.",
        ]
    )
    cards = ""
    by_id = {d["id"]: d for d in defs}
    for cid in ["origin", "projection", "invocation", "capability", "provenance"]:
        d = by_id.get(cid)
        if not d:
            continue
        cards += (
            f'<a class="card" href="/definitions/{cid}/">'
            f'<span class="k">Definition</span>'
            f'<h3>{html.escape(d["title"])}</h3>'
            f'<p>{html.escape(d.get("summary","").strip())}</p></a>'
        )
    body = f"""
<header class="mast">
  <a href="/" aria-label="Heliacon" style="display:block">{logo_svg()}</a>
  <div class="tag">Be first light</div>
</header>

<p class="lede">Heliacon is a trusted origin for knowledge, capability, and provenance —
the canonical source from which every projection is derived.</p>
<p>The browser is not privileged. Neither is the agent. Every consumer negotiates the
projection most appropriate for its capabilities, from one source of truth.</p>

<h2>The five definitions</h2>
{cards}

<h2>Principles</h2>
<ul>{prin}</ul>

<h2>Capabilities</h2>
<ul>{caps}</ul>

<h2>Projections</h2>
<p class="proj">The same origin, negotiated for whoever asks:
  <a href="/origin.md">Markdown</a>
  <a href="/origin.json">JSON</a>
  <a href="/origin.jsonld">JSON-LD</a>
  <a href="/llms.txt">llms.txt</a>
  <a href="/.well-known/mcp.json">MCP</a>
</p>
"""
    return page("Heliacon — Be first light", body, "/", {
        "text/markdown": f"{CANON}/origin.md",
        "application/json": f"{CANON}/origin.json",
        "application/ld+json": f"{CANON}/origin.jsonld",
    })


def definition_html(d: dict) -> str:
    def sec(label, items):
        if not items:
            return ""
        lis = "".join(f"<li>{html.escape(str(x))}</li>" for x in items)
        return f"<h2>{label}</h2><ul>{lis}</ul>"
    rel = "".join(
        f'<a href="/definitions/{r}/">{html.escape(r.title())}</a> '
        for r in d.get("related", [])
    )
    body = f"""
<a class="back" href="/">&larr; Heliacon</a>
<article>
<h2 style="margin-top:32px">Definition · v{d.get('version','0.1')} · {html.escape(d.get('status','draft'))}</h2>
<h1>{html.escape(d['title'])}</h1>
<p class="lede">{html.escape(d.get('summary','').strip())}</p>
<p>{html.escape(d.get('definition','').strip())}</p>
{sec("Why it matters", d.get("rationale"))}
{sec("Examples", d.get("examples"))}
{sec("Not this", d.get("antipatterns"))}
<h2>Related</h2><p class="proj">{rel}</p>
<h2>Projections</h2>
<p class="proj">
  <a href="/definitions/{d['id']}.json">JSON</a>
  <a href="/definitions/{d['id']}.md">Markdown</a>
</p>
</article>
"""
    return page(f"{d['title']} — Heliacon", body, f"/definitions/{d['id']}/", {
        "application/json": f"{CANON}/definitions/{d['id']}.json",
        "text/markdown": f"{CANON}/definitions/{d['id']}.md",
    })


# ── machine projections ──────────────────────────────────────────────────────
def definition_markdown(d: dict) -> str:
    out = [f"# {d['title']}", "", f"> {d.get('summary','').strip()}", "",
           d.get("definition", "").strip(), ""]
    for label, key in [("Why it matters", "rationale"), ("Examples", "examples"),
                       ("Not this", "antipatterns")]:
        if d.get(key):
            out += [f"## {label}", ""] + [f"- {x}" for x in d[key]] + [""]
    if d.get("related"):
        out += ["## Related", "", ", ".join(d["related"]), ""]
    out += [f"---", f"id: {d['id']} · version: {d.get('version')} · status: {d.get('status')} · source: {CANON}/definitions/{d['id']}/"]
    return "\n".join(out)


def jsonld(origin: dict, defs: list[dict]) -> dict:
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": f"{CANON}/#organization",
                "name": origin["name"],
                "url": CANON,
                "slogan": origin.get("tagline"),
                "description": " ".join(origin.get("description", "").split()),
                "founder": {"@type": "Person", "name": origin.get("author", {}).get("name")},
            },
            *[
                {
                    "@type": "DefinedTerm",
                    "@id": f"{CANON}/definitions/{d['id']}/",
                    "name": d["title"],
                    "description": " ".join(d.get("summary", "").split()),
                    "inDefinedTermSet": f"{CANON}/#corpus",
                    "version": str(d.get("version", "0.1")),
                }
                for d in defs
            ],
        ],
    }


def llms_txt(origin: dict, defs: list[dict], corpus: list[dict]) -> str:
    lines = [
        f"# {origin['name']}", "",
        f"> {' '.join(origin.get('description','').split())}", "",
        f"Tagline: {origin.get('tagline')}",
        f"Canonical: {CANON}", "",
        "One origin, many projections. This file is the projection for language models.",
        "", "## Definitions"]
    for d in defs:
        lines.append(f"- [{d['title']}]({CANON}/definitions/{d['id']}.md): {' '.join(d.get('summary','').split())}")
    lines += ["", "## Corpus"]
    for c in corpus:
        lines.append(f"- [{c['title']}]({CANON}/corpus/{c['slug']}.md)")
    lines += ["", "## Capabilities"]
    for cap in origin.get("capabilities", []):
        lines.append(f"- {cap}")
    lines += ["", "## Principles"]
    for pr in origin.get("principles", []):
        lines.append(f"- {pr}")
    return "\n".join(lines) + "\n"


def mcp_manifest(origin: dict) -> dict:
    cap_desc = {
        "ask": "Resolve a question against the Heliacon corpus and return a cited answer.",
        "definitions": "Return a canonical definition and its relationships.",
        "citations": "Return the citation and source for a claim.",
        "provenance": "Return the verifiable provenance of a claim or capability.",
        "research": "Retrieve a body of research for reasoning.",
    }
    return {
        "schema_version": "2026-03-01",
        "name": "heliacon-origin",
        "description": " ".join(origin.get("description", "").split()),
        "canonical": CANON,
        "tools": [
            {"name": c, "description": cap_desc.get(c, c)}
            for c in origin.get("capabilities", [])
        ],
    }


# ── build ────────────────────────────────────────────────────────────────────
def write(path: Path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(content, (dict, list)):
        path.write_text(json.dumps(content, indent=2, ensure_ascii=False, default=str) + "\n")
    else:
        path.write_text(content)


def main():
    origin = load_yaml(ROOT / "origin.yaml")
    defs = load_definitions()
    corpus = load_corpus()

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()

    # canonical roots
    write(DIST / "origin.yaml", (ROOT / "origin.yaml").read_text())
    write(DIST / "origin.md", (ROOT / "origin.md").read_text())
    write(DIST / "origin.json", origin)
    write(DIST / "origin.jsonld", jsonld(origin, defs))

    # homepage (HTML projection of the origin)
    write(DIST / "index.html", home_html(origin, defs, corpus))

    # definitions — html + json + markdown projections
    for d in defs:
        write(DIST / "definitions" / d["id"] / "index.html", definition_html(d))
        write(DIST / "definitions" / f"{d['id']}.json", d)
        write(DIST / "definitions" / f"{d['id']}.md", definition_markdown(d))
    write(DIST / "definitions" / "index.json", defs)

    # corpus — html + markdown projections
    for c in corpus:
        html_body = md.markdown(c["body_md"], extensions=["extra"])
        pg = page(f"{c['title']} — Heliacon",
                  f'<a class="back" href="/">&larr; Heliacon</a><article>{html_body}</article>',
                  f"/corpus/{c['slug']}/",
                  {"text/markdown": f"{CANON}/corpus/{c['slug']}.md"})
        write(DIST / "corpus" / c["slug"] / "index.html", pg)
        write(DIST / "corpus" / f"{c['slug']}.md", c["body_md"])

    # discovery projections
    write(DIST / "llms.txt", llms_txt(origin, defs, corpus))
    write(DIST / ".well-known" / "mcp.json", mcp_manifest(origin))
    write(DIST / ".well-known" / "llms.txt", llms_txt(origin, defs, corpus))
    write(DIST / "schemas" / "definition.schema.json",
          (ROOT / "schemas" / "definition.schema.json").read_text())

    # static assets (logo etc.)
    if (ROOT / "assets").exists():
        shutil.copytree(ROOT / "assets", DIST / "assets", dirs_exist_ok=True)

    n = 1 + len(defs) * 3 + len(corpus) * 2 + 6
    print(f"built dist/ — {n} files · {len(defs)} definitions · {len(corpus)} corpus entries")


if __name__ == "__main__":
    main()
