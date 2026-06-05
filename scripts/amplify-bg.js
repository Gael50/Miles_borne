const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const CSS_AMPLIFY = `
/* ─── VRAIS ARRIÈRE-PLANS IN-GAME ET AMPLIFICATION ─── */
/* 007 First Light */
[data-theme="first_light_007"] .layout-v2 .layout-main {
    background: radial-gradient(circle at 50% 20%, rgba(15,23,42,0.6), rgba(2,6,23,0.9)) !important;
}
[data-theme="first_light_007"] .layout-main {
    background: radial-gradient(circle at 50% 20%, rgba(15,23,42,0.6), rgba(2,6,23,0.9)) !important;
}
[data-theme="first_light_007"] .top-bar-title span { color: #f87171 !important; text-shadow: 0 0 10px #b91c1c !important; }

/* Saints Row 4 */
[data-theme="saints_row_4"] .layout-v2 .layout-main {
    background: radial-gradient(ellipse at 50% 50%, rgba(46,16,101,0.5), rgba(10,0,20,0.9)) !important;
}
[data-theme="saints_row_4"] .layout-main {
    background: radial-gradient(ellipse at 50% 50%, rgba(46,16,101,0.5), rgba(10,0,20,0.9)) !important;
}
[data-theme="saints_row_4"] .top-bar-title span { color: #c084fc !important; text-shadow: 0 0 10px #db2777 !important; }

/* Tomb Raider */
[data-theme="tomb_raider"] .layout-v2 .layout-main {
    background: radial-gradient(ellipse at 50% 80%, rgba(20,83,45,0.4), rgba(2,18,6,0.9)) !important;
}
[data-theme="tomb_raider"] .layout-main {
    background: radial-gradient(ellipse at 50% 80%, rgba(20,83,45,0.4), rgba(2,18,6,0.9)) !important;
}
[data-theme="tomb_raider"] .top-bar-title span { color: #fcd34d !important; text-shadow: 0 0 10px #b45309 !important; }

/* Big Ambitions */
[data-theme="big_ambitions"] .layout-v2 .layout-main {
    background: radial-gradient(circle at 100% 0%, rgba(6,78,59,0.5), rgba(2,17,10,0.9)) !important;
}
[data-theme="big_ambitions"] .layout-main {
    background: radial-gradient(circle at 100% 0%, rgba(6,78,59,0.5), rgba(2,17,10,0.9)) !important;
}
[data-theme="big_ambitions"] .top-bar-title span { color: #fef08a !important; text-shadow: 0 0 10px #eab308 !important; }

/* Space Marine 2 */
[data-theme="space_marine_2"] .layout-v2 .layout-main {
    background: radial-gradient(ellipse at 50% 100%, rgba(26,5,5,0.8), rgba(5,5,5,0.95)) !important;
}
[data-theme="space_marine_2"] .layout-main {
    background: radial-gradient(ellipse at 50% 100%, rgba(26,5,5,0.8), rgba(5,5,5,0.95)) !important;
}
[data-theme="space_marine_2"] .top-bar-title span { color: #facc15 !important; text-shadow: 0 0 10px #b91c1c !important; }
`;

html = html.replace('</style>', CSS_AMPLIFY + '\n</style>');
fs.writeFileSync('index.html', html);
console.log('Amplify CSS written');
