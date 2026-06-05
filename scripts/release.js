#!/usr/bin/env node
/**
 * Release automatique — incrémente la version patch (+0.0.1) et build le .exe portable.
 * Usage : node scripts/release.js
 *         node scripts/release.js --dry-run   (version bump seulement, pas de build)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
}

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}

// ── 1. Version bump ────────────────────────────────────────────────────────
const versionBefore = readVersion();
run('node scripts/bump-version.js');
const versionAfter = readVersion();
console.log(`\nVersion : ${versionBefore} → ${versionAfter}`);

if (DRY) {
  console.log('\n[--dry-run] Version mise à jour. Build ignoré.');
  process.exit(0);
}

// ── 2. Build renderer (minifié) ────────────────────────────────────────────
run('esbuild src/renderer.jsx --bundle --minify --outfile=assets/renderer.js');

// ── 3. Electron-builder ────────────────────────────────────────────────────
run('electron-builder --win');

// ── 4. Confirmation ────────────────────────────────────────────────────────
const distDir = path.join(ROOT, 'dist');
if (fs.existsSync(distDir)) {
  const exes = fs.readdirSync(distDir).filter(f => f.endsWith('.exe'));
  if (exes.length > 0) {
    console.log(`\n✓ Build terminé — v${versionAfter}`);
    exes.forEach(f => console.log(`  dist/${f}`));
  } else {
    console.warn('\n⚠ Build terminé mais aucun .exe trouvé dans dist/');
  }
} else {
  console.warn('\n⚠ Dossier dist/ introuvable après le build.');
}
