const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  /<div style=\{\{flex:'1 1 520px',minWidth:0,overflowY:"auto",overflowX:'hidden'/g,
  '<div style={{flex:\\'1 1 520px\\',minWidth:0,overflowY:"visible",overflowX:\\'hidden\\''
);

fs.writeFileSync('index.html', html);
console.log('Fixed menu right overflow');
