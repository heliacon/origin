/// <reference types="@cloudflare/workers-types" />

/**
 * Heliacon edge worker. Content negotiation from one canonical URL.
 *
 * The browser is not privileged. Neither is the agent. A request for a page returns HTML to a
 * browser and JSON to a client that asks for it, from the same address. Everything else falls
 * through to the static assets in dist/.
 */
interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  ASSETS: Fetcher;
  MCP_LIMIT?: RateLimiter;
}

type Dict = Record<string, unknown>;

// The format the client prefers, read from Accept. Null means serve the default, which is HTML.
function preferred(accept: string): "json" | "jsonld" | "md" | null {
  const a = accept.toLowerCase();
  const html = a.indexOf("text/html");
  const ld = a.indexOf("application/ld+json");
  const json = a.indexOf("application/json");
  const md = Math.max(a.indexOf("text/markdown"), a.indexOf("text/x-markdown"));
  if (ld !== -1 && (html === -1 || ld < html)) return "jsonld";
  if (json !== -1 && (html === -1 || json < html)) return "json";
  if (md !== -1 && (html === -1 || md < html)) return "md";
  return null;
}

// The JSON projection that matches a negotiable path, or null if the path has none.
function jsonProjection(pathname: string, kind: "json" | "jsonld"): string | null {
  if (pathname === "/") return kind === "jsonld" ? "/origin.jsonld" : "/origin.json";
  const def = pathname.match(/^\/definitions\/([a-z0-9-]+)\/?$/);
  if (def) return `/definitions/${def[1]}.json`;
  return null;
}

