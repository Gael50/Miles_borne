const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /\/\* ─── VRAIS ARRIÈRE-PLANS IN-GAME ET AMPLIFICATION ─── \*\/[\s\S]*?(?=<\/style>)/;

const CSS_EXT = `/* ─── VRAIS ARRIÈRE-PLANS IN-GAME ET AMPLIFICATION ─── */
/* ==========================================================================
   THEME 1: SPACE MARINE 2 (Gothic, Industrial, Brutal, Imperial)
   ========================================================================== */
[data-theme="space_marine_2"] #app-scaler, [data-theme="space_marine_2"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, #260505 0%, #050505 100%) !important;
}
[data-theme="space_marine_2"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: 
        repeating-linear-gradient(45deg, rgba(185,28,28,0.04) 0px, rgba(185,28,28,0.04) 40px, transparent 40px, transparent 80px),
        repeating-linear-gradient(-45deg, rgba(202,138,4,0.02) 0px, rgba(202,138,4,0.02) 40px, transparent 40px, transparent 80px);
    opacity: 0.8;
}
[data-theme="space_marine_2"] .v2-player-card, [data-theme="space_marine_2"] .history-zone, [data-theme="space_marine_2"] .cb, [data-theme="space_marine_2"] .tooltip-box, [data-theme="space_marine_2"] .minimap-container, [data-theme="space_marine_2"] .layout-left > div, [data-theme="space_marine_2"] .layout-feed {
    background: linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%) !important;
    border: 2px solid #3f3f46 !important;
    border-top: 4px solid #3f3f46 !important;
    border-bottom: 4px solid #18181b !important;
    border-left: 6px solid #b91c1c !important;
    border-right: 6px solid #ca8a04 !important;
    border-radius: 2px !important;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.9), 0 8px 16px rgba(0,0,0,0.9) !important;
}
[data-theme="space_marine_2"] .v2-piles {
    border: 4px solid #3f3f46 !important;
    border-bottom: 6px solid #b91c1c !important;
    background: radial-gradient(circle at center, #1f1f1f, #050505) !important;
    border-radius: 2px !important;
    box-shadow: 0 10px 25px rgba(185,28,28,0.2) !important;
}
[data-theme="space_marine_2"] .top-bar-title span { color: #facc15 !important; text-shadow: 0 0 15px #b91c1c !important; text-transform: uppercase !important; letter-spacing: 3px !important; }
[data-theme="space_marine_2"] .v2-progress-arc svg path { stroke: #ca8a04 !important; filter: drop-shadow(0 0 5px #b91c1c); }

/* ==========================================================================
   THEME 2: 007 FIRST LIGHT (MI6, Tech Luxury, Spy)
   ========================================================================== */
[data-theme="first_light_007"] #app-scaler, [data-theme="first_light_007"] .layout-main {
    background: radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%) !important;
}
[data-theme="first_light_007"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
        radial-gradient(circle at 50% 50%, transparent 50%, rgba(185, 28, 28, 0.05) 100%),
        repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.01) 0, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 50px);
}
[data-theme="first_light_007"] .v2-player-card, [data-theme="first_light_007"] .history-zone, [data-theme="first_light_007"] .cb, [data-theme="first_light_007"] .tooltip-box, [data-theme="first_light_007"] .minimap-container, [data-theme="first_light_007"] .layout-left > div, [data-theme="first_light_007"] .layout-feed {
    background: linear-gradient(135deg, rgba(30,41,59,0.7), rgba(2,6,23,0.95)) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-top: 1px solid rgba(255,255,255,0.25) !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1) !important;
    backdrop-filter: blur(16px) !important;
}
[data-theme="first_light_007"] .v2-piles {
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-bottom: 2px solid #b91c1c !important;
    background: rgba(2,6,23,0.95) !important;
    border-radius: 8px !important;
    backdrop-filter: blur(16px) !important;
}
[data-theme="first_light_007"] .top-bar-title span { color: #f87171 !important; text-shadow: 0 0 10px #b91c1c !important; font-weight: 300 !important; letter-spacing: 6px !important; }
[data-theme="first_light_007"] .v2-progress-arc svg path { stroke: #94a3b8 !important; }

/* ==========================================================================
   THEME 3: SAINTS ROW 4 (Simulation, Glitch, Neon, Absurd)
   ========================================================================== */
[data-theme="saints_row_4"] #app-scaler, [data-theme="saints_row_4"] .layout-main {
    background: radial-gradient(ellipse at 50% 50%, #1c0036 0%, #05000a 100%) !important;
}
[data-theme="saints_row_4"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
        linear-gradient(rgba(219, 39, 119, 0.15) 2px, transparent 2px),
        linear-gradient(90deg, rgba(219, 39, 119, 0.15) 2px, transparent 2px);
    background-size: 60px 60px;
    transform: perspective(800px) rotateX(75deg) translateY(-150px) scale(3.5);
    transform-origin: center top;
}
[data-theme="saints_row_4"] .v2-player-card, [data-theme="saints_row_4"] .history-zone, [data-theme="saints_row_4"] .cb, [data-theme="saints_row_4"] .tooltip-box, [data-theme="saints_row_4"] .minimap-container, [data-theme="saints_row_4"] .layout-left > div, [data-theme="saints_row_4"] .layout-feed {
    background: rgba(15, 0, 30, 0.95) !important;
    border: 2px solid #db2777 !important;
    border-radius: 0 !important;
    clip-path: polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%) !important;
    box-shadow: 0 0 15px rgba(219, 39, 119, 0.4), inset 0 0 20px rgba(147, 51, 234, 0.5) !important;
}
[data-theme="saints_row_4"] .v2-piles {
    border: 3px solid #c084fc !important;
    background: rgba(20,0,40,0.95) !important;
    box-shadow: 0 0 30px rgba(219, 39, 119, 0.6) !important;
    border-radius: 0 !important;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px) !important;
}
[data-theme="saints_row_4"] .top-bar-title span { color: #c084fc !important; text-shadow: 3px 3px 0px #db2777, -3px -3px 0px #0ea5e9 !important; font-style: italic; letter-spacing: 2px !important; }
[data-theme="saints_row_4"] .v2-progress-arc svg path { stroke: #db2777 !important; filter: drop-shadow(0 0 8px #9333ea); }

/* ==========================================================================
   THEME 4: TOMB RAIDER (Organic, Jungle, Stone, Relic)
   ========================================================================== */
[data-theme="tomb_raider"] #app-scaler, [data-theme="tomb_raider"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, #063012 0%, #010a03 100%) !important;
}
[data-theme="tomb_raider"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: url('data:image/svg+xml;utf8,<svg opacity="0.05" xmlns="http://www.w3.org/2000/svg" width="150" height="150"><path d="M 75 15 L 135 75 L 75 135 L 15 75 Z" stroke="%23fcd34d" stroke-width="2" fill="none"/><circle cx="75" cy="75" r="35" stroke="%23b45309" stroke-width="1.5" fill="none"/><circle cx="75" cy="75" r="20" stroke="%23fcd34d" stroke-width="1" fill="none"/></svg>') repeat;
}
[data-theme="tomb_raider"] .v2-player-card, [data-theme="tomb_raider"] .history-zone, [data-theme="tomb_raider"] .cb, [data-theme="tomb_raider"] .tooltip-box, [data-theme="tomb_raider"] .minimap-container, [data-theme="tomb_raider"] .layout-left > div, [data-theme="tomb_raider"] .layout-feed {
    background: radial-gradient(circle at center, rgba(30,50,30,0.95), rgba(10,20,10,0.98)) !important;
    border: 2px solid #b45309 !important;
    border-radius: 12px 36px 12px 36px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(180,83,9,0.25) !important;
}
[data-theme="tomb_raider"] .v2-piles {
    border: 2px solid #fcd34d !important;
    border-radius: 16px 48px 16px 48px !important;
    background: rgba(20,40,20,0.95) !important;
    box-shadow: 0 15px 35px rgba(0,0,0,0.9), inset 0 0 15px rgba(252,211,77,0.1) !important;
}
[data-theme="tomb_raider"] .top-bar-title span { color: #fcd34d !important; text-shadow: 2px 2px 4px #000, 0 0 20px #b45309 !important; font-weight: 400 !important; letter-spacing: 3px !important; }
[data-theme="tomb_raider"] .v2-progress-arc svg path { stroke: #15803d !important; }

/* ==========================================================================
   THEME 5: BIG AMBITIONS (Business, Corporate, Finance)
   ========================================================================== */
[data-theme="big_ambitions"] #app-scaler, [data-theme="big_ambitions"] .layout-main {
    background: radial-gradient(circle at 100% 0%, #064e3b 0%, #010a05 100%) !important;
}
[data-theme="big_ambitions"] #app-scaler::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    background-position: center;
}
[data-theme="big_ambitions"] .v2-player-card, [data-theme="big_ambitions"] .history-zone, [data-theme="big_ambitions"] .cb, [data-theme="big_ambitions"] .tooltip-box, [data-theme="big_ambitions"] .minimap-container, [data-theme="big_ambitions"] .layout-left > div, [data-theme="big_ambitions"] .layout-feed {
    background: rgba(2, 20, 10, 0.98) !important;
    border: 1px solid #16a34a !important;
    border-top: 5px solid #eab308 !important;
    border-radius: 0 !important;
    box-shadow: 8px 8px 0 rgba(0,0,0,0.8) !important;
}
[data-theme="big_ambitions"] .v2-piles {
    border: 1px solid #16a34a !important;
    border-top: 5px solid #16a34a !important;
    background: #02110a !important;
    box-shadow: 12px 12px 0 rgba(0,0,0,0.9) !important;
    border-radius: 0 !important;
}
[data-theme="big_ambitions"] .top-bar-title span { color: #fef08a !important; text-shadow: none !important; font-weight: 900 !important; letter-spacing: 2px !important; }
[data-theme="big_ambitions"] .v2-progress-arc svg path { stroke: #16a34a !important; }
`;

if (regex.test(html)) {
    html = html.replace(regex, ULTIMATE_CSS);
    fs.writeFileSync('index.html', html);
    console.log('Replaced block successfully.');
} else {
    console.error('Regex match failed.');
}
