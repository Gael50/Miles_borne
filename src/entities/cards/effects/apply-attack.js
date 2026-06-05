const { isImmune } = require('../targeting/card-targeting');

function cloneAttackTarget(target = {}) {
  return {
    ...target,
    bottes: Array.isArray(target.bottes) ? [...target.bottes] : [],
    hand: Array.isArray(target.hand) ? [...target.hand] : [],
    inventory: Array.isArray(target.inventory) ? [...target.inventory] : [],
    tank_shield: target.tank_shield || 0,
  };
}

function attackImmunityValue(card = {}) {
  if (card.isZone) return card.hazard || 'feu_rouge';
  return card.value;
}

function applyShieldParry(target) {
  target.tank_shield = Math.max(0, (target.tank_shield || 0) - 1);
  return { ok: true, msg: 'Bouclier Blinde active !', target, parried: true };
}

function applyHack(card = {}, target) {
  target.km = Math.max(0, (target.km || 0) - 50);
  target.hazard = 'feu_rouge';
  target.stopped = true;
  return { ok: true, msg: `${card.icon} Piratage ! (-50km & Bloque)`, target };
}

function applySabotage(card = {}, target) {
  target.km = Math.max(0, (target.km || 0) - 50);
  return { ok: true, msg: `${card.icon} Sabotage reussi (-50) !`, target };
}

function applyTrap(card = {}, target) {
  const loss = card.isTrapPlus ? 50 : 30;
  target.km = Math.max(0, (target.km || 0) - loss);
  target.speedLimit = true;
  return { ok: true, msg: `${card.icon} Piège ! -${loss} & vitesse limitée`, target };
}

function applySlow(card = {}, target) {
  target.km = Math.max(0, (target.km || 0) - 25);
  return { ok: true, msg: `${card.icon} -25 km !`, target };
}

function applyLimit(card = {}, target) {
  if (target.speedLimit) return { ok: false, msg: 'La cible a deja une limite.' };
  target.speedLimit = true;
  return { ok: true, msg: `${card.icon} Limite imposee !`, target };
}

function applyBlock(card = {}, target) {
  if (target.stopped || target.hazard === 'feu_rouge') return { ok: false, msg: 'La cible est deja bloquee.' };
  target.hazard = 'feu_rouge';
  target.stopped = true;
  return { ok: true, msg: `${card.icon} Bloque !`, target };
}

function applyHazard(card = {}, target) {
  if (target.hazard) return { ok: false, msg: 'La cible a deja une panne.' };
  target.hazard = card.value;
  return { ok: true, msg: `${card.icon} ${card.label} !`, target };
}

function applyAttack(card = {}, target = {}, options = {}) {
  const t = cloneAttackTarget(target);
  const immunityValue = attackImmunityValue(card);

  if (isImmune(t, immunityValue, options)) return { ok: false, msg: 'La cible est immune !' };
  if ((t.tank_shield || 0) > 0) return applyShieldParry(t);
  if (card.isHack) return applyHack(card, t);
  if (card.isSabo) return applySabotage(card, t);
  if (card.isTrap) return applyTrap(card, t);
  if (card.isSlow) return applySlow(card, t);
  if (card.value === 'limite') return applyLimit(card, t);
  if (card.value === 'feu_rouge' || card.isZone) return applyBlock(card, t);
  return applyHazard(card, t);
}

module.exports = {
  applyAttack,
  applyBlock,
  applyHack,
  applyHazard,
  applyLimit,
  applySabotage,
  applyShieldParry,
  applySlow,
  applyTrap,
  attackImmunityValue,
  cloneAttackTarget,
};
