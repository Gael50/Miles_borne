const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const expansionPacks = `  payday: [
    ["Pickup de Planque","🛻","Polyvalent","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Berline Banalisée","🚘","Discrète","Immunité Limite","Aucun",{immune_limite:true}],
    ["Blindé Léger","🚓","Sécurisé","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Voiture de Sport Volée","🏎️","Nerveuse","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
  ],
  space_marine_2: [
    ["Thunderhawk", "🦅", "Aérien", "Immunité Limite", "Aucun", { immune_limite: true }],
    ["Rhino Transport", "🚙", "Lourd", "2 Boucliers", "Pas de 200", { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ["Drop Pod", "☄️", "Frappe", "+50 départ", "Aucun", { start_km: 50 }],
    ["Dreadnought", "🤖", "Relique", "Immunité Accident", "Aucun", { immune_accident: true }],
    ["Land Raider", "🚜", "Blindé", "Immunité Panne", "Main max 9", { immune_panne: true, hand_size: -1 }]
  ],
  first_light_007: [
    ["Aston Martin DB5", "🚘", "Classique", "Main +1", "Aucun", { hand_size: 1 }],
    ["Lotus Esprit", "🚤", "Submersible", "Immunité Panne", "Aucun", { immune_panne: true }],
    ["Moto Q-Branch", "🏍️", "Rapide", "Démarre en route", "Main max 9", { start_green: true, hand_size: -1 }],
    ["Jetpack", "🎒", "Discret", "Immunité Limite", "Aucun", { immune_limite: true }],
    ["Hélico Furtif", "🚁", "Survol", "Commence avec Vol", "Pas de 200", { start_thief: true, no_200: true }]
  ],
  saints_row_4: [
    ["Super Sprint", "🏃", "Pouvoir", "Démarre en route", "Départ limité", { start_green: true, start_limite: true }],
    ["Tank Zin", "🛸", "Extraterrestre", "2 Boucliers", "Pas de 200", { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ["Dubstep Gun", "📻", "Absurde", "Immunité Accident", "Aucun", { immune_accident: true }],
    ["Vaisseau Boss", "🚀", "Rapide", "Commence avec Vol", "Main max 9", { start_thief: true, hand_size: -1 }],
    ["Voiture Glitchée", "🚘", "Instable", "+50 départ", "Aucun", { start_km: 50 }]
  ],
  tomb_raider: [
    ["Piolet", "⛏️", "Survie", "Immunité Panne", "Aucun", { immune_panne: true }],
    ["Arc à poulies", "🏹", "Furtif", "Immunité Limite", "Aucun", { immune_limite: true }],
    ["Tenue Jaguar", "🐆", "Instinct", "Démarre en route", "Départ limité", { start_green: true, start_limite: true }],
    ["Fusil d'assaut", "🔫", "Combat", "Immunité Accident", "Aucun", { immune_accident: true }],
    ["Bottes de Trek", "🥾", "Endurance", "+50 départ", "Aucun", { start_km: 50 }]
  ],
  big_ambitions: [
    ["Fourgonnette", "🚐", "Logistique", "Main +1", "Aucun", { hand_size: 1 }],
    ["Camion lourd", "🚛", "Fret", "Immunité Panne", "Aucun", { immune_panne: true }],
    ["Voiture PDG", "🚗", "Luxe", "Démarre en route", "Main max 9", { start_green: true, hand_size: -1 }],
    ["Élévateur", "🚜", "Entrepôt", "2 Boucliers", "Pas de 200", { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ["Hélico d'entreprise", "🚁", "Exec", "Commence avec Vol", "Départ limité", { start_thief: true, start_limite: true }]
  ]
};`;

html = html.replace(/  payday: \[\s*\["Pickup de Planque"[^]*?\],\s*\]\s*,\s*\};/m, expansionPacks);
fs.writeFileSync('index.html', html);
console.log('Modifications written to index.html');
