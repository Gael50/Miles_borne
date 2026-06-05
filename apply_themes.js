const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const themeContentStr = `    shop:{title:"Planque du Fixeur",npc:"Shade",desc:"Armes non létales, itinéraires, ECM et véhicules de fuite.",items:["ECM déployé","Gilet tactique","Plan B","Fuite rapide","Vol de sac"],phrases:["Le temps, c'est du cash.","Pas de héros, juste le plan.","L'alarme n'attend personne.","J'ai un fourgon prêt.","Les caméras mentiront pour toi.","Le SWAT arrive toujours trop tôt.","Prends l'ECM si tu tiens à respirer.","Le coffre ne s'ouvre pas avec des excuses.","Ton masque est ton identité.","On part propres ou on ne part pas."]}
  },
  space_marine_2: {
    identity:"Militaire, brutal, impérial, tyranides, purge et foi en l'Empereur.",
    ui:{materials:"acier sombre, sceaux de pureté, sang tyranide", cardStyle:"plaques de métal", hud:"auspex tactique", palette:["#b91c1c","#0f172a","#ca8a04","#facc15"]},
    audio:{intent:"hymnes orchestraux, tirs de bolter, rugissements tyranides."},
    attacks:["Nuée Tyranide","Embûche Hérétique","Munitions vides","Armure brisée","Générateur HS","Frappe orbitale","Essaim toxique","Signal brouillé","Tir de plasma","Écran thermique"],
    remedies:["Frappe vengeresse","Prières de bataille","Ravitaillement Bolter","Réparation Techmarine","Noyau redémarré","Appel de détresse","Sérum de combat","Aura de pureté","Lame tronçonneuse","Fureur de l'Astartes"],
    protections:["Bénédiction de l'Empereur","Bouclier relique","Dévotion inébranlable","Armure Terminator","Esprit de la Machine"],
    vehicles:["Thunderhawk","Rhino de transport","Drop Pod tactique","Dreadnought Vénérable","Land Raider","Moto Scout","Speeder d'assaut","Predator blindé"],
    events:[
      {title:"Avance impériale",desc:"Tous avancent sans peur.",icon:"🛡️",effect:"gainAll70"},
      {title:"Tempête Warp",desc:"La purge est suspendue.",icon:"🌪️",effect:"stopAll"},
      {title:"Embuscade Genestealer",desc:"Le leader recule.",icon:"👾",effect:"lossLeader60"},
      {title:"Renforts Astartes",desc:"Les blocages sautent.",icon:"⚔️",effect:"rescue"},
      {title:"Bénédiction du Primarque",desc:"Pannes effacées.",icon:"⚜️",effect:"clearHazards"},
      {title:"Saut orbital",desc:"Le dernier frappe fort.",icon:"☄️",effect:"boostLast130"},
      {title:"Route purifiée",desc:"Limites annulées.",icon:"🔥",effect:"clearLimits"},
      {title:"Nuée menaçante",desc:"Tout le monde ralentit.",icon:"🦂",effect:"speedLimitAll"},
      {title:"Intervention divine",desc:"Hasard du Warp.",icon:"🎲",effect:"randomSwing"},
      {title:"Exterminatus mineur",desc:"Nettoyage de zone.",icon:"💥",effect:"gainAll90"}
    ],
    shop:{title:"Arsenal de la Barge",npc:"Techmarine",desc:"Munitions, réparations et reliques d'assaut.",items:["Prière sacrée","Kit de réparation","Bénédiction armure","Munitions bénies","Escorte Scout"],phrases:["Pour l'Empereur.","L'esprit de la machine est apaisé.","Vos armes sont prêtes, frère.","La purge continue.","Prenez cette relique.","Une armure brisée est une honte.","La foi est votre meilleur bouclier.","Ne montrez aucune pitié.","Le Chapitre vous observe.","Frappez fort et juste."]}
  },
  first_light_007: {
    identity:"Espionnage, infiltration, gadgets, véhicules élégants et sabotage discret.",
    ui:{materials:"acier brossé, verre, rouge laser", cardStyle:"dossiers confidentiels", hud:"radar MI6", palette:["#94a3b8","#b91c1c","#000000","#f87171"]},
    audio:{intent:"jazz furtif, cuivres tendus, bruits de gadgets, silencieux."},
    attacks:["Route bloquée par le Spectre","Pneu saboté","Réservoir percé","Gadget en panne","Tireur d'élite","Barrage routier","Faux barrage","Mine magnétique","Course-poursuite","Coupure système"],
    remedies:["Route dégagée","Kit de secours MI6","Plein d'urgence","Reset du gadget","Esquive parfaite","Permis de rouler","Soutien satellite","Piratage d'urgence","Gadget Q-Branch","Coup de volant"],
    protections:["Blindage Q","Pneus auto-réparants","Voiture autonome","Anti-sabotage","Licence Double-O"],
    vehicles:["Aston Martin DB5","Lotus Esprit","Moto Q-Branch","Jetpack discret","Supercar blindée","Hélico furtif","Speedboat MI6","Sedan banalisé"],
    events:[
      {title:"Voie libre",desc:"Tous avancent discrètement.",icon:"🍸",effect:"gainAll70"},
      {title:"Alerte rouge",desc:"Le MI6 bloque la zone.",icon:"🚨",effect:"stopAll"},
      {title:"Cible verrouillée",desc:"Le leader ralentit.",icon:"🎯",effect:"lossLeader60"},
      {title:"Intervention de Q",desc:"Les blocages sont levés.",icon:"💼",effect:"rescue"},
      {title:"Gadgets réparés",desc:"Avaries effacées.",icon:"🔧",effect:"clearHazards"},
      {title:"Soutien furtif",desc:"Le dernier s'échappe.",icon:"🕶️",effect:"boostLast130"},
      {title:"Couverture réseau",desc:"Limites annulées.",icon:"📡",effect:"clearLimits"},
      {title:"Trafic suspect",desc:"Vitesse limitée pour tous.",icon:"🛑",effect:"speedLimitAll"},
      {title:"Jeu de casino",desc:"Hasard et bluff.",icon:"🎲",effect:"randomSwing"},
      {title:"Frappe ciblée",desc:"Avance coordonnée.",icon:"💥",effect:"gainAll90"}
    ],
    shop:{title:"Laboratoire Q-Branch",npc:"Q",desc:"Gadgets, modifications et intelligence tactique.",items:["Montre laser","Pneus blindés","Fausse plaque","Drone espion","Parapluie furtif"],phrases:["Ne touchez à rien 007.","C'est un équipement coûteux.","Rapportez-le en un seul morceau.","Le MI6 compte sur vous.","Un gadget peut faire la différence.","Soyez discret, je vous prie.","L'ennemi écoute.","Un peu de classe, 007.","Mon labo n'est pas un terrain de jeu.","Bonne chance, agent."]}
  },
  saints_row_4: {
    identity:"Chaos virtuel, simulation piratée, super-pouvoirs, extraterrestres et absurdité.",
    ui:{materials:"néon glitché, textures violettes, interfaces extraterrestres", cardStyle:"hologrammes", hud:"interface Zin piratée", palette:["#9333ea","#db2777","#0a0014","#c084fc"]},
    audio:{intent:"dubstep, glitchs audio, blagues absurdes, explosions."},
    attacks:["Glitch de simulation","Portail Zin","Crash serveur","Rayon alien","Simulation gelée","Bug de physique","Lag temporel","Flics virtuels","Virus alien","Suppression de données"],
    remedies:["Code de triche","Hack de Kinzie","Reboot serveur","Super-saut","Patch de simulation","Correction physique","Bande passante","Reset des flics","Antivirus Boss","Restauration"],
    protections:["Aura de Glitch","Bypass Zin","Bouclier Dubstep","Admin de la Sim","Aura Présidentielle"],
    vehicles:["Super Sprint","Tank Zin","Dubstep Gun Car","Vaisseau Zin","Voiture glitchée","Moto Tron","Monster Truck violet","Ovni présidentiel"],
    events:[
      {title:"Hack réseau",desc:"Tous avancent par glitch.",icon:"👾",effect:"gainAll70"},
      {title:"Crash Zin",desc:"La simulation s'arrête.",icon:"💥",effect:"stopAll"},
      {title:"Ciblage alien",desc:"Le leader recule.",icon:"🛸",effect:"lossLeader60"},
      {title:"Patch de Kinzie",desc:"Blocages annulés.",icon:"💻",effect:"rescue"},
      {title:"Débug général",desc:"Avaries effacées.",icon:"🛠️",effect:"clearHazards"},
      {title:"Super-Sprint",desc:"Le dernier bondit.",icon:"🏃",effect:"boostLast130"},
      {title:"Hack de vitesse",desc:"Limites annulées.",icon:"⚡",effect:"clearLimits"},
      {title:"Lag global",desc:"Vitesse limitée.",icon:"🐌",effect:"speedLimitAll"},
      {title:"Roue du chaos",desc:"Simulation aléatoire.",icon:"🎲",effect:"randomSwing"},
      {title:"Overclocking",desc:"Tous avancent vite.",icon:"🚀",effect:"gainAll90"}
    ],
    shop:{title:"Terminal de Hack",npc:"Kinzie",desc:"Cheats, armes absurdes et upgrades virtuels.",items:["Arme Dubstep","Patch de vol","Bouclier glitch","Super-vitesse","Reset étoiles"],phrases:["La simulation est instable.","Ne fais pas planter le serveur, Boss.","J'ai un code pour ça.","Les Zins vont détester ça.","Le glitch est ton ami.","J'upload un patch.","Reste en mouvement.","Fais péter les stats.","La réalité est surfaite.","Amuse-toi bien, Président."]}
  },
  tomb_raider: {
    identity:"Jungle hostile, survie, reliques anciennes, furtivité et tombes mortelles.",
    ui:{materials:"pierre taillée, lianes, or terne", cardStyle:"parchemins et cuir", hud:"boussole ancienne", palette:["#15803d","#b45309","#021206","#fcd34d"]},
    audio:{intent:"tambours tribaux, bruits de jungle, éboulements, silence tendu."},
    attacks:["Piège ancien","Morsure de jaguar","Éboulement","Fléchette empoisonnée","Brouillard toxique","Corde cassée","Garde mercenaire","Liane pourrie","Puits de piques","Ruine instable"],
    remedies:["Antidote local","Bandage de fortune","Chemin dégagé","Esquive acrobatique","Souffle retrouvé","Nouvelle corde","Furtivité parfaite","Appui solide","Grappin","Mur d'escalade"],
    protections:["Instinct de survie","Amulette solaire","Pas de panthère","Chance de l'explorateur","Héritage Croft"],
    vehicles:["Piolet d'escalade","Arc à poulies","Tenue de Jaguar","Fusil d'assaut d'urgence","Jeep de mercenaire","Bateau de rivière","Parachute de fortune","Bottes de trek"],
    events:[
      {title:"Piste dégagée",desc:"Progression fluide.",icon:"🌿",effect:"gainAll70"},
      {title:"Tempête tropicale",desc:"La jungle s'arrête.",icon:"⛈️",effect:"stopAll"},
      {title:"Garde en patrouille",desc:"Le leader se cache.",icon:"🔦",effect:"lossLeader60"},
      {title:"Instinct aiguisé",desc:"Blocages esquivés.",icon:"👁️",effect:"rescue"},
      {title:"Feu de camp",desc:"Blessures soignées.",icon:"🔥",effect:"clearHazards"},
      {title:"Découverte secrète",desc:"Le dernier trouve un raccourci.",icon:"🗺️",effect:"boostLast130"},
      {title:"Voie antique",desc:"Limites annulées.",icon:"🗿",effect:"clearLimits"},
      {title:"Boue épaisse",desc:"Vitesse réduite pour tous.",icon:"🤎",effect:"speedLimitAll"},
      {title:"Relique maudite",desc:"Effet aléatoire.",icon:"🏺",effect:"randomSwing"},
      {title:"Course éperdue",desc:"Fuite générale.",icon:"🏃‍♀️",effect:"gainAll90"}
    ],
    shop:{title:"Campement Marchand",npc:"Jonah",desc:"Équipement de survie, munitions et cartes de tombes.",items:["Plantes médicinales","Flèches renforcées","Corde solide","Piolet amélioré","Trousse de soin"],phrases:["Fais attention à toi, Lara.","La jungle ne pardonne pas.","J'ai trouvé ça près des ruines.","Les mercenaires approchent.","Garde tes forces.","C'est une ancienne route.","Ne prends pas de risques inutiles.","La survie avant tout.","J'ai amélioré ton équipement.","On se retrouve au prochain camp."]}
  },
  big_ambitions: {
    identity:"Business, investissement, logistique, immobilier et cashflow.",
    ui:{materials:"marbre, verre, graphiques boursiers", cardStyle:"contrats et actions", hud:"terminal boursier", palette:["#16a34a","#eab308","#02110a","#fef08a"]},
    audio:{intent:"ambiance bureau urbaine, claviers, sonnettes de caisse, murmures de ville."},
    attacks:["Grève syndicale","Contrôle fiscal","Camion en panne","Rupture de stock","Concurrence déloyale","Panne de courant","Clientèle fâchée","Dégât des eaux","Baisse de la bourse","Employé malade"],
    remedies:["Négociation réussie","Audit validé","Nouveau camion","Livraison express","Marketing viral","Générateur de secours","Promo flash","Plombier d'urgence","Remontée boursière","Remplaçant trouvé"],
    protections:["Avocat d'affaires","Assurance tous risques","Monopole local","Contrat béton","Fonds de secours"],
    vehicles:["Fourgonnette de livraison","Camion logistique","Voiture de PDG","Chariot élévateur","Scooter de coursier","Berline de fonction","Camionnette frigorifique","Hélico d'entreprise"],
    events:[
      {title:"Boom du marché",desc:"Tout le monde encaisse.",icon:"📈",effect:"gainAll70"},
      {title:"Krach boursier",desc:"Gèle des affaires.",icon:"📉",effect:"stopAll"},
      {title:"OPA hostile",desc:"Le leader perd des parts.",icon:"💼",effect:"lossLeader60"},
      {title:"Subvention d'état",desc:"Blocages annulés.",icon:"🏦",effect:"rescue"},
      {title:"Renflouement",desc:"Dettes et pannes effacées.",icon:"💸",effect:"clearHazards"},
      {title:"Soutien providentiel",desc:"Le dernier fait un bond.",icon:"🤝",effect:"boostLast130"},
      {title:"Dérégulation",desc:"Limites annulées.",icon:"🔓",effect:"clearLimits"},
      {title:"Nouvelle taxe",desc:"Vitesse limitée pour tous.",icon:"📋",effect:"speedLimitAll"},
      {title:"Fluctuation",desc:"Le marché est instable.",icon:"⚖️",effect:"randomSwing"},
      {title:"Contrat majeur",desc:"Avance générale.",icon:"📝",effect:"gainAll90"}
    ],
    shop:{title:"Siège Social",npc:"Directeur RH",desc:"Formations, avocats, marketing et avantages fiscaux.",items:["Conseil juridique","Campagne pub","Bonus employé","Assurance premium","Consultant expert"],phrases:["Le temps, c'est de l'argent.","Optimisons nos marges.","Un bon avocat évite bien des soucis.","Le marché ne dort jamais.","Investissez intelligemment.","Vos employés réclament des primes.","La concurrence est rude.","Signez en bas de la page.","Le cashflow est roi.","Développons nos actifs."]}
  }`;

