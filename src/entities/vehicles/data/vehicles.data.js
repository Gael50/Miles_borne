const BASE_VEHICLES = Object.freeze([
  { id: 'v1', name: 'Citadine', icon: '🚗', theme: 'classic', desc: 'Standard', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v2', name: 'Voiture Course', icon: '🏎️', theme: 'classic', desc: 'Rapide', b: 'Démarre en route', m: 'Main max 5', effects: { start_green: true, hand_size: -1 } },
  { id: 'v3', name: 'Poids Lourd', icon: '🚚', theme: 'classic', desc: 'Robuste', b: 'Immunisé limites', m: 'Pas de 200km', effects: { immune_limite: true, no_200: true } },
  { id: 'v4', name: 'Moto-Cross', icon: '🏍️', theme: 'classic', desc: 'Agile', b: 'Immunisé Crevaison', m: 'Démarre Limité', effects: { immune_crevaison: true, start_limite: true } },
  { id: 'v5', name: 'Destrier Royal', icon: '🐴', theme: 'zelda', desc: 'Fidèle', b: 'Immunisé Panne', m: 'Aucun', effects: { immune_panne: true } },
  { id: 'v6', name: 'Paravoile', icon: '🪁', theme: 'zelda', desc: 'Aérien', b: 'Démarre en route', m: 'Sensible Vent', effects: { start_green: true, no_200: true } },
  { id: 'v7', name: 'Kart Standard', icon: '🏎️', theme: 'mario', desc: 'Classique', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v8', name: 'Kart Lourd', icon: '🐢', theme: 'mario', desc: 'Blindé', b: 'Bloque 1ère attaque', m: 'Main max 5', effects: { tank_shield: true, hand_size: -1 } },
  { id: 'v9', name: 'Minecart', icon: '🛒', theme: 'craft', desc: 'Sur rails', b: '+50 blocs départ', m: 'Aucun', effects: { start_km: 50 } },
  { id: 'v10', name: 'Bateau Chêne', icon: '🛶', theme: 'craft', desc: 'Flottant', b: 'Immunité Crevaison', m: 'Aucun', effects: { immune_crevaison: true } },
  { id: 'v11', name: 'Moto Néon', icon: '🏍️', theme: 'cyber', desc: 'Pirate', b: 'Commence avec Vol', m: 'Aucun', effects: { start_thief: true } },
  { id: 'v12', name: 'Hacker Deck', icon: '💻', theme: 'cyber', desc: 'Réseau', b: '+1 taille main', m: 'Sensible Sabotage', effects: { hand_size: 1 } },
  { id: 'v13', name: 'Cyber-Bécane', icon: '🛵', theme: 'cyber', desc: 'Rapide', b: 'Démarre en route', m: 'Immunité 0', effects: { start_green: true } },
  { id: 'v14', name: 'Croiseur Lourd', icon: '🚀', theme: 'space', desc: 'Gigantesque', b: 'Bloque 1ère attaque', m: 'Pas de 200km', effects: { tank_shield: true, no_200: true } },
  { id: 'v15', name: 'Chasseur Stellaire', icon: '☄️', theme: 'space', desc: 'Vif', b: 'Immunité Feu Rouge', m: 'Main max 5', effects: { immune_feu_rouge: true, hand_size: -1 } },
  { id: 'v16', name: 'DeLorean', icon: '⏱️', theme: 'space', desc: 'Temporel', b: '+50 au départ', m: 'Aucun', effects: { start_km: 50, hand_size: 1 } },
  { id: 'v17', name: 'Vaisseau Fantôme', icon: '🛸', theme: 'space', desc: 'Spectre', b: 'Commence avec Vol', m: 'Main max 5', effects: { start_thief: true, hand_size: -1 } },
  { id: 'v18', name: 'Interceptor V8', icon: '🚘', theme: 'apoca', desc: 'Furieux', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v19', name: 'War Rig', icon: '🚛', theme: 'apoca', desc: 'Forteresse', b: '2 Boucliers', m: 'Main max 5', effects: { tank_shield: true, tank_shield_x2: true, hand_size: -1 } },
  { id: 'v20', name: 'Buggy Sables', icon: '🛺', theme: 'apoca', desc: 'Dune', b: '+50 au départ', m: 'Démarre Limité', effects: { start_km: 50, start_limite: true } },
  { id: 'v21', name: 'Rat-Rod', icon: '🚜', theme: 'apoca', desc: 'Bricolé', b: 'Immunité Panne', m: 'Pas de 200km', effects: { immune_panne: true, no_200: true } },
  { id: 'v22', name: 'Char de Siège', icon: '🦏', theme: 'medieval', desc: 'Dévastateur', b: 'Bloque 1ère attaque', m: 'Pas de 200km', effects: { tank_shield: true, no_200: true } },
  { id: 'v23', name: 'Chevalier Blindé', icon: '🛡️', theme: 'medieval', desc: 'Solide', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limite: true } },
  { id: 'v24', name: 'Pégase', icon: '🦄', theme: 'medieval', desc: 'Magique', b: 'Commence avec Vol', m: 'Aucun', effects: { start_thief: true } },
  { id: 'v25', name: 'Tapis Volant', icon: '🕌', theme: 'medieval', desc: 'Mystique', b: 'Immunité Crevaison', m: 'Main max 5', effects: { immune_crevaison: true, immune_limite: true, hand_size: -1 } },
  { id: 'v26', name: 'Drakkar Furtif', icon: '⛵', theme: 'medieval', desc: 'Vikings', b: 'Bloque 1ère attaque', m: 'Démarre Limité', effects: { tank_shield: true, start_limite: true } },
  { id: 'v27', name: 'Dépanneuse', icon: '🛻', theme: 'classic', desc: 'Solidaire', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v28', name: 'Voiture Police', icon: '🚓', theme: 'classic', desc: 'Autorité', b: 'Immunité Limite', m: 'Pas de 200km', effects: { immune_feu_rouge: true, immune_limite: true, no_200: true } },
  { id: 'v29', name: 'Tracteur', icon: '🚜', theme: 'classic', desc: 'Lent', b: '2 Boucliers', m: 'Pas de 100/200km', effects: { tank_shield: true, tank_shield_x2: true, no_100: true, no_200: true } },
  { id: 'v30', name: 'Ambulance', icon: '🚑', theme: 'classic', desc: 'Urgence', b: 'Immunité Feu Rouge', m: 'Aucun', effects: { immune_feu_rouge: true } },
  { id: 'v31', name: 'Coursier Persan', icon: '🐎', theme: 'ac_mirage', desc: 'Rapide', b: 'Démarre en route', m: 'Aucun', effects: { start_green: true } },
  { id: 'v32', name: 'Maître Hashashin', icon: '🥷', theme: 'ac_mirage', desc: 'Furtif', b: 'Commence avec Vol', m: 'Main max 9', effects: { start_thief: true, hand_size: -1 } },
  { id: 'v33', name: 'Chamelier', icon: '🐪', theme: 'ac_mirage', desc: 'Endurant', b: 'Immunité Soif', m: 'Aucun', effects: { immune_panne: true } },
  { id: 'v34', name: 'Bayek Légende', icon: '🦅', theme: 'ac_mirage', desc: 'Vétéran', b: 'Immunité Garde', m: 'Pas de 200km', effects: { immune_accident: true, no_200: true } },
  { id: 'v35', name: "Cape d'Ombre", icon: '🌙', theme: 'ac_mirage', desc: 'Discret', b: '+1 blindage', m: 'Aucun', effects: { tank_shield: true } },
  { id: 'v36', name: 'Sloop Léger', icon: '⛵', theme: 'ac_bf', desc: 'Agile', b: 'Démarre en route', m: 'Aucun', effects: { start_green: true } },
  { id: 'v37', name: 'Jackdaw', icon: '🏴‍☠️', theme: 'ac_bf', desc: 'Légendaire', b: '2 boucliers', m: 'Pas de 200km', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v38', name: 'Brigantin', icon: '🚢', theme: 'ac_bf', desc: 'Robuste', b: 'Immunité Avarie', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v39', name: 'Galion Royal', icon: '⚓', theme: 'ac_bf', desc: 'Imposant', b: 'Immunité Marine', m: 'Démarre Limité', effects: { immune_feu_rouge: true, start_limite: true } },
  { id: 'v40', name: 'Frégate Pirate', icon: '🦜', theme: 'ac_bf', desc: 'Audacieuse', b: 'Commence avec Vol', m: 'Main max 9', effects: { start_thief: true, hand_size: -1 } },
  { id: 'v41', name: 'Compacte Familiale', icon: '🚗', theme: 'sims', desc: 'Pratique', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v42', name: 'Vélo de Quartier', icon: '🚲', theme: 'sims', desc: 'Écolo', b: 'Immunité Panne', m: 'Pas de 200', effects: { immune_panne: true, no_200: true } },
  { id: 'v43', name: 'Van Familial', icon: '🚐', theme: 'sims', desc: 'Spacieux', b: '+1 taille main', m: 'Démarre Limité', effects: { hand_size: 1, start_limite: true } },
  { id: 'v44', name: 'Scooter Urbain', icon: '🛵', theme: 'sims', desc: 'Agile', b: 'Démarre en route', m: 'Main max 9', effects: { start_green: true, hand_size: -1 } },
  { id: 'v45', name: 'Bus Scolaire', icon: '🚌', theme: 'sims', desc: 'Solide', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v46', name: 'Caddie de Jardin', icon: '🛒', theme: 'sims', desc: 'Chaotique', b: 'Commence avec Vol', m: 'Démarre Limité', effects: { start_thief: true, start_limite: true } },
  { id: 'v47', name: 'Sloop Léger', icon: '⛵', theme: 'sea_thieves', desc: 'Agile', b: 'Démarre en route', m: 'Aucun', effects: { start_green: true } },
  { id: 'v48', name: 'Brigantin Marchand', icon: '🚢', theme: 'sea_thieves', desc: 'Robuste', b: 'Immunité Accident', m: 'Aucun', effects: { immune_accident: true } },
  { id: 'v49', name: 'Galion Capturé', icon: '⚓', theme: 'sea_thieves', desc: 'Massif', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v50', name: 'Chaloupe Rapide', icon: '🛶', theme: 'sea_thieves', desc: 'Furtive', b: 'Commence avec Vol', m: 'Main max 9', effects: { start_thief: true, hand_size: -1 } },
  { id: 'v51', name: 'Jonque de Contrebande', icon: '⛵', theme: 'sea_thieves', desc: 'Rusée', b: '+50 départ', m: 'Démarre Limité', effects: { start_km: 50, start_limite: true } },
  { id: 'v52', name: 'Frégate Corsaire', icon: '🏴‍☠️', theme: 'sea_thieves', desc: 'Audacieuse', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limite: true } },
  { id: 'v53', name: 'Char Infernal', icon: '🔥', theme: 'hades', desc: 'Brûlant', b: 'Démarre en route', m: 'Aucun', effects: { start_green: true } },
  { id: 'v54', name: 'Barque du Styx', icon: '🛶', theme: 'hades', desc: 'Souterraine', b: 'Immunité Panne', m: 'Main max 9', effects: { immune_panne: true, hand_size: -1 } },
  { id: 'v55', name: 'Monture Spectrale', icon: '🐎', theme: 'hades', desc: 'Fantôme', b: 'Commence avec Vol', m: 'Aucun', effects: { start_thief: true } },
  { id: 'v56', name: "Sandales d'Hermès", icon: '🪽', theme: 'hades', desc: 'Vives', b: '+50 départ', m: 'Pas de 200', effects: { start_km: 50, no_200: true } },
  { id: 'v57', name: 'Égide Mobile', icon: '🛡️', theme: 'hades', desc: 'Protectrice', b: '2 boucliers', m: 'Démarre Limité', effects: { tank_shield: true, tank_shield_x2: true, start_limite: true } },
  { id: 'v58', name: 'Flamme Propulsive', icon: '🔥', theme: 'hades', desc: 'Instable', b: 'Immunité Accident', m: 'Main max 9', effects: { immune_accident: true, hand_size: -1 } },
  { id: 'v59', name: 'Berline Vintage', icon: '🚗', theme: 'mafia', desc: 'Classe', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v60', name: 'Coupé Années 30', icon: '🚘', theme: 'mafia', desc: 'Rapide', b: 'Démarre en route', m: 'Main max 9', effects: { start_green: true, hand_size: -1 } },
  { id: 'v61', name: 'Fourgon de Contrebande', icon: '🚚', theme: 'mafia', desc: 'Discret', b: '+1 taille main', m: 'Démarre Limité', effects: { hand_size: 1, start_limite: true } },
  { id: 'v62', name: 'Taxi Noir', icon: '🚕', theme: 'mafia', desc: 'Urbain', b: 'Immunité Limite', m: 'Aucun', effects: { immune_limite: true } },
  { id: 'v63', name: 'Limousine Blindée', icon: '🚙', theme: 'mafia', desc: 'Boss', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v64', name: 'Voiture Banalisée', icon: '🚓', theme: 'mafia', desc: 'Sous couverture', b: 'Commence avec Vol', m: 'Aucun', effects: { start_thief: true } },
  { id: 'v65', name: 'Cheval de Guerre', icon: '🐎', theme: 'sekiro', desc: 'Noble', b: 'Démarre en route', m: 'Aucun', effects: { start_green: true } },
  { id: 'v66', name: 'Palanquin Discret', icon: '🏮', theme: 'sekiro', desc: 'Protégé', b: '2 boucliers', m: 'Pas de 200', effects: { tank_shield: true, tank_shield_x2: true, no_200: true } },
  { id: 'v67', name: 'Chariot de Bois', icon: '🛒', theme: 'sekiro', desc: 'Stable', b: 'Immunité Accident', m: 'Démarre Limité', effects: { immune_accident: true, start_limite: true } },
  { id: 'v68', name: 'Coursier de Montagne', icon: '🐴', theme: 'sekiro', desc: 'Endurant', b: '+50 départ', m: 'Aucun', effects: { start_km: 50 } },
  { id: 'v69', name: 'Barque de Rivière', icon: '🛶', theme: 'sekiro', desc: 'Silencieuse', b: 'Commence avec Vol', m: 'Main max 9', effects: { start_thief: true, hand_size: -1 } },
  { id: 'v70', name: 'Messager Shinobi', icon: '🥷', theme: 'sekiro', desc: 'Rapide', b: 'Immunité Limite', m: 'Pas de 200', effects: { immune_limite: true, no_200: true } },
  { id: 'v71', name: 'Fourgon de Fuite', icon: '🚐', theme: 'payday', desc: 'Classique', b: 'Équilibré', m: 'Aucun', effects: {} },
  { id: 'v72', name: 'SUV Noir', icon: '🚙', theme: 'payday', desc: 'Robuste', b: '2 boucliers', m: 'Main max 9', effects: { tank_shield: true, tank_shield_x2: true, hand_size: -1 } },
  { id: 'v73', name: 'Moto Urbaine', icon: '🏍️', theme: 'payday', desc: 'Agile', b: 'Démarre en route', m: 'Pas de 200', effects: { start_green: true, no_200: true } },
  { id: 'v74', name: 'Van Blindé Léger', icon: '🚚', theme: 'payday', desc: 'Sécurisé', b: 'Immunité Accident', m: 'Démarre Limité', effects: { immune_accident: true, start_limite: true } },
  { id: 'v75', name: 'Voiture Volée', icon: '🚗', theme: 'payday', desc: 'Anonyme', b: 'Commence avec Vol', m: 'Aucun', effects: { start_thief: true } },
  { id: 'v76', name: 'Ambulance Maquillée', icon: '🚑', theme: 'payday', desc: 'Déguisée', b: 'Immunité Feu Rouge', m: 'Main max 9', effects: { immune_feu_rouge: true, hand_size: -1 } },
]);

const VEHICLE_EXPANSION_PACKS = Object.freeze({
  classic: [
    ['Break Familial', '🚙', 'Stable', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Cabriolet', '🚘', 'Nerveux', '+50 départ', 'Main max 9', { start_km: 50, hand_size: -1 }],
  ],
  zelda: [
    ["Cheval d'Hyrule", '🐎', 'Noble', '+50 départ', 'Aucun', { start_km: 50 }],
    ['Chariot Korogu', '🛒', 'Rusé', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Radeau Zora', '🛶', 'Fluvial', 'Immunité Crevaison', 'Pas de 200', { immune_crevaison: true, no_200: true }],
    ['Moto Antique', '🏍️', 'Sheikah', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Cerf de Forêt', '🦌', 'Discret', 'Commence avec Vol', 'Aucun', { start_thief: true }],
    ['Charrette Goron', '🪨', 'Robuste', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Planeur Royal', '🪁', 'Aérien', 'Immunité Limite', 'Départ limité', { immune_limite: true, start_limite: true }],
    ['Coursier Blanc', '🐴', 'Élite', 'Immunité Accident', 'Aucun', { immune_accident: true }],
  ],
  mario: [
    ['Kart Champignon', '🍄', 'Punchy', '+50 départ', 'Aucun', { start_km: 50 }],
    ['Yoshi Bike', '🦖', 'Agile', 'Immunité Crevaison', 'Main max 9', { immune_crevaison: true, hand_size: -1 }],
    ['Buggy Koopa', '🐢', 'Solide', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Bolide Luigi', '🏎️', 'Stable', 'Immunité Limite', 'Aucun', { immune_limite: true }],
    ['Kart Bowser', '🔥', 'Lourd', 'Immunité Accident', 'Départ limité', { immune_accident: true, start_limite: true }],
    ['Scooter Toad', '🛵', 'Rapide', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Kart Boo', '👻', 'Furtif', 'Commence avec Vol', 'Aucun', { start_thief: true }],
    ['Dauphine Marine', '🐬', 'Aquatique', 'Immunité Panne', 'Pas de 200', { immune_panne: true, no_200: true }],
  ],
  craft: [
    ['Cheval Sellé', '🐴', 'Exploration', 'Démarre en route', 'Aucun', { start_green: true }],
    ['Wagonnet TNT', '💥', 'Risqué', '+50 départ', 'Départ limité', { start_km: 50, start_limite: true }],
    ['Élytre', '🪽', 'Aérienne', 'Immunité Limite', 'Main max 9', { immune_limite: true, hand_size: -1 }],
    ['Cochon Sellé', '🐖', 'Drôle', 'Commence avec Vol', 'Pas de 200', { start_thief: true, no_200: true }],
    ['Chariot Netherite', '🛡️', 'Blindé', '2 boucliers', 'Départ limité', { tank_shield: true, tank_shield_x2: true, start_limite: true }],
    ['Bateau Mangrove', '🛶', 'Marais', 'Immunité Crevaison', 'Aucun', { immune_crevaison: true }],
    ['Lama Marchand', '🦙', 'Stockage', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Araignée Montée', '🕷️', 'Insolite', 'Immunité Accident', 'Main max 9', { immune_accident: true, hand_size: -1 }],
  ],
  cyber: [
    ['Taxi Autonome', '🚕', 'Urbain', 'Immunité Feu Rouge', 'Aucun', { immune_feu_rouge: true }],
    ['Drone Cargo', '🛸', 'Aérien', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Hoverboard Néon', '🛹', 'Agile', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Fourgon Datavault', '🚐', 'Blindé', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Coursier Synth', '🤖', 'Furtif', 'Commence avec Vol', 'Aucun', { start_thief: true }],
    ['Railbike Magnétique', '🚄', 'Stable', '+50 départ', 'Aucun', { start_km: 50 }],
    ['Patrouilleur Ghost', '🚓', 'Sécurisé', 'Immunité Accident', 'Départ limité', { immune_accident: true, start_limite: true }],
  ],
  space: [
    ['Navette Orbitale', '🚀', 'Standard', 'Démarre en route', 'Aucun', { start_green: true }],
    ['Capsule Minérale', '🛰️', 'Solide', '2 boucliers', 'Main max 9', { tank_shield: true, tank_shield_x2: true, hand_size: -1 }],
    ['Rover Lunaire', '🌕', 'Endurant', 'Immunité Panne', 'Pas de 200', { immune_panne: true, no_200: true }],
    ['Comète Harnachée', '☄️', 'Instable', '+50 départ', 'Départ limité', { start_km: 50, start_limite: true }],
    ['Cargo Stellaire', '🚢', 'Stockage', 'Main +1', 'Aucun', { hand_size: 1 }],
    ['Sonde Furtive', '📡', 'Furtive', 'Commence avec Vol', 'Main max 9', { start_thief: true, hand_size: -1 }],
  ],
  apoca: [
    ['Moto Pillarde', '🏍️', 'Rapide', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Camion Citerne', '🚚', 'Réserve', 'Immunité Panne', 'Départ limité', { immune_panne: true, start_limite: true }],
    ['Bus Blindé', '🚌', 'Lourd', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Charrette Ferraille', '🛒', 'Bricolée', 'Main +1', 'Pas de 200', { hand_size: 1, no_200: true }],
    ['Quad Dune', '🏍️', 'Agile', '+50 départ', 'Aucun', { start_km: 50 }],
    ['Interceptor Noir', '🚓', 'Furtif', 'Commence avec Vol', 'Départ limité', { start_thief: true, start_limite: true }],
  ],
  medieval: [
    ['Diligence Noble', '🚃', 'Confort', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Bélier Roulant', '🐏', 'Assaut', 'Immunité Accident', 'Pas de 200', { immune_accident: true, no_200: true }],
    ['Licorne de Cour', '🦄', 'Pure', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Carrosse Royal', '👑', 'Prestige', '2 boucliers', 'Aucun', { tank_shield: true, tank_shield_x2: true }],
    ['Mulet de Marché', '🐴', 'Tenace', 'Immunité Panne', 'Départ limité', { immune_panne: true, start_limite: true }],
  ],
  ac_mirage: [
    ['Âne des Souks', '🫏', 'Discret', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Faucon Guide', '🦅', 'Vision', 'Immunité Limite', 'Main max 9', { immune_limite: true, hand_size: -1 }],
    ['Barque du Tigre', '🛶', 'Fluviale', '+50 départ', 'Aucun', { start_km: 50 }],
    ['Coursier Noir', '🐎', 'Rapide', 'Démarre en route', 'Aucun', { start_green: true }],
    ['Porteur de Relais', '📦', 'Stockage', 'Immunité Panne', 'Pas de 200', { immune_panne: true, no_200: true }],
  ],
  ac_bf: [
    ['Goélette Rapide', '⛵', 'Agile', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Chaloupe Espionne', '🛶', 'Furtive', 'Commence avec Vol', 'Aucun', { start_thief: true }],
    ['Galion de Guerre', '🚢', 'Massif', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Brûlot Pirate', '🔥', 'Risqué', '+50 départ', 'Départ limité', { start_km: 50, start_limite: true }],
    ['Navire Marchand', '⚓', 'Rentable', 'Main +1', 'Aucun', { hand_size: 1 }],
  ],
  sims: [
    ['Voiture de Sport Rouge', '🏎️', 'Frime', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
    ['Trottinette Électrique', '🛴', 'Compacte', '+50 départ', 'Pas de 200', { start_km: 50, no_200: true }],
    ['Vieux Break', '🚙', 'Solide', 'Immunité Accident', 'Départ limité', { immune_accident: true, start_limite: true }],
    ['Taxi de Ville', '🚕', 'Pratique', 'Immunité Feu Rouge', 'Aucun', { immune_feu_rouge: true }],
  ],
  sea_thieves: [
    ['Galion Fantôme', '👻', 'Maudit', 'Commence avec Vol', 'Main max 9', { start_thief: true, hand_size: -1 }],
    ['Bateau de Pêche', '🎣', 'Tenace', 'Immunité Panne', 'Départ limité', { immune_panne: true, start_limite: true }],
    ['Navire de Marine', '🚢', 'Armé', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ["Canoë d'Île", '🛶', 'Léger', '+50 départ', 'Aucun', { start_km: 50 }],
  ],
  hades: [
    ["Trône de Mégère", '🔥', 'Vengeur', 'Immunité Accident', 'Départ limité', { immune_accident: true, start_limite: true }],
    ["Coursier d'Asphodèle", '🐎', 'Rapide', 'Démarre en route', 'Aucun', { start_green: true }],
    ['Roues du Tartare', '⚙️', 'Lourdes', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Ombre Ailée', '🪽', 'Furtive', 'Commence avec Vol', 'Main max 9', { start_thief: true, hand_size: -1 }],
  ],
  mafia: [
    ['Roadster du Boss', '🚘', 'Rapide', '+50 départ', 'Main max 9', { start_km: 50, hand_size: -1 }],
    ['Camion Livraison', '🚚', 'Discret', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Corbillard Noir', '⚰️', 'Intimidant', 'Immunité Accident', 'Pas de 200', { immune_accident: true, no_200: true }],
    ['Moto Coursier', '🏍️', 'Nerveuse', 'Démarre en route', 'Aucun', { start_green: true }],
  ],
  sekiro: [
    ['Cheval Caparaçonné', '🐎', 'Solide', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Traîneau de Neige', '🛷', 'Montagne', 'Immunité Panne', 'Départ limité', { immune_panne: true, start_limite: true }],
    ['Renard Messager', '🦊', 'Furtif', 'Commence avec Vol', 'Main max 9', { start_thief: true, hand_size: -1 }],
    ['Barque Brumeuse', '🛶', 'Silence', '+50 départ', 'Aucun', { start_km: 50 }],
  ],
  payday: [
    ['Pickup de Planque', '🛻', 'Polyvalent', 'Main +1', 'Départ limité', { hand_size: 1, start_limite: true }],
    ['Berline Banalisée', '🚘', 'Discrète', 'Immunité Limite', 'Aucun', { immune_limite: true }],
    ['Blindé Léger', '🚓', 'Sécurisé', '2 boucliers', 'Pas de 200', { tank_shield: true, tank_shield_x2: true, no_200: true }],
    ['Voiture de Sport Volée', '🏎️', 'Nerveuse', 'Démarre en route', 'Main max 9', { start_green: true, hand_size: -1 }],
  ],
});

function vehicleFromExpansionRow(theme, row, index) {
  const [name, icon, desc, b, m, effects] = row;
  return {
    id: `vx_${theme}_${index + 1}`,
    name,
    icon,
    theme,
    desc,
    b,
    m,
    effects: { ...(effects || {}) },
  };
}

function cloneVehicle(vehicle) {
  return {
    ...vehicle,
    effects: { ...(vehicle.effects || {}) },
  };
}

function buildVehicleCatalog(baseVehicles = BASE_VEHICLES, expansionPacks = VEHICLE_EXPANSION_PACKS) {
  const vehicles = baseVehicles.map(cloneVehicle);
  Object.entries(expansionPacks).forEach(([theme, rows]) => {
    rows.forEach((row, index) => {
      const vehicle = vehicleFromExpansionRow(theme, row, index);
      if (!vehicles.some((candidate) => candidate.id === vehicle.id)) vehicles.push(vehicle);
    });
  });
  return vehicles;
}

const VEHICLES = Object.freeze(buildVehicleCatalog());

module.exports = {
  BASE_VEHICLES,
  VEHICLE_EXPANSION_PACKS,
  VEHICLES,
  buildVehicleCatalog,
  vehicleFromExpansionRow,
};
