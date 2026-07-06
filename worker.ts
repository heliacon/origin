/// <reference types="@cloudflare/workers-types" />

/**
 * Heliacon edge worker. Content negotiation from one canonical URL.
 *
 * The browser is not privileged. Neither is the agent. A request for a page returns HTML to a
 * browser and JSON to a client that asks for it, from the same address. Everything else falls
 * through to the static assets in dist/.
 */
export interface Env {
  ASSETS: Fetcher;
}

// The format the client prefers, read from Accept. Null means serve the default, which is HTML.
function preferred(accept: string): "json" | "jsonld" | null {
  const a = accept.toLowerCase();
  const html = a.indexOf("text/html");
  const ld = a.indexOf("application/ld+json");
  const json = a.indexOf("application/json");
  if (ld !== -1 && (html === -1 || ld < html)) return "jsonld";
  if (json !== -1 && (html === -1 || json < html)) return "json";
  return null;
}

// The JSON projection that matches a negotiable path, or null if the path has none.
function jsonProjection(pathname: string, kind: "json" | "jsonld"): string | null {
  if (pathname === "/") return kind === "jsonld" ? "/origin.jsonld" : "/origin.json";
  const def = pathname.match(/^\/definitions\/([a-z0-9-]+)\/?$/);
  if (def) return `/definitions/${def[1]}.json`;
  return null;
}

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "vary": "Accept",
    },
  });

const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type", "access-control-allow-methods": "GET, POST, OPTIONS" };
const STOP = new Set("a an the and or but of to in on at for with by from as is are was were be it its this that these those what which who how why when where do does did not no can will your you we our they their more most other some such than too very into over".split(" "));
const tokenise = (s: string): string[] => (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length >= 3 && !STOP.has(t));

// The ask capability. Retrieve the corpus passages that answer a question, each with its
// citation. Lexical scoring at the edge, no model, so no answer is invented.
async function ask(request: Request, url: URL, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const body = request.method === "POST" ? await request.json<{ q?: string }>().catch(() => ({})) : {};
  const q = (url.searchParams.get("q") ?? body.q ?? "").trim();
  if (!q) return jsonResponse({ error: "provide q, e.g. /ask?q=what is an origin" }, 400);

  const res = await env.ASSETS.fetch(new URL("/ask-index.json", url.origin));
  if (!res.ok) return jsonResponse({ error: "index unavailable" }, 503);
  const { passages } = (await res.json()) as { passages: { id: string; title: string; url: string; source: string; text: string }[] };

  const terms = [...new Set(tokenise(q))];
  const answers = passages
    .map((p) => {
      const title = p.title.toLowerCase();
      const text = p.text.toLowerCase();
      // title match weighs heavily; body matches count by frequency
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 5 : 0) + (text.split(t).length - 1), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ p, score }) => ({
      text: p.text.length > 420 ? p.text.slice(0, 420).replace(/\s+\S*$/, "") + "..." : p.text,
      score,
      citation: { id: p.id, title: p.title, url: p.url, source: p.source },
    }));

  return jsonResponse({
    question: q,
    matched: answers.length,
    answers,
    note: "Retrieval over the Heliacon corpus. Each answer is a canonical passage with its provenance. No answer is generated.",
  });
}

// The provenance capability. /provenance returns the whole record, /provenance/:id one item.
async function provenance(pathname: string, env: Env, origin: string): Promise<Response> {
  const res = await env.ASSETS.fetch(new URL("/provenance.json", origin));
  if (!res.ok) return jsonResponse({ error: "provenance unavailable" }, 503);
  const index = (await res.json()) as { items: { id: string }[] };
  if (pathname === "/provenance" || pathname === "/provenance/") return jsonResponse(index);
  const id = decodeURIComponent(pathname.slice("/provenance/".length));
  const item = index.items.find((i) => i.id === id);
  return item ? jsonResponse(item) : jsonResponse({ error: "not found", id }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Always HTTPS, except on local hosts where dev runs over http.
    if (url.protocol === "http:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // Capabilities, invocable at stable paths.
    if (url.pathname === "/ask") return ask(request, url, env);
    if (url.pathname === "/provenance" || url.pathname.startsWith("/provenance/")) {
      return provenance(url.pathname, env, url.origin);
    }

    const kind = preferred(request.headers.get("accept") ?? "");

    if (kind && (request.method === "GET" || request.method === "HEAD")) {
      const target = jsonProjection(url.pathname, kind);
      if (target) {
        const res = await env.ASSETS.fetch(new URL(target, url.origin));
        if (res.ok) {
          const headers = new Headers(res.headers);
          headers.set("content-type", target.endsWith(".jsonld")
            ? "application/ld+json; charset=utf-8"
            : "application/json; charset=utf-8");
          headers.set("access-control-allow-origin", "*");
          headers.set("vary", "Accept");
          return new Response(res.body, { status: res.status, headers });
        }
      }
    }

    // Default: the static asset. Tag it so caches key on Accept.
    const res = await env.ASSETS.fetch(request);
    const headers = new Headers(res.headers);
    headers.append("vary", "Accept");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  },
};
