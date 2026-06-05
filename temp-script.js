const fs = require('fs');
let content = fs.readFileSync('src/renderer.jsx', 'utf8');

const loggerStart = content.indexOf('// --- OBSERVABILITY & LOGGING ---');
const loggerEnd = content.indexOf('Logger.perf(\'Init\', \'Global React Init\', () => {') + 50;

if (loggerStart > -1 && loggerEnd > -1) {
  content = content.substring(0, loggerStart) + 'Logger.perf(\'Init\', \'Global React Init\', () => {\n' + content.substring(loggerEnd);
}

const audioStart = content.indexOf('// --- AUDIO SYSTEM ---');
const audioEnd = content.indexOf('})();', audioStart) + 5;

if (audioStart > -1 && audioEnd > -1) {
  content = content.substring(0, audioStart) + content.substring(audioEnd);
}

content = `import { Logger } from './shared/utils/logger.js';\nimport { AudioSys } from './features/audio/AudioSys.js';\n\n` + content;

fs.writeFileSync('src/renderer.jsx', content);
console.log('Success');
