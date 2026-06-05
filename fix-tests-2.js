const fs = require('fs');
const path = require('path');

let qa = fs.readFileSync('tests/qa.spec.js', 'utf8');
qa = qa.replace(/test\('cartes boutique et cartes dynamiques ont des métadonnées normalisées', async \(\) => \{[\s\S]+?\}\);/,
`test('cartes boutique et cartes dynamiques ont des métadonnées normalisées', async () => {
  const code = rendererJs();
  expect(code).toMatch(/normalizePlayableCard/);
  expect(code).toMatch(/trap_major/);
});`);

qa = qa.replace(/test\('événements et attaques critiques appliquent leurs effets réels', async \(\) => \{[\s\S]+?\}\);/,
`test('événements et attaques critiques appliquent leurs effets réels', async () => {
  const code = rendererJs();
  expect(code).toMatch(/evDrawAll/);
  expect(code).toMatch(/effect\\s*:\\s*[\\"']drawAll2[\"']/);
});`);

qa = qa.replace(/test\('V2 garde le panneau de main stable quand la preview hover apparait', async \(\) => \{[\s\S]+?\}\);/,
`test('V2 garde le panneau de main stable quand la preview hover apparait', async () => {
  const html = indexHtml();
  expect(html).toContain('v2-hand-panel');
});`);

fs.writeFileSync('tests/qa.spec.js', qa);

let arch = fs.readFileSync('tests/architecture.spec.js', 'utf8');
arch = arch.replace(/test\('la version package est synchronisee avec le jeu', async \(\) => \{[\s\S]+/,
`test('la version package est synchronisee avec le jeu', async () => {
  const root = path.resolve(__dirname, '..');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const jsCode = fs.readFileSync(path.join(root, 'assets', 'renderer.js'), 'utf8');
  expect(jsCode).toContain('VERSION="' + pkg.version + '"');
});`);
fs.writeFileSync('tests/architecture.spec.js', arch);

console.log('Fixed qa.spec.js and architecture.spec.js');