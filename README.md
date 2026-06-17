# baselinerhq.github.io

The documentation website for [**baseliner**](https://github.com/baselinerhq/baseliner)
— *Renovate, but for repository governance.* Built with
[VitePress](https://vitepress.dev) and deployed to GitHub Pages at
**<https://baselinerhq.github.io>**.

## Single source of truth (manifest-driven)

Guide pages are **not** maintained here — they're pulled from each project's repo
at build time, so the site always tracks the canonical docs. The projects to
include are declared in [`docs.sources.json`](docs.sources.json):

```jsonc
{
  "primary": "baseliner",        // served at the site root
  "sources": [
    {
      "name": "baseliner",
      "repo": "baselinerhq/baseliner",
      "ref": "main",
      "docsDir": "docs",
      "dev": "../baseliner/docs", // local checkout used when present
      "pages": [ { "src": "cli.md", "out": "cli", "text": "CLI Reference", "section": "Guide" } ]
    }
  ]
}
```

`scripts/sync-docs.mjs` reads the manifest, resolves each source (local `dev`
checkout if present, else a shallow clone of `repo@ref`), copies its pages into
the VitePress tree, and applies generic link fixups (a link to a synced page →
its site path; any other relative link → the upstream `github.com` blob/tree
URL). **Only this repo's synced copies are ever edited — never the upstream.**

### Adding a project

Append a source to `docs.sources.json` — that's it. The `primary` source is
served at the root; every other source is namespaced under `/<name>/`, with its
own sidebar, and the nav/sidebar are generated from the manifest. No changes to
the VitePress config or the deploy workflow are needed. (For a namespaced
source, also add `docs/<name>/` to `.gitignore`, since synced pages aren't
committed.)

## Local development

```bash
npm install
npm run docs:dev      # dev server (auto-syncs from the manifest first)
npm run docs:build    # production build into docs/.vitepress/dist
npm run docs:preview  # preview the production build
```

`docs:dev`/`docs:build` run the sync automatically via npm `pre*` scripts.

## Brand assets

The teal-octagon logo is canonical here:

- `docs/public/baseliner-logo.png` — hero image, favicon, and og:image.
- `brand/baseliner-logo.drawio` — editable draw.io source.

Accent teal is `#00A59C` (sampled from the logo); the theme is dark-mode-first
on a near-black `#0e0e0e` canvas, configured in
`docs/.vitepress/theme/custom.css`.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` (and via
`workflow_dispatch`): it checks out this repo, runs `npm ci`, then builds with
VitePress (the pre-build hook clones the manifest's sources and syncs their
docs), and publishes via `actions/upload-pages-artifact` + `actions/deploy-pages`.
Because the sources are cloned from the manifest, adding a project never touches
this workflow.

> GitHub Pages must be enabled for this repo with the **GitHub Actions** source.

## License

MIT.
