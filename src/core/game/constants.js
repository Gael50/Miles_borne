// --- DATA & CONSTANTS ---
export const E={
  road:"🛣",gas:"⛽",wrench:"🔧",redlight:"🔴",barrier:"🚧",screw:"🪛",green:"🟢",car:"🚗",wheel:"🛞",trophy:"🏆",barrel:"🛢",shield:"🛡",
  light:"🚦",mountain:"🏔",horse:"🐴",sword:"⚔",storm:"🌩",fog:"🌫",paw:"🐾",apple:"🍎",leaf:"🌿",scope:"🔭",horse2:"🏇",sparkle:"✨",
  star:"⭐",mushroom:"🍄",turtle:"🐢",wave:"🌊",spiral:"🌀",cactus:"🌵",flag:"🏁",flower:"🌸",eagle:"🦅",bolt:"⚡",gem:"💎",crown:"👑",
  compass:"🧭",zombie:"🧟",boom:"💥",spider:"🕷",bow:"🏹",meat:"🍖",torch:"🔦",map:"🗺",dragon:"🐉",anchor:"⚓",tornado:"🌪",hook:"🪝",
  bomb:"💣",hammer:"🔨",wind:"💨",dolphin:"🐬",skull:"💀",croc:"🐊",pirate:"🏴",moon:"🌙",desert:"🏜",dagger:"🗡",padlock:"🔒",eye:"👁",
  trap:"🪤",jar:"🫙",ninja:"🥷",mask:"🎭",boomerang:"🪃",falcon:"🦅",droplet:"💧",crescent:"☽",scroll:"📜",box:"📦",cardback:"🎴",phone:"📱",
  cyber:"🌐",battery:"🔋",hack:"💻",lock:"🔒",glitch:"🐛",plug:"🔌",patch:"🛠",unlock:"🔓",rocket:"🚀",backup:"💾",robot:"🤖",reactor:"⚡",
  firewall:"🛡",root:"👑",planet:"🪐",alien:"👽",asteroid:"☄️",blackhole:"🕳",laser:"🔫",ufo:"🛸",fuel:"🔋",ship:"🚀",radar:"📡",commander:"👨‍🚀",
  hand:"🫳", tire:"🛞", gear:"⚙️", mechanic:"🛠️", sun:"🌤️", goggles:"🥽", mine:"🧨", armor:"🚜", axe:"🪓", fire:"🔥", water:"💧",
  castle:"🏰", troll:"🧌", bridge:"🌉", mud:"🟤", horseshoe:"🧲", guard:"🛡️", pass:"📜", knight:"🗡️", bread:"🍞", magic:"✨",
  dice:"🎲", police:"🚨", book:"📓", tools:"🧰", shop:"🏪", garage:"🧰", cart:"🛒", hacker:"🧑‍💻", shopkeeper:"👩‍🦰", mechanicBoy:"👨‍🔧", builder:"👲",
  house:"🏠", bed:"🛏️", sofa:"🛋️", toilet:"🚽", cake:"🍰", music:"🎵", broom:"🧹", wrench2:"🔩", smile:"🙂", diamond:"💠", mirror:"🪞", clock:"⏰", calendar:"📅",
  tavern:"🍺", chest:"🧰", kraken:"🐙", mermaid:"🧜", cannon:"💣", compass2:"🧭", rum:"🥃", helm:"⎈", island:"🏝️",
  flame:"🔥", lyre:"🎻", skull2:"☠️", laurel:"🏺", spear:"🔱", shade:"👤", pomegranate:"🍎", obsidian:"⬛",
  hat:"🎩", sax:"🎷", money:"💵", briefcase:"💼", newspaper:"📰", cigar:"🚬", bank:"🏦", coat:"🧥",
  torii:"⛩️", katana:"⚔️", bamboo:"🎋", fox:"🦊", lotus:"🪷", rain:"🌧️", prayer:"📿", fan:"🪭", rice:"🍙",
  drill:"🪚", camera:"📷", mask2:"🎭", siren:"🚨", vault:"🏦", cashbag:"💰", keypad:"⌨️", escape:"🚐"
};

const mkSkin=(d,pe,ac,fr,li,cr,es,rp,fv,fl,ro,av,ci,in_,pr,vo,sb, ch, zA, spB, brico, pirat)=>({
  distance:d,panne_essence:{...pe,atk:true},accident:{...ac,atk:true},feu_rouge:{...fr,atk:true},limite:{...li,atk:true},crevaison:{...cr,atk:true},
  essence:{...es,fixes:"panne_essence"},reparation:{...rp,fixes:"accident"},feu_vert:{...fv,fixes:"feu_rouge"},fin_limite:{...fl,fixes:"limite"},roue:{...ro,fixes:"crevaison"},
  as_volant:{...av,immuneTo:"accident"},citerne:{...ci,immuneTo:"panne_essence"},increvable:{...in_,immuneTo:"crevaison"},prioritaire:{...pr,immuneTo:["feu_rouge","limite"]},
  vol:{...vo, action:true}, sabotage:{...sb, atk:true, isSabo:true},
  chaos:{...ch, action:true, isChaos:true}, zone_attack:{...zA, atk:true, isZone:true}, special_boost:{...spB, type:"distance", value:100},
  bricolage:{...brico, type:"remedy", isBrico:true}, piratage:{...pirat, atk:true, isHack:true}
});

export const CLASSIC=mkSkin(
  {icon:E.road,typeName:"Distance"},{icon:E.gas,label:"Panne essence",sub:"essence"},{icon:E.wrench,label:"Accident",sub:"accident"},{icon:E.redlight,label:"Feu rouge",sub:"rouge"},{icon:E.barrier,label:"Limite vit.",sub:"vitesse"},{icon:E.screw,label:"Crevaison",sub:"pneu"},
  {icon:E.gas,label:"Essence",sub:"plein"},{icon:E.wrench,label:"Réparation",sub:"garage"},{icon:E.green,label:"Feu vert",sub:"vert"},{icon:E.car,label:"Fin limite",sub:"limite"},{icon:E.wheel,label:"Roue secours",sub:"secours"},
  {icon:E.trophy,label:"As du volant",sub:"immunité accident"},{icon:E.barrel,label:"Citerne",sub:"immunité panne"},{icon:E.shield,label:"Increvable",sub:"immunité crevaison"},{icon:E.light,label:"Prioritaire",sub:"immunité feu+limite"},
  {icon:E.hand,label:"Vol",sub:"piquer une carte"}, {icon:E.bomb,label:"Sabotage",sub:"Fait perdre 50km"},
  {icon:E.dice,label:"Aléa Routier",sub:"Événement aléatoire"}, {icon:E.police,label:"Barrage Police",sub:"Bloque TOUT LE MONDE"}, {icon:E.road,label:"Aspiration",sub:"+100 Rapide"},
  {icon:E.tools,label:"Système D",sub:"Répare, mais limite 50"}, {icon:E.hack,label:"Piratage",sub:"Recul -50 & Arrête"}
);
export const ZELDA=mkSkin(
  {icon:E.mountain,typeName:"Voyage"},{icon:E.horse,label:"Cheval épuisé",sub:"monture"},{icon:E.sword,label:"Bokoblin",sub:"combat"},{icon:E.storm,label:"Malédiction",sub:"Ganon"},{icon:E.fog,label:"Brouillard",sub:"épais"},{icon:E.paw,label:"Patte blessée",sub:"cheval"},
  {icon:E.apple,label:"Pomme Endura",sub:"soin"},{icon:E.shield,label:"Bouclier Hylien",sub:"défense"},{icon:E.leaf,label:"Feuille Korogu",sub:"voyage"},{icon:E.scope,label:"Tour de guet",sub:"exploration"},{icon:E.leaf,label:"Herbe Endura",sub:"soin patte"},
  {icon:E.horse2,label:"Epona",sub:"immunité Bokoblin"},{icon:E.leaf,label:"Elixir Endura",sub:"immunité épuisement"},{icon:E.horse2,label:"Cheval guerre",sub:"immunité blessure"},{icon:E.sparkle,label:"Bénédiction",sub:"immunité tout"},
  {icon:E.hook,label:"Grappin",sub:"vol d'objet"}, {icon:E.bomb,label:"Fleur Bombe",sub:"Recul de 50"},
  {icon:E.magic,label:"Magie Sauvage",sub:"Événement aléatoire"}, {icon:E.crescent,label:"Lune de Sang",sub:"Danger de Zone"}, {icon:E.leaf,label:"Rage de Revali",sub:"+100 Rapide"},
  {icon:E.sparkle,label:"Fée Fatiguée",sub:"Répare, mais limite 50"}, {icon:E.magic,label:"Sort Glace",sub:"Recul -50 & Arrête"}
);
export const MARIO=mkSkin(
  {icon:E.star,typeName:"Voyage"},{icon:E.mushroom,label:"Champi Poison",sub:"piège"},{icon:E.turtle,label:"Carapace Koopa",sub:"projectile"},{icon:E.wave,label:"Lac de lave",sub:"bloque"},{icon:E.spiral,label:"Bourbier",sub:"ralenti"},{icon:E.cactus,label:"Plante Piranha",sub:"morsure"},
  {icon:E.mushroom,label:"Super Champi",sub:"guérison"},{icon:E.star,label:"Super Étoile",sub:"invincible"},{icon:E.flag,label:"Drapeau départ",sub:"en piste"},{icon:E.flower,label:"Cape Tanooki",sub:"libre"},{icon:E.leaf,label:"Feuille Tanooki",sub:"soin pied"},
  {icon:E.eagle,label:"Lakitu",sub:"immunité Koopa"},{icon:E.bolt,label:"Mini Champi",sub:"immunité poison"},{icon:E.gem,label:"Diamant",sub:"immunité plante"},{icon:E.crown,label:"Couronne Royale",sub:"immunité lave+boue"},
  {icon:E.mask,label:"Boo",sub:"vol de carte"}, {icon:E.bomb,label:"Bob-omb",sub:"Explosion -50"},
  {icon:E.box,label:"Boîte Mystère",sub:"Événement aléatoire"}, {icon:E.bolt,label:"Éclair Global",sub:"Ralentit TOUT LE MONDE"}, {icon:E.star,label:"Champi Doré",sub:"+100 Rapide"},
  {icon:E.mushroom,label:"Vieux Champi",sub:"Répare, mais limite 50"}, {icon:E.mask,label:"Possession",sub:"Recul -50 & Arrête"}
);
export const CRAFT=mkSkin(
  {icon:E.compass,typeName:"Exploration"},{icon:E.zombie,label:"Zombie",sub:"attaque"},{icon:E.boom,label:"Creeper",sub:"explosion"},{icon:E.spider,label:"Araignée",sub:"toile"},{icon:E.fog,label:"Brume",sub:"égaré"},{icon:E.bow,label:"Archer Squelette",sub:"flèche"},
  {icon:E.meat,label:"Côtelette",sub:"soin"},{icon:E.shield,label:"Bouclier bois",sub:"parade"},{icon:E.torch,label:"Torche",sub:"éclaire"},{icon:E.map,label:"Carte biome",sub:"orientation"},{icon:E.bow,label:"Arc enchanté",sub:"déflecte"},
  {icon:E.dragon,label:"Dragon d'End",sub:"immunité Creeper"},{icon:E.apple,label:"Pomme en Or",sub:"immunité Zombie"},{icon:E.sword,label:"Épée Diamant",sub:"immunité flèche"},{icon:E.sparkle,label:"Enchantement",sub:"immunité tout"},
  {icon:E.moon,label:"Enderman",sub:"vol de bloc"}, {icon:E.bomb,label:"TNT",sub:"Détruit 50 blocs"},
  {icon:E.book,label:"Livre Maudit",sub:"Événement aléatoire"}, {icon:E.fire,label:"Lac de Lave",sub:"Bloque TOUT LE MONDE"}, {icon:E.compass,label:"Portail Nether",sub:"+100 Blocs"},
  {icon:E.leaf,label:"Bloc Terre",sub:"Répare, mais limite 50"}, {icon:E.storm,label:"Foudre",sub:"Recul -50 & Arrête"}
);
export const CYBER=mkSkin(
  {icon:E.cyber,typeName:"Transfert"},{icon:E.battery,label:"Batterie vide",sub:"énergie"},{icon:E.hack,label:"DDoS Attack",sub:"crash"},{icon:E.lock,label:"Lockdown",sub:"firewall"},{icon:E.bolt,label:"Bridage FAI",sub:"ralenti"},{icon:E.glitch,label:"Virus Trojen",sub:"corrompu"},
  {icon:E.plug,label:"Fast Charge",sub:"énergie"},{icon:E.patch,label:"System Patch",sub:"fix"},{icon:E.unlock,label:"Override",sub:"bypass"},{icon:E.rocket,label:"Bande Passante",sub:"libre"},{icon:E.backup,label:"Restore Backup",sub:"nettoyé"},
  {icon:E.robot,label:"IA Autonome",sub:"immunité DDoS"},{icon:E.reactor,label:"Réacteur Arc",sub:"immunité batterie"},{icon:E.firewall,label:"Giga Firewall",sub:"immunité virus"},{icon:E.root,label:"Root Access",sub:"immunité tout"},
  {icon:E.eye,label:"Data Breach",sub:"vol de données"}, {icon:E.bomb,label:"Logic Bomb",sub:"Corrompt 50TB"},
  {icon:E.glitch,label:"Glitch Matrice",sub:"Événement aléatoire"}, {icon:E.lock,label:"Blackout Total",sub:"Bloque TOUT LE MONDE"}, {icon:E.bolt,label:"Overclocking",sub:"+100 TB"},
  {icon:E.backup,label:"Disquette",sub:"Répare, mais limite 50"}, {icon:E.skull,label:"Ransomware",sub:"Recul -50 & Arrête"}
);
export const SPACE=mkSkin(
  {icon:E.planet,typeName:"Saut Spatial"},{icon:E.fuel,label:"Plus de Plasma",sub:"panne"},{icon:E.asteroid,label:"Astéroïdes",sub:"dégâts"},{icon:E.blackhole,label:"Trou Noir",sub:"bloque"},{icon:E.ufo,label:"Chasseur Ennemi",sub:"danger"},{icon:E.laser,label:"Avarie Moteur",sub:"critique"},
  {icon:E.battery,label:"Cellule Plasma",sub:"recharge"},{icon:E.hammer,label:"Droïdes Rép.",sub:"soin"},{icon:E.ship,label:"Saut Hyperespace",sub:"libre"},{icon:E.radar,label:"Radar Dégagé",sub:"sécurité"},{icon:E.wrench,label:"Pièces Détachées",sub:"réparation"},
  {icon:E.shield,label:"Bouclier Déflec.",sub:"immunité astéroïde"},{icon:E.bolt,label:"Énergie Infinie",sub:"immunité plasma"},{icon:E.patch,label:"Moteur Renforcé",sub:"immunité avarie"},{icon:E.commander,label:"Vaisseau Amiral",sub:"immunité tout"},
  {icon:E.radar,label:"Rayon Tracteur",sub:"vol d'équipement"}, {icon:E.bomb,label:"Torpille Protons",sub:"Recul 50ps"},
  {icon:E.spiral,label:"Anomalie",sub:"Événement aléatoire"}, {icon:E.bolt,label:"I.E.M. Massive",sub:"Bloque TOUT LE MONDE"}, {icon:E.rocket,label:"Trou de Ver",sub:"+100 ps"},
  {icon:E.radar,label:"Duct Tape",sub:"Répare, mais limite 50"}, {icon:E.ufo,label:"Rayon IEM",sub:"Recul -50 & Arrête"}
);
export const APOCA=mkSkin(
  {icon:E.tire,typeName:"Miles"},{icon:E.water,label:"Plus d'Eau",sub:"déshydratation"},{icon:E.fire,label:"Moteur en Feu",sub:"surchauffe"},{icon:E.tornado,label:"Tempête Sable",sub:"visibilité 0"},{icon:E.mine,label:"Piste Minée",sub:"danger"},{icon:E.screw,label:"Clous sur Piste",sub:"crevaison"},
  {icon:E.barrel,label:"Citerne d'Eau",sub:"rempli"},{icon:E.gear,label:"Pièces Récup",sub:"réparation"},{icon:E.sun,label:"Ciel Dégagé",sub:"route libre"},{icon:E.road,label:"Voie Libre",sub:"accélération"},{icon:E.tire,label:"Roue Blindée",sub:"rechange"},
  {icon:E.mechanic,label:"Mécano de Génie",sub:"immunité feu"},{icon:E.droplet,label:"Oasis Secrète",sub:"immunité eau"},{icon:E.armor,label:"Pneus Increvables",sub:"immunité clous"},{icon:E.goggles,label:"Lunettes Infra.",sub:"immunité tempête"},
  {icon:E.axe,label:"Pillage",sub:"vol de ressource"}, {icon:E.bomb,label:"Roquette",sub:"Détruit 50 miles"},
  {icon:E.skull,label:"Pacte de Sang",sub:"Événement aléatoire"}, {icon:E.mine,label:"Champ de Mines",sub:"Bloque TOUT LE MONDE"}, {icon:E.fire,label:"Post-Combustion",sub:"+100 Miles"},
  {icon:E.wrench,label:"Bout d'Ferraille",sub:"Répare, mais limite 50"}, {icon:E.axe,label:"Embuscade",sub:"Recul -50 & Arrête"}
);
export const MEDIEVAL=mkSkin(
  {icon:E.horse,typeName:"Lieues"},{icon:E.meat,label:"Famine",sub:"affamé"},{icon:E.troll,label:"Embuscade",sub:"attaque"},{icon:E.bridge,label:"Pont-Levis levé",sub:"bloqué"},{icon:E.mud,label:"Route Boueuse",sub:"ralenti"},{icon:E.horseshoe,label:"Fer Perdu",sub:"boiteux"},
  {icon:E.bread,label:"Rations",sub:"nourri"},{icon:E.knight,label:"Renforts",sub:"sauvé"},{icon:E.castle,label:"Pont Abaissé",sub:"passage"},{icon:E.road,label:"Route Pavée",sub:"vitesse"},{icon:E.hammer,label:"Forgeron",sub:"ferré"},
  {icon:E.guard,label:"Garde Royale",sub:"immunité embuscade"},{icon:E.magic,label:"Abondance",sub:"immunité famine"},{icon:E.sparkle,label:"Fers Magiques",sub:"immunité fers"},{icon:E.pass,label:"Laissez-passer",sub:"immunité pont+boue"},
  {icon:E.ninja,label:"Pickpocket",sub:"vol de bourse"}, {icon:E.bomb,label:"Catapulte",sub:"Recul de 50"},
  {icon:E.scroll,label:"Décret Royal",sub:"Événement aléatoire"}, {icon:E.dragon,label:"Souffle Dragon",sub:"Bloque TOUT LE MONDE"}, {icon:E.knight,label:"Charge Héroïque",sub:"+100 Lieues"},
  {icon:E.hammer,label:"Bricolage",sub:"Répare, mais limite 50"}, {icon:E.bow,label:"Volée de Flèches",sub:"Recul -50 & Arrête"}
);

