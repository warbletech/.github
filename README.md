# warbletech/.github

Organization profile and a synthetic GitHub Pages demo for [github.com/warbletech](https://github.com/warbletech).

- [`profile/README.md`](profile/README.md) is the public org profile.
- [`profile/assets/`](profile/assets/) holds project, product, and membership marks. Sources are listed in [`profile/assets/LOGOS.md`](profile/assets/LOGOS.md).
- [`pages/`](pages/) and [`scripts/build-pages.mjs`](scripts/build-pages.mjs) build a static site that publishes that profile plus a clearly labeled **synthetic enterprise demo**.

## Synthetic Pages demo

The Documentation Pages workflow follows the Central Agentic Ops pattern described in [Building the synthetic pages demo](https://githubnext.github.io/gh-cao/deployment-actions/#building-the-synthetic-pages-demo) and implemented upstream in [`githubnext/gh-cao` `docs.yml`](https://github.com/githubnext/gh-cao/blob/main/.github/workflows/docs.yml):

- GitHub Actions builds documentation and a **synthetic** demo only.
- The builder accepts **no real-data input** and never downloads operational artifacts.
- Demo files live under `demo-data/`, not a root manifest.
- Deploy uses the ordinary Pages environment and OIDC. Agents receive no deployment authority.
- A daily schedule refreshes synthetic dates, independently of any operational collection.

This repository does **not** vendor the gh-cao dashboard, Go/PostgreSQL host, Web Worker, or IndexedDB pipeline. Those belong in a full CAO catalog checkout. What is adapted here is the Pages boundary, the workflow shape, and a Warble-branded synthetic sample.

```sh
npm run pages:build
# optional local preview (serves ./dist on :8080)
BASE_PATH=/ npm run pages:preview
```

The Actions build sets `BASE_PATH=/.github/` so links work on `https://warbletech.github.io/.github/` after Pages is enabled.

## Settings a maintainer must enable

This pull request does not flip repository settings or add secrets. Before the first successful deploy:

1. In this repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Allow the workflow to run (Actions enabled for the repo). On first deploy, GitHub will create the `github-pages` environment. If that environment is protected, approve the first run.
4. No repository secrets are required. Deploy authenticates with OIDC (`id-token: write` and `pages: write`).

Until those settings are on, pull requests still run the build job only; they do not publish.