// The markdown projection for a negotiable path. Every page advertises a .md alternate; this
// makes Accept: text/markdown resolve it too, so the "negotiate by Accept" claim holds.
function mdProjection(pathname: string): string | null {
  if (pathname === "/") return "/origin.md";
  const nested = pathname.match(/^\/(definitions|corpus|notes)\/([a-z0-9-]+)\/?$/);
  if (nested) return `/${nested[1]}/${nested[2]}.md`;
  const root = pathname.match(/^\/(manifesto|architecture|consulting|products)\/?$/);
  if (root) return `/${root[1]}.md`;
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

// ── capability cores (return data; used by both the REST routes and the MCP tools) ──────

// ask: retrieve the corpus passages that answer a question, each with its citation. Lexical
// scoring at the edge, no model, so no answer is invented.
async function askData(q: string, env: Env, origin: string): Promise<Dict> {
  const res = await env.ASSETS.fetch(new URL("/ask-index.json", origin));
  if (!res.ok) return { error: "index unavailable" };
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
  return { question: q, matched: answers.length, answers, note: "Retrieval over the Heliacon corpus. Each answer is a canonical passage with its provenance. No answer is generated." };
}

// provenance: the whole record, or one item by id, or null if that id is unknown.
async function provenanceData(id: string | null, env: Env, origin: string): Promise<Dict | null> {
  const res = await env.ASSETS.fetch(new URL("/provenance.json", origin));
  if (!res.ok) return { error: "provenance unavailable" };
  const index = (await res.json()) as { items: { id: string }[] };
  if (!id) return index;
  return (index.items.find((i) => i.id === id) as Dict) ?? null;
}

// definitions: one canonical definition as JSON, or null.
async function definitionData(id: string, env: Env, origin: string): Promise<Dict | null> {
  const res = await env.ASSETS.fetch(new URL(`/definitions/${encodeURIComponent(id)}.json`, origin));
  return res.ok ? ((await res.json()) as Dict) : null;
}

// ── REST wrappers ───────────────────────────────────────────────────────────────────────
async function ask(request: Request, url: URL, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const body = request.method === "POST" ? await request.json<{ q?: string }>().catch(() => ({})) : {};
  const q = String(url.searchParams.get("q") ?? body.q ?? "").trim();
  if (!q) return jsonResponse({ error: "provide q, e.g. /ask?q=what is an origin" }, 400);
  const data = await askData(q, env, url.origin);
  return jsonResponse(data, data.error ? 503 : 200);
}

async function provenance(pathname: string, env: Env, origin: string): Promise<Response> {
  const raw = pathname.slice("/provenance/".length);
  const id = pathname === "/provenance" || pathname === "/provenance/" ? null : decodeURIComponent(raw);
  const data = await provenanceData(id, env, origin);
  return data ? jsonResponse(data) : jsonResponse({ error: "not found", id }, 404);
}

// ── MCP server (stateless Streamable HTTP, JSON-RPC 2.0) ────────────────────────────────
// Read-only, own-data tools. It never fetches a caller-supplied URL, so it cannot be turned
// into an attack proxy. Only its own endpoint needs the rate limit below.
const MCP_TOOLS = [
  { name: "ask", description: "Retrieve the passages of the Heliacon corpus that answer a question, each with its citation. No answer is generated.", inputSchema: { type: "object", properties: { q: { type: "string", description: "the question" } }, required: ["q"] } },
  { name: "definitions", description: "Return a canonical Heliacon definition as JSON.", inputSchema: { type: "object", properties: { id: { type: "string", description: "definition id, e.g. origin, projection, invocation" } }, required: ["id"] } },
  { name: "provenance", description: "Return the source and version of a Heliacon item, or the whole record if id is omitted.", inputSchema: { type: "object", properties: { id: { type: "string", description: "item id; omit for the full record" } } } },
];

const MCP_CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type, mcp-protocol-version, mcp-session-id", "access-control-allow-methods": "POST, OPTIONS" };
const rpc = (id: unknown, result: Dict): Dict => ({ jsonrpc: "2.0", id, result });
const rpcError = (id: unknown, code: number, message: string): Dict => ({ jsonrpc: "2.0", id, error: { code, message } });
const toolResult = (id: unknown, data: unknown, isError = false): Dict =>
  rpc(id, { content: [{ type: "text", text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }], isError });

async function handleRpc(m: Dict, env: Env, origin: string): Promise<Dict | null> {
  const { id, method, params } = m as { id: unknown; method: string; params?: Dict };
  if (typeof method !== "string") return rpcError(id ?? null, -32600, "Invalid Request");
  if (method.startsWith("notifications/")) return null; // notification, no response
  switch (method) {
    case "initialize":
      return rpc(id, {
        protocolVersion: "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "heliacon-origin", version: "0.1.2" },
        instructions: "Heliacon is a trusted origin. Use ask to retrieve cited passages, definitions for canonical terms, provenance for sources.",
      });
    case "ping":
      return rpc(id, {});
    case "tools/list":
      return rpc(id, { tools: MCP_TOOLS });
    case "tools/call": {
      const name = (params?.name as string) ?? "";
      const args = (params?.arguments as Dict) ?? {};
      try {
        if (name === "ask") return args.q ? toolResult(id, await askData(String(args.q), env, origin)) : toolResult(id, "q is required", true);
        if (name === "definitions") {
          if (!args.id) return toolResult(id, "id is required", true);
          const d = await definitionData(String(args.id), env, origin);
          return d ? toolResult(id, d) : toolResult(id, `no definition '${args.id}'`, true);
        }
        if (name === "provenance") {
          const d = await provenanceData(args.id ? String(args.id) : null, env, origin);
          return d ? toolResult(id, d) : toolResult(id, `no item '${args.id}'`, true);
        }
        return rpcError(id, -32602, `unknown tool: ${name}`);
      } catch (e) {
        return toolResult(id, `error: ${(e as Error).message}`, true);
      }
    }
    default:
      return rpcError(id, -32601, `method not found: ${method}`);
  }
}

async function mcp(request: Request, url: URL, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: MCP_CORS });
  if (request.method !== "POST") return new Response("Method Not Allowed. POST JSON-RPC 2.0 to this endpoint.", { status: 405, headers: MCP_CORS });
  let msg: unknown;
  try { msg = await request.json(); } catch { return new Response(JSON.stringify(rpcError(null, -32700, "Parse error")), { headers: { "content-type": "application/json", ...MCP_CORS } }); }
  const out = Array.isArray(msg)
    ? (await Promise.all(msg.map((m) => handleRpc(m as Dict, env, url.origin)))).filter(Boolean)
    : await handleRpc(msg as Dict, env, url.origin);
  if (out === null || (Array.isArray(out) && out.length === 0)) return new Response(null, { status: 202, headers: MCP_CORS });
  return new Response(JSON.stringify(out), { headers: { "content-type": "application/json", ...MCP_CORS } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
   try {
    const url = new URL(request.url);

    // Always HTTPS, except on local hosts where dev runs over http.
    if (url.protocol === "http:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // Light per-IP rate limit on the invocable endpoints (Cloudflare absorbs the rest).
    if (env.MCP_LIMIT && (url.pathname === "/ask" || url.pathname === "/mcp")) {
      const ip = request.headers.get("cf-connecting-ip") ?? "anon";
      const { success } = await env.MCP_LIMIT.limit({ key: ip });
      if (!success) return jsonResponse({ error: "rate limit exceeded, slow down" }, 429);
    }

    // Capabilities, invocable at stable paths.
    if (url.pathname === "/mcp") return mcp(request, url, env);
    if (url.pathname === "/ask") return ask(request, url, env);
    if (url.pathname === "/provenance" || url.pathname.startsWith("/provenance/")) {
      return provenance(url.pathname, env, url.origin);
    }

    const kind = preferred(request.headers.get("accept") ?? "");

    if (kind && (request.method === "GET" || request.method === "HEAD")) {
      const target = kind === "md" ? mdProjection(url.pathname) : jsonProjection(url.pathname, kind);
      if (target) {
        const res = await env.ASSETS.fetch(new URL(target, url.origin));
        if (res.ok) {
          const headers = new Headers(res.headers);
          headers.set("content-type",
            kind === "md" ? "text/markdown; charset=utf-8"
            : target.endsWith(".jsonld") ? "application/ld+json; charset=utf-8"
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
   } catch {
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
   }
  },
};
