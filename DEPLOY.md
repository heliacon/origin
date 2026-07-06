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

## Auto-deploy (Workers Builds)

The `heliacon-origin` worker exists already, created by `wrangler deploy` from the CLI. A worker
created that way has **no Git connection**, which is why a plain `git push` does not redeploy.
Connect it once and pushes deploy themselves:

1. Cloudflare dashboard → **Compute → Workers** (2026 sidebar; Workers & Pages moved under
   **Compute**) → open **`heliacon-origin`** → **Settings → Builds**.
2. **Connect** → authorize the **`heliacon`** GitHub account → repo **`heliacon/origin`** →
   branch `main`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`   (default, leave as is)
   - Root directory: `/`   (leave default)
4. Save. The next push to `main` triggers a build and deploy. Watch it under the worker's
   **Builds** tab.

If it still does not fire: the connected branch must be `main`, the GitHub App must have access
to the `heliacon/origin` repo, and the build must pass `npm run build` (check the Builds log).
Until connected, keep deploying with `npm run deploy`.

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