// ─── ASSASSIN'S CREED MIRAGE — Bagdad, age d'or islamique, infiltration ───
export const AC_MIRAGE=mkSkin(
  {icon:E.crescent,typeName:"Ruelles"},
  {icon:E.water,label:"Soif du désert",sub:"déshydraté"},
  {icon:E.eye,label:"Garde repéré",sub:"alerte"},
  {icon:E.moon,label:"Couvre-feu",sub:"patrouille"},
  {icon:E.scope,label:"Surveillance",sub:"ralenti"},
  {icon:E.paw,label:"Sandale brisée",sub:"boiteux"},
  {icon:E.jar,label:"Outre d'eau",sub:"hydraté"},
  {icon:E.hand,label:"Allié local",sub:"sauvé"},
  {icon:E.mask,label:"Manteau Hashashin",sub:"furtif"},
  {icon:E.scroll,label:"Tour de guet",sub:"vue dégagée"},
  {icon:E.hammer,label:"Cordonnier",sub:"ressemelé"},
  {icon:E.dagger,label:"Bayek",sub:"immunité combat"},
  {icon:E.leaf,label:"Oasis cachée",sub:"immunité soif"},
  {icon:E.shield,label:"Bottes Hashashin",sub:"immunité boiterie"},
  {icon:E.crown,label:"Cape de Maître",sub:"immunité couvre-feu+surv."},
  {icon:E.ninja,label:"Pickpocket",sub:"vol de bourse"},
  {icon:E.dagger,label:"Lame Cachée",sub:"-50 silencieux"},
  {icon:E.eye,label:"Saut de la Foi",sub:"Événement aléatoire"},
  {icon:E.bow,label:"Alarme du Bureau",sub:"Bloque TOUT LE MONDE"},
  {icon:E.eagle,label:"Eagle Vision",sub:"+100 Ruelles"},
  {icon:E.tools,label:"Outil d'Assassin",sub:"Répare, limite 50"},
  {icon:E.skull,label:"Lame Empoisonnée",sub:"Recul -50 & Arrête"}
);

// ─── ASSASSIN'S CREED BLACK FLAG — Caraibes, piraterie navale ───
export const AC_BF=mkSkin(
  {icon:E.anchor,typeName:"Noeuds"},
  {icon:E.wind,label:"Calme plat",sub:"sans vent"},
  {icon:E.pirate,label:"Voile déchirée",sub:"endommagé"},
  {icon:E.ship,label:"Marine Impériale",sub:"vaisseau royal"},
  {icon:E.water,label:"Eaux peu profondes",sub:"récifs"},
  {icon:E.hook,label:"Coque percée",sub:"voie d'eau"},
  {icon:E.wind,label:"Vent du large",sub:"brise retrouvée"},
  {icon:E.hammer,label:"Charpentier",sub:"réparé"},
  {icon:E.flag,label:"Hisser voiles",sub:"cap libre"},
  {icon:E.wave,label:"Eaux profondes",sub:"hors récifs"},
  {icon:E.wrench,label:"Calfat",sub:"coque colmatée"},
  {icon:E.crown,label:"Edward Kenway",sub:"immunité Marine"},
  {icon:E.wind,label:"Alizés éternels",sub:"immunité calme plat"},
  {icon:E.shield,label:"Coque renforcée",sub:"immunité avarie"},
  {icon:E.pirate,label:"Drapeau Noir",sub:"immunité Marine+récifs"},
  {icon:E.hook,label:"Abordage",sub:"vol d'or"},
  {icon:E.bomb,label:"Mortier",sub:"-50 explosif"},
  {icon:E.storm,label:"Tempête tropicale",sub:"Événement aléatoire"},
  {icon:E.boom,label:"Salve de Canon",sub:"Bloque TOUT LE MONDE"},
  {icon:E.rocket,label:"Vent en poupe",sub:"+100 Noeuds"},
  {icon:E.tools,label:"Rafistolage",sub:"Répare, limite 50"},
  {icon:E.anchor,label:"Boulet Chaîné",sub:"Recul -50 & Immobilise"}
);

// ─── LES SIMS — vie quotidienne, carrière, chaos domestique ───
export const SIMS=mkSkin(
  {icon:E.house,typeName:"Jours"},
  {icon:E.toilet,label:"Besoin critique",sub:"jauge rouge"},
  {icon:E.bed,label:"Burn-out",sub:"épuisement"},
  {icon:E.clock,label:"Retard au travail",sub:"planning"},
  {icon:E.sofa,label:"Télé en boucle",sub:"ralenti"},
  {icon:E.wrench2,label:"Évier cassé",sub:"fuite"},
  {icon:E.cake,label:"Pause goûter",sub:"jauge pleine"},
  {icon:E.bed,label:"Sieste réparatrice",sub:"énergie"},
  {icon:E.smile,label:"Humeur verte",sub:"repart"},
  {icon:E.calendar,label:"Agenda clair",sub:"planning"},
  {icon:E.broom,label:"Réparateur express",sub:"maison propre"},
  {icon:E.diamond,label:"Sim inspiré",sub:"immunité burn-out"},
  {icon:E.cake,label:"Frigo rempli",sub:"immunité besoin"},
  {icon:E.wrench2,label:"Maison rénovée",sub:"immunité fuite"},
  {icon:E.mirror,label:"Routine parfaite",sub:"immunité retard+TV"},
  {icon:E.hand,label:"Emprunt discret",sub:"vol d'objet"},
  {icon:E.toilet,label:"Facture impayée",sub:"-50 budget"},
  {icon:E.dice,label:"Drama de quartier",sub:"Événement aléatoire"},
  {icon:E.house,label:"Réunion de copro",sub:"Bloque tout le monde"},
  {icon:E.music,label:"Inspiration soudaine",sub:"+100 jours"},
  {icon:E.tools,label:"Bricolage maison",sub:"Répare, limite 50"},
  {icon:E.mask,label:"Crise existentielle",sub:"Recul -50 & arrêt"}
);

// ─── SEA OF THIEVES — aventure navale, trésors, tempêtes ───
export const SEA_THIEVES=mkSkin(
  {icon:E.anchor,typeName:"Noeuds"},
  {icon:E.wind,label:"Voiles molles",sub:"pas de vent"},
  {icon:E.cannon,label:"Bordée ennemie",sub:"canons"},
  {icon:E.kraken,label:"Tentacule du Kraken",sub:"bloqué"},
  {icon:E.fog,label:"Brume marine",sub:"ralenti"},
  {icon:E.water,label:"Coque fendue",sub:"voie d'eau"},
  {icon:E.wind,label:"Vent favorable",sub:"cap retrouvé"},
  {icon:E.hammer,label:"Charpentier de bord",sub:"répare"},
  {icon:E.flag,label:"Voiles hissées",sub:"repart"},
  {icon:E.compass2,label:"Carte nautique",sub:"cap clair"},
  {icon:E.tools,label:"Calfatage",sub:"coque saine"},
  {icon:E.pirate,label:"Capitaine légendaire",sub:"immunité canons"},
  {icon:E.rum,label:"Cale pleine",sub:"immunité calme"},
  {icon:E.shield,label:"Coque de chêne",sub:"immunité voie d'eau"},
  {icon:E.helm,label:"Maître navigateur",sub:"immunité brume+kraken"},
  {icon:E.hook,label:"Abordage ciblé",sub:"vol de butin"},
  {icon:E.cannon,label:"Salve de canon",sub:"-50 noeuds"},
  {icon:E.tornado,label:"Mer maudite",sub:"Événement aléatoire"},
  {icon:E.kraken,label:"Le Kraken surgit",sub:"Bloque tout le monde"},
  {icon:E.wave,label:"Pleine voile",sub:"+100 noeuds"},
  {icon:E.tools,label:"Réparations de fortune",sub:"Répare, limite 50"},
  {icon:E.anchor,label:"Ancre arrachée",sub:"Recul -50 & arrêt"}
);

// ─── HADES — enfer mythologique, ombres, feu et dieux ───
export const HADES=mkSkin(
  {icon:E.flame,typeName:"Ombres"},
  {icon:E.pomegranate,label:"Sang desséché",sub:"vigueur"},
  {icon:E.spear,label:"Furie déchaînée",sub:"combat"},
  {icon:E.flame,label:"Porte du Tartare",sub:"bloqué"},
  {icon:E.shade,label:"Chaînes du Styx",sub:"ralenti"},
  {icon:E.obsidian,label:"Armure brisée",sub:"blessure"},
  {icon:E.pomegranate,label:"Grenade sacrée",sub:"vigueur"},
  {icon:E.laurel,label:"Faveur divine",sub:"sauvé"},
  {icon:E.torch,label:"Pacte relancé",sub:"repart"},
  {icon:E.lyre,label:"Chant d'Orphée",sub:"chaînes levées"},
  {icon:E.hammer,label:"Marteau de Dédale",sub:"réparé"},
  {icon:E.crown,label:"Bénédiction d'Athéna",sub:"immunité furie"},
  {icon:E.flame,label:"Flamme éternelle",sub:"immunité vigueur"},
  {icon:E.shield,label:"Égide infernale",sub:"immunité blessure"},
  {icon:E.skull2,label:"Pacte d'Hadès",sub:"immunité tartare+styx"},
  {icon:E.hand,label:"Faveur dérobée",sub:"vol de boon"},
  {icon:E.flame,label:"Malédiction du Styx",sub:"-50 ombres"},
  {icon:E.dice,label:"Jugement des Moires",sub:"Événement aléatoire"},
  {icon:E.spear,label:"Colère des Erinyes",sub:"Bloque tout le monde"},
  {icon:E.bolt,label:"Dash infernal",sub:"+100 ombres"},
  {icon:E.hammer,label:"Réforge de Dédale",sub:"Répare, limite 50"},
  {icon:E.skull,label:"Sentence d'Hadès",sub:"Recul -50 & arrêt"}
);

// ─── MAFIA — prohibition, poursuites, jazz noir années 30 ───
export const MAFIA=mkSkin(
  {icon:E.car,typeName:"Rues"},
  {icon:E.gas,label:"Réservoir à sec",sub:"essence"},
  {icon:E.police,label:"Descente de police",sub:"rafle"},
  {icon:E.redlight,label:"Barrage fédéral",sub:"contrôle"},
  {icon:E.fog,label:"Rue bouclée",sub:"ralenti"},
  {icon:E.tire,label:"Pneu crevé",sub:"poursuite"},
  {icon:E.gas,label:"Bidon clandestin",sub:"plein"},
  {icon:E.wrench,label:"Mécano du quartier",sub:"réparé"},
  {icon:E.hat,label:"Feu vert du boss",sub:"repart"},
  {icon:E.newspaper,label:"Itinéraire sûr",sub:"barrage levé"},
  {icon:E.tire,label:"Roue de rechange",sub:"pneu"},
  {icon:E.coat,label:"Chauffeur d'élite",sub:"immunité police"},
  {icon:E.briefcase,label:"Réserve du boss",sub:"immunité essence"},
  {icon:E.shield,label:"Pneus blindés",sub:"immunité crevaison"},
  {icon:E.hat,label:"Influence locale",sub:"immunité barrage+rue"},
  {icon:E.hand,label:"Pickpocket de bar",sub:"vol de carte"},
  {icon:E.bomb,label:"Voiture piégée",sub:"-50 rues"},
  {icon:E.dice,label:"Nuit au speakeasy",sub:"Événement aléatoire"},
  {icon:E.police,label:"Couvre-feu policier",sub:"Bloque tout le monde"},
  {icon:E.sax,label:"Route du jazz",sub:"+100 rues"},
  {icon:E.tools,label:"Réparation clandestine",sub:"Répare, limite 50"},
  {icon:E.mask,label:"Trahison de gang",sub:"Recul -50 & arrêt"}
);

// ─── SEKIRO — folklore japonais, pluie, sanctuaires, duel et discrétion ───
export const SEKIRO=mkSkin(
  {icon:E.torii,typeName:"Pas"},
  {icon:E.rice,label:"Rations vides",sub:"fatigue"},
  {icon:E.katana,label:"Ashigaru embusqué",sub:"combat"},
  {icon:E.rain,label:"Pont noyé",sub:"bloqué"},
  {icon:E.bamboo,label:"Forêt de bambous",sub:"ralenti"},
  {icon:E.horseshoe,label:"Monture blessée",sub:"boiteux"},
  {icon:E.rice,label:"Boule de riz",sub:"rations"},
  {icon:E.katana,label:"Parade parfaite",sub:"sauvé"},
  {icon:E.torii,label:"Chemin du sanctuaire",sub:"repart"},
  {icon:E.fan,label:"Carte du clan",sub:"voie claire"},
  {icon:E.hammer,label:"Forgeron shinobi",sub:"réparé"},
  {icon:E.fox,label:"Esprit Kitsune",sub:"immunité embuscade"},
  {icon:E.lotus,label:"Bénédiction du temple",sub:"immunité faim"},
  {icon:E.shield,label:"Selle de guerre",sub:"immunité blessure"},
  {icon:E.prayer,label:"Sceau du moine",sub:"immunité pont+bambous"},
  {icon:E.ninja,label:"Main shinobi",sub:"vol d'outil"},
  {icon:E.katana,label:"Coup mortel",sub:"-50 pas"},
  {icon:E.scroll,label:"Conte de yokai",sub:"Événement aléatoire"},
  {icon:E.rain,label:"Orage sur Ashina",sub:"Bloque tout le monde"},
  {icon:E.torii,label:"Pas fantôme",sub:"+100 pas"},
  {icon:E.tools,label:"Prothèse réparée",sub:"Répare, limite 50"},
  {icon:E.skull,label:"Malédiction rouge",sub:"Recul -50 & arrêt"}
);

// ─── PAYDAY 3 — braquage moderne, fuite, cash et tactique ───
export const PAYDAY=mkSkin(
  {icon:E.cashbag,typeName:"Butin"},
  {icon:E.fuel,label:"Fourgon à sec",sub:"carburant"},
  {icon:E.siren,label:"Assaut SWAT",sub:"police"},
  {icon:E.lock,label:"Confinement banque",sub:"bloqué"},
  {icon:E.camera,label:"Caméras actives",sub:"ralenti"},
  {icon:E.tire,label:"Herse de police",sub:"pneu"},
  {icon:E.fuel,label:"Jerrycan planqué",sub:"plein"},
  {icon:E.drill,label:"Kit de fuite",sub:"réparé"},
  {icon:E.mask2,label:"Masque en place",sub:"go loud"},
  {icon:E.keypad,label:"Boucle caméra",sub:"surveillance"},
  {icon:E.tire,label:"Pneus runflat",sub:"rechange"},
  {icon:E.shield,label:"Gilet lourd",sub:"immunité SWAT"},
  {icon:E.briefcase,label:"Plan B",sub:"immunité carburant"},
  {icon:E.tire,label:"Runflat pro",sub:"immunité herse"},
  {icon:E.hacker,label:"ECM Expert",sub:"immunité lock+caméras"},
  {icon:E.hand,label:"Vol de sac",sub:"vol de carte"},
  {icon:E.bomb,label:"C4 sur le pont",sub:"-50 butin"},
  {icon:E.dice,label:"Plan qui dérape",sub:"Événement aléatoire"},
  {icon:E.siren,label:"Assaut général",sub:"Bloque tout le monde"},
  {icon:E.escape,label:"Fuite parfaite",sub:"+100 butin"},
  {icon:E.tools,label:"Réparation de planque",sub:"Répare, limite 50"},
  {icon:E.hack,label:"Blackout sécurité",sub:"Recul -50 & arrêt"}
);

export const SKINS={classic:CLASSIC,zelda:ZELDA,mario:MARIO,craft:CRAFT,cyber:CYBER,space:SPACE,apoca:APOCA,medieval:MEDIEVAL,ac_mirage:AC_MIRAGE,ac_bf:AC_BF,sims:SIMS,sea_thieves:SEA_THIEVES,hades:HADES,mafia:MAFIA,sekiro:SEKIRO,payday:PAYDAY};

// ─── 10 ARCHETYPES DE CARTES INEDITES × 8 THEMES = 80 DEFINITIONS ────────
// Chaque archetype represente une MECANIQUE unique. Chaque theme habille les 10 archetypes
// avec son propre lexique visuel (icone + nom + sub thematique).
// Dans le deck, chaque archetype apparait 2 fois => 20 cartes nouvelles par theme.
//
// MECANIQUES (definies dans apply*) :
//   boost50, boost75, boost100 : +N km a soi (type=boost)
//   shield, shieldPlus         : +1 / +2 tank_shield (type=shield)
//   trapMinor, trapMajor       : -30/-50 km + speedLimit (type=attack, isTrap)
//   draw                       : pioche 3 cartes (type=draw)
//   slow                       : -25 km a la cible, sans hazard (type=attack, isSlow)
//   reroll                     : defausse main, repioche 10 (type=reroll)

