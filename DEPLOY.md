# Deploy: Cloudflare Worker with static assets

The origin is the source. `dist/` is a projection. Cloudflare rebuilds `dist/` from source on
every push to `main`. Nothing in `dist/` is committed.

Deployed as a Worker with static assets, not Pages. Cloudflare is consolidating on Workers, and
this keeps static hosting and edge code in one deployable. See `wrangler.jsonc`.

`worker.ts` runs first on every request and content-negotiates. A request for a page returns
HTML to a browser and JSON to a client that sends `Accept: application/json`, from the same
URL. Everything else falls through to the static assets. It also forces HTTPS.

## Build contract
- Build command: `npm run build`. Cloudflare installs deps automatically.
- Deploy command: `npx wrangler deploy`. Bundles `worker.ts` and uploads `dist/`.
- Config: `wrangler.jsonc`. `name: heliacon-origin`, `main: worker.ts`, `assets.directory: ./dist`.
- Output: `dist/`. HTML plus JSON, JSON-LD, Markdown, llms.txt and MCP projections.

## Dashboard setup (one-time)

Repo is already pushed to `github.com/heliacon/origin`.

1. Cloudflare dashboard → **Compute → Workers** (new 2026 sidebar; Workers & Pages moved
   under **Compute**) → **Create** → **Import a repository** / **Connect to Git**.
2. Authorize the **`heliacon`** GitHub account → pick **`heliacon/origin`** → branch `main`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`   (default — leave as is)
   - Root directory: `/`   (leave default)
4. Deploy → you get `heliacon-origin.<subdomain>.workers.dev`.

### Custom domain
Worker → **Settings → Domains & Routes → Add → Custom domain** → `heliacon.com` (and `www`).
Records auto-add because DNS is on Cloudflare. Add a redirect rule so `www` → 301 → apex.

## Local commands
```bash
npm run build      # generate dist/
npm run preview    # build + wrangler dev (local preview at 127.0.0.1:8787)
npm run deploy     # build + wrangler deploy (manual deploy; needs `wrangler login`)
```

## After launch
- `git push` → Workers Builds rebuilds and deploys `main` automatically.
- Cross-posts (dev.to / LinkedIn / Substack) are non-canonical projections: each carries
  `rel="canonical"` back to the matching `https://heliacon.com/...` URL.
- Adding capabilities later: set `"main": "worker.ts"` + `assets.binding` in `wrangler.jsonc`
  and put edge code in `worker.ts` — same repo, same deploy.
