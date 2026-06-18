#!/usr/bin/env node
/**
 * render-brand.mjs — regenerate every raster brand asset from the single SVG
 * source of truth (brand/baseliner-logo.svg), so the derivatives can never
 * drift from the vector. Run `npm run brand` after editing the logo.
 *
 * The SVG is canonical for the nav logo, hero, and SVG favicon. The rasters
 * below exist only because some surfaces can't consume SVG: social scrapers
 * (og:image) and legacy browsers (/favicon.ico, PNG fallback).
 *
 * To add a variant, append a row to `targets` — no new code:
 *   { out, size }            -> a square, transparent PNG
 *   { out, ico: [..sizes] }  -> a multi-size .ico
 *   { out, w, h, logo, bg }  -> the logo centered on a solid w×h canvas
 * Any row may set `fg` to recolor the mark (defaults to the brand teal).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'brand/baseliner-logo.svg')
const TEAL = '#00A59C' // the one brand color baked into the source SVG

const targets = [
  { out: 'docs/public/favicon.png', size: 64 }, // PNG fallback for older browsers
  { out: 'docs/public/favicon.ico', ico: [16, 32, 48] }, // legacy /favicon.ico
  { out: 'docs/public/og-image.png', w: 1200, h: 630, logo: 520, bg: '#0e0e0e' } // social card
]

const baseSvg = readFileSync(SRC, 'utf8')

/** The source SVG as a buffer, optionally recolored to `fg`. */
function svgBuf(fg) {
  return Buffer.from(fg && fg !== TEAL ? baseSvg.replaceAll(TEAL, fg) : baseSvg)
}

/** Render the square logo to a transparent PNG buffer at `size`px. */
function renderLogo(size, fg) {
  return sharp(svgBuf(fg), { density: 384 }).resize(size, size).png().toBuffer()
}

for (const t of targets) {
  const out = path.join(ROOT, t.out)
  if (t.ico) {
    writeFileSync(out, await pngToIco(await Promise.all(t.ico.map((s) => renderLogo(s, t.fg)))))
  } else if (t.bg) {
    const logo = await renderLogo(t.logo, t.fg)
    const png = await sharp({ create: { width: t.w, height: t.h, channels: 4, background: t.bg } })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toBuffer()
    writeFileSync(out, png)
  } else {
    writeFileSync(out, await renderLogo(t.size, t.fg))
  }
  console.log(`  + ${t.out}`)
}
console.log(`render-brand: ${targets.length} asset(s) from ${path.relative(ROOT, SRC)}`)
