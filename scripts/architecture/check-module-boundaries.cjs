const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const configPath = path.join(root, 'src', 'architecture', 'module-boundaries.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const toPosix = (p) => p.replace(/\\/g, '/');
const exists = (p) => fs.existsSync(path.join(root, p));

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', 'test-results'].includes(entry.name)) walk(full, out);
    } else if (/\.(js|jsx|ts|tsx|cjs|mjs)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function layerFor(file) {
  const rel = toPosix(path.relative(root, file));
  return Object.entries(config.layers).find(([, def]) => rel.startsWith(def.path + '/')) || null;
}

function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  return toPosix(path.relative(root, base));
}

function importSpecs(source) {
  const specs = [];
  const patterns = [
    /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g
  ];
  for (const re of patterns) {
    let match;
    while ((match = re.exec(source))) specs.push(match[1]);
  }
  return specs;
}

const errors = [];

for (const required of config.requiredPaths) {
  if (!exists(required)) errors.push(`Missing required architecture path: ${required}`);
}

for (const file of walk(path.join(root, 'src'))) {
  const rel = toPosix(path.relative(root, file));
  const current = layerFor(file);
  const source = fs.readFileSync(file, 'utf8');

  for (const forbidden of config.forbiddenImportPatterns) {
    if (source.includes(forbidden)) errors.push(`${rel}: forbidden import/source pattern "${forbidden}"`);
  }

  if (!current) continue;
  const [layerName, layerDef] = current;
  const allowed = new Set([layerDef.path, ...(layerDef.mayImport || [])]);

  for (const spec of importSpecs(source)) {
    const resolved = resolveImport(file, spec);
    if (!resolved || !resolved.startsWith('src/')) continue;
    const target = Object.values(config.layers).find((def) => resolved.startsWith(def.path + '/') || resolved === def.path);
    if (!target) continue;
    const targetPath = target.path;
    if (!allowed.has(targetPath)) {
      errors.push(`${rel}: ${layerName} cannot import ${targetPath} via "${spec}"`);
    }
  }
}

if (errors.length) {
  console.error('Architecture boundary check failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Architecture boundary check passed.');

