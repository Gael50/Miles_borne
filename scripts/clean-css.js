const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacement = `/* ─── THEME OVERRIDES ─── */
/* 007 First Light */
[data-theme="first_light_007"] .page-transition {
    background: radial-gradient(circle at 50% -20%, #1e293b, #020617 70%) !important;
}
[data-theme="first_light_007"] .page-transition::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px);
}
[data-theme="first_light_007"] .cb { border-radius: 4px !important; }
[data-theme="first_light_007"] .minimap-container {
    background: linear-gradient(to bottom, rgba(15,23,42,0.9), #000) !important;
    border-top: 1px solid #b91c1c !important;
}

/* Saints Row IV */
[data-theme="saints_row_4"] {
    --f-xs: calc(11px * var(--ui-scale));
    --f-sm: calc(13px * var(--ui-scale));
    --f-md: calc(16px * var(--ui-scale));
    --f-lg: calc(20px * var(--ui-scale));
    --f-xl: calc(26px * var(--ui-scale));
    --f-xxl: calc(36px * var(--ui-scale));
    letter-spacing: 0.5px;
    line-height: 1.35;
}
[data-theme="saints_row_4"] .page-transition {
    background: radial-gradient(ellipse at 50% 50%, #2e1065, #0a0014) !important;
}
[data-theme="saints_row_4"] .page-transition::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(219, 39, 119, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(219, 39, 119, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg) scale(2);
    transform-origin: center top;
}
[data-theme="saints_row_4"] .cb {
    border-radius: 0 !important;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

/* Tomb Raider */
[data-theme="tomb_raider"] .page-transition {
    background: radial-gradient(ellipse at 50% 100%, #14532d, #021206) !important;
}
[data-theme="tomb_raider"] .page-transition::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: url('data:image/svg+xml;utf8,<svg opacity="0.05" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="%23fcd34d" stroke-width="2" fill="none"/><path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="%23fcd34d" stroke-width="1"/></svg>') repeat;
}
[data-theme="tomb_raider"] .cb { border-radius: 8px 32px 8px 32px !important; }
[data-theme="tomb_raider"] { line-height: 1.35; }

/* Big Ambitions */
[data-theme="big_ambitions"] .page-transition {
    background: radial-gradient(circle at 100% 0%, #064e3b, #02110a 60%) !important;
}
[data-theme="big_ambitions"] .page-transition::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
}
[data-theme="big_ambitions"] .cb {
    border-radius: 2px !important;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.5) !important;
}

/* Space Marine 2 */
[data-theme="space_marine_2"] { letter-spacing: 0.5px; }

/* GLOBALS FOR READABILITY AND CLIPPING */
.tooltip-box {
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    text-align: center;
    max-width: 90vw;
}
.cb { overflow: hidden; display: flex; flex-direction: column; }
.cb span { overflow: hidden; text-overflow: ellipsis; }
.menu-section-right { overflow-y: visible !important; }

/* FIX MENU SECTIONS OPACITY/BACKGROUND READABILITY */
.page-transition { overflow-y: auto !important; }
.menu-cta-main, .menu-cta-secondary { box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; }

`;

html = html.replace(/\/\* ─── THEME OVERRIDES ─── \*\/[\s\S]*?(?=\/\* ─── EXTRA DEFAULT LAYOUT & V1 THEME RULES ─── \*\/)/, replacement);
fs.writeFileSync('index.html', html);
console.log('Cleaned up CSS');
