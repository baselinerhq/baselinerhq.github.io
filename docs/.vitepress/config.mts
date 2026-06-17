import { defineConfig } from 'vitepress'

const description =
  'Renovate, but for repository governance. baseliner is a single static Go ' +
  'binary that scans a fleet of repositories against a configurable policy, ' +
  'scores each repo, and reports compliance — ad hoc, in CI, or continuously.'

const ogImage = 'https://baselinerhq.github.io/baseliner-logo.png'

export default defineConfig({
  title: 'baseliner',
  description,
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'dark',
  sitemap: {
    hostname: 'https://baselinerhq.github.io'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
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
    logo: '/baseliner-logo.png',
    siteTitle: 'baseliner',
    nav: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Install', link: '/install' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'CLI Reference', link: '/cli' },
          { text: 'Policies', link: '/policies' },
          { text: 'Control Repo', link: '/control-repo' }
        ]
      },
      { text: 'Roadmap', link: '/roadmap' },
      {
        text: 'v0.1.1',
        items: [
          { text: 'Releases', link: 'https://github.com/baselinerhq/baseliner/releases' },
          { text: 'Changelog', link: 'https://github.com/baselinerhq/baseliner/releases/latest' },
          { text: 'Go Reference', link: 'https://pkg.go.dev/github.com/baselinerhq/baseliner' }
        ]
      }
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Install', link: '/install' },
            { text: 'Configuration', link: '/configuration' },
            { text: 'CLI Reference', link: '/cli' },
            { text: 'Policies', link: '/policies' },
            { text: 'Control Repo', link: '/control-repo' }
          ]
        },
        {
          text: 'Project',
          collapsed: false,
          items: [{ text: 'Roadmap', link: '/roadmap' }]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baselinerhq/baseliner' }
    ],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/baselinerhq/baseliner/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025–present baselinerhq'
    }
  }
})
