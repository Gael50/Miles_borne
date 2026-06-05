function getCardEffect(card, unit) {
  if (!card) return '';
  if (card.type === 'distance') return `+${card.value} ${unit || 'km'}`;
  if (card.type === 'attack') {
    if (card.isTrap) return card.isTrapPlus ? '-50 + limite' : '-30 + limite';
    if (card.isSabo) return '-50 km cible';
    if (card.isHack) return '-50 + arrêt';
    if (card.isZone) return 'Bloque tous';
    if (card.isSlow) return '-25 km cible';
    if (card.value === 'feu_rouge') return 'Bloque cible';
    if (card.value === 'limite') return 'Limite vitesse';
    if (card.value === 'panne_essence') return 'Panne essence';
    if (card.value === 'accident') return 'Accident';
    if (card.value === 'crevaison') return 'Crevaison';
    return 'Attaque';
  }
  if (card.type === 'remedy') {
    if (card.value === 'premium') return 'Répare tout';
    if (card.isBrico) return 'Répare + limite';
    if (card.value === 'feu_vert') return 'Démarre / soigne';
    if (card.value === 'fin_limite') return 'Fin de limite';
    if (card.value === 'essence') return 'Soigne panne';
    if (card.value === 'reparation') return 'Soigne accident';
    if (card.value === 'roue') return 'Soigne crevaison';
    return 'Soigne';
  }
  if (card.type === 'botte') {
    if (card.value === 'prioritaire') return 'Immunité ×2';
    return 'Immunité';
  }
  if (card.type === 'boost') {
    if (card.isWild) return '+60 km libre';
    if (card.isDouble) return '+40 km +pioche';
    if (card.value === 'boost100') return '+100 km';
    if (card.value === 'boost75') return '+75 km';
    return '+50 km';
  }
  if (card.type === 'shield') return card.isShieldPlus ? '+2 blindage' : '+1 blindage';
  if (card.type === 'draw') return 'Pioche +3';
  if (card.type === 'reroll') return 'Refresh main';
  if (card.type === 'action') {
    if (card.isChaos) return 'Aléa global';
    if (card.value === 'vol') return 'Vole 1 carte';
    return 'Action';
  }
  return card.sub || '';
}

function getCardDesc(card) {
  if (!card) return '';
  if (card.type === 'distance') {
    if (card.value === 200) return '🛣️ Avancez de 200. Joueur en route obligatoire, panne soignée, et hors limite de vitesse.';
    if (card.value === 100) return '🛣️ Avancez de 100. Nécessite : en route, sans panne, hors limite de vitesse (max 50).';
    if (card.value > 50) return `🛣️ Avancez de ${card.value}. Nécessite : en route, sans panne, hors limite (max 50).`;
    return `🛣️ Avancez de ${card.value}. Nécessite : en route, sans panne.`;
  }
  if (card.type === 'attack') {
    if (card.isTrap) return "🛑 Piège : inflige -30 km ET pose une limite de vitesse à la cible. Glissez sur l'adversaire.";
    if (card.isSabo) return '💥 Sabotage : fait reculer la cible de 50 km. Glissez la carte sur un adversaire.';
    if (card.isHack) return '💻 Piratage : recul de 50 km ET arrêt immédiat (Feu Rouge). Glissez sur la cible.';
    if (card.isZone) return '🌐 Attaque de zone : applique la panne à TOUS les adversaires (vous épargné).';
    if (card.value === 'feu_rouge') return "🔴 Feu Rouge : bloque la cible jusqu'à un Feu Vert. Glissez sur l'adversaire.";
    if (card.value === 'limite') return '🚧 Limite de vitesse : la cible ne peut plus jouer de cartes > 50 km.';
    if (card.value === 'panne_essence') return "⛽ Panne d'essence : la cible doit jouer Essence avant de repartir.";
    if (card.value === 'accident') return '🔧 Accident : la cible doit jouer Réparation pour repartir.';
    if (card.value === 'crevaison') return '🛞 Crevaison : la cible doit jouer Roue de secours.';
    return "⚠️ Inflige une panne à un adversaire. Glissez la carte sur la cible.";
  }
  if (card.type === 'remedy') {
    if (card.value === 'premium') return "🔧 Kit Premium : soigne instantanément n'importe quelle panne (Feu Rouge, Essence, Accident, Crevaison).";
    if (card.isBrico) return '🧰 Bricolage : répare tout et vous met en route, MAIS impose la limite 50 km.';
    if (card.value === 'feu_vert') return '🟢 Feu Vert : démarre ou lève un Feu Rouge. À jouer en début de partie pour rouler.';
    if (card.value === 'fin_limite') return '🏁 Fin de Limite : annule la limite de vitesse (vous pouvez rejouer des >50).';
    if (card.value === 'essence') return "⛽ Essence : soigne la Panne d'essence.";
    if (card.value === 'reparation') return '🔧 Réparation : soigne un Accident.';
    if (card.value === 'roue') return '🛞 Roue de secours : soigne une Crevaison.';
    return '🩺 Soigne la panne correspondante.';
  }
  if (card.type === 'botte') {
    const immuneTo = Array.isArray(card.immuneTo) ? card.immuneTo.join(' + ') : card.immuneTo;
    if (card.value === 'prioritaire') return '👑 Botte Prioritaire : immunité Feu Rouge + Limite. Coup Fourré +300 pts si jouée juste après une attaque !';
    if (card.value === 'as_volant') return "🏆 As du Volant : immunité totale contre Accident. Coup Fourré +300 pts si jouée après l'attaque.";
    if (card.value === 'citerne') return "🛢️ Citerne : immunité Panne d'essence. Coup Fourré +300 pts si jouée après l'attaque.";
    if (card.value === 'increvable') return "🛡️ Increvable : immunité Crevaison. Coup Fourré +300 pts si jouée après l'attaque.";
    return `✨ Botte ! Immunité permanente (${immuneTo || 'panne'}). +300 pts en Coup Fourré.`;
  }
  if (card.type === 'action') {
    if (card.isChaos) return '🎲 Aléa Routier : déclenche un événement aléatoire pour toute la table.';
    if (card.value === 'vol') return '🫳 Vol : choisissez une position dans la main adverse, sans révéler son contenu.';
    return '🃏 Action spéciale.';
  }
  if (card.type === 'boost') {
    if (card.isWild) return '🎰 Joker Route : +60 km à vous-même, retire toute panne. Jouable même bloqué.';
    if (card.isDouble) return "🔂 Double Tour : +40 km + pioche 1 carte bonus. Nécessite d'être en route.";
    const gain = card.value === 'boost100' ? 100 : card.value === 'boost75' ? 75 : 50;
    return `💨 Boost : +${gain} km à vous-même. Nécessite d'être en route, sans panne.`;
  }
  if (card.type === 'shield') {
    const add = card.isShieldPlus ? 2 : 1;
    return `🛡 Blindage : ajoute +${add} bouclier${add > 1 ? 's' : ''} qui pareront vos prochaines attaques ou vols subis.`;
  }
  if (card.type === 'draw') return '🎴 Pioche bonus : prenez 3 cartes supplémentaires en plus du refill normal.';
  if (card.type === 'reroll') return "♻ Reroll : défaussez toute votre main, repiochez 10 cartes fraîches. Idéal pour sortir d'une mauvaise main.";
  if (card.isSlow) return "🐌 Ralentissement : -25 km à la cible, sans hazard. Pas de speedLimit imposée.";
  return '';
}

module.exports = {
  getCardDesc,
  getCardEffect,
};

