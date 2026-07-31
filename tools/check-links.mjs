#!/usr/bin/env node
/**
 * Check that every relative markdown link in the repository resolves on disk.
 *
 *     node tools/check-links.mjs
 *
 * Docs point at `src/data/*.js` a lot, and those paths move. A rename that leaves a
 * dangling link is invisible on GitHub until someone clicks it, so this runs in CI
 * alongside `npm run validate`.
 *
 * External links (http, mailto) are not checked — that needs the network and turns a
 * deterministic check into a flaky one.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

/** Relative markdown links, with an optional #anchor. Absolute and external targets skipped. */
const RELATIVE_LINK = /\]\((?!https?:|mailto:|#|\/)([^)\s#]+)(#[^)\s]*)?\)/g;

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'coverage']);

function markdownFiles(dir = '.') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry).replace(/^\.\//, '');
    if (statSync(full).isDirectory()) out.push(...markdownFiles(full));
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

const broken = [];
let checked = 0;

for (const file of markdownFiles()) {
  for (const [, target] of readFileSync(file, 'utf8').matchAll(RELATIVE_LINK)) {
    checked++;
    // Notion exported some links percent-encoded; decode before resolving.
    const decoded = decodeURIComponent(target);
    if (!existsSync(join(dirname(file), decoded))) broken.push({ file, target: decoded });
  }
}

for (const { file, target } of broken) {
  console.error(`✗ ${file}: broken relative link → ${target}`);
}

if (broken.length === 0) {
  console.log(`✓ ${checked} relative link(s) resolve`);
}
process.exit(broken.length === 0 ? 0 : 1);
