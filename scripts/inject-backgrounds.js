const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const backgroundInject = `/* ─── THEMATIC IN-GAME OVERRIDES ─── */

/* -- BACKGROUND IN-GAME THEMES -- */
[data-theme="first_light_007"] .layout-main {
    background: radial-gradient(circle at 50% 10%, #0f172a, #020617 80%) !important;
}
[data-theme="first_light_007"] .layout-main::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.01) 10px, rgba(255,255,255,0.01) 11px);
    pointer-events: none;
    z-index: 0;
}

[data-theme="saints_row_4"] .layout-main {
    background: radial-gradient(ellipse at 50% 50%, #1c0036, #0a0014) !important;
}
[data-theme="saints_row_4"] .layout-main::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(219, 39, 119, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(219, 39, 119, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    transform: perspective(500px) rotateX(60deg) scale(2);
    transform-origin: center top;
    z-index: 0;
}

[data-theme="tomb_raider"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, #0a2e13, #021206) !important;
}
[data-theme="tomb_raider"] .layout-main::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml;utf8,<svg opacity="0.02" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="%23fcd34d" stroke-width="2" fill="none"/><path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="%23fcd34d" stroke-width="1"/></svg>') repeat;
    pointer-events: none;
    z-index: 0;
}

[data-theme="big_ambitions"] .layout-main {
    background: radial-gradient(circle at 100% 0%, #062b16, #02110a 60%) !important;
}
[data-theme="big_ambitions"] .layout-main::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
}

[data-theme="space_marine_2"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, #1a0505, #050505) !important;
}
[data-theme="space_marine_2"] .layout-main::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(90deg, rgba(185,28,28,0.02), rgba(185,28,28,0.02) 20px, transparent 20px, transparent 40px);
    pointer-events: none;
    z-index: 0;
}
`;

html = html.replace('/* ─── THEMATIC IN-GAME OVERRIDES ─── */', backgroundInject);
fs.writeFileSync('index.html', html);
console.log('Added backgrounds for in-game');
