# Deploy — GitHub + Cloudflare Pages

The origin is the source; `dist/` is a projection. Cloudflare Pages rebuilds `dist/`
from source on every push. Nothing in `dist/` is committed.

## Build contract
- Build command: `pip install -r requirements.txt && python build.py`
- Output directory: `dist`
- Python: 3.11+ (set `PYTHON_VERSION=3.11` in Pages build env vars)

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
- Build command: `pip install -r requirements.txt && python build.py`
- Build output directory: `dist`
- Env var: `PYTHON_VERSION` = `3.11`
Deploy. You'll get `heliacon-origin.pages.dev`.

### 4. Custom domain
Pages project → Custom domains → Set up → `heliacon.com` (and `www`).
Because `heliacon.com`'s DNS is already on Cloudflare, it adds the records for you.
Set `www` → 301 → apex (or vice-versa) via a redirect rule.

## After launch
- `git push` → Pages rebuilds and deploys.
- Cross-posts (dev.to / LinkedIn / Substack) are non-canonical projections: each carries
  `rel="canonical"` back to the matching `https://heliacon.com/...` URL.