html = html.replace(`    shop:{title:"Planque du Fixeur",npc:"Shade",desc:"Armes non létales, itinéraires, ECM et véhicules de fuite.",items:["ECM déployé","Gilet tactique","Plan B","Fuite rapide","Vol de sac"],phrases:["Le temps, c'est du cash.","Pas de héros, juste le plan.","L'alarme n'attend personne.","J'ai un fourgon prêt.","Les caméras mentiront pour toi.","Le SWAT arrive toujours trop tôt.","Prends l'ECM si tu tiens à respirer.","Le coffre ne s'ouvre pas avec des excuses.","Ton masque est ton identité.","On part propres ou on ne part pas."]}
  }`, themeContentStr);

const THEMES_STR = `  payday:   {name:"Payday 3",icon:"🎭",a1:"#facc15",a2:"#2563eb",bg:"#030712",bg2:"#0f172a",br:"#facc1555",particle:"#fef08a",skin:"payday",font:"'Orbitron', sans-serif"},
  space_marine_2: {name:"Space Marine 2",icon:"⚔️",a1:"#b91c1c",a2:"#ca8a04",bg:"#050505",bg2:"#1a0505",br:"#b91c1c55",particle:"#facc15",skin:"space_marine_2", font:"'Black Ops One', cursive"},
  first_light_007:{name:"007 First Light",icon:"🕵️",a1:"#94a3b8",a2:"#b91c1c",bg:"#000000",bg2:"#111111",br:"#b91c1c55",particle:"#f87171",skin:"first_light_007", font:"'Orbitron', sans-serif"},
  saints_row_4:   {name:"Saints Row IV",icon:"👽",a1:"#9333ea",a2:"#db2777",bg:"#0a0014",bg2:"#1c0036",br:"#db277755",particle:"#c084fc",skin:"saints_row_4",font:"'VT323', monospace"},
  tomb_raider:    {name:"Tomb Raider",icon:"🗿",a1:"#15803d",a2:"#b45309",bg:"#021206",bg2:"#0a2e13",br:"#b4530955",particle:"#fcd34d",skin:"tomb_raider",font:"'Cinzel', serif"},
  big_ambitions:  {name:"Big Ambitions",icon:"💼",a1:"#16a34a",a2:"#eab308",bg:"#02110a",bg2:"#062b16",br:"#eab30855",particle:"#fef08a",skin:"big_ambitions",font:"'Orbitron', sans-serif"}`;

