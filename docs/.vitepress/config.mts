import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Single source of truth for which projects' docs appear on the site. See
// ../../docs.sources.json — adding a project there extends the nav and sidebar
// automatically (no edits here).
const manifest = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../docs.sources.json', import.meta.url)), 'utf8')
) as {
  primary: string
  sources: {
    name: string
    title: string
    repo: string
    ref: string
    docsDir: string
    pages: { src: string; out: string; text: string; section?: string }[]
  }[]
}

const primary = manifest.sources.find((s) => s.name === manifest.primary)!
const others = manifest.sources.filter((s) => s.name !== manifest.primary)

const sectionsOf = (pages: { section?: string }[]) => [
  ...new Set(pages.map((p) => p.section ?? 'Docs'))
]

// nav: primary's Guide section as a dropdown, its other sections as links, a
// dropdown per additional project, then a resources menu.
const nav: any[] = []
for (const sec of sectionsOf(primary.pages)) {
  const items = primary.pages
    .filter((p) => (p.section ?? 'Docs') === sec)
    .map((p) => ({ text: p.text, link: `/${p.out}` }))
  if (sec === 'Guide') nav.push({ text: sec, items })
  else nav.push(...items)
}
for (const s of others) {
  nav.push({ text: s.title, items: s.pages.map((p) => ({ text: p.text, link: `/${s.name}/${p.out}` })) })
}
nav.push({
  text: 'Resources',
  items: [
    { text: 'Releases', link: `https://github.com/${primary.repo}/releases` },
    { text: 'GitHub Action', link: 'https://github.com/baselinerhq/baseliner-action' },
    { text: 'Go Reference', link: `https://pkg.go.dev/github.com/${primary.repo}` }
  ]
})

// sidebar: primary at root, each additional project namespaced under /<name>/.
const groupsFor = (pages: typeof primary.pages, base: string) =>
  sectionsOf(pages).map((sec) => ({
    text: sec,
    collapsed: false,
    items: pages
      .filter((p) => (p.section ?? 'Docs') === sec)
      .map((p) => ({ text: p.text, link: `${base}/${p.out}` }))
  }))

const sidebar: Record<string, any> = { '/': groupsFor(primary.pages, '') }
for (const s of others) sidebar[`/${s.name}/`] = groupsFor(s.pages, `/${s.name}`)

const description =
  'Renovate, but for repository governance. baseliner is a single static Go ' +
  'binary that scans a fleet of repositories against a configurable policy, ' +
  'scores each repo, and reports compliance — ad hoc, in CI, or continuously.'

const ogImage = 'https://baselinerhq.github.io/og-image.png'

export default defineConfig({
  title: 'baseliner',
  description,
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'dark',
  sitemap: { hostname: 'https://baselinerhq.github.io' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/baseliner-logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['meta', { name: 'theme-color', content: '#00A59C' }],
    ['meta', { name: 'author', content: 'baselinerhq' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'baseliner' }],
    ['meta', { property: 'og:title', content: 'baseliner — repository governance, as code' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:alt', content: 'baseliner' }],
    ['meta', { property: 'og:url', content: 'https://baselinerhq.github.io' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'baseliner — repository governance, as code' }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: ogImage }]
  ],
  themeConfig: {
    logo: '/baseliner-logo.svg',
    siteTitle: 'baseliner',
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: `https://github.com/${primary.repo}` }],
    search: { provider: 'local' },
    editLink: {
      pattern: `https://github.com/${primary.repo}/edit/${primary.ref}/${primary.docsDir}/:path`,
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025–present baselinerhq'
    }
  }
})
