const fs = require('fs');
let content = fs.readFileSync('src/renderer.jsx', 'utf8');

const startMarker = '// --- DATA & CONSTANTS ---';
const endMarker = '// ─── UI COMPONENTS ─────────────────────────────────────────────';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx > -1 && endIdx > -1) {
  const extracted = content.substring(startIdx, endIdx);
  const remaining = content.substring(0, startIdx) + content.substring(endIdx);
  
  // We need to export everything from extracted, but there are multiple consts and functions.
  // We can just append `export ` to all top-level `const ` and `function ` declarations.
  let exportedContent = extracted.replace(/^const ([A-Z_]+)/gm, 'export const $1');
  exportedContent = exportedContent.replace(/^function ([a-zA-Z0-9_]+)/gm, 'export function $1');
  
  // Also we need to import these into renderer.jsx
  // We can just import everything: `import * as GameData from './core/game/constants.js';`
  // Actually, wait, the easiest is to just destructure the exact things used. Or keep it simple: export const X ... and import { X, Y } ...
  // Since there are many, we can use a script to extract all exported names.
  
  const exportMatches = [...exportedContent.matchAll(/export (const|function) ([a-zA-Z0-9_]+)/g)];
  const exportedNames = exportMatches.map(m => m[2]);
  
  const importStatement = `import {\n  ${exportedNames.join(',\n  ')}\n} from './core/game/constants.js';\n\n`;
  
  const newRenderer = importStatement + remaining;
  
  fs.mkdirSync('src/core/game', { recursive: true });
  fs.writeFileSync('src/core/game/constants.js', exportedContent);
  fs.writeFileSync('src/renderer.jsx', newRenderer);
  console.log('Success. Exported names:', exportedNames.length);
} else {
  console.error('Markers not found');
}
