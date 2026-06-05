const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const POLISH_CSS = `
/* ULTIMATE MICRO-POLISH */
.cb:hover {
    transform: translateY(calc(-4px * var(--ui-scale))) scale(1.02);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    z-index: 10;
}
.v2-player-card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.menu-cta-main:hover {
    filter: brightness(1.15);
    transform: scale(1.01);
}
.menu-cta-secondary:hover {
    background: rgba(255,255,255,0.05) !important;
}
`;

html = html.replace('/* GLOBAL READABILITY & CLIPPING FIXES */', POLISH_CSS + '\n/* GLOBAL READABILITY & CLIPPING FIXES */');
fs.writeFileSync('index.html', html);
console.log('Applied micro-polish');