export const SKIN_EXTRAS = {
  classic: {
    boost50:    {icon:"💨", label:"Petit Boost",       sub:"+50 km bonus"},
    boost75:    {icon:"⚡", label:"Coup de Boost",     sub:"+75 km bonus"},
    boost100:   {icon:"🚀", label:"Turbo",             sub:"+100 km express"},
    shield:     {icon:"🛡", label:"Garde-Boue",        sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Pare-Chocs Renforcé",sub:"+2 blindage"},
    trapMinor:  {icon:"🛑", label:"Contrôle Radar",    sub:"-30 km & limite"},
    trapMajor:  {icon:"🚧", label:"Barrage Sauvage",   sub:"-50 km & limite"},
    draw:       {icon:"🎴", label:"Pause Café",        sub:"Pioche 3 cartes"},
    slow:       {icon:"🐌", label:"Bouchon",           sub:"-25 km cible"},
    reroll:     {icon:"♻", label:"Nouveau Plan",      sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🎰", label:"Joker Route",       sub:"+60 km (toujours valide)"},
    doublePlay: {icon:"🔂", label:"Double Tour",       sub:"+40 km + pioche 1"},
  },
  zelda: {
    boost50:    {icon:"🍃", label:"Souffle Sheikah",   sub:"+50 lieues"},
    boost75:    {icon:"🦅", label:"Rage de Revali",    sub:"+75 lieues"},
    boost100:   {icon:"⚡", label:"Vol Divin",         sub:"+100 lieues"},
    shield:     {icon:"🛡", label:"Bouclier de Hyrule",sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Bouclier Royal",    sub:"+2 blindage"},
    trapMinor:  {icon:"🕸", label:"Piège Yiga",        sub:"-30 & ralenti"},
    trapMajor:  {icon:"🌑", label:"Malédiction Ganon", sub:"-50 & ralenti"},
    draw:       {icon:"📜", label:"Tablette Sheikah",  sub:"Pioche 3 cartes"},
    slow:       {icon:"🐢", label:"Boue de Hyrule",    sub:"-25 lieues cible"},
    reroll:     {icon:"🌀", label:"Sanctuaire",        sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🍀", label:"Bénédiction Korogu",sub:"+60 lieues (toujours valide)"},
    doublePlay: {icon:"⚜", label:"Élan d'Hylia",       sub:"+40 lieues + pioche 1"},
  },
  mario: {
    boost50:    {icon:"🍄", label:"Champi Costaud",    sub:"+50 étoiles"},
    boost75:    {icon:"⭐", label:"Champignon Or",     sub:"+75 étoiles"},
    boost100:   {icon:"🌟", label:"Étoile d'Invincibilité",sub:"+100 étoiles"},
    shield:     {icon:"⭐", label:"Bouclier Étoile",   sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Carapace Kart",     sub:"+2 blindage"},
    trapMinor:  {icon:"🍌", label:"Peau de Banane",    sub:"-30 & dérapage"},
    trapMajor:  {icon:"💣", label:"Bob-omb Géant",     sub:"-50 & dérapage"},
    draw:       {icon:"📦", label:"Boîte à Objets",    sub:"Pioche 3 cartes"},
    slow:       {icon:"🐌", label:"Carapace Bleue",    sub:"-25 étoiles cible"},
    reroll:     {icon:"🔄", label:"Téléportation Warp",sub:"Défausse & repioche 10"},
    wildCard:   {icon:"❓", label:"Bloc Mystère",      sub:"+60 étoiles (toujours valide)"},
    doublePlay: {icon:"🪙", label:"Pièce d'Or",        sub:"+40 étoiles + pioche 1"},
  },
  craft: {
    boost50:    {icon:"🚂", label:"Rails Express",     sub:"+50 blocs"},
    boost75:    {icon:"🚂", label:"Wagon Express",     sub:"+75 blocs"},
    boost100:   {icon:"🚀", label:"Portail Nether",    sub:"+100 blocs"},
    shield:     {icon:"🛡", label:"Armure Diamant",    sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Armure Netherite",  sub:"+2 blindage"},
    trapMinor:  {icon:"🕳", label:"Piège à Mobs",      sub:"-30 & ralenti"},
    trapMajor:  {icon:"💥", label:"TNT en Chaîne",     sub:"-50 & ralenti"},
    draw:       {icon:"📖", label:"Livre Enchanté",    sub:"Pioche 3 cartes"},
    slow:       {icon:"🕸", label:"Toile d'Araignée",  sub:"-25 blocs cible"},
    reroll:     {icon:"🔮", label:"Œil de l'Ender",    sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💎", label:"Bloc Diamant",      sub:"+60 blocs (toujours valide)"},
    doublePlay: {icon:"⛏", label:"Pioche Bénie",       sub:"+40 blocs + pioche 1"},
  },
  cyber: {
    boost50:    {icon:"⚡", label:"Boost Néon",        sub:"+50 TB"},
    boost75:    {icon:"🔋", label:"Overclock",         sub:"+75 TB"},
    boost100:   {icon:"🚀", label:"Burst Quantique",   sub:"+100 TB"},
    shield:     {icon:"🛡", label:"Pare-Feu",          sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Pare-Feu IA",       sub:"+2 blindage"},
    trapMinor:  {icon:"📛", label:"Trojan Cheval",     sub:"-30 TB & lag"},
    trapMajor:  {icon:"🦠", label:"Ransomware",        sub:"-50 TB & lag"},
    draw:       {icon:"💾", label:"Backup Cloud",      sub:"Pioche 3 cartes"},
    slow:       {icon:"🐌", label:"Throttling FAI",    sub:"-25 TB cible"},
    reroll:     {icon:"🔄", label:"Reboot Système",    sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🪙", label:"Crypto-Wildcard",   sub:"+60 TB (toujours valide)"},
    doublePlay: {icon:"⏩", label:"Burst CPU",          sub:"+40 TB + pioche 1"},
  },
  space: {
    boost50:    {icon:"🚀", label:"Propulseur Ionique",sub:"+50 parsecs"},
    boost75:    {icon:"🚀", label:"Post-Combustion",   sub:"+75 parsecs"},
    boost100:   {icon:"🌠", label:"Saut Hyperspatial", sub:"+100 parsecs"},
    shield:     {icon:"🛰", label:"Bouclier Déflec.",  sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Bouclier Plasma",   sub:"+2 blindage"},
    trapMinor:  {icon:"☄", label:"Champ Astéroïdes",  sub:"-30 & dérive"},
    trapMajor:  {icon:"🕳", label:"Trou Noir Local",   sub:"-50 & dérive"},
    draw:       {icon:"📡", label:"Scan Longue Portée",sub:"Pioche 3 cartes"},
    slow:       {icon:"🛸", label:"Rayon Tracteur",    sub:"-25 parsecs cible"},
    reroll:     {icon:"🌌", label:"Pliage Espace",     sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🌟", label:"Étoile Filante",    sub:"+60 ps (toujours valide)"},
    doublePlay: {icon:"☄", label:"Comète Tractée",     sub:"+40 ps + pioche 1"},
  },
  apoca: {
    boost50:    {icon:"🔥", label:"Mode Berserk",      sub:"+50 miles"},
    boost75:    {icon:"🔥", label:"Nitro Bricolé",     sub:"+75 miles"},
    boost100:   {icon:"💥", label:"Réservoir Détonant",sub:"+100 miles"},
    shield:     {icon:"🛡", label:"Plaques Blindées",  sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"War Rig Armor",     sub:"+2 blindage"},
    trapMinor:  {icon:"💀", label:"Embuscade",         sub:"-30 & ralenti"},
    trapMajor:  {icon:"🪤", label:"Pillage Brutal",    sub:"-50 & ralenti"},
    draw:       {icon:"🛢", label:"Stock de Survie",   sub:"Pioche 3 cartes"},
    slow:       {icon:"🏜", label:"Tempête de Sable",  sub:"-25 miles cible"},
    reroll:     {icon:"🔧", label:"Bricolage Total",   sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💀", label:"Roue de Fortune",   sub:"+60 miles (toujours valide)"},
    doublePlay: {icon:"⛽", label:"Réserve Cachée",     sub:"+40 miles + pioche 1"},
  },
  medieval: {
    boost50:    {icon:"🐎", label:"Trot Royal",        sub:"+50 lieues"},
    boost75:    {icon:"🐎", label:"Galop Royal",       sub:"+75 lieues"},
    boost100:   {icon:"⚔", label:"Charge des Croisés", sub:"+100 lieues"},
    shield:     {icon:"🛡", label:"Bouclier Croisé",   sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Bouclier Templier", sub:"+2 blindage"},
    trapMinor:  {icon:"🏹", label:"Volée d'Archers",   sub:"-30 & ralenti"},
    trapMajor:  {icon:"🐲", label:"Souffle Dragon",    sub:"-50 & ralenti"},
    draw:       {icon:"📜", label:"Parchemin Royal",   sub:"Pioche 3 cartes"},
    slow:       {icon:"🟤", label:"Boue Profonde",     sub:"-25 lieues cible"},
    reroll:     {icon:"✨", label:"Bénédiction",       sub:"Défausse & repioche 10"},
    wildCard:   {icon:"👑", label:"Faveur Royale",     sub:"+60 lieues (toujours valide)"},
    doublePlay: {icon:"🐎", label:"Cheval Frais",      sub:"+40 lieues + pioche 1"},
  },
  ac_mirage: {
    boost50:    {icon:"🌙", label:"Course des Toits",   sub:"+50 ruelles"},
    boost75:    {icon:"🦅", label:"Saut de la Foi",     sub:"+75 ruelles"},
    boost100:   {icon:"✨", label:"Maîtrise du Credo",  sub:"+100 ruelles"},
    shield:     {icon:"🛡", label:"Cape d'Ombre",       sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Armure Hashashin",   sub:"+2 blindage"},
    trapMinor:  {icon:"🪤", label:"Piège à Garde",      sub:"-30 & ralenti"},
    trapMajor:  {icon:"💣", label:"Bombe Fumigène",     sub:"-50 & ralenti"},
    draw:       {icon:"📖", label:"Codex d'Altaïr",     sub:"Pioche 3 cartes"},
    slow:       {icon:"🌫", label:"Brume des Souks",    sub:"-25 ruelles cible"},
    reroll:     {icon:"🕊", label:"Communion Silencieuse",sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🗝", label:"Clé du Bureau",       sub:"+60 ruelles (toujours valide)"},
    doublePlay: {icon:"🏛", label:"Sanctuaire Caché",    sub:"+40 ruelles + pioche 1"},
  },
  ac_bf: {
    boost50:    {icon:"⛵", label:"Vent arrière",       sub:"+50 noeuds"},
    boost75:    {icon:"💨", label:"Bordée tribord",     sub:"+75 noeuds"},
    boost100:   {icon:"🌊", label:"Cap des Tempêtes",   sub:"+100 noeuds"},
    shield:     {icon:"🛡", label:"Coque renforcée",    sub:"+1 blindage"},
    shieldPlus: {icon:"⚓", label:"Forteresse flottante",sub:"+2 blindage"},
    trapMinor:  {icon:"🪝", label:"Grappin",            sub:"-30 & ralenti"},
    trapMajor:  {icon:"💣", label:"Mortier de proue",   sub:"-50 & ralenti"},
    draw:       {icon:"📜", label:"Lettre de marque",   sub:"Pioche 3 cartes"},
    slow:       {icon:"🪸", label:"Banc de corail",     sub:"-25 noeuds cible"},
    reroll:     {icon:"🏴‍☠️", label:"Pavillon Noir",     sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💰", label:"Trésor Caché",       sub:"+60 noeuds (toujours valide)"},
    doublePlay: {icon:"🦜", label:"Vigie Chanceuse",     sub:"+40 noeuds + pioche 1"},
  },
  sims: {
    boost50:    {icon:"☕", label:"Café serré",          sub:"+50 jours"},
    boost75:    {icon:"🎨", label:"Inspiration",         sub:"+75 jours"},
    boost100:   {icon:"💼", label:"Promotion express",  sub:"+100 jours"},
    shield:     {icon:"🧹", label:"Maison rangée",      sub:"+1 blindage"},
    shieldPlus: {icon:"🏠", label:"Villa optimisée",    sub:"+2 blindage"},
    trapMinor:  {icon:"📬", label:"Factures",           sub:"-30 & stress"},
    trapMajor:  {icon:"🚽", label:"Toilettes cassées",  sub:"-50 & stress"},
    draw:       {icon:"🛒", label:"Shopping déco",      sub:"Pioche 3 cartes"},
    slow:       {icon:"📺", label:"Série addictive",    sub:"-25 jours cible"},
    reroll:     {icon:"🪞", label:"Recréer le foyer",   sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💠", label:"Point de bonheur",   sub:"+60 jours (toujours valide)"},
    doublePlay: {icon:"🎵", label:"Fête improvisée",    sub:"+40 jours + pioche 1"},
  },
  sea_thieves: {
    boost50:    {icon:"⛵", label:"Brise arrière",      sub:"+50 noeuds"},
    boost75:    {icon:"🌊", label:"Vague porteuse",     sub:"+75 noeuds"},
    boost100:   {icon:"🏴‍☠️", label:"Pleine voile",      sub:"+100 noeuds"},
    shield:     {icon:"🛡", label:"Planches neuves",    sub:"+1 blindage"},
    shieldPlus: {icon:"⚓", label:"Coque de galion",     sub:"+2 blindage"},
    trapMinor:  {icon:"🪸", label:"Récif caché",        sub:"-30 & dérive"},
    trapMajor:  {icon:"🐙", label:"Kraken en chasse",   sub:"-50 & dérive"},
    draw:       {icon:"🧭", label:"Carte au trésor",    sub:"Pioche 3 cartes"},
    slow:       {icon:"🌫", label:"Brouillard salé",    sub:"-25 noeuds cible"},
    reroll:     {icon:"🍺", label:"Taverne bruyante",   sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💰", label:"Coffre maudit",      sub:"+60 noeuds (toujours valide)"},
    doublePlay: {icon:"🦜", label:"Perroquet vigie",    sub:"+40 noeuds + pioche 1"},
  },
  hades: {
    boost50:    {icon:"🔥", label:"Dash infernal",      sub:"+50 ombres"},
    boost75:    {icon:"🔱", label:"Faveur de Poséidon", sub:"+75 ombres"},
    boost100:   {icon:"⚡", label:"Foudre de Zeus",     sub:"+100 ombres"},
    shield:     {icon:"🛡", label:"Égide bénie",        sub:"+1 blindage"},
    shieldPlus: {icon:"🏺", label:"Pacte divin",        sub:"+2 blindage"},
    trapMinor:  {icon:"👤", label:"Ombre collante",     sub:"-30 & entrave"},
    trapMajor:  {icon:"☠️", label:"Sentence des Moires",sub:"-50 & entrave"},
    draw:       {icon:"🎻", label:"Chant d'Orphée",     sub:"Pioche 3 cartes"},
    slow:       {icon:"⛓", label:"Chaînes du Styx",     sub:"-25 ombres cible"},
    reroll:     {icon:"🍎", label:"Contrat renégocié",  sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🏺", label:"Boon imprévu",       sub:"+60 ombres (toujours valide)"},
    doublePlay: {icon:"🔥", label:"Double dash",        sub:"+40 ombres + pioche 1"},
  },
  mafia: {
    boost50:    {icon:"🎷", label:"Route du jazz",      sub:"+50 rues"},
    boost75:    {icon:"💵", label:"Paie du boss",       sub:"+75 rues"},
    boost100:   {icon:"🚘", label:"Fuite en V8",        sub:"+100 rues"},
    shield:     {icon:"🧥", label:"Manteau blindé",     sub:"+1 blindage"},
    shieldPlus: {icon:"🎩", label:"Protection du boss", sub:"+2 blindage"},
    trapMinor:  {icon:"📰", label:"Balance au journal", sub:"-30 & pression"},
    trapMajor:  {icon:"🚨", label:"Descente fédérale",  sub:"-50 & pression"},
    draw:       {icon:"💼", label:"Mallette livrée",    sub:"Pioche 3 cartes"},
    slow:       {icon:"🚧", label:"Rue barrée",         sub:"-25 rues cible"},
    reroll:     {icon:"🥃", label:"Speakeasy",          sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💵", label:"Pot-de-vin",         sub:"+60 rues (toujours valide)"},
    doublePlay: {icon:"🎩", label:"Double alibi",       sub:"+40 rues + pioche 1"},
  },
  sekiro: {
    boost50:    {icon:"⛩️", label:"Pas du sanctuaire",  sub:"+50 pas"},
    boost75:    {icon:"🦊", label:"Faveur Kitsune",     sub:"+75 pas"},
    boost100:   {icon:"⚔️", label:"Ruée shinobi",       sub:"+100 pas"},
    shield:     {icon:"📿", label:"Sceau protecteur",   sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Armure du clan",     sub:"+2 blindage"},
    trapMinor:  {icon:"🎋", label:"Bambous piégés",     sub:"-30 & entrave"},
    trapMajor:  {icon:"🌧️", label:"Orage d'Ashina",    sub:"-50 & entrave"},
    draw:       {icon:"📜", label:"Parchemin secret",   sub:"Pioche 3 cartes"},
    slow:       {icon:"🪷", label:"Brume du temple",    sub:"-25 pas cible"},
    reroll:     {icon:"🪭", label:"Conseil du moine",   sub:"Défausse & repioche 10"},
    wildCard:   {icon:"🍙", label:"Offrande discrète",  sub:"+60 pas (toujours valide)"},
    doublePlay: {icon:"⚔️", label:"Double parade",      sub:"+40 pas + pioche 1"},
  },
  payday: {
    boost50:    {icon:"🚐", label:"Fuite rapide",       sub:"+50 butin"},
    boost75:    {icon:"💰", label:"Sac bonus",          sub:"+75 butin"},
    boost100:   {icon:"🏦", label:"Jackpot au coffre",  sub:"+100 butin"},
    shield:     {icon:"🛡", label:"Gilet tactique",     sub:"+1 blindage"},
    shieldPlus: {icon:"🛡", label:"Armure lourde",      sub:"+2 blindage"},
    trapMinor:  {icon:"📷", label:"Caméra repérée",     sub:"-30 & alerte"},
    trapMajor:  {icon:"🚨", label:"Assaut SWAT",        sub:"-50 & alerte"},
    draw:       {icon:"💼", label:"Briefing du fixeur", sub:"Pioche 3 cartes"},
    slow:       {icon:"🪚", label:"Perceuse bloquée",   sub:"-25 butin cible"},
    reroll:     {icon:"⌨️", label:"Plan B",             sub:"Défausse & repioche 10"},
    wildCard:   {icon:"💵", label:"Cash non marqué",    sub:"+60 butin (toujours valide)"},
    doublePlay: {icon:"🎭", label:"Switch de masque",   sub:"+40 butin + pioche 1"},
  },
};

export function buildThemeDeepCards(skin, ex, unit){
  const remix = (base, suffix, fallback) => {
    const label = base?.label || fallback;
    const icon = base?.icon || "✨";
    return {icon, label:`${label} ${suffix}`.trim()};
  };
  const shortUnit = unit || "km";
  return [
    {...remix(ex.trapMinor, "tactique", "Piège tactique"), value:"trap_minor", type:"attack", isTrap:true, sub:"-30 & limite"},
    {...remix(ex.trapMajor, "brutal", "Piège brutal"), value:"trap_major", type:"attack", isTrap:true, isTrapPlus:true, sub:"-50 & limite"},
    {...remix(ex.slow, "collant", "Ralentissement"), value:"slow", type:"attack", isSlow:true, sub:"-25 cible"},
    {...remix(skin.limite, "renforcée", "Limite renforcée"), value:"limite", type:"attack", sub:"limite cible"},
    {...remix(skin.feu_rouge, "d'urgence", "Arrêt d'urgence"), value:"feu_rouge", type:"attack", sub:"bloque cible"},
    {...remix(skin.panne_essence, "sournoise", "Panne sournoise"), value:"panne_essence", type:"attack", sub:"panne cible"},

    {...remix(skin.essence, "plus", "Ravitaillement plus"), value:"essence", type:"remedy", fixes:"panne_essence", sub:"soigne panne"},
    {...remix(skin.reparation, "rapide", "Réparation rapide"), value:"reparation", type:"remedy", fixes:"accident", sub:"soigne accident"},
    {...remix(skin.roue, "de secours", "Secours roue"), value:"roue", type:"remedy", fixes:"crevaison", sub:"soigne crevaison"},
    {...remix(skin.feu_vert, "clair", "Relance claire"), value:"feu_vert", type:"remedy", fixes:"feu_rouge", sub:"redémarre"},
    {...remix(skin.bricolage, "premium", "Kit premium"), value:"premium", type:"remedy", sub:"répare tout"},

    {...remix(ex.boost50, "court", "Boost court"), value:"boost50", type:"boost", sub:`+50 ${shortUnit}`},
    {...remix(ex.boost75, "nerveux", "Boost nerveux"), value:"boost75", type:"boost", sub:`+75 ${shortUnit}`},
    {...remix(ex.boost100, "maître", "Boost maître"), value:"boost100", type:"boost", sub:`+100 ${shortUnit}`},
    {...remix(ex.wildCard, "libre", "Joker libre"), value:"wildcard", type:"boost", isWild:true, sub:`+60 ${shortUnit} libre`},
    {...remix(ex.doublePlay, "enchaîné", "Action enchaînée"), value:"doubleplay", type:"boost", isDouble:true, sub:`+40 ${shortUnit} + pioche`},

    {...remix(ex.shield, "stable", "Protection stable"), value:"shield_1", type:"shield", sub:"+1 blindage"},
    {...remix(ex.shieldPlus, "élite", "Protection élite"), value:"shield_2", type:"shield", isShieldPlus:true, sub:"+2 blindage"},
    {...remix(ex.draw, "préparé", "Ressource préparée"), value:"draw3", type:"draw", sub:"pioche 3"},
    {...remix(ex.reroll, "total", "Plan total"), value:"reroll", type:"reroll", sub:"repioche 10"},
  ].map((c, i) => ({...c, expansionTier:"deep-theme", deepIndex:i}));
}

// Bibles de themes : contenu exploitable par l'UI, les shops, les evenements et le filtrage.
// Chaque theme garde son lexique, ses PNJ, sa charte HUD, ses evenements et ses noms de cartes.
export const THEME_CONTENT = {
  sims: {
    identity:"Vie quotidienne chaotique, simulation sociale, humour domestique et objectifs de carrière.",
    ui:{materials:"plastique glossy, bulles vertes, panneaux arrondis", cardStyle:"cartes pastel avec icône de besoin en médaillon", hud:"jauges propres, badges humeur, notifications façon agenda", palette:["#7dd3fc","#86efac","#facc15","#fb7185"]},
    audio:{intent:"pop légère de simulation, marimba doux, pizzicati, petits jingles de réussite et sons de maison."},
    attacks:["Besoin critique","Burn-out","Retard au travail","Télé en boucle","Évier cassé","Factures surprises","Voisin bruyant","Crise d'ado","Fuite au lavabo","Panne de frigo"],
    remedies:["Pause goûter","Sieste réparatrice","Humeur verte","Agenda clair","Réparateur express","Douche énergisante","Café serré","Repas familial","Aide du coloc","Nettoyage express"],
    protections:["Routine parfaite","Frigo rempli","Maison rénovée","Sim inspiré","Assurance habitation"],
    vehicles:["Compacte familiale","Vélo de quartier","Van familial","Scooter urbain","Trottinette électrique","Voiture de carrière","Bus scolaire","Caddie de jardin"],
    events:[
      {title:"Fête de quartier",desc:"Tous progressent avec une humeur positive.",icon:"🎵",effect:"gainAll70"},
      {title:"Factures en retard",desc:"Le leader perd du rythme administratif.",icon:"📬",effect:"lossLeader60"},
      {title:"Promotion surprise",desc:"Le dernier reçoit un vrai coup de pouce.",icon:"💼",effect:"boostLast130"},
      {title:"Plombier efficace",desc:"Toutes les pannes domestiques sont nettoyées.",icon:"🔧",effect:"clearHazards"},
      {title:"Coupure de courant",desc:"Tout le monde s'arrête un instant.",icon:"💡",effect:"stopAll"},
      {title:"Vide-grenier",desc:"Hasard de voisinage : avance ou retard.",icon:"🛒",effect:"randomSwing"},
      {title:"Routine gagnante",desc:"Les limites de planning sautent.",icon:"📅",effect:"clearLimits"},
      {title:"Grand ménage",desc:"Les joueurs bloqués repartent.",icon:"🧹",effect:"rescue"},
      {title:"Nouvelle aspiration",desc:"Tout le monde gagne un objectif clair.",icon:"💠",effect:"gainAll90"},
      {title:"Drama familial",desc:"Tout le monde reçoit une limite temporaire.",icon:"😵",effect:"speedLimitAll"}
    ],
    shop:{title:"Boutique Mode Achat",npc:"Mila Plumbob",desc:"Meubles, services et solutions de crise pour foyer débordé.",items:["Sieste premium","Réparateur express","Café de carrière","Assurance maison","Point de bonheur"],phrases:["Sul sul, besoin d'un coup de pouce ?","Ta jauge sociale fait peur.","J'ai un réparateur qui arrive vite.","Ce canapé est presque stratégique.","Une promotion, ça se prépare.","Factures ? Je connais quelqu'un.","Ton foyer manque de confort.","Un petit café et ça repart.","Ne laisse pas l'évier décider de la partie.","Dag dag, reviens avec des simflouz."]}
  },
  sea_thieves: {
    identity:"Aventure pirate lisible, navigation, trésors, risques de mer et équipage bruyant.",
    ui:{materials:"bois humide, cuivre, cordages, parchemins", cardStyle:"cartes parchemin salé avec bord usé", hud:"boussole, jauges nautiques, éclats dorés", palette:["#0ea5e9","#f59e0b","#14532d","#7c2d12"]},
    audio:{intent:"sea shanty synthétique, concertina, tambours de pont, bois qui craque, impacts de canon."},
    attacks:["Voiles molles","Bordée ennemie","Tentacule du Kraken","Brume marine","Coque fendue","Récif caché","Mutinerie","Soute inondée","Cap perdu","Sirènes perfides"],
    remedies:["Vent favorable","Charpentier de bord","Voiles hissées","Carte nautique","Calfatage","Rhum de courage","Vigie attentive","Nouveau gouvernail","Pompe de cale","Port franc"],
    protections:["Capitaine légendaire","Cale pleine","Coque de chêne","Maître navigateur","Pavillon noir"],
    vehicles:["Sloop léger","Brigantin","Galion marchand","Chaloupe rapide","Frégate pirate","Jonque de contrebande","Galion royal capturé","Barque de naufragé"],
    events:[
      {title:"Vents favorables",desc:"Toute la flotte avance.",icon:"💨",effect:"gainAll70"},
      {title:"Calme plat",desc:"Plus personne ne bouge.",icon:"🌊",effect:"stopAll"},
      {title:"Récifs traîtres",desc:"Tout le monde ralentit.",icon:"🪸",effect:"speedLimitAll"},
      {title:"Île au trésor",desc:"Le dernier pirate se relance.",icon:"🏝️",effect:"boostLast130"},
      {title:"Kraken distrait",desc:"Les blocages sont levés.",icon:"🐙",effect:"rescue"},
      {title:"Salve impériale",desc:"Le leader prend cher.",icon:"💣",effect:"lossLeader60"},
      {title:"Port franc",desc:"Les avaries disparaissent.",icon:"⚓",effect:"clearHazards"},
      {title:"Roulette du pirate",desc:"La mer décide.",icon:"🎲",effect:"randomSwing"},
      {title:"Carte parfaite",desc:"Tout le monde gagne du cap.",icon:"🧭",effect:"gainAll90"},
      {title:"Brise tropicale",desc:"Les limites sautent.",icon:"🌴",effect:"clearLimits"}
    ],
    shop:{title:"Comptoir du Port Franc",npc:"Mara la Cartographe",desc:"Cartes, planches, rhum et rumeurs vendues sans poser de questions.",items:["Carte au trésor","Planches neuves","Rhum de courage","Pleine voile","Abordage ciblé"],phrases:["Arrr, montre ton or.","Le vent tourne pour ceux qui paient.","J'ai une carte, peut-être vraie.","Tes voiles ont mauvaise mine.","Un bon charpentier vaut un équipage.","Le Kraken respecte les clients fidèles.","Ne dis pas mon nom à la Marine.","Ce coffre chante la nuit.","Cap au nord, si tu as le courage.","Reviens vivant, capitaine."]}
  },
  hades: {
    identity:"Run infernal nerveux, puissance divine, pactes, ombres, feu et rattrapages dramatiques.",
    ui:{materials:"obsidienne, bronze, lave, fumée violette", cardStyle:"cartes sombres avec sceaux divins", hud:"arc de progression incandescent, badges de pacte", palette:["#ef4444","#f97316","#7c3aed","#111827"]},
    audio:{intent:"percussions sourdes, lyre sombre, basse rituelle, impacts de flammes et réverbération souterraine."},
    attacks:["Sang desséché","Furie déchaînée","Porte du Tartare","Chaînes du Styx","Armure brisée","Sentence des Moires","Ombre collante","Pacte rompu","Flamme noire","Cerbère bloque"],
    remedies:["Grenade sacrée","Faveur divine","Pacte relancé","Chant d'Orphée","Marteau de Dédale","Fontaine du Styx","Boon d'Hermès","Repos au vestibule","Sang titanique","Bénédiction d'Athéna"],
    protections:["Égide bénie","Flamme éternelle","Pacte d'Hadès","Bénédiction d'Athéna","Armure stygienne"],
    vehicles:["Char infernal","Barque du Styx","Monture spectrale","Sandales d'Hermès","Ombre de coursier","Trône glissant","Cerbère miniature","Flamme propulsive"],
    events:[
      {title:"Faveur de Zeus",desc:"Tous reçoivent une impulsion divine.",icon:"⚡",effect:"gainAll90"},
      {title:"Colère des Erinyes",desc:"Tous sont arrêtés.",icon:"🔥",effect:"stopAll"},
      {title:"Pacte des Moires",desc:"Le leader paie son avance.",icon:"☠️",effect:"lossLeader60"},
      {title:"Hermès intervient",desc:"Le dernier rattrape le rythme.",icon:"🪽",effect:"boostLast130"},
      {title:"Fontaine du Styx",desc:"Les blocages sont purgés.",icon:"💧",effect:"rescue"},
      {title:"Marteau de Dédale",desc:"Toutes les avaries sont réparées.",icon:"🔨",effect:"clearHazards"},
      {title:"Contrat brûlé",desc:"Hasard infernal.",icon:"📜",effect:"randomSwing"},
      {title:"Portail d'Asphodèle",desc:"Tous avancent.",icon:"🔥",effect:"gainAll70"},
      {title:"Fumée du Tartare",desc:"Tout le monde est limité.",icon:"🌫",effect:"speedLimitAll"},
      {title:"Sortie révélée",desc:"Les limites disparaissent.",icon:"🚪",effect:"clearLimits"}
    ],
    shop:{title:"Comptoir de Charon",npc:"Charon",desc:"Objets divins, pactes et faveurs vendus en silence.",items:["Boon d'Hermès","Égide bénie","Marteau de Dédale","Faveur dérobée","Contrat renégocié"],phrases:["...","Le prix est inscrit dans ton destin.","Charon incline la tête.","Une faveur divine, pas une garantie.","Ne touche pas la rame.","Les ombres regardent ton choix.","Ton or brille assez.","Le Styx n'accorde pas de crédit.","Un pacte peut sauver une course.","Pars avant que Cerbère s'ennuie."]}
  },
  mafia: {
    identity:"Noir années 30, prohibition, poursuites, argent sale, jazz et ruelles sous pression.",
    ui:{materials:"cuir noir, chrome, papier journal, néons de speakeasy", cardStyle:"cartes dossier confidentiel avec tampon rouge", hud:"badges dorés, lignes fines, contraste noir/ambre", palette:["#f59e0b","#7f1d1d","#111827","#d1d5db"]},
    audio:{intent:"jazz noir synthétique, contrebasse, saxophone, caisse claire sèche, sirènes lointaines."},
    attacks:["Réservoir à sec","Descente de police","Barrage fédéral","Rue bouclée","Pneu crevé","Balance au journal","Voiture filée","Alibi grillé","Caisse sabotée","Dette du boss"],
    remedies:["Bidon clandestin","Mécano du quartier","Feu vert du boss","Itinéraire sûr","Roue de rechange","Pot-de-vin","Faux papiers","Planque sûre","Chauffeur sobre","Mallette livrée"],
    protections:["Chauffeur d'élite","Réserve du boss","Pneus blindés","Influence locale","Protection du clan"],
    vehicles:["Berline vintage","Coupé années 30","Fourgon de contrebande","Taxi noir","Roadster du boss","Camion de livraison","Voiture banalisée","Limousine blindée"],
    events:[
      {title:"Route du jazz",desc:"Tous prennent le bon tempo.",icon:"🎷",effect:"gainAll70"},
      {title:"Descente fédérale",desc:"Tout le monde est arrêté.",icon:"🚨",effect:"stopAll"},
      {title:"Article explosif",desc:"Le leader perd du terrain.",icon:"📰",effect:"lossLeader60"},
      {title:"Planque ouverte",desc:"Les pannes sont nettoyées.",icon:"🏚",effect:"clearHazards"},
      {title:"Coup de main du boss",desc:"Le dernier remonte.",icon:"🎩",effect:"boostLast130"},
      {title:"Rue barrée",desc:"Tous sont limités.",icon:"🚧",effect:"speedLimitAll"},
      {title:"Pot-de-vin réussi",desc:"Les limites sautent.",icon:"💵",effect:"clearLimits"},
      {title:"Mécano clandestin",desc:"Les joueurs bloqués repartent.",icon:"🔧",effect:"rescue"},
      {title:"Nuit au speakeasy",desc:"Hasard de table.",icon:"🥃",effect:"randomSwing"},
      {title:"Convoi discret",desc:"Tout le monde avance fort.",icon:"🚚",effect:"gainAll90"}
    ],
    shop:{title:"Arrière-salle du Speakeasy",npc:"Vito Mancini",desc:"Services, moteurs, faux papiers et faveurs de quartier.",items:["Pot-de-vin","Mécano du quartier","Protection du boss","Route du jazz","Pickpocket de bar"],phrases:["Tu n'as rien vu, compris ?","Le boss aime les bons payeurs.","J'ai un chauffeur qui ne pose pas de questions.","Les fédéraux rôdent.","Une mallette peut résoudre beaucoup.","Cette route est sûre ce soir.","Ton alibi a besoin d'huile.","Le jazz couvre les moteurs.","Paie maintenant, remercie plus tard.","Sors par l'arrière."]}
  },
  sekiro: {
    identity:"Japon féodal tendu, pluie, sanctuaires, duel, yokai et gestes précis.",
    ui:{materials:"papier washi, encre, bois sombre, pluie froide", cardStyle:"cartes parchemin vertical avec sceau rouge", hud:"traits d'encre, halos sobres, arc de progression comme route de montagne", palette:["#dc2626","#0f172a","#94a3b8","#facc15"]},
    audio:{intent:"shamisen discret, taiko grave, pluie, cloche de temple, tension minimale."},
    attacks:["Rations vides","Ashigaru embusqué","Pont noyé","Forêt de bambous","Monture blessée","Bambous piégés","Yokai errant","Lame rouillée","Route boueuse","Malédiction rouge"],
    remedies:["Boule de riz","Parade parfaite","Chemin du sanctuaire","Carte du clan","Forgeron shinobi","Offrande au temple","Talisman de pluie","Herbes médicinales","Repos au relais","Guide de montagne"],
    protections:["Esprit Kitsune","Bénédiction du temple","Selle de guerre","Sceau du moine","Armure du clan"],
    vehicles:["Cheval de guerre","Palanquin discret","Chariot de bois","Coursier de montagne","Barque de rivière","Messager shinobi","Cheval caparaçonné","Traîneau de neige"],
    events:[
      {title:"Pas fantômes",desc:"Tous avancent en silence.",icon:"⛩️",effect:"gainAll70"},
      {title:"Orage sur Ashina",desc:"Tout le monde s'arrête.",icon:"🌧️",effect:"stopAll"},
      {title:"Yokai de carrefour",desc:"Le leader recule.",icon:"👺",effect:"lossLeader60"},
      {title:"Temple accueillant",desc:"Les blocages disparaissent.",icon:"🪷",effect:"rescue"},
      {title:"Forgeron itinérant",desc:"Toutes les avaries sont réparées.",icon:"🔨",effect:"clearHazards"},
      {title:"Faveur Kitsune",desc:"Le dernier rattrape.",icon:"🦊",effect:"boostLast130"},
      {title:"Chemin de bambous",desc:"Tout le monde est limité.",icon:"🎋",effect:"speedLimitAll"},
      {title:"Bénédiction du moine",desc:"Les limites sautent.",icon:"📿",effect:"clearLimits"},
      {title:"Vent de montagne",desc:"Progression générale.",icon:"🌬",effect:"gainAll90"},
      {title:"Conte de yokai",desc:"Hasard folklorique.",icon:"📜",effect:"randomSwing"}
    ],
    shop:{title:"Relais du Sanctuaire",npc:"Dame Aki",desc:"Offrandes, cartes de route, outils shinobi et soins de voyage.",items:["Boule de riz","Parchemin secret","Sceau protecteur","Main shinobi","Guide de montagne"],phrases:["La pluie efface les traces.","Un bon voyage commence par le silence.","Ce talisman a déjà sauvé un samouraï.","Les bambous mentent aux imprudents.","Le sanctuaire accepte les offrandes.","Ton cheval a besoin de repos.","Ne provoque pas les yokai.","La lame décide vite.","Le chemin court n'est pas toujours sûr.","Pars avant la cloche du soir."]}
  },
  payday: {
    identity:"Braquage moderne, planification, fuite, police, cash, équipements et tension tactique.",
    ui:{materials:"verre fumé, écrans tactiques, jaune sécurité, bleu police", cardStyle:"cartes blueprint / dossier de mission", hud:"radar, statuts d'alerte, compteurs cash", palette:["#facc15","#2563eb","#111827","#ef4444"]},
    audio:{intent:"beats électroniques tendus, basses filtrées, radios police, confirmations de fixeur."},
    attacks:["Fourgon à sec","Assaut SWAT","Confinement banque","Caméras actives","Herse de police","Caméra repérée","Otages paniqués","Perceuse bloquée","Drone policier","Traceur GPS"],
    remedies:["Jerrycan planqué","Kit de fuite","Masque en place","Boucle caméra","Pneus runflat","ECM déployé","Plan d'extraction","Thermite réglée","Briefing propre","Sac sécurisé"],
    protections:["Gilet lourd","Plan B","Runflat pro","ECM Expert","Équipe fantôme"],
    vehicles:["Fourgon de fuite","SUV noir","Moto urbaine","Berline banalisée","Van blindé léger","Camion utilitaire","Voiture volée","Ambulance maquillée","Pickup de planque"],
    events:[
      {title:"Fenêtre d'extraction",desc:"Tout le monde progresse.",icon:"🚐",effect:"gainAll70"},
      {title:"Assaut général",desc:"Tout le monde est bloqué.",icon:"🚨",effect:"stopAll"},
      {title:"Traceur sur le leader",desc:"Le leader perd l'avance.",icon:"📍",effect:"lossLeader60"},
      {title:"Fixeur efficace",desc:"Les joueurs bloqués repartent.",icon:"📞",effect:"rescue"},
      {title:"Planque ouverte",desc:"Les pannes sont nettoyées.",icon:"🏚",effect:"clearHazards"},
      {title:"Sac oublié",desc:"Le dernier remonte fort.",icon:"💰",effect:"boostLast130"},
      {title:"Caméras en boucle",desc:"Les limites sautent.",icon:"📷",effect:"clearLimits"},
      {title:"Police partout",desc:"Tous sont limités.",icon:"🚔",effect:"speedLimitAll"},
      {title:"Coup de poker",desc:"Hasard de braquage.",icon:"🎲",effect:"randomSwing"},
      {title:"Coffre secondaire",desc:"Tout le monde gagne gros.",icon:"🏦",effect:"gainAll90"}
    ],
    shop:{title:"Planque du Fixeur",npc:"Shade",desc:"Armes non létales, itinéraires, ECM et véhicules de fuite.",items:["ECM déployé","Gilet tactique","Plan B","Fuite rapide","Vol de sac"],phrases:["Le temps, c'est du cash.","Pas de héros, juste le plan.","L'alarme n'attend personne.","J'ai un fourgon prêt.","Les caméras mentiront pour toi.","Le SWAT arrive toujours trop tôt.","Prends l'ECM si tu tiens à respirer.","Le coffre ne s'ouvre pas avec des excuses.","Ton masque est ton identité.","On part propres ou on ne part pas."]}
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
  }
};

export const THEMES={
  bleu:     {name:"Classique",icon:"💙",a1:"#3b82f6",a2:"#6366f1",bg:"#040b1a",bg2:"#0d1b3e",br:"#3b82f640",particle:"#60a5fa",skin:"classic", font:"'Orbitron', sans-serif"},
  mario:    {name:"Mario Kart",icon:"🍄",a1:"#ef4444",a2:"#3b82f6",bg:"#080012",bg2:"#120020",br:"#ef444440",particle:"#f87171",skin:"mario", font:"'Press Start 2P', monospace"},
  craft:    {name:"Minecraft", icon:"⛏",a1:"#65a30d",a2:"#92400e",bg:"#020c02",bg2:"#041804",br:"#65a30d40",particle:"#84cc16",skin:"craft", font:"'Press Start 2P', monospace"},
  cyber:    {name:"Cyberpunk", icon:"🌐",a1:"#06b6d4",a2:"#db2777",bg:"#000b18",bg2:"#1a001a",br:"#06b6d455",particle:"#22d3ee",skin:"cyber", font:"'VT323', monospace"},
  space:    {name:"Espace",    icon:"🪐",a1:"#8b5cf6",a2:"#3b82f6",bg:"#01020a",bg2:"#06041a",br:"#8b5cf655",particle:"#c4b5fd",skin:"space", font:"'Orbitron', sans-serif"},
  zelda:    {name:"Zelda",     icon:"⚔",a1:"#16a34a",a2:"#ca8a04",bg:"#020802",bg2:"#061202",br:"#16a34a40",particle:"#4ade80",skin:"zelda", font:"'Cinzel', serif"},
  apoca:    {name:"Apocalypse",icon:"🔥",a1:"#ea580c",a2:"#991b1b",bg:"#1a0500",bg2:"#2a0a00",br:"#ea580c55",particle:"#fb923c",skin:"apoca", font:"'Black Ops One', cursive"},
  medieval: {name:"Médiéval",  icon:"🏰",a1:"#94a3b8",a2:"#475569",bg:"#0f172a",bg2:"#1e293b",br:"#94a3b855",particle:"#cbd5e1",skin:"medieval", font:"'Cinzel', serif"},
  ac_mirage:{name:"AC Mirage", icon:"🗡",a1:"#d4af37",a2:"#1e3a8a",bg:"#0a0608",bg2:"#1a0e0a",br:"#d4af3755",particle:"#fde68a",skin:"ac_mirage",font:"'Cinzel', serif"},
  ac_bf:    {name:"AC Black Flag",icon:"🏴‍☠️",a1:"#f59e0b",a2:"#0c4a6e",bg:"#02080f",bg2:"#082030",br:"#f59e0b55",particle:"#fbbf24",skin:"ac_bf", font:"'Black Ops One', cursive"},
  sims:     {name:"Les Sims", icon:"🏠",a1:"#7dd3fc",a2:"#86efac",bg:"#04111d",bg2:"#0b2a36",br:"#7dd3fc55",particle:"#a7f3d0",skin:"sims",font:"'Orbitron', sans-serif"},
  sea_thieves:{name:"Sea of Thieves",icon:"⚓",a1:"#0ea5e9",a2:"#f59e0b",bg:"#02111c",bg2:"#063044",br:"#0ea5e955",particle:"#67e8f9",skin:"sea_thieves",font:"'Cinzel', serif"},
  hades:    {name:"Hades",icon:"🔥",a1:"#ef4444",a2:"#7c3aed",bg:"#090205",bg2:"#1f0508",br:"#ef444455",particle:"#fb923c",skin:"hades",font:"'Cinzel', serif"},
  mafia:    {name:"Mafia",icon:"🎩",a1:"#f59e0b",a2:"#7f1d1d",bg:"#05070b",bg2:"#16100b",br:"#f59e0b55",particle:"#fde68a",skin:"mafia",font:"'Black Ops One', cursive"},
  sekiro:   {name:"Sekiro",icon:"⛩️",a1:"#dc2626",a2:"#94a3b8",bg:"#05070a",bg2:"#111827",br:"#dc262655",particle:"#fca5a5",skin:"sekiro",font:"'Cinzel', serif"},
  payday:   {name:"Payday 3",icon:"🎭",a1:"#facc15",a2:"#2563eb",bg:"#030712",bg2:"#0f172a",br:"#facc1555",particle:"#fef08a",skin:"payday",font:"'Orbitron', sans-serif"},
  space_marine_2: {name:"Space Marine 2",icon:"⚔️",a1:"#b91c1c",a2:"#ca8a04",bg:"#050505",bg2:"#1a0505",br:"#b91c1c55",particle:"#facc15",skin:"space_marine_2", font:"'Black Ops One', cursive"},
  first_light_007:{name:"007 First Light",icon:"🕵️",a1:"#94a3b8",a2:"#b91c1c",bg:"#000000",bg2:"#111111",br:"#b91c1c55",particle:"#f87171",skin:"first_light_007", font:"'Orbitron', sans-serif"},
  saints_row_4:   {name:"Saints Row IV",icon:"👽",a1:"#9333ea",a2:"#db2777",bg:"#0a0014",bg2:"#1c0036",br:"#db277755",particle:"#c084fc",skin:"saints_row_4",font:"'Orbitron', sans-serif"},
  tomb_raider:    {name:"Tomb Raider",icon:"🗿",a1:"#15803d",a2:"#b45309",bg:"#021206",bg2:"#0a2e13",br:"#b4530955",particle:"#fcd34d",skin:"tomb_raider",font:"'Cinzel', serif"},
  big_ambitions:  {name:"Big Ambitions",icon:"💼",a1:"#16a34a",a2:"#eab308",bg:"#02110a",bg2:"#062b16",br:"#eab30855",particle:"#fef08a",skin:"big_ambitions",font:"'Orbitron', sans-serif"}
};
export const UNIVERSE=["bleu","mario","craft","cyber","space","zelda","apoca","medieval","ac_mirage","ac_bf","sims","sea_thieves","hades","mafia","sekiro","payday","space_marine_2","first_light_007","saints_row_4","tomb_raider","big_ambitions"];
export const META={
  bleu:     {desc:"Course classique",title:"Mille Bornes",         solo:"1 Joueur vs IA",     multi:"Multijoueur",       aiIcon:"🤖",start:"Feu vert !",   unit:"km", dk:E.car},
  zelda:    {desc:"The Legend of Zelda",title:"Mille Lieues",      solo:"Partir en quête",    multi:"Quête en groupe",  aiIcon:"👹",start:"Jouez une Feuille !",   unit:"lieues", dk:E.scroll},
  mario:    {desc:"Royaume Champignon", title:"Mille Étoiles",         solo:"Jouer solo",         multi:"Party Mario",       aiIcon:"👾",start:"Drapeau départ !",   unit:"étoiles",dk:E.star},
  craft:    {desc:"Survie & Exploration",title:"Mille Blocs",           solo:"Survie solo",        multi:"Serveur multi",      aiIcon:"🧟",start:"Allumez une Torche !",        unit:"blocs",  dk:E.box},
  cyber:    {desc:"Piratage Systèmes",   title:"Mille Terabytes",       solo:"Infiltration IA",    multi:"Guerre Hackers",     aiIcon:"🤖",start:"Override System !",      unit:"TB",     dk:E.cyber},
  space:    {desc:"Batailles Galactiques",title:"Mille Parsecs",        solo:"Campagne Solo",      multi:"Flotte Galactique",  aiIcon:"👽",start:"Saut Hyperespace !",      unit:"parsecs",dk:E.planet},
  apoca:    {desc:"Désolation Mad Max",  title:"Miles Rouillés", solo:"Survivre",        multi:"Convoi de Guerre",   aiIcon:"💀",start:"Moteur en marche !", unit:"miles", dk:E.tire},
  medieval: {desc:"Quête des Chevaliers",title:"Lieues Épiques", solo:"Entrer en Lice",    multi:"Guerre des Clans",  aiIcon:"🧌",start:"En avant !", unit:"lieues", dk:E.shield},
  ac_mirage:{desc:"Bagdad & infiltration",title:"Mille Lames",   solo:"Contrat solitaire", multi:"Confrérie Hashashin", aiIcon:"🗡",start:"Au nom du Credo !", unit:"ruelles", dk:E.dagger},
  ac_bf:    {desc:"Caraïbes & piraterie",title:"Mille Vagues",   solo:"Capitaine solitaire", multi:"Flotte pirate",     aiIcon:"🏴‍☠️",start:"Hissez les voiles !", unit:"noeuds", dk:E.anchor},
  sims:     {desc:"Vie quotidienne & chaos",title:"Mille Jours", solo:"Foyer solo", multi:"Colocation locale", aiIcon:"🏠",start:"Sul sul, on commence !", unit:"jours", dk:E.house},
  sea_thieves:{desc:"Aventure navale",title:"Mille Trésors", solo:"Capitaine solo", multi:"Équipage local", aiIcon:"🐙",start:"Hissez les voiles !", unit:"noeuds", dk:E.anchor},
  hades:    {desc:"Enfer mythologique",title:"Mille Enfers", solo:"Run solitaire", multi:"Pacte des ombres", aiIcon:"☠️",start:"Brisez le pacte !", unit:"ombres", dk:E.flame},
  mafia:    {desc:"Gangsters années 30",title:"Mille Rues", solo:"Affaire solo", multi:"Famille locale", aiIcon:"🚨",start:"Le boss donne le feu vert.", unit:"rues", dk:E.hat},
  sekiro:   {desc:"Folklore japonais",title:"Mille Pas", solo:"Voie du loup", multi:"Clan local", aiIcon:"👺",start:"Le sanctuaire ouvre la voie.", unit:"pas", dk:E.torii},
  payday:   {desc:"Braquage tactique",title:"Mille Casses", solo:"Plan solo", multi:"Équipe locale", aiIcon:"🚔",start:"Masques en place !", unit:"butin", dk:E.mask2},
  space_marine_2: {desc:"Croisade Impériale",title:"Mille Purgations",solo:"Mission solo", multi:"Escouade Astartes",aiIcon:"👾",start:"Pour l'Empereur !",unit:"xenos",dk:E.skull},
  first_light_007:{desc:"Mission d'Espionnage",title:"Mille Cibles",solo:"Agent double", multi:"Réseau MI6",aiIcon:"🕴️",start:"Permis de tuer !",unit:"intel",dk:E.eye},
  saints_row_4:   {desc:"Simulation piratée",title:"Mille Glitches",solo:"Le Boss", multi:"Les Saints",aiIcon:"🛸",start:"Simulation hackée !",unit:"clusters",dk:E.alien},
  tomb_raider:    {desc:"Exploration mortelle",title:"Mille Reliques",solo:"Pilleuse de Tombes", multi:"Expédition",aiIcon:"🐆",start:"Explorez la jungle !",unit:"artefacts",dk:E.skull},
  big_ambitions:  {desc:"Empire Financier",title:"Mille Dollars",solo:"Start-up", multi:"Multinationale",aiIcon:"💼",start:"Ouvrez le magasin !",unit:"k$",dk:E.house},
};
export const LOCAL_PLAY_LABELS={
  bleu:     {title:"Partie locale",        sub:"Même écran, chacun son tour"},
  mario:    {title:"Grand Prix local",     sub:"Même canapé, même chaos"},
  craft:    {title:"Serveur canapé",       sub:"Survie locale sur un écran"},
  cyber:    {title:"LAN de proximité",     sub:"Run local sur la même machine"},
  space:    {title:"Pont local",           sub:"Équipage partagé sur un écran"},
  zelda:    {title:"Quête locale",         sub:"Aventure à plusieurs sur place"},
  apoca:    {title:"Convoi local",         sub:"Survivants autour du même écran"},
  medieval: {title:"Table ronde locale",   sub:"Chevaliers sur le même écran"},
  ac_mirage:{title:"Bureau local",         sub:"Contrats partagés sur place"},
  ac_bf:    {title:"Équipage local",       sub:"Même pont, plusieurs capitaines"},
  sims:     {title:"Colocation locale",    sub:"Même foyer, objectifs partagés"},
  sea_thieves:{title:"Équipage local",     sub:"Même pont, même trésor"},
  hades:    {title:"Pacte local",          sub:"Runs infernaux sur le même écran"},
  mafia:    {title:"Famille locale",       sub:"Même table, mêmes affaires"},
  sekiro:   {title:"Clan local",           sub:"Duel et voyage sur le même écran"},
  payday:   {title:"Équipe locale",        sub:"Braquage canapé en équipe"},
  space_marine_2: {title:"Escouade locale",       sub:"Purge en coopération"},
  first_light_007:{title:"QG local",              sub:"Opération conjointe"},
  saints_row_4:   {title:"Co-op locale",          sub:"Chaos sur le même canapé"},
  tomb_raider:    {title:"Expédition locale",     sub:"Exploration partagée"},
  big_ambitions:  {title:"Siège local",           sub:"Business en famille"},
};
export function getLocalPlayLabel(theme){
  return LOCAL_PLAY_LABELS[theme] || LOCAL_PLAY_LABELS.bleu;
}
export const DIFFS={
  facile:   {name:"Facile",   emoji:"😊",blunder:0.55,atk:0.15,safe:6, desc:"L'IA fait des erreurs.", ml:false},
  normal:   {name:"Normal",   emoji:"🙂",blunder:0.20,atk:0.45,safe:3, desc:"Joue prudemment.", ml:false},
  difficile:{name:"Difficile",emoji:"😤",blunder:0.10,atk:0.65,safe:1, desc:"Attaque prioritaire.", ml:false},
  expert:   {name:"Cauchemar",emoji:"💀",blunder:0.0, atk:1.0, safe:0, desc:"Impitoyable ! Traque le leader.", ml:true},
  apocalypse:{name:"Apocalypse",emoji:"☄️",blunder:0.0, atk:1.0, safe:0, desc:"Pression maximale : événements tous les 2 tours.", ml:true, eventEveryTurns:2},
};
export const DMULT={facile:1,normal:1.5,difficile:2,expert:3.5,apocalypse:5};
export const RACE_TARGET_OPTIONS = [1000, 2000, 3000];
const normalizeTargetKm = (v) => RACE_TARGET_OPTIONS.includes(Number(v)) ? Number(v) : 1000;
const buildEventMilestones = (targetKm=1000) => [0.2,0.4,0.6,0.8].map(r => Math.round(normalizeTargetKm(targetKm) * r));
export const PC=[
  {main:"#3b82f6",dark:"#1d4ed8",glow:"#3b82f680",emoji:"🔵",name:"Bleu"},{main:"#ef4444",dark:"#b91c1c",glow:"#ef444480",emoji:"🔴",name:"Rouge"},
  {main:"#22c55e",dark:"#15803d",glow:"#22c55e80",emoji:"🟢",name:"Vert"},{main:"#f59e0b",dark:"#b45309",glow:"#f59e0b80",emoji:"🟡",name:"Or"},
  {main:"#a855f7",dark:"#7c3aed",glow:"#a855f780",emoji:"🟣",name:"Violet"},{main:"#ec4899",dark:"#be185d",glow:"#ec489980",emoji:"🩷",name:"Rose"},
  {main:"#06b6d4",dark:"#0e7490",glow:"#06b6d480",emoji:"🩵",name:"Cyan"},{main:"#f97316",dark:"#c2410c",glow:"#f9731680",emoji:"🟠",name:"Orange"},
];

export const CD={
  distance:{bg:"#052e16,#065f46,#047857",glow:"#10b981",ib:"#047857",tx:"#a7f3d0",border:"#10b98155"},
  attack:  {bg:"#450a0a,#7f1d1d,#991b1b",glow:"#ef4444",ib:"#991b1b",tx:"#fecaca",border:"#ef444455"},
  remedy:  {bg:"#0c1445,#1e3a8a,#1d4ed8",glow:"#3b82f6",ib:"#1d4ed8",tx:"#bfdbfe",border:"#3b82f655"},
  botte:   {bg:"#3b1f00,#78350f,#b45309",glow:"#f59e0b",ib:"#b45309",tx:"#fef3c7",border:"#f59e0b55"},
  action:  {bg:"#2e1065,#4c1d95,#6d28d9",glow:"#a855f7",ib:"#5b21b6",tx:"#e9d5ff",border:"#a855f755"},
  // Nouveaux types thematiques : boost (+km), shield (+blindage), draw (pioche), reroll (refresh)
  boost:   {bg:"#15803d,#0ea5e9,#14b8a6",glow:"#0ea5e9",ib:"#0e7490",tx:"#cffafe",border:"#06b6d455"},
  shield:  {bg:"#3f3f46,#52525b,#71717a",glow:"#a1a1aa",ib:"#52525b",tx:"#f4f4f5",border:"#a1a1aa66"},
  draw:    {bg:"#4a044e,#86198f,#a21caf",glow:"#d946ef",ib:"#86198f",tx:"#fae8ff",border:"#d946ef66"},
  reroll:  {bg:"#7c2d12,#9a3412,#c2410c",glow:"#fb923c",ib:"#9a3412",tx:"#ffedd5",border:"#fb923c66"},
};

export const VEHICLES = [
  {id:"v1", name:"Citadine", icon:"🚗", theme:"classic", desc:"Standard", b:"Équilibré", m:"Aucun", effects:{}},
  {id:"v2", name:"Voiture Course", icon:"🏎️", theme:"classic", desc:"Rapide", b:"Démarre en route", m:"Main max 5", effects:{start_green:true, hand_size:-1}},
  {id:"v3", name:"Poids Lourd", icon:"🚚", theme:"classic", desc:"Robuste", b:"Immunisé limites", m:"Pas de 200km", effects:{immune_limite:true, no_200:true}},
  {id:"v4", name:"Moto-Cross", icon:"🏍️", theme:"classic", desc:"Agile", b:"Immunisé Crevaison", m:"Démarre Limité", effects:{immune_crevaison:true, start_limite:true}},
  {id:"v5", name:"Destrier Royal", icon:"🐴", theme:"zelda", desc:"Fidèle", b:"Immunisé Panne", m:"Aucun", effects:{immune_panne:true}},
  {id:"v6", name:"Paravoile", icon:"🪁", theme:"zelda", desc:"Aérien", b:"Démarre en route", m:"Sensible Vent", effects:{start_green:true, no_200:true}},
  {id:"v7", name:"Kart Standard", icon:"🏎️", theme:"mario", desc:"Classique", b:"Équilibré", m:"Aucun", effects:{}},
  {id:"v8", name:"Kart Lourd", icon:"🐢", theme:"mario", desc:"Blindé", b:"Bloque 1ère attaque", m:"Main max 5", effects:{tank_shield:true, hand_size:-1}},
  {id:"v9", name:"Minecart", icon:"🛒", theme:"craft", desc:"Sur rails", b:"+50 blocs départ", m:"Aucun", effects:{start_km:50}},
  {id:"v10", name:"Bateau Chêne", icon:"🛶", theme:"craft", desc:"Flottant", b:"Immunité Crevaison", m:"Aucun", effects:{immune_crevaison:true}},
  {id:"v11", name:"Moto Néon", icon:"🏍️", theme:"cyber", desc:"Pirate", b:"Commence avec Vol", m:"Aucun", effects:{start_thief:true}},
  {id:"v12", name:"Hacker Deck", icon:"💻", theme:"cyber", desc:"Réseau", b:"+1 taille main", m:"Sensible Sabotage", effects:{hand_size:1}},
  {id:"v13", name:"Cyber-Bécane", icon:"🛵", theme:"cyber", desc:"Rapide", b:"Démarre en route", m:"Immunité 0", effects:{start_green:true}},
  {id:"v14", name:"Croiseur Lourd", icon:"🚀", theme:"space", desc:"Gigantesque", b:"Bloque 1ère attaque", m:"Pas de 200km", effects:{tank_shield:true, no_200:true}},
  {id:"v15", name:"Chasseur Stellaire", icon:"☄️", theme:"space", desc:"Vif", b:"Immunité Feu Rouge", m:"Main max 5", effects:{immune_feu_rouge:true, hand_size:-1}},
  {id:"v16", name:"DeLorean", icon:"⏱️", theme:"space", desc:"Temporel", b:"+50 au départ", m:"Aucun", effects:{start_km:50, hand_size:1}},
  {id:"v17", name:"Vaisseau Fantôme", icon:"🛸", theme:"space", desc:"Spectre", b:"Commence avec Vol", m:"Main max 5", effects:{start_thief:true, hand_size:-1}},
  {id:"v18", name:"Interceptor V8", icon:"🚘", theme:"apoca", desc:"Furieux", b:"Immunité Accident", m:"Aucun", effects:{immune_accident:true}},
  {id:"v19", name:"War Rig", icon:"🚛", theme:"apoca", desc:"Forteresse", b:"2 Boucliers", m:"Main max 5", effects:{tank_shield:true, tank_shield_x2:true, hand_size:-1}},
  {id:"v20", name:"Buggy Sables", icon:"🛺", theme:"apoca", desc:"Dune", b:"+50 au départ", m:"Démarre Limité", effects:{start_km:50, start_limite:true}},
  {id:"v21", name:"Rat-Rod", icon:"🚜", theme:"apoca", desc:"Bricolé", b:"Immunité Panne", m:"Pas de 200km", effects:{immune_panne:true, no_200:true}},
  {id:"v22", name:"Char de Siège", icon:"🦏", theme:"medieval", desc:"Dévastateur", b:"Bloque 1ère attaque", m:"Pas de 200km", effects:{tank_shield:true, no_200:true}},
  {id:"v23", name:"Chevalier Blindé", icon:"🛡️", theme:"medieval", desc:"Solide", b:"Immunité Limite", m:"Aucun", effects:{immune_limite:true}},
  {id:"v24", name:"Pégase", icon:"🦄", theme:"medieval", desc:"Magique", b:"Commence avec Vol", m:"Aucun", effects:{start_thief:true}},
  {id:"v25", name:"Tapis Volant", icon:"🕌", theme:"medieval", desc:"Mystique", b:"Immunité Crevaison", m:"Main max 5", effects:{immune_crevaison:true, immune_limite:true, hand_size:-1}},
  {id:"v26", name:"Drakkar Furtif", icon:"⛵", theme:"medieval", desc:"Vikings", b:"Bloque 1ère attaque", m:"Démarre Limité", effects:{tank_shield:true, start_limite:true}},
  {id:"v27", name:"Dépanneuse", icon:"🛻", theme:"classic", desc:"Solidaire", b:"Immunité Accident", m:"Aucun", effects:{immune_accident:true}},
  {id:"v28", name:"Voiture Police", icon:"🚓", theme:"classic", desc:"Autorité", b:"Immunité Limite", m:"Pas de 200km", effects:{immune_feu_rouge:true, immune_limite:true, no_200:true}},
  {id:"v29", name:"Tracteur", icon:"🚜", theme:"classic", desc:"Lent", b:"2 Boucliers", m:"Pas de 100/200km", effects:{tank_shield:true, tank_shield_x2:true, no_100:true, no_200:true}},
  {id:"v30", name:"Ambulance", icon:"🚑", theme:"classic", desc:"Urgence", b:"Immunité Feu Rouge", m:"Aucun", effects:{immune_feu_rouge:true}},
  // ─── AC MIRAGE — montures / supports d'assassins ───
  {id:"v31", name:"Coursier Persan",  icon:"🐎",  theme:"ac_mirage", desc:"Rapide",   b:"Démarre en route",     m:"Aucun",            effects:{start_green:true}},
  {id:"v32", name:"Maître Hashashin", icon:"🥷",  theme:"ac_mirage", desc:"Furtif",   b:"Commence avec Vol",    m:"Main max 9",       effects:{start_thief:true, hand_size:-1}},
  {id:"v33", name:"Chamelier",        icon:"🐪",  theme:"ac_mirage", desc:"Endurant", b:"Immunité Soif",        m:"Aucun",            effects:{immune_panne:true}},
  {id:"v34", name:"Bayek Légende",    icon:"🦅",  theme:"ac_mirage", desc:"Vétéran",  b:"Immunité Garde",       m:"Pas de 200km",     effects:{immune_accident:true, no_200:true}},
  {id:"v35", name:"Cape d'Ombre",     icon:"🌙",  theme:"ac_mirage", desc:"Discret",  b:"+1 blindage",          m:"Aucun",            effects:{tank_shield:true}},
  // ─── AC BLACK FLAG — navires pirates et marine ───
  {id:"v36", name:"Sloop Léger",      icon:"⛵",  theme:"ac_bf",     desc:"Agile",    b:"Démarre en route",     m:"Aucun",            effects:{start_green:true}},
  {id:"v37", name:"Jackdaw",          icon:"🏴‍☠️",theme:"ac_bf",   desc:"Légendaire",b:"2 boucliers",          m:"Pas de 200km",     effects:{tank_shield:true, tank_shield_x2:true, no_200:true}},
  {id:"v38", name:"Brigantin",        icon:"🚢",  theme:"ac_bf",     desc:"Robuste",  b:"Immunité Avarie",      m:"Aucun",            effects:{immune_accident:true}},
  {id:"v39", name:"Galion Royal",     icon:"⚓",  theme:"ac_bf",     desc:"Imposant", b:"Immunité Marine",      m:"Démarre Limité",   effects:{immune_feu_rouge:true, start_limite:true}},
  {id:"v40", name:"Frégate Pirate",   icon:"🦜",  theme:"ac_bf",     desc:"Audacieuse",b:"Commence avec Vol",   m:"Main max 9",       effects:{start_thief:true, hand_size:-1}},
  // ─── LES SIMS — véhicules du quotidien / absurde plausible ───
  {id:"v41", name:"Compacte Familiale", icon:"🚗", theme:"sims", desc:"Pratique", b:"Équilibré", m:"Aucun", effects:{}},
  {id:"v42", name:"Vélo de Quartier", icon:"🚲", theme:"sims", desc:"Écolo", b:"Immunité Panne", m:"Pas de 200", effects:{immune_panne:true,no_200:true}},
  {id:"v43", name:"Van Familial", icon:"🚐", theme:"sims", desc:"Spacieux", b:"+1 taille main", m:"Démarre Limité", effects:{hand_size:1,start_limite:true}},
  {id:"v44", name:"Scooter Urbain", icon:"🛵", theme:"sims", desc:"Agile", b:"Démarre en route", m:"Main max 9", effects:{start_green:true,hand_size:-1}},
  {id:"v45", name:"Bus Scolaire", icon:"🚌", theme:"sims", desc:"Solide", b:"2 boucliers", m:"Pas de 200", effects:{tank_shield:true,tank_shield_x2:true,no_200:true}},
  {id:"v46", name:"Caddie de Jardin", icon:"🛒", theme:"sims", desc:"Chaotique", b:"Commence avec Vol", m:"Démarre Limité", effects:{start_thief:true,start_limite:true}},
  // ─── SEA OF THIEVES — flotte navale stricte ───
  {id:"v47", name:"Sloop Léger", icon:"⛵", theme:"sea_thieves", desc:"Agile", b:"Démarre en route", m:"Aucun", effects:{start_green:true}},
  {id:"v48", name:"Brigantin Marchand", icon:"🚢", theme:"sea_thieves", desc:"Robuste", b:"Immunité Accident", m:"Aucun", effects:{immune_accident:true}},
  {id:"v49", name:"Galion Capturé", icon:"⚓", theme:"sea_thieves", desc:"Massif", b:"2 boucliers", m:"Pas de 200", effects:{tank_shield:true,tank_shield_x2:true,no_200:true}},
  {id:"v50", name:"Chaloupe Rapide", icon:"🛶", theme:"sea_thieves", desc:"Furtive", b:"Commence avec Vol", m:"Main max 9", effects:{start_thief:true,hand_size:-1}},
  {id:"v51", name:"Jonque de Contrebande", icon:"⛵", theme:"sea_thieves", desc:"Rusée", b:"+50 départ", m:"Démarre Limité", effects:{start_km:50,start_limite:true}},
  {id:"v52", name:"Frégate Corsaire", icon:"🏴‍☠️", theme:"sea_thieves", desc:"Audacieuse", b:"Immunité Limite", m:"Aucun", effects:{immune_limite:true}},
  // ─── HADES — mythologique / infernal uniquement ───
  {id:"v53", name:"Char Infernal", icon:"🔥", theme:"hades", desc:"Brûlant", b:"Démarre en route", m:"Aucun", effects:{start_green:true}},
  {id:"v54", name:"Barque du Styx", icon:"🛶", theme:"hades", desc:"Souterraine", b:"Immunité Panne", m:"Main max 9", effects:{immune_panne:true,hand_size:-1}},
  {id:"v55", name:"Monture Spectrale", icon:"🐎", theme:"hades", desc:"Fantôme", b:"Commence avec Vol", m:"Aucun", effects:{start_thief:true}},
  {id:"v56", name:"Sandales d'Hermès", icon:"🪽", theme:"hades", desc:"Vives", b:"+50 départ", m:"Pas de 200", effects:{start_km:50,no_200:true}},
  {id:"v57", name:"Égide Mobile", icon:"🛡️", theme:"hades", desc:"Protectrice", b:"2 boucliers", m:"Démarre Limité", effects:{tank_shield:true,tank_shield_x2:true,start_limite:true}},
  {id:"v58", name:"Flamme Propulsive", icon:"🔥", theme:"hades", desc:"Instable", b:"Immunité Accident", m:"Main max 9", effects:{immune_accident:true,hand_size:-1}},
  // ─── MAFIA — véhicules époque prohibition ───
  {id:"v59", name:"Berline Vintage", icon:"🚗", theme:"mafia", desc:"Classe", b:"Équilibré", m:"Aucun", effects:{}},
  {id:"v60", name:"Coupé Années 30", icon:"🚘", theme:"mafia", desc:"Rapide", b:"Démarre en route", m:"Main max 9", effects:{start_green:true,hand_size:-1}},
  {id:"v61", name:"Fourgon de Contrebande", icon:"🚚", theme:"mafia", desc:"Discret", b:"+1 taille main", m:"Démarre Limité", effects:{hand_size:1,start_limite:true}},
  {id:"v62", name:"Taxi Noir", icon:"🚕", theme:"mafia", desc:"Urbain", b:"Immunité Limite", m:"Aucun", effects:{immune_limite:true}},
  {id:"v63", name:"Limousine Blindée", icon:"🚙", theme:"mafia", desc:"Boss", b:"2 boucliers", m:"Pas de 200", effects:{tank_shield:true,tank_shield_x2:true,no_200:true}},
  {id:"v64", name:"Voiture Banalisée", icon:"🚓", theme:"mafia", desc:"Sous couverture", b:"Commence avec Vol", m:"Aucun", effects:{start_thief:true}},
  // ─── SEKIRO — montures et transports féodaux ───
  {id:"v65", name:"Cheval de Guerre", icon:"🐎", theme:"sekiro", desc:"Noble", b:"Démarre en route", m:"Aucun", effects:{start_green:true}},
  {id:"v66", name:"Palanquin Discret", icon:"🏮", theme:"sekiro", desc:"Protégé", b:"2 boucliers", m:"Pas de 200", effects:{tank_shield:true,tank_shield_x2:true,no_200:true}},
  {id:"v67", name:"Chariot de Bois", icon:"🛒", theme:"sekiro", desc:"Stable", b:"Immunité Accident", m:"Démarre Limité", effects:{immune_accident:true,start_limite:true}},
  {id:"v68", name:"Coursier de Montagne", icon:"🐴", theme:"sekiro", desc:"Endurant", b:"+50 départ", m:"Aucun", effects:{start_km:50}},
  {id:"v69", name:"Barque de Rivière", icon:"🛶", theme:"sekiro", desc:"Silencieuse", b:"Commence avec Vol", m:"Main max 9", effects:{start_thief:true,hand_size:-1}},
  {id:"v70", name:"Messager Shinobi", icon:"🥷", theme:"sekiro", desc:"Rapide", b:"Immunité Limite", m:"Pas de 200", effects:{immune_limite:true,no_200:true}},
  // ─── PAYDAY 3 — véhicules de fuite modernes ───
  {id:"v71", name:"Fourgon de Fuite", icon:"🚐", theme:"payday", desc:"Classique", b:"Équilibré", m:"Aucun", effects:{}},
  {id:"v72", name:"SUV Noir", icon:"🚙", theme:"payday", desc:"Robuste", b:"2 boucliers", m:"Main max 9", effects:{tank_shield:true,tank_shield_x2:true,hand_size:-1}},
  {id:"v73", name:"Moto Urbaine", icon:"🏍️", theme:"payday", desc:"Agile", b:"Démarre en route", m:"Pas de 200", effects:{start_green:true,no_200:true}},
  {id:"v74", name:"Van Blindé Léger", icon:"🚚", theme:"payday", desc:"Sécurisé", b:"Immunité Accident", m:"Démarre Limité", effects:{immune_accident:true,start_limite:true}},
  {id:"v75", name:"Voiture Volée", icon:"🚗", theme:"payday", desc:"Anonyme", b:"Commence avec Vol", m:"Aucun", effects:{start_thief:true}},
  {id:"v76", name:"Ambulance Maquillée", icon:"🚑", theme:"payday", desc:"Déguisée", b:"Immunité Feu Rouge", m:"Main max 9", effects:{immune_feu_rouge:true,hand_size:-1}}
];

// Pack d'extension vehicules/skins : complete chaque univers a 10+ choix thematiques.
// Les bonus restent legers pour enrichir la personnalite sans casser l'equilibrage.
export const VEHICLE_EXPANSION_PACKS = {
  classic: [
    ["Break Familial","🚙","Stable","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Cabriolet","🚘","Nerveux","+50 départ","Main max 9",{start_km:50,hand_size:-1}],
  ],
  zelda: [
    ["Cheval d'Hyrule","🐎","Noble","+50 départ","Aucun",{start_km:50}],
    ["Chariot Korogu","🛒","Rusé","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Radeau Zora","🛶","Fluvial","Immunité Crevaison","Pas de 200",{immune_crevaison:true,no_200:true}],
    ["Moto Antique","🏍️","Sheikah","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Cerf de Forêt","🦌","Discret","Commence avec Vol","Aucun",{start_thief:true}],
    ["Charrette Goron","🪨","Robuste","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Planeur Royal","🪁","Aérien","Immunité Limite","Départ limité",{immune_limite:true,start_limite:true}],
    ["Coursier Blanc","🐴","Élite","Immunité Accident","Aucun",{immune_accident:true}],
  ],
  mario: [
    ["Kart Champignon","🍄","Punchy","+50 départ","Aucun",{start_km:50}],
    ["Yoshi Bike","🦖","Agile","Immunité Crevaison","Main max 9",{immune_crevaison:true,hand_size:-1}],
    ["Buggy Koopa","🐢","Solide","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Bolide Luigi","🏎️","Stable","Immunité Limite","Aucun",{immune_limite:true}],
    ["Kart Bowser","🔥","Lourd","Immunité Accident","Départ limité",{immune_accident:true,start_limite:true}],
    ["Scooter Toad","🛵","Rapide","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Kart Boo","👻","Furtif","Commence avec Vol","Aucun",{start_thief:true}],
    ["Dauphine Marine","🐬","Aquatique","Immunité Panne","Pas de 200",{immune_panne:true,no_200:true}],
  ],
  craft: [
    ["Cheval Sellé","🐴","Exploration","Démarre en route","Aucun",{start_green:true}],
    ["Wagonnet TNT","💥","Risqué","+50 départ","Départ limité",{start_km:50,start_limite:true}],
    ["Élytre","🪽","Aérienne","Immunité Limite","Main max 9",{immune_limite:true,hand_size:-1}],
    ["Cochon Sellé","🐖","Drôle","Commence avec Vol","Pas de 200",{start_thief:true,no_200:true}],
    ["Chariot Netherite","🛡️","Blindé","2 boucliers","Départ limité",{tank_shield:true,tank_shield_x2:true,start_limite:true}],
    ["Bateau Mangrove","🛶","Marais","Immunité Crevaison","Aucun",{immune_crevaison:true}],
    ["Lama Marchand","🦙","Stockage","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Araignée Montée","🕷️","Insolite","Immunité Accident","Main max 9",{immune_accident:true,hand_size:-1}],
  ],
  cyber: [
    ["Taxi Autonome","🚕","Urbain","Immunité Feu Rouge","Aucun",{immune_feu_rouge:true}],
    ["Drone Cargo","🛸","Aérien","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Hoverboard Néon","🛹","Agile","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Fourgon Datavault","🚐","Blindé","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Coursier Synth","🤖","Furtif","Commence avec Vol","Aucun",{start_thief:true}],
    ["Railbike Magnétique","🚄","Stable","+50 départ","Aucun",{start_km:50}],
    ["Patrouilleur Ghost","🚓","Sécurisé","Immunité Accident","Départ limité",{immune_accident:true,start_limite:true}],
  ],
  space: [
    ["Navette Orbitale","🚀","Standard","Démarre en route","Aucun",{start_green:true}],
    ["Capsule Minérale","🛰️","Solide","2 boucliers","Main max 9",{tank_shield:true,tank_shield_x2:true,hand_size:-1}],
    ["Rover Lunaire","🌕","Endurant","Immunité Panne","Pas de 200",{immune_panne:true,no_200:true}],
    ["Comète Harnachée","☄️","Instable","+50 départ","Départ limité",{start_km:50,start_limite:true}],
    ["Cargo Stellaire","🚢","Stockage","Main +1","Aucun",{hand_size:1}],
    ["Sonde Furtive","📡","Furtive","Commence avec Vol","Main max 9",{start_thief:true,hand_size:-1}],
  ],
  apoca: [
    ["Moto Pillarde","🏍️","Rapide","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Camion Citerne","🚚","Réserve","Immunité Panne","Départ limité",{immune_panne:true,start_limite:true}],
    ["Bus Blindé","🚌","Lourd","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Charrette Ferraille","🛒","Bricolée","Main +1","Pas de 200",{hand_size:1,no_200:true}],
    ["Quad Dune","🏍️","Agile","+50 départ","Aucun",{start_km:50}],
    ["Interceptor Noir","🚓","Furtif","Commence avec Vol","Départ limité",{start_thief:true,start_limite:true}],
  ],
  medieval: [
    ["Diligence Noble","🚃","Confort","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Bélier Roulant","🐏","Assaut","Immunité Accident","Pas de 200",{immune_accident:true,no_200:true}],
    ["Licorne de Cour","🦄","Pure","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Carrosse Royal","👑","Prestige","2 boucliers","Aucun",{tank_shield:true,tank_shield_x2:true}],
    ["Mulet de Marché","🐴","Tenace","Immunité Panne","Départ limité",{immune_panne:true,start_limite:true}],
  ],
  ac_mirage: [
    ["Âne des Souks","🫏","Discret","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Faucon Guide","🦅","Vision","Immunité Limite","Main max 9",{immune_limite:true,hand_size:-1}],
    ["Barque du Tigre","🛶","Fluviale","+50 départ","Aucun",{start_km:50}],
    ["Coursier Noir","🐎","Rapide","Démarre en route","Aucun",{start_green:true}],
    ["Porteur de Relais","📦","Stockage","Immunité Panne","Pas de 200",{immune_panne:true,no_200:true}],
  ],
  ac_bf: [
    ["Goélette Rapide","⛵","Agile","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Chaloupe Espionne","🛶","Furtive","Commence avec Vol","Aucun",{start_thief:true}],
    ["Galion de Guerre","🚢","Massif","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Brûlot Pirate","🔥","Risqué","+50 départ","Départ limité",{start_km:50,start_limite:true}],
    ["Navire Marchand","⚓","Rentable","Main +1","Aucun",{hand_size:1}],
  ],
  sims: [
    ["Voiture de Sport Rouge","🏎️","Frime","Démarre en route","Main max 9",{start_green:true,hand_size:-1}],
    ["Trottinette Électrique","🛴","Compacte","+50 départ","Pas de 200",{start_km:50,no_200:true}],
    ["Vieux Break","🚙","Solide","Immunité Accident","Départ limité",{immune_accident:true,start_limite:true}],
    ["Taxi de Ville","🚕","Pratique","Immunité Feu Rouge","Aucun",{immune_feu_rouge:true}],
  ],
  sea_thieves: [
    ["Galion Fantôme","👻","Maudit","Commence avec Vol","Main max 9",{start_thief:true,hand_size:-1}],
    ["Bateau de Pêche","🎣","Tenace","Immunité Panne","Départ limité",{immune_panne:true,start_limite:true}],
    ["Navire de Marine","🚢","Armé","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Canoë d'Île","🛶","Léger","+50 départ","Aucun",{start_km:50}],
  ],
  hades: [
    ["Trône de Mégère","🔥","Vengeur","Immunité Accident","Départ limité",{immune_accident:true,start_limite:true}],
    ["Coursier d'Asphodèle","🐎","Rapide","Démarre en route","Aucun",{start_green:true}],
    ["Roues du Tartare","⚙️","Lourdes","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Ombre Ailée","🪽","Furtive","Commence avec Vol","Main max 9",{start_thief:true,hand_size:-1}],
  ],
  mafia: [
    ["Roadster du Boss","🚘","Rapide","+50 départ","Main max 9",{start_km:50,hand_size:-1}],
    ["Camion Livraison","🚚","Discret","Main +1","Départ limité",{hand_size:1,start_limite:true}],
    ["Corbillard Noir","⚰️","Intimidant","Immunité Accident","Pas de 200",{immune_accident:true,no_200:true}],
    ["Moto Coursier","🏍️","Nerveuse","Démarre en route","Aucun",{start_green:true}],
  ],
  sekiro: [
    ["Cheval Caparaçonné","🐎","Solide","2 boucliers","Pas de 200",{tank_shield:true,tank_shield_x2:true,no_200:true}],
    ["Traîneau de Neige","🛷","Montagne","Immunité Panne","Départ limité",{immune_panne:true,start_limite:true}],
    ["Renard Messager","🦊","Furtif","Commence avec Vol","Main max 9",{start_thief:true,hand_size:-1}],
    ["Barque Brumeuse","🛶","Silence","+50 départ","Aucun",{start_km:50}],
  ],
  payday: [
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
};

Object.entries(VEHICLE_EXPANSION_PACKS).forEach(([theme, rows]) => {
  rows.forEach(([name, icon, desc, b, m, effects], idx) => {
    const id = `vx_${theme}_${idx + 1}`;
    if(!VEHICLES.some(v => v.id === id)) VEHICLES.push({id, name, icon, theme, desc, b, m, effects});
  });
});

export function getVehiclesForTheme(themeKey){
  const skinKey = THEMES[themeKey]?.skin || themeKey || "classic";
  const scoped = VEHICLES.filter(v => v.theme === skinKey || v.theme === themeKey);
  return scoped.length ? scoped : VEHICLES.filter(v => v.theme === "classic");
}

// ─── LOGIC HELPERS ───────────────────────────────────────────
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=0|(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
const isImmune=(p,v)=>{
  if(p.bottes.some(b=>Array.isArray(b.immuneTo)?b.immuneTo.includes(v):b.immuneTo===v)) return true;
  const fx = VEHICLES.find(x=>x.id===p.vid)?.effects || {};
  if(v==="panne_essence" && fx.immune_panne) return true;
  if(v==="limite" && fx.immune_limite) return true;
  if(v==="crevaison" && fx.immune_crevaison) return true;
  if(v==="feu_rouge" && fx.immune_feu_rouge) return true;
  if(v==="accident" && fx.immune_accident) return true;
  return false;
};
// ─── REGLE GLOBALE : MAIN MINIMUM 10 CARTES ─────────────────
// Tous les joueurs (humains + IA, solo + multi) maintiennent au moins MIN_HAND_SIZE cartes
// en main. La pioche refait le plein apres chaque action qui retire des cartes. Si la pioche
// est vide, on reshuffle la defausse (sauf la carte du dessus). Si tout est vide, on s'arrete.
export const MIN_HAND_SIZE = 10;
export const MAX_HAND_SIZE = 14; // plafond souple pour eviter une croissance infinie via vols/pioche

// Helper : remplit la main d'un joueur jusqu'a au moins MIN_HAND_SIZE cartes.
// MUTATE le player.hand (push) ; retourne les nouvelles refs deck/disc.
export function refillHand(player, deck, disc, min = MIN_HAND_SIZE) {
    let d = deck, dc2 = disc, safety = 200;
    while (player.hand.length < min && safety-- > 0) {
        const r = drawCard(d, dc2);
        if (!r.card) break; // plus rien a piocher, on arrete
        player.hand.push(r.card);
        d = r.deck; dc2 = r.disc;
    }
    return { deck: d, disc: dc2 };
}

// Clone defensif d'un joueur : protege contre un inventory absent (ancienne sauvegarde) ou des arrays manquants.
const dc=p=>({
  ...p,
  bottes:Array.isArray(p.bottes)?[...p.bottes]:[],
  hand:Array.isArray(p.hand)?p.hand.map(c=>({...c})):[],
  inventory:Array.isArray(p.inventory)?p.inventory.map(c=>({...c})):[],
  maxFuel:p.maxFuel||100,
  fuel:typeof p.fuel==="number"?p.fuel:100,
  hazardHidden:!!p.hazardHidden
}); 

export function humanizeCardValue(value){
  return String(value || "carte")
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function normalizePlayableCard(raw={}, skin=CLASSIC, skinKey="classic", unit="km", uidOverride=null){
  const ex = SKIN_EXTRAS[skinKey] || SKIN_EXTRAS.classic || {};
  const value = raw.value || raw.cardVal || "";
  const baseMap = {
    boost50: {...(ex.boost50 || {}), value:"boost50", type:"boost", sub:`+50 ${unit}`},
    boost75: {...(ex.boost75 || {}), value:"boost75", type:"boost", sub:`+75 ${unit}`},
    boost100:{...(ex.boost100 || {}), value:"boost100", type:"boost", sub:`+100 ${unit}`},
    shield_1:{...(ex.shield || {}), value:"shield_1", type:"shield", sub:"+1 blindage"},
    shield_2:{...(ex.shieldPlus || {}), value:"shield_2", type:"shield", isShieldPlus:true, sub:"+2 blindages"},
    trap_minor:{...(ex.trapMinor || {}), value:"trap_minor", type:"attack", isTrap:true, sub:"-30 + limite"},
    trap_major:{...(ex.trapMajor || {}), value:"trap_major", type:"attack", isTrap:true, isTrapPlus:true, sub:"-50 + limite"},
    slow:{...(ex.slow || {}), value:"slow", type:"attack", isSlow:true, sub:"-25 cible"},
    draw3:{...(ex.draw || {}), value:"draw3", type:"draw", sub:"pioche 3"},
    reroll:{...(ex.reroll || {}), value:"reroll", type:"reroll", sub:"repioche 10"},
    wildcard:{...(ex.wildCard || {}), value:"wildcard", type:"boost", isWild:true, sub:`+60 ${unit} libre`},
    doubleplay:{...(ex.doublePlay || {}), value:"doubleplay", type:"boost", isDouble:true, sub:`+40 ${unit} + pioche`},
    vol:{...(skin.vol || {}), value:"vol", type:"action", icon:E.hand, label:"Vol", sub:"vole 1 carte"},
    sabotage:{...(skin.sabotage || {}), value:"sabotage", type:"attack", icon:E.bomb, label:"Sabotage", sub:"-50 cible", isSabo:true},
    piratage:{...(skin.piratage || {}), value:"piratage", type:"attack", icon:"💻", label:"Piratage", sub:"-50 + arrêt", isHack:true},
    premium:{type:"remedy", value:"premium", icon:"🔧", label:"Kit Premium", sub:"répare tout"},
    bricolage:{...(skin.bricolage || {}), value:"bricolage", type:"remedy", icon:"🧰", label:"Bricolage", sub:"répare + limite", isBrico:true},
    fin_limite:{...(skin.fin_limite || {}), value:"fin_limite", type:"remedy", fixes:"limite"},
    feu_vert:{...(skin.feu_vert || {}), value:"feu_vert", type:"remedy", fixes:"feu_rouge"},
    essence:{...(skin.essence || {}), value:"essence", type:"remedy", fixes:"panne_essence"},
    reparation:{...(skin.reparation || {}), value:"reparation", type:"remedy", fixes:"accident"},
    roue:{...(skin.roue || {}), value:"roue", type:"remedy", fixes:"crevaison"},
  };
  const base = baseMap[value] || (skin[value] ? {...skin[value], value} : {});
  const card = {...base, ...raw, value:value || base.value, type:raw.type || raw.cardType || base.type || "action"};
  if(card.value === "trap_minor") { card.isTrap = true; card.isTrapPlus = false; }
  if(card.value === "trap_major") { card.isTrap = true; card.isTrapPlus = true; }
  if(card.value === "slow") card.isSlow = true;
  if(card.value === "shield_2") card.isShieldPlus = true;
  if(card.value === "wildcard") card.isWild = true;
  if(card.value === "doubleplay") card.isDouble = true;
  if(card.value === "sabotage") card.isSabo = true;
  if(card.value === "piratage") card.isHack = true;
  if(card.value === "bricolage") card.isBrico = true;
  if(card.type === "remedy" && !card.fixes) {
    const fixes = {essence:"panne_essence", reparation:"accident", roue:"crevaison", feu_vert:"feu_rouge", fin_limite:"limite"};
    if(fixes[card.value]) card.fixes = fixes[card.value];
  }
  if(!card.label) card.label = raw.itemName || base.label || humanizeCardValue(card.value || card.type);
  if(!card.icon) card.icon = raw.itemIcon || base.icon || (card.type==="attack" ? "⚠️" : card.type==="remedy" ? "🩺" : card.type==="boost" ? "💨" : "🎴");
  if(!card.sub) card.sub = raw.itemDesc || base.sub || humanizeCardValue(card.type);
  if(uidOverride !== null && typeof uidOverride !== "undefined") card.uid = uidOverride;
  return card;
}

export function buildDeck(skin, skinKey){
  const di=skin.distance.icon;
  const unitByType={"Distance":"km","Exploration":"blocs","Transfert":"TB","Saut Spatial":"ps","Miles":"mi","Noeuds":"noeuds","Jours":"jours","Ombres":"ombres","Rues":"rues","Pas":"pas","Butin":"butin","Ruelles":"ruelles","Voyage":"lieues"};
  const su=unitByType[skin.distance.typeName] || "lieues";
  const D=(n,o)=>Array(n).fill(o);
  const ex = SKIN_EXTRAS[skinKey] || SKIN_EXTRAS.classic;
  return[
    // ── DISTANCES (66 + 4 supplementaires en 25 et 50 pour epauler les mains de 10) ──
    ...D(5,{label:"5",value:5,type:"distance",icon:di,sub:su}),...D(5,{label:"10",value:10,type:"distance",icon:di,sub:su}),
    ...D(5,{label:"15",value:15,type:"distance",icon:di,sub:su}),...D(5,{label:"20",value:20,type:"distance",icon:di,sub:su}),
    ...D(12,{label:"25",value:25,type:"distance",icon:di,sub:su}),...D(12,{label:"50",value:50,type:"distance",icon:di,sub:su}),
    ...D(10,{label:"75",value:75,type:"distance",icon:di,sub:su}),...D(12,{label:"100",value:100,type:"distance",icon:di,sub:su}),
    ...D(4,{label:"200",value:200,type:"distance",icon:di,sub:su}),
    // ── ATTAQUES (16 + 1 piratage + 2 sabotage + 2 zone) ──
    ...D(3,{...skin.panne_essence,value:"panne_essence",type:"attack"}),...D(3,{...skin.accident,value:"accident",type:"attack"}),
    ...D(4,{...skin.feu_rouge,value:"feu_rouge",type:"attack"}),...D(3,{...skin.limite,value:"limite",type:"attack"}),
    ...D(3,{...skin.crevaison,value:"crevaison",type:"attack"}),
    // ── REMEDES ──
    ...D(6,{...skin.essence,value:"essence",type:"remedy"}),...D(6,{...skin.reparation,value:"reparation",type:"remedy"}),
    ...D(14,{...skin.feu_vert,value:"feu_vert",type:"remedy"}),...D(6,{...skin.fin_limite,value:"fin_limite",type:"remedy"}),
    ...D(6,{...skin.roue,value:"roue",type:"remedy"}),
    // ── BOTTES ──
    {...skin.as_volant,value:"as_volant",type:"botte"},{...skin.citerne,value:"citerne",type:"botte"},
    {...skin.increvable,value:"increvable",type:"botte"},{...skin.prioritaire,value:"prioritaire",type:"botte"},
    // ── SPECIALES ──
    ...D(2,{...skin.vol, value:"vol", type:"action"}), ...D(2,{...skin.sabotage, value:"sabotage", type:"attack"}),
    ...D(2,{...skin.chaos, value:"chaos", type:"action"}), ...D(2,{...skin.special_boost}), ...D(2,{...skin.zone_attack, type:"attack"}),
    ...D(1,{...skin.bricolage, value:"bricolage", type:"remedy"}), ...D(1,{...skin.piratage, value:"piratage", type:"attack"}),
    // ── NOUVELLES CARTES THEMATIQUES : 12 archetypes × 2 exemplaires = 24 cartes par theme ──
    ...D(2,{...ex.boost50,    value:"boost50",    type:"boost"}),
    ...D(2,{...ex.boost75,    value:"boost75",    type:"boost"}),
    ...D(2,{...ex.boost100,   value:"boost100",   type:"boost"}),
    ...D(2,{...ex.shield,     value:"shield_1",   type:"shield"}),
    ...D(2,{...ex.shieldPlus, value:"shield_2",   type:"shield", isShieldPlus:true}),
    ...D(2,{...ex.trapMinor,  value:"trap_minor", type:"attack", isTrap:true}),
    ...D(2,{...ex.trapMajor,  value:"trap_major", type:"attack", isTrap:true, isTrapPlus:true}),
    ...D(2,{...ex.draw,       value:"draw3",      type:"draw"}),
    ...D(2,{...ex.slow,       value:"slow",       type:"attack", isSlow:true}),
    ...D(2,{...ex.reroll,     value:"reroll",     type:"reroll"}),
    // Nouveaux archetypes 2026-05-18 : diversification gameplay
    ...D(2,{...ex.wildCard,   value:"wildcard",   type:"boost",  isWild:true}),    // +60 km sans pre-requis
    ...D(2,{...ex.doublePlay, value:"doubleplay", type:"boost",  isDouble:true}),  // +40 km + pioche bonus
    // Pass 2 v8.22.1 : 20 variantes supplementaires par theme, toutes branchees
    // sur les handlers existants pour eviter les cartes mortes.
    ...buildThemeDeepCards(skin, ex, su),
    // Augmentation quantites distances pour deck plus dense (deja a 24/24/12)
    ...D(2,{label:"25",value:25,type:"distance",icon:di,sub:su}),
    ...D(2,{label:"50",value:50,type:"distance",icon:di,sub:su}),
  ].map((c,i)=>normalizePlayableCard(c, skin, skinKey, su, i));
}

export function dealAll(all,n, roles){
  let d=shuffle(all);
  const hands=Array.from({length:n},()=>[]);
  const fv=d.reduce((a,c,i)=>{if(c.value==="feu_vert")a.push(i);return a;},[]);
  const volCards=d.reduce((a,c,i)=>{if(c.value==="vol")a.push(i);return a;},[]);
  const used=new Set();

  // Etape 1 : pre-assignations (start_thief, start_green)
  for(let p=0;p<n;p++){
    const fx = VEHICLES.find(x=>x.id===roles[p])?.effects || {};
    if(fx.start_thief) { const fi=volCards.find(i=>!used.has(i)); if(fi!==undefined){used.add(fi);hands[p].push(d[fi]);} }
    if(!fx.start_green) { const fi=fv.find(i=>!used.has(i)); if(fi!==undefined){used.add(fi);hands[p].push(d[fi]);} }
  }
  // Etape 2 : round-robin jusqu'a ce que chaque joueur ait MIN_HAND_SIZE cartes (modulee par hand_size effect)
  let pi=0, safety = d.length * 2;
  while (safety-- > 0) {
    // Verifie si tous les joueurs ont atteint leur target
    let allDone = true;
    for(let p=0; p<n; p++){
      const fx = VEHICLES.find(x=>x.id===roles[p])?.effects || {};
      const targetH = Math.max(1, MIN_HAND_SIZE + (fx.hand_size || 0));
      if(hands[p].length < targetH) { allDone = false; break; }
    }
    if(allDone) break;
    // Cherche une carte libre a donner au joueur courant
    const fx = VEHICLES.find(x=>x.id===roles[pi])?.effects || {};
    const targetH = Math.max(1, MIN_HAND_SIZE + (fx.hand_size || 0));
    if(hands[pi].length < targetH) {
      // Trouve la prochaine carte non-utilisee
      let placed = false;
      for(let i=0;i<d.length;i++){
        if(!used.has(i)){ hands[pi].push(d[i]); used.add(i); placed=true; break; }
      }
      if(!placed) break; // plus de cartes
    }
    pi=(pi+1)%n;
  }
  return{hands,remaining:d.filter((_,i)=>!used.has(i))};
}

const newP=(name,ci,vid="v1",targetKm=1000)=>{
    const fx = VEHICLES.find(x=>x.id===vid)?.effects || {};
    const raceTarget = normalizeTargetKm(targetKm);
    return {
        name,km: fx.start_km||0,hand:[],inventory:[],bottes:[],hazard:null,speedLimit:!!fx.start_limite,
        stopped: !fx.start_green, colorIdx:ci, bottes_count:0, coupsFourres:0,
        vid: vid, tank_shield: !!fx.tank_shield ? (fx.tank_shield_x2 ? 2 : 1) : 0,
        maxFuel:100, fuel:100, hazardHidden:false, targetKm:raceTarget
    };
};
const getPlayerTargetKm = (player) => normalizeTargetKm(player?.targetKm);

// ─── EFFECT LABEL (P5 enrichissement 2026-05-18) ───
// Genere un sub COURT et PRECIS pour la carte (affiche en bas de la carte).
// Remplace les "sub" vagues du mkSkin par un effet immediatement comprehensible.
// Garde le texte tres court (≤ 18 chars) pour ne pas alourdir la carte.
export function getCardEffect(card, unit) {
    if(!card) return "";
    if(card.type === 'distance') return `+${card.value} ${unit||'km'}`;
    if(card.type === 'attack') {
        if(card.isTrap)   return card.isTrapPlus ? "-50 + limite" : "-30 + limite";
        if(card.isSabo)   return "-50 km cible";
        if(card.isHack)   return "-50 + arrêt";
        if(card.isZone)   return "Bloque tous";
        if(card.isSlow)   return "-25 km cible";
        if(card.value === "feu_rouge")     return "Bloque cible";
        if(card.value === "limite")        return "Limite vitesse";
        if(card.value === "panne_essence") return "Panne essence";
        if(card.value === "accident")      return "Accident";
        if(card.value === "crevaison")     return "Crevaison";
        return "Attaque";
    }
    if(card.type === 'remedy') {
        if(card.value === 'premium')    return "Répare tout";
        if(card.isBrico)                return "Répare + limite";
        if(card.value === 'feu_vert')   return "Démarre / soigne";
        if(card.value === 'fin_limite') return "Fin de limite";
        if(card.value === 'essence')    return "Soigne panne";
        if(card.value === 'reparation') return "Soigne accident";
        if(card.value === 'roue')       return "Soigne crevaison";
        return "Soigne";
    }
    if(card.type === 'botte') {
        if(card.value === 'prioritaire') return "Immunité ×2";
        return "Immunité";
    }
    if(card.type === 'boost') {
        if(card.isWild)   return "+60 km libre";
        if(card.isDouble) return "+40 km +pioche";
        if(card.value === 'boost100') return "+100 km";
        if(card.value === 'boost75')  return "+75 km";
        return "+50 km";
    }
    if(card.type === 'shield') return card.isShieldPlus ? "+2 blindage" : "+1 blindage";
    if(card.type === 'draw')   return "Pioche +3";
    if(card.type === 'reroll') return "Refresh main";
    if(card.type === 'action') {
        if(card.isChaos)         return "Aléa global";
        if(card.value === 'vol') return "Vole 1 carte";
        return "Action";
    }
    return card.sub || "";
}

export function getCardDesc(card){
    if(!card) return "";
    if(card.type === 'distance') {
        if(card.value === 200) return `🛣️ Avancez de 200. Joueur en route obligatoire, panne soignée, et hors limite de vitesse.`;
        if(card.value === 100) return `🛣️ Avancez de 100. Nécessite : en route, sans panne, hors limite de vitesse (max 50).`;
        if(card.value > 50)    return `🛣️ Avancez de ${card.value}. Nécessite : en route, sans panne, hors limite (max 50).`;
        return `🛣️ Avancez de ${card.value}. Nécessite : en route, sans panne.`;
    }
    if(card.type === 'attack') {
        if(card.isTrap) return `🛑 Piège : inflige -30 km ET pose une limite de vitesse à la cible. Glissez sur l'adversaire.`;
        if(card.isSabo) return `💥 Sabotage : fait reculer la cible de 50 km. Glissez la carte sur un adversaire.`;
        if(card.isHack) return `💻 Piratage : recul de 50 km ET arrêt immédiat (Feu Rouge). Glissez sur la cible.`;
        if(card.isZone) return `🌐 Attaque de zone : applique la panne à TOUS les adversaires (vous épargné).`;
        if(card.value === "feu_rouge") return `🔴 Feu Rouge : bloque la cible jusqu'à un Feu Vert. Glissez sur l'adversaire.`;
        if(card.value === "limite")    return `🚧 Limite de vitesse : la cible ne peut plus jouer de cartes > 50 km.`;
        if(card.value === "panne_essence") return `⛽ Panne d'essence : la cible doit jouer Essence avant de repartir.`;
        if(card.value === "accident") return `🔧 Accident : la cible doit jouer Réparation pour repartir.`;
        if(card.value === "crevaison") return `🛞 Crevaison : la cible doit jouer Roue de secours.`;
        return `⚠️ Inflige une panne à un adversaire. Glissez la carte sur la cible.`;
    }
    if(card.type === 'remedy') {
        if(card.value === 'premium') return `🔧 Kit Premium : soigne instantanément n'importe quelle panne (Feu Rouge, Essence, Accident, Crevaison).`;
        if(card.isBrico) return `🧰 Bricolage : répare tout et vous met en route, MAIS impose la limite 50 km.`;
        if(card.value === 'feu_vert')   return `🟢 Feu Vert : démarre ou lève un Feu Rouge. À jouer en début de partie pour rouler.`;
        if(card.value === 'fin_limite') return `🏁 Fin de Limite : annule la limite de vitesse (vous pouvez rejouer des >50).`;
        if(card.value === 'essence')    return `⛽ Essence : soigne la Panne d'essence.`;
        if(card.value === 'reparation') return `🔧 Réparation : soigne un Accident.`;
        if(card.value === 'roue')       return `🛞 Roue de secours : soigne une Crevaison.`;
        return `🩺 Soigne la panne correspondante.`;
    }
    if(card.type === 'botte') {
        const t = Array.isArray(card.immuneTo)?card.immuneTo.join(" + "):card.immuneTo;
        if(card.value === 'prioritaire') return `👑 Botte Prioritaire : immunité Feu Rouge + Limite. Coup Fourré +300 pts si jouée juste après une attaque !`;
        if(card.value === 'as_volant')   return `🏆 As du Volant : immunité totale contre Accident. Coup Fourré +300 pts si jouée après l'attaque.`;
        if(card.value === 'citerne')     return `🛢️ Citerne : immunité Panne d'essence. Coup Fourré +300 pts si jouée après l'attaque.`;
        if(card.value === 'increvable')  return `🛡️ Increvable : immunité Crevaison. Coup Fourré +300 pts si jouée après l'attaque.`;
        return `✨ Botte ! Immunité permanente (${t||"panne"}). +300 pts en Coup Fourré.`;
    }
    if(card.type === 'action') {
        if(card.isChaos) return `🎲 Aléa Routier : déclenche un événement aléatoire pour toute la table.`;
        if(card.value === 'vol') return `🫳 Vol : choisissez une position dans la main adverse, sans révéler son contenu.`;
        return `🃏 Action spéciale.`;
    }
    if(card.type === 'boost') {
        if(card.isWild)   return `🎰 Joker Route : +60 km à vous-même, retire toute panne. Jouable même bloqué.`;
        if(card.isDouble) return `🔂 Double Tour : +40 km + pioche 1 carte bonus. Nécessite d'être en route.`;
        const g = card.value === 'boost100' ? 100 : card.value === 'boost75' ? 75 : 50;
        return `💨 Boost : +${g} km à vous-même. Nécessite d'être en route, sans panne.`;
    }
    if(card.type === 'shield') {
        const add = card.isShieldPlus ? 2 : 1;
        return `🛡 Blindage : ajoute +${add} bouclier${add>1?'s':''} qui pareront vos prochaines attaques ou vols subis.`;
    }
    if(card.type === 'draw') {
        return `🎴 Pioche bonus : prenez 3 cartes supplémentaires en plus du refill normal.`;
    }
    if(card.type === 'reroll') {
        return `♻ Reroll : défaussez toute votre main, repiochez 10 cartes fraîches. Idéal pour sortir d'une mauvaise main.`;
    }
    if(card.isSlow) return `🐌 Ralentissement : -25 km à la cible, sans hazard. Pas de speedLimit imposée.`;
    return "";
}

export function applySelf(card,player){
  const p={...player,bottes:[...player.bottes]};
  const limit = getPlayerTargetKm(p);
  const fx = VEHICLES.find(x=>x.id===p.vid)?.effects || {};
  const refillFuel = (amount=null) => {
    p.maxFuel = p.maxFuel || 100;
    const cur = typeof p.fuel === "number" ? p.fuel : p.maxFuel;
    p.fuel = amount === null ? p.maxFuel : Math.min(p.maxFuel, cur + amount);
  };
  // ─── NOUVELLES CARTES SELF (boost, shield, draw, reroll, wild, double) ───
  if(card.type==="boost"){
    // Wild card : pas de prerequis (peut etre jouee meme bloque) — debloque + +60 km
    if(card.isWild) {
        const gain = 60;
        p.hazard = null;
        p.stopped = false; // remet en route
        refillFuel(20);
        if(p.km + gain > limit) return {ok:false, msg:`Cette wildcard dépasserait ${limit}.`};
        p.km = Math.min(limit, p.km + gain);
        return {ok:true, msg:`${card.icon} Joker ! +${gain} & carburant +20`, player:p};
    }
    // Double play : +40 km + pioche 1 carte bonus (gere comme drawBonus)
    if(card.isDouble) {
        if(p.stopped && !fx.start_green) return {ok:false, msg:"Démarrez d'abord (Feu Vert)."};
        if(p.hazard) return {ok:false, msg:"Soignez votre panne d'abord."};
        const gain = 40;
        if(p.km + gain > limit) return {ok:false, msg:`Ce gain dépasserait ${limit}.`};
        p.km = Math.min(limit, p.km + gain);
        return {ok:true, msg:`${card.icon} +${gain} & pioche !`, player:p, drawBonus:1};
    }
    if(p.stopped && !fx.start_green) return {ok:false, msg:"Démarrez d'abord (Feu Vert)."};
    if(p.hazard) return {ok:false, msg:"Soignez votre panne avant le boost."};
    const gain = card.value === "boost100" ? 100 : card.value === "boost75" ? 75 : 50;
    if(p.km + gain > limit) return {ok:false, msg:`Ce boost dépasserait ${limit}.`};
    p.km = Math.min(limit, p.km + gain);
    return {ok:true, msg:`${card.icon} +${gain} = ${p.km} !`, player:p};
  }
  if(card.type==="shield"){
    const add = card.isShieldPlus ? 2 : 1;
    p.tank_shield = (p.tank_shield || 0) + add;
    return {ok:true, msg:`${card.icon} Blindage +${add} (total ${p.tank_shield})`, player:p};
  }
  // type=draw : pioche 3 cartes (effectue dans processPlay via refillHand a +3, voir plus bas)
  if(card.type==="draw"){
    return {ok:true, msg:`${card.icon} +3 cartes`, player:p, drawBonus:3};
  }
  // type=reroll : signale au caller de defausser tout et repiocher (gere dans processPlay)
  if(card.type==="reroll"){
    return {ok:true, msg:`${card.icon} Nouveau plan !`, player:p, rerollHand:true};
  }
  if(card.type==="botte"){
    p.bottes.push(card);p.bottes_count=(p.bottes_count||0)+1;
    let cf = false;
    if(card.value==="prioritaire"){
      if(p.hazard==="feu_rouge" || p.speedLimit || p.hazard==="limite") cf = true;
      p.stopped=false; p.hazard=null; p.speedLimit=false;
    }
    if(card.value==="as_volant"&&p.hazard==="accident"){ p.hazard=null; cf = true; }
    if(card.value==="citerne"&&p.hazard==="panne_essence"){ p.hazard=null; refillFuel(); cf = true; }
    if(card.value==="increvable"&&p.hazard==="crevaison"){ p.hazard=null; cf = true; }
    if(cf) p.coupsFourres = (p.coupsFourres||0) + 1;
    return{ok:true,msg:cf?`COUP FOURRE ! ${card.label}`:`${card.icon} ${card.label} !`,player:p, cf:cf};
  }
  if(card.type==="distance"){
    if(p.stopped)return{ok:false,msg:"Jouez d'abord un feu vert !"};
    if(p.hazard)return{ok:false,msg:"Vous avez une panne active !"};
    if(card.value>50&&p.speedLimit)return{ok:false,msg:"Limite de vitesse ! (max 50)"};
    if(card.value===200&&fx.no_200)return{ok:false,msg:"Votre vehicule ne peut pas jouer de 200 !"};
    if(card.value===100&&fx.no_100)return{ok:false,msg:"Votre vehicule ne peut pas jouer de 100 !"};
    if(p.km+card.value>limit)return{ok:false,msg:`Depasserait ${limit} !`};
    p.km+=card.value;return{ok:true,msg:`${card.icon} +${card.value} = ${p.km}`,player:p};
  }
  if(card.type==="remedy"){
    if(card.value==="premium") {
        p.hazard = null; p.hazardHidden = false; p.stopped = false;
        refillFuel();
        return {ok:true, msg:`${card.icon} Tout est réparé + plein fait !`, player:p};
    }
    if(card.isBrico) {
        if(!p.hazard && !p.stopped) return {ok:false, msg:"Inutile, vous roulez deja !"};
        p.hazard = null; p.hazardHidden = false; p.stopped = false; p.speedLimit = true;
        refillFuel(35);
        return {ok:true, msg:`${card.icon} Bricolage ! +35 carburant (Max 50)`, player:p};
    }
    if(card.value==="feu_vert"){
      if(!p.stopped&&!p.hazard)return{ok:false,msg:"Vous roulez deja !"};
      if(p.hazard==="feu_rouge"){p.hazard=null;p.hazardHidden=false;p.stopped=false;refillFuel(10);return{ok:true,msg:`${card.icon} En route ! +10 carburant`,player:p};}
      if(p.stopped&&!p.hazard){p.stopped=false;refillFuel(10);return{ok:true,msg:`${card.icon} En route ! +10 carburant`,player:p};}
      return{ok:false,msg:"Soignez d'abord votre panne."};
    }
    if(card.value==="fin_limite"){if(!p.speedLimit)return{ok:false,msg:"Pas de limite active."};p.speedLimit=false;return{ok:true,msg:`${card.icon} Limite levee !`,player:p};}
    if(p.hazard===card.fixes){
      p.hazard=null;p.hazardHidden=false;
      if(card.value==="essence") refillFuel();
      else if(card.value==="reparation" || card.value==="roue") refillFuel(35);
      const fuelNote = card.value==="essence" ? " + plein fait" : (card.value==="reparation" || card.value==="roue") ? " +35 carburant" : "";
      return{ok:true,msg:`${card.icon} Soigné !${fuelNote}`,player:p};
    }
    return{ok:false,msg:"Ce remede ne correspond pas."};
  }
  return{ok:false,msg:"Carte invalide."};
}

export function applyAtk(card,target){
  const t={...target,bottes:[...target.bottes]};
  if(isImmune(t,card.value))return{ok:false,msg:"La cible est immune !"};
  if(t.tank_shield > 0) {
      t.tank_shield -= 1;
      return {ok:true, msg:`Bouclier Blinde active !`, target:t, parried:true};
  }
  if(card.isHack) {
      t.km = Math.max(0, t.km - 50); t.hazard = "feu_rouge"; t.stopped = true;
      return {ok:true, msg:`${card.icon} Piratage ! (-50km & Bloque)`, target:t};
  }
  if(card.isSabo) {
      t.km = Math.max(0, t.km - 50);
      return {ok:true, msg:`${card.icon} Sabotage reussi (-50) !`, target:t};
  }
  if(card.isTrap) {
      // Piege thematique : -30 km (mineur) ou -50 km (majeur) + limite de vitesse imposee
      const loss = card.isTrapPlus ? 50 : 30;
      t.km = Math.max(0, t.km - loss);
      t.speedLimit = true;
      return {ok:true, msg:`${card.icon} Piège ! -${loss} & vitesse limitée`, target:t};
  }
  if(card.isSlow) {
      // Ralentissement simple : -25 km sans hazard ni limite (cible peut toujours rouler)
      t.km = Math.max(0, t.km - 25);
      return {ok:true, msg:`${card.icon} -25 km !`, target:t};
  }
  if(card.value==="limite"){if(t.speedLimit)return{ok:false,msg:"La cible a deja une limite."};t.speedLimit=true;return{ok:true,msg:`${card.icon} Limite imposee !`,target:t};}
  if(card.value==="feu_rouge" || card.isZone){
    if(t.stopped||t.hazard==="feu_rouge")return{ok:false,msg:"La cible est deja bloquee."};
    t.hazard="feu_rouge";
    t.stopped=true;
    return{ok:true,msg:`${card.icon} Bloque !`,target:t};
  }
  if(t.hazard)return{ok:false,msg:"La cible a deja une panne."};
  t.hazard=card.value;return{ok:true,msg:`${card.icon} ${card.label} !`,target:t};
}

export function applyAction(card, target, _attackerHand, choiceIndex=null) {
    // choiceIndex permet un vrai choix de vol sans révéler automatiquement la main adverse.
    if(card.value === "vol") {
        if(target.hand.length === 0) return {ok:false, msg:"Main cible vide !"};
        if(target.tank_shield > 0) {
            const t = {...target, tank_shield: target.tank_shield - 1};
            return {ok:true, msg:`Bouclier Blinde repousse le vol !`, target:t, stolen: null, parried:true};
        }
        const rIdx = typeof choiceIndex === "number"
          ? Math.max(0, Math.min(target.hand.length - 1, choiceIndex))
          : Math.floor(Math.random() * target.hand.length);
        const stolen = target.hand[rIdx];
        const t = {...target, hand: target.hand.filter((_,i)=>i!==rIdx)};
        return {ok:true, msg:`${card.icon} Vol réussi !`, target:t, stolen, choiceIndex:rIdx};
    }
    return {ok:false, msg:"Action inconnue"};
}

export function drawCard(deck,disc){
  if(deck.length>0){const[c,...r]=deck;return{card:c,deck:r,disc};}
  if(disc.length>1){const top=disc[disc.length-1];const rs=shuffle(disc.slice(0,-1));const[c,...r]=rs;return{card:c,deck:r,disc:[top]};}
  return{card:null,deck,disc};
}

export function aiMove(aiP,humans,safe,diff){
  const ai=dc(aiP),hs=humans.map(dc),h=ai.hand,inv=ai.inventory;
  let idx=-1, isInvMove=false, nAI=ai,nH=hs;
  
  if(Math.random()<diff.blunder)return{idx:-1,nAI,nH,isInvMove};
  let threatIdx = -1; let maxKm = -1;
  if(diff.ml) { hs.forEach((p, i) => { if(p.km > maxKm) { maxKm=p.km; threatIdx=i; } }); }

  if(ai.hazard || ai.stopped || ai.speedLimit) {
      for(let i=0;i<inv.length;i++){
          if(inv[i].type==="remedy") {
              const r=applySelf(inv[i],ai);
              if(r.ok){nAI=r.player;idx=i;isInvMove=true;break;}
          }
      }
  }

  if(idx<0) {
      for(let i=0;i<h.length;i++){if(h[i].type!=="botte")continue;const r=applySelf(h[i],ai);if(r.ok){nAI=r.player;idx=i;break;}}
      if(idx<0&&ai.hazard){for(let i=0;i<h.length;i++){if(h[i].type!=="remedy"||h[i].fixes!==ai.hazard)continue;const r=applySelf(h[i],ai);if(r.ok){nAI=r.player;idx=i;break;}}}
      if(idx<0&&ai.stopped){for(let i=0;i<h.length;i++){if(h[i].value!=="feu_vert" && !h[i].isBrico)continue;const r=applySelf(h[i],ai);if(r.ok){nAI=r.player;idx=i;break;}}}
      if(idx<0&&ai.speedLimit){for(let i=0;i<h.length;i++){if(h[i].value!=="fin_limite")continue;const r=applySelf(h[i],ai);if(r.ok){nAI=r.player;idx=i;break;}}}
      if(idx<0&&!ai.hazard&&!ai.stopped){const ds=h.map((c,i)=>({c,i})).filter(x=>x.c.type==="distance").sort((a,b)=>b.c.value-a.c.value);for(const{c,i}of ds){const r=applySelf(c,ai);if(r.ok){nAI=r.player;idx=i;break;}}}
      
      if(idx<0 && (safe===0 || diff.ml)){
          for(let i=0; i<inv.length; i++) {
              if(inv[i].type==="attack" || inv[i].type==="action") {
                  let targets = [...hs].map((p,i)=>({p,i})).sort((a,b)=>b.p.km-a.p.km);
                  if(diff.ml && maxKm >= 700) targets = [targets.find(x => x.i === threatIdx)];
                  for(const{p:tp,i:ti}of targets){
                      if(!tp) continue;
                      if(inv[i].type === "action") {
                          const r = applyAction(inv[i], tp);
                          if(r.ok) { nH=hs.map((p,xi)=>xi===ti?r.target:p); if(r.stolen) nAI.hand.push(r.stolen); idx=i; isInvMove=true; break; }
                      } else {
                          const r=applyAtk(inv[i],tp);
                          if(r.ok){ nH=hs.map((p,xi)=>xi===ti?r.target:p); idx=i; isInvMove=true; break; }
                      }
                  }
              }
              if(idx>=0) break;
          }

          if(idx<0) {
              let specialIdx = h.findIndex(c => c.isZone || c.isChaos);
              if(specialIdx >= 0) {
                  idx = specialIdx;
              } else {
                  const atks=shuffle(h.map((c,i)=>({c,i})).filter(x=>x.c.type==="attack" || x.c.type==="action"));
                  let targets = [...hs].map((p,i)=>({p,i})).sort((a,b)=>b.p.km-a.p.km);
                  if(diff.ml && maxKm >= 700) targets = [targets.find(x => x.i === threatIdx)];

                  outer:for(const{p:tp,i:ti}of targets){
                      if(!tp) continue;
                      for(const{c,i}of atks){
                          if(c.type === "action") {
                              const r = applyAction(c, tp);
                              if(r.ok) { nH=hs.map((p,xi)=>xi===ti?r.target:p); if(r.stolen) nAI.hand.push(r.stolen); idx=i; break outer; }
                          } else {
                              const r=applyAtk(c,tp);
                              if(r.ok){ nH=hs.map((p,xi)=>xi===ti?r.target:p); idx=i; break outer; }
                          }
                      }
                  }
              }
          }
      }
  }
  return{idx,nAI,nH,isInvMove};
}

export function calcScore({winnerIsAI,players,aiPlayer,diff,turns,targetKm=1000}){
  const raceTarget = normalizeTargetKm(targetKm);
  const rows=[],mult=DMULT[diff]||1;let total=0;
  const w=winnerIsAI?aiPlayer:players.find(p=>p.km>=raceTarget)||players[0];
  if(!w)return{rows:[],total:0};
  rows.push({l:"Victoire",pts:200,color:"#fbbf24"});total+=200;
  const kp=Math.round((w.km||0)/10);rows.push({l:`Distance (${w.km})`,pts:kp,color:"#4ade80"});total+=kp;
  const others=[...players,...(aiPlayer?[aiPlayer]:[])].filter(p=>p!==w);
  if(others.length>0){const best=Math.max(...others.map(p=>p.km));const adv=Math.max(0,raceTarget-best);const gp=Math.round(adv*.5);rows.push({l:`Avance (+${adv})`,pts:gp,color:"#34d399"});total+=gp;}
  const bc=w.bottes_count||0;if(bc>0){rows.push({l:`Bottes (x${bc})`,pts:bc*30,color:"#f59e0b"});total+=bc*30;}
  const cf=w.coupsFourres||0;if(cf>0){rows.push({l:`Coups Fourres (x${cf})`,pts:cf*300,color:"#ec4899"});total+=cf*300;}
  if(turns<=15){rows.push({l:"Victoire éclair !",pts:80,color:"#a78bfa"});total+=80;}
  else if(turns<=25){rows.push({l:"Victoire rapide",pts:40,color:"#818cf8"});total+=40;}
  const before=total;total=Math.round(total*mult);
  if(mult>1)rows.push({l:`Difficulté (x${mult})`,pts:total-before,color:"#f87171"});
  return{rows,total:Math.max(0,total)};
}

