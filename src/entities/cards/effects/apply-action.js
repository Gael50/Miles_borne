function cloneActionTarget(target = {}) {
  return {
    ...target,
    bottes: Array.isArray(target.bottes) ? [...target.bottes] : [],
    hand: Array.isArray(target.hand) ? [...target.hand] : [],
    inventory: Array.isArray(target.inventory) ? [...target.inventory] : [],
    tank_shield: target.tank_shield || 0,
  };
}

function clampChoiceIndex(choiceIndex, handLength) {
  if (typeof choiceIndex !== 'number') return null;
  return Math.max(0, Math.min(handLength - 1, choiceIndex));
}

function randomChoiceIndex(handLength, random = Math.random) {
  return Math.floor(random() * handLength);
}

function isRuntimeOrchestratedAction(card = {}) {
  return !!card.isChaos;
}

function applySteal(card = {}, target = {}, context = {}) {
  const t = cloneActionTarget(target);
  const hand = Array.isArray(t.hand) ? t.hand : [];

  if (hand.length === 0) return { ok: false, msg: 'Main cible vide !' };

  if ((t.tank_shield || 0) > 0) {
    t.tank_shield = Math.max(0, t.tank_shield - 1);
    return { ok: true, msg: 'Bouclier Blinde repousse le vol !', target: t, stolen: null, parried: true };
  }

  const choiceIndex = clampChoiceIndex(context.choiceIndex, hand.length);
  const resolvedIndex = choiceIndex === null ? randomChoiceIndex(hand.length, context.random || Math.random) : choiceIndex;
  const stolen = hand[resolvedIndex];
  t.hand = hand.filter((_, index) => index !== resolvedIndex);

  return { ok: true, msg: `${card.icon} Vol réussi !`, target: t, stolen, choiceIndex: resolvedIndex };
}

function applyAction(card = {}, target = {}, attackerHand = [], choiceIndex = null, options = {}) {
  if (card.value === 'vol') return applySteal(card, target, { ...options, attackerHand, choiceIndex });
  return { ok: false, msg: 'Action inconnue', requiresRuntime: isRuntimeOrchestratedAction(card) };
}

module.exports = {
  applyAction,
  applySteal,
  clampChoiceIndex,
  cloneActionTarget,
  isRuntimeOrchestratedAction,
  randomChoiceIndex,
};
