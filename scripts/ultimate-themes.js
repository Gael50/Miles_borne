const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /\/\* ─── VRAIS ARRIÈRE-PLANS IN-GAME ET AMPLIFICATION ─── \*\/[\s\S]*?(?=<\/style>)/;

const ULTIMATE_CSS = `/* ─── VRAIS ARRIÈRE-PLANS IN-GAME ET AMPLIFICATION ─── */
/* 007 First Light: Espionnage & Luxe */
[data-theme="first_light_007"] #app-scaler, [data-theme="first_light_007"] .layout-main {
    background: radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%) !important;
}
[data-theme="first_light_007"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
        radial-gradient(circle at 50% 50%, transparent 60%, rgba(185, 28, 28, 0.05) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px),
        repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
}
[data-theme="first_light_007"] .v2-player-card, [data-theme="first_light_007"] .history-zone, [data-theme="first_light_007"] .cb, [data-theme="first_light_007"] .tooltip-box, [data-theme="first_light_007"] .minimap-container {
    background: linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.95)) !important;
    border: 1px solid rgba(185, 28, 28, 0.5) !important;
    border-radius: 2px !important;
    box-shadow: 0 0 15px rgba(185, 28, 28, 0.1), inset 0 0 20px rgba(0,0,0,0.8) !important;
    backdrop-filter: blur(12px) !important;
}
[data-theme="first_light_007"] .v2-piles {
    border: 1px solid #b91c1c !important;
    background: rgba(2,6,23,0.9) !important;
    box-shadow: 0 0 20px rgba(185, 28, 28, 0.2) !important;
}
[data-theme="first_light_007"] .v2-progress-arc svg path { stroke: #b91c1c !important; }
[data-theme="first_light_007"] .minimap-lines { border-top: 1px dashed #b91c1c !important; }
[data-theme="first_light_007"] .top-bar-title span { color: #f87171 !important; text-shadow: 0 0 8px #b91c1c !important; letter-spacing: 4px !important; }

/* Saints Row 4: Glitch & Simulation */
[data-theme="saints_row_4"] #app-scaler, [data-theme="saints_row_4"] .layout-main {
    background: radial-gradient(ellipse at 50% 50%, #1c0036 0%, #05000a 100%) !important;
}
[data-theme="saints_row_4"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
        linear-gradient(rgba(219, 39, 119, 0.1) 2px, transparent 2px),
        linear-gradient(90deg, rgba(219, 39, 119, 0.1) 2px, transparent 2px);
    background-size: 50px 50px;
    transform: perspective(600px) rotateX(70deg) translateY(-100px) scale(3);
    transform-origin: center top;
}
[data-theme="saints_row_4"] .v2-player-card, [data-theme="saints_row_4"] .history-zone, [data-theme="saints_row_4"] .cb, [data-theme="saints_row_4"] .tooltip-box, [data-theme="saints_row_4"] .minimap-container {
    background: rgba(15, 0, 30, 0.9) !important;
    border: 2px solid #db2777 !important;
    border-radius: 0 !important;
    clip-path: polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%) !important;
    box-shadow: 0 0 10px #db2777, inset 0 0 15px #9333ea !important;
}
[data-theme="saints_row_4"] .v2-piles {
    border: 3px solid #c084fc !important;
    background: rgba(20,0,40,0.9) !important;
    box-shadow: 0 0 25px rgba(219, 39, 119, 0.5) !important;
    border-radius: 0 !important;
}
[data-theme="saints_row_4"] .top-bar-title span { color: #c084fc !important; text-shadow: 2px 2px 0px #db2777, -2px -2px 0px #0ea5e9 !important; font-style: italic; }

/* Tomb Raider: Jungle & Reliques */
[data-theme="tomb_raider"] #app-scaler, [data-theme="tomb_raider"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, #0a2e13 0%, #020a04 100%) !important;
}
[data-theme="tomb_raider"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: url('data:image/svg+xml;utf8,<svg opacity="0.04" xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M 60 10 L 110 60 L 60 110 L 10 60 Z" stroke="%23fcd34d" stroke-width="2" fill="none"/><circle cx="60" cy="60" r="30" stroke="%23fcd34d" stroke-width="1" fill="none"/></svg>') repeat;
}
[data-theme="tomb_raider"] .v2-player-card, [data-theme="tomb_raider"] .history-zone, [data-theme="tomb_raider"] .cb, [data-theme="tomb_raider"] .tooltip-box, [data-theme="tomb_raider"] .minimap-container {
    background: radial-gradient(circle at center, rgba(30,45,30,0.9), rgba(10,20,10,0.95)) !important;
    border: 2px solid #b45309 !important;
    border-radius: 12px 36px 12px 36px !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.9), inset 0 0 15px rgba(180,83,9,0.2) !important;
}
[data-theme="tomb_raider"] .v2-piles {
    border: 2px solid #fcd34d !important;
    border-radius: 16px 48px 16px 48px !important;
    background: rgba(20,35,20,0.95) !important;
    box-shadow: 0 15px 30px rgba(0,0,0,0.9) !important;
}
[data-theme="tomb_raider"] .top-bar-title span { color: #fcd34d !important; text-shadow: 1px 1px 4px #000, 0 0 15px #b45309 !important; }

/* Big Ambitions: Business & Finance */
[data-theme="big_ambitions"] #app-scaler, [data-theme="big_ambitions"] .layout-main {
    background: radial-gradient(circle at 100% 0%, #064e3b 0%, #02110a 100%) !important;
}
[data-theme="big_ambitions"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
}
[data-theme="big_ambitions"] .v2-player-card, [data-theme="big_ambitions"] .history-zone, [data-theme="big_ambitions"] .cb, [data-theme="big_ambitions"] .tooltip-box, [data-theme="big_ambitions"] .minimap-container {
    background: rgba(2, 20, 10, 0.95) !important;
    border: 1px solid #16a34a !important;
    border-top: 4px solid #eab308 !important;
    border-radius: 0 !important;
    box-shadow: 8px 8px 0 rgba(0,0,0,0.7) !important;
}
[data-theme="big_ambitions"] .v2-piles {
    border: 1px solid #16a34a !important;
    border-top: 4px solid #16a34a !important;
    background: #02110a !important;
    box-shadow: 10px 10px 0 rgba(0,0,0,0.8) !important;
    border-radius: 0 !important;
}
[data-theme="big_ambitions"] .top-bar-title span { color: #fef08a !important; text-shadow: none !important; font-weight: 900 !important; letter-spacing: 2px !important; }

/* Space Marine 2: Blindage Gothique */
[data-theme="space_marine_2"] #app-scaler, [data-theme="space_marine_2"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, #1f0505 0%, #050505 100%) !important;
}
[data-theme="space_marine_2"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: 
        repeating-linear-gradient(45deg, rgba(185,28,28,0.03) 0px, rgba(185,28,28,0.03) 20px, transparent 20px, transparent 40px),
        repeating-linear-gradient(-45deg, rgba(202,138,4,0.02) 0px, rgba(202,138,4,0.02) 20px, transparent 20px, transparent 40px);
}
[data-theme="space_marine_2"] .v2-player-card, [data-theme="space_marine_2"] .history-zone, [data-theme="space_marine_2"] .cb, [data-theme="space_marine_2"] .tooltip-box, [data-theme="space_marine_2"] .minimap-container {
    background: linear-gradient(180deg, #262626 0%, #0f0f0f 100%) !important;
    border: 2px solid #333 !important;
    border-left: 6px solid #b91c1c !important;
    border-right: 6px solid #ca8a04 !important;
    border-radius: 4px !important;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.9), 0 5px 15px rgba(0,0,0,0.8) !important;
}
[data-theme="space_marine_2"] .v2-piles {
    border: 4px solid #333 !important;
    border-bottom: 6px solid #b91c1c !important;
    background: #111 !important;
    border-radius: 4px !important;
    box-shadow: 0 10px 20px rgba(0,0,0,0.9) !important;
}
[data-theme="space_marine_2"] .top-bar-title span { color: #facc15 !important; text-shadow: 0 0 15px #b91c1c !important; text-transform: uppercase !important; }
\n`;

if (regex.test(html)) {
    html = html.replace(regex, ULTIMATE_CSS);
    fs.writeFileSync('index.html', html);
    console.log('Replaced block successfully.');
} else {
    console.error('Regex match failed.');
}
