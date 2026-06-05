const { humanizeCardValue } = require('./descriptions/humanize-card-value');

const DEFAULT_CARD_ICONS = Object.freeze({
  action: '🎴',
  attack: '⚠️',
  boost: '💨',
  default: '🎴',
  hand: '🫳',
  remedy: '🩺',
});

const REMEDY_FIXES = Object.freeze({
  essence: 'panne_essence',
  reparation: 'accident',
  roue: 'crevaison',
  feu_vert: 'feu_rouge',
  fin_limite: 'limite',
});

function buildBaseCardMap({ extras = {}, skin = {}, unit = 'km', icons = DEFAULT_CARD_ICONS } = {}) {
  return {
    boost50: { ...(extras.boost50 || {}), value: 'boost50', type: 'boost', sub: `+50 ${unit}` },
    boost75: { ...(extras.boost75 || {}), value: 'boost75', type: 'boost', sub: `+75 ${unit}` },
    boost100: { ...(extras.boost100 || {}), value: 'boost100', type: 'boost', sub: `+100 ${unit}` },
    shield_1: { ...(extras.shield || {}), value: 'shield_1', type: 'shield', sub: '+1 blindage' },
    shield_2: { ...(extras.shieldPlus || {}), value: 'shield_2', type: 'shield', isShieldPlus: true, sub: '+2 blindages' },
    trap_minor: { ...(extras.trapMinor || {}), value: 'trap_minor', type: 'attack', isTrap: true, sub: '-30 + limite' },
    trap_major: { ...(extras.trapMajor || {}), value: 'trap_major', type: 'attack', isTrap: true, isTrapPlus: true, sub: '-50 + limite' },
    slow: { ...(extras.slow || {}), value: 'slow', type: 'attack', isSlow: true, sub: '-25 cible' },
    draw3: { ...(extras.draw || {}), value: 'draw3', type: 'draw', sub: 'pioche 3' },
    reroll: { ...(extras.reroll || {}), value: 'reroll', type: 'reroll', sub: 'repioche 10' },
    wildcard: { ...(extras.wildCard || {}), value: 'wildcard', type: 'boost', isWild: true, sub: `+60 ${unit} libre` },
    doubleplay: { ...(extras.doublePlay || {}), value: 'doubleplay', type: 'boost', isDouble: true, sub: `+40 ${unit} + pioche` },
    vol: { ...(skin.vol || {}), value: 'vol', type: 'action', icon: icons.hand, label: 'Vol', sub: 'vole 1 carte' },
    sabotage: { ...(skin.sabotage || {}), value: 'sabotage', type: 'attack', icon: icons.bomb || DEFAULT_CARD_ICONS.attack, label: 'Sabotage', sub: '-50 cible', isSabo: true },
    piratage: { ...(skin.piratage || {}), value: 'piratage', type: 'attack', icon: '💻', label: 'Piratage', sub: '-50 + arrêt', isHack: true },
    premium: { type: 'remedy', value: 'premium', icon: '🔧', label: 'Kit Premium', sub: 'répare tout' },
    bricolage: { ...(skin.bricolage || {}), value: 'bricolage', type: 'remedy', icon: '🧰', label: 'Bricolage', sub: 'répare + limite', isBrico: true },
    fin_limite: { ...(skin.fin_limite || {}), value: 'fin_limite', type: 'remedy', fixes: 'limite' },
    feu_vert: { ...(skin.feu_vert || {}), value: 'feu_vert', type: 'remedy', fixes: 'feu_rouge' },
    essence: { ...(skin.essence || {}), value: 'essence', type: 'remedy', fixes: 'panne_essence' },
    reparation: { ...(skin.reparation || {}), value: 'reparation', type: 'remedy', fixes: 'accident' },
    roue: { ...(skin.roue || {}), value: 'roue', type: 'remedy', fixes: 'crevaison' },
  };
}

function markDerivedCardFlags(card) {
  if (card.value === 'trap_minor') {
    card.isTrap = true;
    card.isTrapPlus = false;
  }
  if (card.value === 'trap_major') {
    card.isTrap = true;
    card.isTrapPlus = true;
  }
  if (card.value === 'slow') card.isSlow = true;
  if (card.value === 'shield_2') card.isShieldPlus = true;
  if (card.value === 'wildcard') card.isWild = true;
  if (card.value === 'doubleplay') card.isDouble = true;
  if (card.value === 'sabotage') card.isSabo = true;
  if (card.value === 'piratage') card.isHack = true;
  if (card.value === 'bricolage') card.isBrico = true;
  return card;
}

function fallbackIconForType(type, icons = DEFAULT_CARD_ICONS) {
  if (type === 'attack') return icons.attack || DEFAULT_CARD_ICONS.attack;
  if (type === 'remedy') return icons.remedy || DEFAULT_CARD_ICONS.remedy;
  if (type === 'boost') return icons.boost || DEFAULT_CARD_ICONS.boost;
  return icons.default || DEFAULT_CARD_ICONS.default;
}

function normalizePlayableCard(raw = {}, options = {}) {
  const {
    skin = {},
    skinExtras = {},
    skinKey = 'classic',
    unit = 'km',
    uidOverride = null,
    icons = DEFAULT_CARD_ICONS,
  } = options;
  const extras = skinExtras[skinKey] || skinExtras.classic || {};
  const value = raw.value || raw.cardVal || '';
  const baseMap = buildBaseCardMap({ extras, skin, unit, icons });
  const base = baseMap[value] || (skin[value] ? { ...skin[value], value } : {});
  const card = {
    ...base,
    ...raw,
    value: value || base.value,
    type: raw.type || raw.cardType || base.type || 'action',
  };

  markDerivedCardFlags(card);

  if (card.type === 'remedy' && !card.fixes && REMEDY_FIXES[card.value]) {
    card.fixes = REMEDY_FIXES[card.value];
  }

  if (!card.label) card.label = raw.itemName || base.label || humanizeCardValue(card.value || card.type);
  if (!card.icon) card.icon = raw.itemIcon || base.icon || fallbackIconForType(card.type, icons);
  if (!card.sub) card.sub = raw.itemDesc || base.sub || humanizeCardValue(card.type);
  if (uidOverride !== null && typeof uidOverride !== 'undefined') card.uid = uidOverride;

  return card;
}

module.exports = {
  DEFAULT_CARD_ICONS,
  REMEDY_FIXES,
  buildBaseCardMap,
  fallbackIconForType,
  markDerivedCardFlags,
  normalizePlayableCard,
};

