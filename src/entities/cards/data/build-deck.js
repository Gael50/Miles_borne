const { normalizePlayableCard } = require('../card-normalizer');

const UNIT_BY_DISTANCE_TYPE = Object.freeze({
  Distance: 'km',
  Exploration: 'blocs',
  Transfert: 'TB',
  'Saut Spatial': 'ps',
  Miles: 'mi',
  Noeuds: 'noeuds',
  Jours: 'jours',
  Ombres: 'ombres',
  Rues: 'rues',
  Pas: 'pas',
  Butin: 'butin',
  Ruelles: 'ruelles',
  Voyage: 'lieues',
});

function repeatCard(count, card) {
  return Array(count).fill(card);
}

function resolveDeckUnit(skin = {}) {
  return UNIT_BY_DISTANCE_TYPE[skin.distance?.typeName] || 'lieues';
}

function buildDeck(skin, skinKey, options = {}) {
  const {
    buildThemeDeepCards = () => [],
    normalizeCard = normalizePlayableCard,
    skinExtras = {},
  } = options;

  const distanceIcon = skin.distance?.icon || '🚗';
  const unit = resolveDeckUnit(skin);
  const ex = skinExtras[skinKey] || skinExtras.classic || {};
  const D = repeatCard;

  return [
    ...D(5, { label: '5', value: 5, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(5, { label: '10', value: 10, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(5, { label: '15', value: 15, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(5, { label: '20', value: 20, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(12, { label: '25', value: 25, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(12, { label: '50', value: 50, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(10, { label: '75', value: 75, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(12, { label: '100', value: 100, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(4, { label: '200', value: 200, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(3, { ...skin.panne_essence, value: 'panne_essence', type: 'attack' }),
    ...D(3, { ...skin.accident, value: 'accident', type: 'attack' }),
    ...D(4, { ...skin.feu_rouge, value: 'feu_rouge', type: 'attack' }),
    ...D(3, { ...skin.limite, value: 'limite', type: 'attack' }),
    ...D(3, { ...skin.crevaison, value: 'crevaison', type: 'attack' }),
    ...D(6, { ...skin.essence, value: 'essence', type: 'remedy' }),
    ...D(6, { ...skin.reparation, value: 'reparation', type: 'remedy' }),
    ...D(14, { ...skin.feu_vert, value: 'feu_vert', type: 'remedy' }),
    ...D(6, { ...skin.fin_limite, value: 'fin_limite', type: 'remedy' }),
    ...D(6, { ...skin.roue, value: 'roue', type: 'remedy' }),
    { ...skin.as_volant, value: 'as_volant', type: 'botte' },
    { ...skin.citerne, value: 'citerne', type: 'botte' },
    { ...skin.increvable, value: 'increvable', type: 'botte' },
    { ...skin.prioritaire, value: 'prioritaire', type: 'botte' },
    ...D(2, { ...skin.vol, value: 'vol', type: 'action' }),
    ...D(2, { ...skin.sabotage, value: 'sabotage', type: 'attack' }),
    ...D(2, { ...skin.chaos, value: 'chaos', type: 'action' }),
    ...D(2, { ...skin.special_boost }),
    ...D(2, { ...skin.zone_attack, type: 'attack' }),
    ...D(1, { ...skin.bricolage, value: 'bricolage', type: 'remedy' }),
    ...D(1, { ...skin.piratage, value: 'piratage', type: 'attack' }),
    ...D(2, { ...ex.boost50, value: 'boost50', type: 'boost' }),
    ...D(2, { ...ex.boost75, value: 'boost75', type: 'boost' }),
    ...D(2, { ...ex.boost100, value: 'boost100', type: 'boost' }),
    ...D(2, { ...ex.shield, value: 'shield_1', type: 'shield' }),
    ...D(2, { ...ex.shieldPlus, value: 'shield_2', type: 'shield', isShieldPlus: true }),
    ...D(2, { ...ex.trapMinor, value: 'trap_minor', type: 'attack', isTrap: true }),
    ...D(2, { ...ex.trapMajor, value: 'trap_major', type: 'attack', isTrap: true, isTrapPlus: true }),
    ...D(2, { ...ex.draw, value: 'draw3', type: 'draw' }),
    ...D(2, { ...ex.slow, value: 'slow', type: 'attack', isSlow: true }),
    ...D(2, { ...ex.reroll, value: 'reroll', type: 'reroll' }),
    ...D(2, { ...ex.wildCard, value: 'wildcard', type: 'boost', isWild: true }),
    ...D(2, { ...ex.doublePlay, value: 'doubleplay', type: 'boost', isDouble: true }),
    ...buildThemeDeepCards(skin, ex, unit),
    ...D(2, { label: '25', value: 25, type: 'distance', icon: distanceIcon, sub: unit }),
    ...D(2, { label: '50', value: 50, type: 'distance', icon: distanceIcon, sub: unit }),
  ].map((card, index) =>
    normalizeCard(card, {
      skin,
      skinExtras,
      skinKey,
      unit,
      uidOverride: index,
    })
  );
}

module.exports = {
  UNIT_BY_DISTANCE_TYPE,
  buildDeck,
  repeatCard,
  resolveDeckUnit,
};
