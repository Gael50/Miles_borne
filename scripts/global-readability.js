const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const GLOBAL_READABILITY = `
/* GLOBAL READABILITY & CLIPPING FIXES */
* {
    /* Base */
}

button, .cb {
    line-height: 1.2 !important; /* Tighter line height for interactive elements so text fits */
}

.history-zone, .v2-action-bar, .tooltip-box, .minimap-container {
    line-height: 1.4 !important;
}

/* Ensure no text overflows the cards */
.cb > div {
    max-width: 100%;
}
.cb span, .cb strong {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
`;

html = html.replace('/* ─── THEMATIC IN-GAME OVERRIDES ─── */', GLOBAL_READABILITY + '\n/* ─── THEMATIC IN-GAME OVERRIDES ─── */');
fs.writeFileSync('index.html', html);
console.log('Applied global readability fixes');
