#!/usr/bin/env node
/**
 * sync-docs.mjs — pull docs for every source declared in docs.sources.json into
 * this VitePress site, so the website is a single source of truth (each repo's
 * docs/, not a hand-copied snapshot).
 *
 * To add a project: add an entry to docs.sources.json. No changes here, in the
 * VitePress config, or in the deploy workflow are needed.
 *
 * Each source is resolved from its local `dev` checkout when present (fast local
 * iteration), otherwise shallow-cloned from GitHub at build time.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const DEST = path.join(ROOT, 'docs')
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs.sources.json'), 'utf8'))

/** Resolve a source's docs directory: local dev checkout, else shallow clone. */
function resolveSource(src) {
  if (src.dev) {
    const dev = path.resolve(ROOT, src.dev)
    if (fs.existsSync(dev)) {
      console.log(`  ${src.name}: using local checkout ${dev}`)
      return dev
    }
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `docs-${src.name}-`))
  console.log(`  ${src.name}: cloning ${src.repo}@${src.ref}`)
  execFileSync('git', ['clone', '--depth', '1', '--branch', src.ref,
    `https://github.com/${src.repo}.git`, tmp], { stdio: 'ignore' })
  return path.join(tmp, src.docsDir)
}

// Imported docs are technical references and must not carry emoji (they tofu on
// platforms without a color-emoji font, e.g. bare Linux). Strip any emoji during
// sync so the site stays clean regardless of upstream, and warn with the page +
// line so the upstream repo can be cleaned up. Brand iconography lives only in
// this repo (the home page's Lucide SVGs), never in synced content.
//
// Match true emoji pictographs via the Unicode Extended_Pictographic property
// (plus flag pairs, ZWJ, variation selector, keycap), minus the text-symbols
// ©®™. This deliberately excludes arrows (→ ⇒), plain checkmarks (✓ ✗) and
// other technical punctuation, which render everywhere and belong in the docs.
const EMOJI_RE =
  /[[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]--[\u{A9}\u{AE}\u{2122}]]\u{FE0F}?|[\u{200D}\u{20E3}\u{FE0F}]/gv

/** Remove emoji from a page's body; return the cleaned text and warn per line. */
function stripEmoji(body, label) {
  if (!EMOJI_RE.test(body)) return body
  body.split('\n').forEach((line, i) => {
    EMOJI_RE.lastIndex = 0
    if (EMOJI_RE.test(line))
      console.warn(`  ! ${label}:${i + 1} stripped emoji (no emoji in imported docs): ${line.trim()}`)
  })
  return body.replace(EMOJI_RE, '').replace(/[ \t]+$/gm, '')
}

/** Rewrite an upstream markdown link to something valid on the site. */
function rewriteLink(target, src, base, pageMap) {
  if (/^(https?:|#|mailto:)/.test(target)) return target
  const hash = target.includes('#') ? target.slice(target.indexOf('#')) : ''
  const tpath = hash ? target.slice(0, target.indexOf('#')) : target
  if (!tpath) return target

  // 1) resolves to a synced page in this source -> the site path
  const fromDocs = path.posix.normalize(tpath)
  if (pageMap.has(fromDocs)) return pageMap.get(fromDocs) + hash

  // 2) otherwise point at the upstream repo (file -> blob, dir -> tree)
  const repoRel = path.posix.normalize(path.posix.join(src.docsDir, tpath))
  if (repoRel.startsWith('..')) return target // can't resolve; leave as-is
  const kind = tpath.endsWith('/') ? 'tree' : 'blob'
  return `https://github.com/${src.repo}/${kind}/${src.ref}/${repoRel.replace(/\/$/, '')}${hash}`
}

let total = 0
for (const src of manifest.sources) {
  const isPrimary = src.name === manifest.primary
  const base = isPrimary ? '' : `/${src.name}`
  const dir = resolveSource(src)

  // src filename -> the page's site path (for link rewriting)
  const pageMap = new Map(src.pages.map((p) => [p.src, `${base || ''}/${p.out}`]))

  for (const page of src.pages) {
    const from = path.join(dir, page.src)
    if (!fs.existsSync(from)) {
      console.error(`error: ${src.name}: missing ${page.src} in ${dir}`)
      process.exit(1)
    }
    let body = fs.readFileSync(from, 'utf8')
    body = stripEmoji(body, `${src.name}/${page.src}`)
    body = body.replace(/\]\(([^)]+)\)/g, (m, t) => `](${rewriteLink(t, src, base, pageMap)})`)

    // The global editLink pattern only fits the primary repo's same-named pages;
    // disable it where it would 404 (renamed pages, or non-primary sources).
    const renamed = path.basename(page.src, '.md') !== page.out
    if (!isPrimary || renamed) {
      body = `---\neditLink: false\n---\n\n` + body
    }

    const out = path.join(DEST, base, `${page.out}.md`)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, body)
    console.log(`  + ${src.name}/${page.src} -> docs${base}/${page.out}.md`)
    total++
  }
}
console.log(`sync-docs: ${total} page(s) from ${manifest.sources.length} source(s)`)
