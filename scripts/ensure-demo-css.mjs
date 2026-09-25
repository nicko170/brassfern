#!/usr/bin/env node
/**
 * Safety net for in-flight demos: demo builders write index.tsx first and
 * demo.css last, so a build landing mid-write fails on the missing CSS.
 * This creates a loud, minimal stub ONLY where demo.css is absent — real
 * demo.css files are never touched; builders' own writes simply overwrite
 * the stub. Runs as part of `prebuild` (and `predev`).
 */
import fs from 'node:fs'
import path from 'node:path'

const DEMOS = path.join(process.cwd(), 'src/demos')
if (!fs.existsSync(DEMOS)) process.exit(0)

const STUB = `/* TEMPORARY BUILD STUB — created by scripts/ensure-demo-css.mjs.
   The demo builder for this folder has not written the real demo.css yet;
   their next save overwrites this file. Scoped styles go here. */
`

for (const entry of fs.readdirSync(DEMOS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const dir = path.join(DEMOS, entry.name)
  const hasEntry = fs.existsSync(path.join(dir, 'index.tsx'))
  const cssPath = path.join(dir, 'demo.css')
  if (hasEntry && !fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, STUB)
    console.warn(`  ⚠ stubbed missing ${path.relative(process.cwd(), cssPath)} — awaiting the demo builder's real CSS`)
  }
}
