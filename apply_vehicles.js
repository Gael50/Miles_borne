const fs = require('fs');
let vehiclesData = fs.readFileSync('src/entities/vehicles/data/vehicles.data.js', 'utf8');

const VEHICLES_EXT = `  space_marine_2: [
    { id: 'v55', name: 'Thunderhawk', icon: '🦅', theme: 'space_marine_2', desc: 'Aérien', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limit: true } },
    { id: 'v56', name: 'Rhino Transport', icon: '🚙', theme: 'space_marine_2', desc: 'Lourd', b: '2 Boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
    { id: 'v57', name: 'Drop Pod', icon: '☄️', theme: 'space_marine_2', desc: 'Frappe', b: 'Départ Avancé', m: 'Aucun', effects: { start_bonus_50: true } },
    { id: 'v58', name: 'Dreadnought', icon: '🤖', theme: 'space_marine_2', desc: 'Relique', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } }
  ],
  first_light_007: [
    { id: 'v59', name: 'Aston Martin DB5', icon: '🚘', theme: 'first_light_007', desc: 'Classique', b: 'Équilibré', m: 'Aucun', effects: {} },
    { id: 'v60', name: 'Lotus Esprit', icon: '🚤', theme: 'first_light_007', desc: 'Submersible', b: 'Immunité Panne', m: 'Aucun', effects: { immune_breakdown: true } },
    { id: 'v61', name: 'Moto Q-Branch', icon: '🏍️', theme: 'first_light_007', desc: 'Rapide', b: 'Départ Vert', m: 'Vuln. Accident', effects: { start_green: true, vuln_accident: true } },
    { id: 'v62', name: 'Jetpack', icon: '🎒', theme: 'first_light_007', desc: 'Discret', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limit: true } }
  ],
  saints_row_4: [
    { id: 'v63', name: 'Super Sprint', icon: '🏃', theme: 'saints_row_4', desc: 'Pouvoir', b: 'Départ Vert', m: 'Vuln. Panne', effects: { start_green: true, vuln_breakdown: true } },
    { id: 'v64', name: 'Tank Zin', icon: '🛸', theme: 'saints_row_4', desc: 'Extraterrestre', b: '2 Boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
    { id: 'v65', name: 'Dubstep Gun', icon: '📻', theme: 'saints_row_4', desc: 'Absurde', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
    { id: 'v66', name: 'Vaisseau Boss', icon: '🚀', theme: 'saints_row_4', desc: 'Rapide', b: 'Voleur', m: 'Vuln. Panne', effects: { start_thief: true, vuln_breakdown: true } }
  ],
  tomb_raider: [
    { id: 'v67', name: 'Piolet', icon: '⛏️', theme: 'tomb_raider', desc: 'Survie', b: 'Équilibré', m: 'Aucun', effects: {} },
    { id: 'v68', name: 'Arc à poulies', icon: '🏹', theme: 'tomb_raider', desc: 'Furtif', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limit: true } },
    { id: 'v69', name: 'Tenue Jaguar', icon: '🐆', theme: 'tomb_raider', desc: 'Instinct', b: 'Départ Vert', m: 'Vuln. Accident', effects: { start_green: true, vuln_accident: true } },
    { id: 'v70', name: 'Fusil d\\'assaut', icon: '🔫', theme: 'tomb_raider', desc: 'Combat', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } }
  ],
  big_ambitions: [
    { id: 'v71', name: 'Fourgonnette', icon: '🚐', theme: 'big_ambitions', desc: 'Logistique', b: 'Équilibré', m: 'Aucun', effects: {} },
    { id: 'v72', name: 'Camion lourd', icon: '🚛', theme: 'big_ambitions', desc: 'Fret', b: 'Immunité Panne', m: 'Aucun', effects: { immune_breakdown: true } },
    { id: 'v73', name: 'Voiture PDG', icon: '🚗', theme: 'big_ambitions', desc: 'Luxe', b: 'Départ Vert', m: 'Vuln. Essence', effects: { start_green: true, vuln_gas: true } },
    { id: 'v74', name: 'Élévateur', icon: '🚜', theme: 'big_ambitions', desc: 'Entrepôt', b: 'Aucun', m: 'Pas de 200', effects: { no_200: true } }
  ]
});`;

vehiclesData = vehiclesData.replace(`    { id: 'v54', name: 'Fourgon SWAT', icon: '🚐', theme: 'payday', desc: 'Blindé', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } }\n  ]\n});`, 
`    { id: 'v54', name: 'Fourgon SWAT', icon: '🚐', theme: 'payday', desc: 'Blindé', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } }\n  ],\n${VEHICLES_EXT}`);

fs.writeFileSync('src/entities/vehicles/data/vehicles.data.js', vehiclesData);
console.log('Modifications written to vehicles.data.js');
