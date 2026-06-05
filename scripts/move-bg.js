const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/\[data-theme="([^"]+)"\] \.layout-main/g, '[data-theme="$1"] #app-scaler');

fs.writeFileSync('index.html', html);
console.log('Moved backgrounds to #app-scaler');