html = html.replace(`  payday:   {name:"Payday 3",icon:"🎭",a1:"#facc15",a2:"#2563eb",bg:"#030712",bg2:"#0f172a",br:"#facc1555",particle:"#fef08a",skin:"payday",font:"'Orbitron', sans-serif"},`, THEMES_STR);

html = html.replace(`const UNIVERSE=["bleu","mario","craft","cyber","space","zelda","apoca","medieval","ac_mirage","ac_bf","sims","sea_thieves","hades","mafia","sekiro","payday"];`,
`const UNIVERSE=["bleu","mario","craft","cyber","space","zelda","apoca","medieval","ac_mirage","ac_bf","sims","sea_thieves","hades","mafia","sekiro","payday","space_marine_2","first_light_007","saints_row_4","tomb_raider","big_ambitions"];`);

const META_STR = `  payday:   {desc:"Braquage tactique",title:"Mille Casses", solo:"Plan solo", multi:"Équipe locale", aiIcon:"🚔",start:"Masques en place !", unit:"butin", dk:E.mask2},
  space_marine_2: {desc:"Croisade Impériale",title:"Mille Purgations",solo:"Mission solo", multi:"Escouade Astartes",aiIcon:"👾",start:"Pour l'Empereur !",unit:"xenos",dk:E.skull},
  first_light_007:{desc:"Mission d'Espionnage",title:"Mille Cibles",solo:"Agent double", multi:"Réseau MI6",aiIcon:"🕴️",start:"Permis de tuer !",unit:"intel",dk:E.eye},
  saints_row_4:   {desc:"Simulation piratée",title:"Mille Glitches",solo:"Le Boss", multi:"Les Saints",aiIcon:"🛸",start:"Simulation hackée !",unit:"clusters",dk:E.alien},
  tomb_raider:    {desc:"Exploration mortelle",title:"Mille Reliques",solo:"Pilleuse de Tombes", multi:"Expédition",aiIcon:"🐆",start:"Explorez la jungle !",unit:"artefacts",dk:E.skull},
  big_ambitions:  {desc:"Empire Financier",title:"Mille Dollars",solo:"Start-up", multi:"Multinationale",aiIcon:"💼",start:"Ouvrez le magasin !",unit:"k$",dk:E.house},`;

