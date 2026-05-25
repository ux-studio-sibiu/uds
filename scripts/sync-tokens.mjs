/*
 * sync-tokens.mjs
 *
 * Source of truth: src/css/tokens.preview.css
 *   - Uses literal `hsl(H S% L%)` so VS Code shows color swatches.
 *   - Block selectors `.preview-light`, `.preview-dark`, `.preview-mars`.
 *
 * Target:          src/css/tokens.css
 *   - Tailwind-friendly `H S% L%` triplets consumed via `hsl(var(--token))`.
 *   - Block selectors `:root`, `.dark`, `.theme-mars`.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PREVIEW = resolve(ROOT, 'src/css/tokens.preview.css')
const TARGET = resolve(ROOT, 'src/css/tokens.css')

const BLOCK_MAP = {
  '.preview-light': ':root',
  '.preview-dark': '.dark',
  '.preview-mars': '.theme-mars',
}

function parsePreview(css) {
  const blocks = {}
  for (const [previewSel, targetSel] of Object.entries(BLOCK_MAP)) {
    const re = new RegExp(`${previewSel.replace('.', '\\.')}\\s*\\{([^}]*)\\}`, 'm')
    const m = css.match(re)
    if (!m) continue
    const tokens = {}
    for (const line of m[1].split('\n')) {
      const t = line.match(/--([\w-]+)\s*:\s*hsl\(([^)]+)\)\s*;/)
      if (t) tokens[t[1]] = t[2].trim().replace(/\s*,\s*/g, ' ').replace(/\s+/g, ' ')
    }
    blocks[targetSel] = tokens
  }
  return blocks
}

function rewriteBlock(blockBody, tokens) {
  const lines = blockBody.replace(/\r/g, '').split('\n')
  const seen = new Set()
  const out = lines.map((line) => {
    const m = line.match(/^(\s*)--([\w-]+)\s*:\s*([^;]+);(.*)$/)
    if (!m) return line
    const [, indent, name, , tail] = m
    if (!(name in tokens)) return line
    seen.add(name)
    return `${indent}--${name}: ${tokens[name]};${tail}`
  })

  const missing = Object.keys(tokens).filter((n) => !seen.has(n))
  if (missing.length) {
    const sample = out.find((l) => /^\s+--/.test(l))
    const indent = sample ? sample.match(/^(\s*)/)[1] : '    '
    let insertAt = out.length
    while (insertAt > 0 && out[insertAt - 1].trim() === '') insertAt--
    const additions = missing.map((n) => `${indent}--${n}: ${tokens[n]};`)
    out.splice(insertAt, 0, ...additions)
  }

  return out.join('\n')
}

function rewriteTarget(targetCss, blocks) {
  const usesCRLF = targetCss.includes('\r\n')
  let next = targetCss.replace(/\r\n/g, '\n')
  for (const [sel, tokens] of Object.entries(blocks)) {
    const escaped = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(${escaped}\\s*\\{)([\\s\\S]*?)(\\n\\s*\\})`, 'm')
    next = next.replace(re, (_, open, body, close) => `${open}${rewriteBlock(body, tokens)}${close}`)
  }
  return usesCRLF ? next.replace(/\n/g, '\r\n') : next
}

export function syncTokens({ quiet = false } = {}) {
  const preview = readFileSync(PREVIEW, 'utf8')
  const target = readFileSync(TARGET, 'utf8')
  const blocks = parsePreview(preview)
  const next = rewriteTarget(target, blocks)
  if (next === target) {
    if (!quiet) console.log('[sync-tokens] no changes')
    return false
  }
  writeFileSync(TARGET, next, 'utf8')
  if (!quiet) console.log('[sync-tokens] updated tokens.css')
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncTokens()
}
