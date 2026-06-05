const fs = require('fs');

function bumpVersion() {
  const pkgPath = 'package.json';
  const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const oldVersion = pkgData.version;
  const parts = oldVersion.split('.');
  parts[2] = parseInt(parts[2], 10) + 1;
  const newVersion = parts.join('.');
  
  pkgData.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2) + '\n');
  console.log(`Bumped package.json from ${oldVersion} to ${newVersion}`);

  const htmlPath = 'index.html';
  let htmlData = fs.readFileSync(htmlPath, 'utf8');
  htmlData = htmlData.replace(/<title>Mille Bornes v[^<]+<\/title>/g, `<title>Mille Bornes v${newVersion} - Édition Bagley</title>`);
  htmlData = htmlData.replace(/const VERSION\s*=\s*"[^"]+";/g, `const VERSION="${newVersion}";`);
  fs.writeFileSync(htmlPath, htmlData);
  console.log(`Bumped index.html to ${newVersion}`);
}

bumpVersion();
