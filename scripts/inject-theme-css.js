const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const CSS_INJECT = `
/* ─── THEME OVERRIDES ─── */
/* 007 First Light */
[data-theme="first_light_007"] .page-transition {
    background: radial-gradient(circle at 50% -20%, #1e293b, #020617 70%) !important;
}
[data-theme="first_light_007"] .page-transition::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px);
    pointer-events: none;
}
[data-theme="first_light_007"] .cb {
    border-radius: 4px !important;
}
[data-theme="first_light_007"] .minimap-container {
    background: linear-gradient(to bottom, rgba(15,23,42,0.9), #000) !important;
    border-top: 1px solid #b91c1c !important;
}

/* Saints Row IV */
[data-theme="saints_row_4"] {
    --f-xs: calc(16px * var(--ui-scale));
    --f-sm: calc(18px * var(--ui-scale));
    --f-md: calc(21px * var(--ui-scale));
    --f-lg: calc(26px * var(--ui-scale));
    --f-xl: calc(34px * var(--ui-scale));
    --f-xxl: calc(44px * var(--ui-scale));
}
[data-theme="saints_row_4"] .page-transition {
    background: radial-gradient(ellipse at 50% 50%, #2e1065, #0a0014) !important;
}
[data-theme="saints_row_4"] .page-transition::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(219, 39, 119, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(219, 39, 119, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    transform: perspective(500px) rotateX(60deg) scale(2);
    transform-origin: center top;
}
[data-theme="saints_row_4"] .cb {
    border-radius: 0 !important;
    clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
}

/* Tomb Raider */
[data-theme="tomb_raider"] .page-transition {
    background: radial-gradient(ellipse at 50% 100%, #14532d, #021206) !important;
}
[data-theme="tomb_raider"] .page-transition::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml;utf8,<svg opacity="0.05" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="%23fcd34d" stroke-width="2" fill="none"/><path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="%23fcd34d" stroke-width="1"/></svg>') repeat;
    pointer-events: none;
}
[data-theme="tomb_raider"] .cb {
    border-radius: 8px 32px 8px 32px !important;
}

/* Big Ambitions */
[data-theme="big_ambitions"] .page-transition {
    background: radial-gradient(circle at 100% 0%, #064e3b, #02110a 60%) !important;
}
[data-theme="big_ambitions"] .page-transition::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
}
[data-theme="big_ambitions"] .cb {
    border-radius: 2px !important;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.5) !important;
}
`;

html = html.replace('</style>', CSS_INJECT + '\n</style>');
fs.writeFileSync('index.html', html);
console.log('Modifications written to index.html');