html = html.replace(`  payday:   {desc:"Braquage tactique",title:"Mille Casses", solo:"Plan solo", multi:"Équipe locale", aiIcon:"🚔",start:"Masques en place !", unit:"butin", dk:E.mask2},`, META_STR);

const LOCAL_STR = `  payday:   {title:"Équipe locale",        sub:"Braquage canapé en équipe"},
  space_marine_2: {title:"Escouade locale",       sub:"Purge en coopération"},
  first_light_007:{title:"QG local",              sub:"Opération conjointe"},
  saints_row_4:   {title:"Co-op locale",          sub:"Chaos sur le même canapé"},
  tomb_raider:    {title:"Expédition locale",     sub:"Exploration partagée"},
  big_ambitions:  {title:"Siège local",           sub:"Business en famille"},`;

html = html.replace(`  payday:   {title:"Équipe locale",        sub:"Braquage canapé en équipe"},`, LOCAL_STR);

const VEHICLES_STR = `  { id: 'v55', name: 'Thunderhawk', icon: '🦅', theme: 'space_marine_2', desc: 'Aérien', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limit: true } },
  { id: 'v56', name: 'Rhino Transport', icon: '🚙', theme: 'space_marine_2', desc: 'Lourd', b: '2 Boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v57', name: 'Drop Pod', icon: '☄️', theme: 'space_marine_2', desc: 'Frappe', b: 'Départ Avancé', m: 'Aucun', effects: { start_bonus_50: true } },
  { id: 'v58', name: 'Dreadnought', icon: '🤖', theme: 'space_marine_2', desc: 'Relique', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v59', name: 'Aston Martin DB5', icon: '🚘', theme: 'first_light_007', desc: 'Classique', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v60', name: 'Lotus Esprit', icon: '🚤', theme: 'first_light_007', desc: 'Submersible', b: 'Immunité Panne', m: 'Aucun', effects: { immune_breakdown: true } },
  { id: 'v61', name: 'Moto Q-Branch', icon: '🏍️', theme: 'first_light_007', desc: 'Rapide', b: 'Départ Vert', m: 'Vuln. Accident', effects: { start_green: true, vuln_accident: true } },
  { id: 'v62', name: 'Jetpack', icon: '🎒', theme: 'first_light_007', desc: 'Discret', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limit: true } },
  { id: 'v63', name: 'Super Sprint', icon: '🏃', theme: 'saints_row_4', desc: 'Pouvoir', b: 'Départ Vert', m: 'Vuln. Panne', effects: { start_green: true, vuln_breakdown: true } },
  { id: 'v64', name: 'Tank Zin', icon: '🛸', theme: 'saints_row_4', desc: 'Extraterrestre', b: '2 Boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v65', name: 'Dubstep Gun', icon: '📻', theme: 'saints_row_4', desc: 'Absurde', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v66', name: 'Vaisseau Boss', icon: '🚀', theme: 'saints_row_4', desc: 'Rapide', b: 'Voleur', m: 'Vuln. Panne', effects: { start_thief: true, vuln_breakdown: true } },
  { id: 'v67', name: 'Piolet', icon: '⛏️', theme: 'tomb_raider', desc: 'Survie', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v68', name: 'Arc à poulies', icon: '🏹', theme: 'tomb_raider', desc: 'Furtif', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limit: true } },
  { id: 'v69', name: 'Tenue Jaguar', icon: '🐆', theme: 'tomb_raider', desc: 'Instinct', b: 'Départ Vert', m: 'Vuln. Accident', effects: { start_green: true, vuln_accident: true } },
  { id: 'v70', name: 'Fusil d\\'assaut', icon: '🔫', theme: 'tomb_raider', desc: 'Combat', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v71', name: 'Fourgonnette', icon: '🚐', theme: 'big_ambitions', desc: 'Logistique', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v72', name: 'Camion lourd', icon: '🚛', theme: 'big_ambitions', desc: 'Fret', b: 'Immunité Panne', m: 'Aucun', effects: { immune_breakdown: true } },
  { id: 'v73', name: 'Voiture PDG', icon: '🚗', theme: 'big_ambitions', desc: 'Luxe', b: 'Départ Vert', m: 'Vuln. Essence', effects: { start_green: true, vuln_gas: true } },
  { id: 'v74', name: 'Élévateur', icon: '🚜', theme: 'big_ambitions', desc: 'Entrepôt', b: 'Aucun', m: 'Pas de 200', effects: { no_200: true } },
];`;

html = html.replace(`  { id: 'v54', name: 'Fourgon SWAT', icon: '🚐', theme: 'payday', desc: 'Blindé', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },\n];`,
`  { id: 'v54', name: 'Fourgon SWAT', icon: '🚐', theme: 'payday', desc: 'Blindé', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },\n${VEHICLES_STR}`);

fs.writeFileSync('index.html', html);
console.log('Modifications written to index.html');
