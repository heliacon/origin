# Deploy — GitHub + Cloudflare Pages

The origin is the source; `dist/` is a projection. Cloudflare Pages rebuilds `dist/`
from source on every push. Nothing in `dist/` is committed.

## Build contract
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Node: 20+ (Cloudflare Pages default is fine; pin with `NODE_VERSION=20` if needed)

The build is TypeScript (`build.ts`, run via `tsx`) so the whole origin is one edge-native
language — the same as the Cloudflare Workers / Pages Functions that will host the dynamic
capabilities (`ask`, `provenance`, MCP, content negotiation) later.

## One-time setup

### 1. Git + first tag (local)
```bash
cd ~/projects/Heliacon
git init
git add -A
git commit -m "origin v0.1: canonical source + projection pipeline + brand"
git tag -a v0.1.0 -m "Heliacon origin v0.1.0"
```

### 2. Create the GitHub repo and push
```bash
gh repo create heliacon/origin --private --source=. --remote=origin --push
# (or luckylarryschopshop/heliacon-origin if not using a 'heliacon' org)
git push origin v0.1.0
```

### 3. Connect Cloudflare Pages
Dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
- Framework preset: **None**
- Build command: `npm install && npm run build`
- Build output directory: `dist`
- (optional) Env var: `NODE_VERSION` = `20`
Deploy. You'll get `heliacon-origin.pages.dev`.

### 4. Custom domain
Pages project → Custom domains → Set up → `heliacon.com` (and `www`).
Because `heliacon.com`'s DNS is already on Cloudflare, it adds the records for you.
Set `www` → 301 → apex (or vice-versa) via a redirect rule.

## After launch
- `git push` → Pages rebuilds and deploys.
- Cross-posts (dev.to / LinkedIn / Substack) are non-canonical projections: each carries
  `rel="canonical"` back to the matching `https://heliacon.com/...` URL.
