const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const CSS_EXT = `
/* ─── THEMATIC IN-GAME OVERRIDES ─── */

/* 007 First Light: Luxe, verre, metal brosse */
[data-theme="first_light_007"] .layout-v2 .layout-players > div.v2-player-card {
    background: linear-gradient(135deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9)) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: 4px !important;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.6) !important;
}
[data-theme="first_light_007"] .cb {
    border-radius: 4px !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.8) !important;
}
[data-theme="first_light_007"] .layout-v2 .layout-feed {
    border-radius: 4px !important;
    background: linear-gradient(180deg, rgba(15,23,42,0.8), rgba(0,0,0,0.95)) !important;
    border: 1px solid #94a3b8 !important;
}
[data-theme="first_light_007"] .layout-v2 .v2-piles {
    border-radius: 4px !important;
    border: 1px solid #b91c1c !important;
}

/* Saints Row IV: Glitch, Neons, Angles vifs */
[data-theme="saints_row_4"] .layout-v2 .layout-players > div.v2-player-card {
    background: rgba(10,0,20,0.8) !important;
    border: 2px solid #db2777 !important;
    border-radius: 0 !important;
    clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
    transform: none !important;
}
[data-theme="saints_row_4"] .cb {
    border-radius: 0 !important;
    clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
}
[data-theme="saints_row_4"] .layout-v2 .layout-feed {
    border-radius: 0 !important;
    border: 2px dashed #9333ea !important;
    background: rgba(10,0,20,0.8) !important;
}
[data-theme="saints_row_4"] .layout-v2 .v2-piles {
    border-radius: 0 !important;
    border: 2px solid #c084fc !important;
    background: rgba(20,0,40,0.8) !important;
}

/* Shadow of the Tomb Raider: Pierre, organique, arrondi */
[data-theme="tomb_raider"] .layout-v2 .layout-players > div.v2-player-card {
    background: rgba(20,30,20,0.8) !important;
    border: 2px solid #b45309 !important;
    border-radius: 20px !important;
    box-shadow: 0 8px 16px rgba(0,0,0,0.8), inset 0 0 10px rgba(180,83,9,0.3) !important;
}
[data-theme="tomb_raider"] .cb {
    border-radius: 8px 32px 8px 32px !important;
}
[data-theme="tomb_raider"] .layout-v2 .layout-feed {
    border-radius: 20px !important;
    background: rgba(10,20,10,0.85) !important;
    border: 2px solid #15803d !important;
}
[data-theme="tomb_raider"] .layout-v2 .v2-piles {
    border-radius: 20px !important;
    border: 2px solid #fcd34d !important;
    background: rgba(20,30,20,0.9) !important;
}

/* Big Ambitions: Business, Carre, Shadow dure */
[data-theme="big_ambitions"] .layout-v2 .layout-players > div.v2-player-card {
    background: #02110a !important;
    border: 1px solid #16a34a !important;
    border-radius: 2px !important;
    box-shadow: 6px 6px 0 rgba(0,0,0,0.6) !important;
}
[data-theme="big_ambitions"] .cb {
    border-radius: 2px !important;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.5) !important;
}
[data-theme="big_ambitions"] .layout-v2 .layout-feed {
    border-radius: 2px !important;
    background: rgba(2,17,10,0.9) !important;
    border: 1px solid #eab308 !important;
    box-shadow: 6px 6px 0 rgba(0,0,0,0.6) !important;
}
[data-theme="big_ambitions"] .layout-v2 .v2-piles {
    border-radius: 2px !important;
    border: 1px solid #16a34a !important;
    box-shadow: 6px 6px 0 rgba(0,0,0,0.6) !important;
    background: #02110a !important;
}

/* Space Marine 2: Industriel, Brutal, Plaques */
[data-theme="space_marine_2"] .layout-v2 .layout-players > div.v2-player-card {
    background: linear-gradient(180deg, #1f1f1f, #0a0a0a) !important;
    border: 2px solid #b91c1c !important;
    border-radius: 8px !important;
    border-left: 6px solid #ca8a04 !important;
}
[data-theme="space_marine_2"] .cb {
    border-radius: 4px !important;
    border: 2px solid #ca8a04 !important;
}
[data-theme="space_marine_2"] .layout-v2 .layout-feed {
    border-radius: 8px !important;
    background: #050505 !important;
    border: 2px solid #b91c1c !important;
}
[data-theme="space_marine_2"] .layout-v2 .v2-piles {
    border-radius: 8px !important;
    border: 2px solid #ca8a04 !important;
    background: #1f1f1f !important;
}
`;

html = html.replace('</style>', CSS_EXT + '\n</style>');
fs.writeFileSync('index.html', html);
console.log('Added more CSS rules');
