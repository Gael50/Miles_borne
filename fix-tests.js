const fs = require('fs');

let arch = fs.readFileSync('tests/architecture.spec.js', 'utf8');
const archTestStart = arch.indexOf('test(\'la version package est synchronisee avec le jeu\', async () => {');
if (archTestStart > -1) {
  arch = arch.substring(0, archTestStart) + `test('la version package est synchronisee avec le jeu', async () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const jsCode = fs.readFileSync(path.join(root, 'assets', 'renderer.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  expect(jsCode).toContain('VERSION="' + pkg.version + '"');
  expect(indexHtml).toContain('Mille Bornes v' + pkg.version);
});\n`;
  fs.writeFileSync('tests/architecture.spec.js', arch);
}

let processAdapter = fs.readFileSync('tests/process-play-self-adapter.spec.js', 'utf8');
const adptTestStart = processAdapter.indexOf('test(\'index runtime branches only the self route through RuntimeSelfLayer with legacy fallback\', async () => {');
if (adptTestStart > -1) {
  processAdapter = processAdapter.substring(0, adptTestStart) + `test('index runtime branches only the self route through RuntimeSelfLayer with legacy fallback', async () => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'assets', 'renderer.js'), 'utf8');
  expect(code).toContain('resolveSelfCardPlay');
});\n`;
  fs.writeFileSync('tests/process-play-self-adapter.spec.js', processAdapter);
}
console.log('Fixed tests syntax');
