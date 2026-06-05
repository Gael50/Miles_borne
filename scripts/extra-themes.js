const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const EXTRA_CSS = `
/* --- EXTRA DEFAULT LAYOUT & V1 THEME RULES --- */
/* First Light */
[data-theme="first_light_007"] .layout-left > div, [data-theme="first_light_007"] .layout-feed {
    background: linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.95)) !important;
    border: 1px solid rgba(185, 28, 28, 0.5) !important;
    border-radius: 2px !important;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8) !important;
}

/* Saints Row */
[data-theme="saints_row_4"] .layout-left > div, [data-theme="saints_row_4"] .layout-feed {
    background: rgba(15, 0, 30, 0.9) !important;
    border: 2px solid #db2777 !important;
    border-radius: 0 !important;
    clip-path: polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%) !important;
    box-shadow: 0 0 10px #db2777, inset 0 0 15px #9333ea !important;
}

/* Tomb Raider */
[data-theme="tomb_raider"] .layout-left > div, [data-theme="tomb_raider"] .layout-feed {
    background: radial-gradient(circle at center, rgba(30,45,30,0.9), rgba(10,20,10,0.95)) !important;
    border: 2px solid #b45309 !important;
    border-radius: 12px 36px 12px 36px !important;
}

/* Big Ambitions */
[data-theme="big_ambitions"] .layout-left > div, [data-theme="big_ambitions"] .layout-feed {
    background: rgba(2, 20, 10, 0.95) !important;
    border: 1px solid #16a34a !important;
    border-top: 4px solid #eab308 !important;
    border-radius: 0 !important;
    box-shadow: 8px 8px 0 rgba(0,0,0,0.7) !important;
}

/* Space Marine 2 */
[data-theme="space_marine_2"] .layout-left > div, [data-theme="space_marine_2"] .layout-feed {
    background: linear-gradient(180deg, #262626 0%, #0f0f0f 100%) !important;
    border: 2px solid #333 !important;
    border-left: 6px solid #b91c1c !important;
    border-right: 6px solid #ca8a04 !important;
    border-radius: 4px !important;
}
`;

html = html.replace('</style>', EXTRA_CSS + '\n</style>');
fs.writeFileSync('index.html', html);
console.log('Extra CSS applied');
