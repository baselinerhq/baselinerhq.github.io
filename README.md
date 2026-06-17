# baselinerhq.github.io

The documentation website for [**baseliner**](https://github.com/baselinerhq/baseliner)
— *Renovate, but for repository governance.* Built with
[VitePress](https://vitepress.dev) and deployed to GitHub Pages at
**<https://baselinerhq.github.io>**.

## Single source of truth

The guide pages are **not** maintained here. They are sourced from the
[`baselinerhq/baseliner`](https://github.com/baselinerhq/baseliner) repo's
`docs/` directory at build time, so the site always tracks the canonical docs.

`scripts/sync-docs.sh` copies the upstream docs into the VitePress content tree
and applies a few minimal link fixups (rewriting upstream-relative links to
absolute `github.com` URLs, and the `ROADMAP.md` cross-link to the local
`/roadmap` page) so the dead-link checker passes. **Only this repo's synced
copies are ever edited — never the upstream `baseliner` repo.**

Pages surfaced: Getting Started, Install, Configuration, CLI Reference,
Policies, Control Repo, and Roadmap.

## Local development

```bash
npm install

# Sync docs from a sibling checkout of the baseliner repo, then run dev/build.
# sync-docs auto-detects ./baseliner/docs, ../baseliner/docs, or pass a path:
npm run sync-docs -- /path/to/baseliner/docs

npm run docs:dev      # local dev server (runs sync-docs first)
npm run docs:build    # production build into docs/.vitepress/dist
npm run docs:preview  # preview the production build
```

`docs:dev` and `docs:build` run `sync-docs` automatically via npm `pre*`
scripts. Set `BASELINER_DOCS_SRC` to point at the docs source non-interactively.

## Brand assets

The teal-octagon logo is canonical here:

- `docs/public/baseliner-logo.png` — hero image, favicon, and og:image.
- `brand/baseliner-logo.drawio` — editable draw.io source.

Accent teal is `#00A59C` (sampled from the logo); the theme is dark-mode-first
on a near-black `#0e0e0e` canvas, configured in
`docs/.vitepress/theme/custom.css`.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` (and via
`workflow_dispatch`): it checks out this repo **and** `baselinerhq/baseliner`,
runs `npm ci`, syncs the docs, builds with VitePress, and publishes via
`actions/upload-pages-artifact` + `actions/deploy-pages`.

> GitHub Pages must be enabled for this repo with the **GitHub Actions** source.

## License

MIT.
