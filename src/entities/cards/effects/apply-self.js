const { VEHICLES } = require('../../vehicles/data/vehicles.data');

const TARGET_KM_OPTIONS = Object.freeze([1000, 2000, 3000]);

function normalizeTargetKm(value) {
  const normalized = Number(value);
  return TARGET_KM_OPTIONS.includes(normalized) ? normalized : 1000;
}

function getVehicleEffects(vehicleId, vehicles = VEHICLES) {
  return vehicles.find((vehicle) => vehicle.id === vehicleId)?.effects || {};
}

function cloneSelfPlayer(player = {}) {
  return {
    ...player,
    bottes: Array.isArray(player.bottes) ? [...player.bottes] : [],
    hand: Array.isArray(player.hand) ? [...player.hand] : [],
    inventory: Array.isArray(player.inventory) ? [...player.inventory] : [],
    maxFuel: player.maxFuel || 100,
    fuel: typeof player.fuel === 'number' ? player.fuel : (player.maxFuel || 100),
    hazardHidden: !!player.hazardHidden,
  };
}

function refillFuel(player, amount = null) {
  player.maxFuel = player.maxFuel || 100;
  const currentFuel = typeof player.fuel === 'number' ? player.fuel : player.maxFuel;
  player.fuel = amount === null ? player.maxFuel : Math.min(player.maxFuel, currentFuel + amount);
  return player;
}

function applyBoost(card = {}, player = {}, context = {}) {
  const p = player;
  const limit = context.limit;
  const effects = context.effects || {};

  if (card.isWild) {
    const gain = 60;
    p.hazard = null;
    p.stopped = false;
    refillFuel(p, 20);
    if ((p.km || 0) + gain > limit) return { ok: false, msg: `Cette wildcard dépasserait ${limit}.` };
    p.km = Math.min(limit, (p.km || 0) + gain);
    return { ok: true, msg: `${card.icon} Joker ! +${gain} & carburant +20`, player: p };
  }

  if (card.isDouble) {
    if (p.stopped && !effects.start_green) return { ok: false, msg: "Démarrez d'abord (Feu Vert)." };
    if (p.hazard) return { ok: false, msg: "Soignez votre panne d'abord." };
    const gain = 40;
    if ((p.km || 0) + gain > limit) return { ok: false, msg: `Ce gain dépasserait ${limit}.` };
    p.km = Math.min(limit, (p.km || 0) + gain);
    return { ok: true, msg: `${card.icon} +${gain} & pioche !`, player: p, drawBonus: 1 };
  }

  if (p.stopped && !effects.start_green) return { ok: false, msg: "Démarrez d'abord (Feu Vert)." };
  if (p.hazard) return { ok: false, msg: 'Soignez votre panne avant le boost.' };

  const gain = card.value === 'boost100' ? 100 : card.value === 'boost75' ? 75 : 50;
  if ((p.km || 0) + gain > limit) return { ok: false, msg: `Ce boost dépasserait ${limit}.` };
  p.km = Math.min(limit, (p.km || 0) + gain);
  return { ok: true, msg: `${card.icon} +${gain} = ${p.km} !`, player: p };
}

function applyBotte(card = {}, player = {}) {
  const p = player;
  p.bottes.push(card);
  p.bottes_count = (p.bottes_count || 0) + 1;
  let coupFourre = false;

  if (card.value === 'prioritaire') {
    if (p.hazard === 'feu_rouge' || p.speedLimit || p.hazard === 'limite') coupFourre = true;
    p.stopped = false;
    p.hazard = null;
    p.speedLimit = false;
  }
  if (card.value === 'as_volant' && p.hazard === 'accident') {
    p.hazard = null;
    coupFourre = true;
  }
  if (card.value === 'citerne' && p.hazard === 'panne_essence') {
    p.hazard = null;
    refillFuel(p);
    coupFourre = true;
  }
  if (card.value === 'increvable' && p.hazard === 'crevaison') {
    p.hazard = null;
    coupFourre = true;
  }

  if (coupFourre) p.coupsFourres = (p.coupsFourres || 0) + 1;
  return {
    ok: true,
    msg: coupFourre ? `COUP FOURRE ! ${card.label}` : `${card.icon} ${card.label} !`,
    player: p,
    cf: coupFourre,
  };
}

function applyDistance(card = {}, player = {}, context = {}) {
  const p = player;
  const effects = context.effects || {};
  const limit = context.limit;

  if (p.stopped) return { ok: false, msg: "Jouez d'abord un feu vert !" };
  if (p.hazard) return { ok: false, msg: 'Vous avez une panne active !' };
  if (card.value > 50 && p.speedLimit) return { ok: false, msg: 'Limite de vitesse ! (max 50)' };
  if (card.value === 200 && effects.no_200) return { ok: false, msg: 'Votre vehicule ne peut pas jouer de 200 !' };
  if (card.value === 100 && effects.no_100) return { ok: false, msg: 'Votre vehicule ne peut pas jouer de 100 !' };
  if ((p.km || 0) + card.value > limit) return { ok: false, msg: `Depasserait ${limit} !` };

  p.km = (p.km || 0) + card.value;
  return { ok: true, msg: `${card.icon} +${card.value} = ${p.km}`, player: p };
}

function applyRemedy(card = {}, player = {}) {
  const p = player;

  if (card.value === 'premium') {
    p.hazard = null;
    p.hazardHidden = false;
    p.stopped = false;
    refillFuel(p);
    return { ok: true, msg: `${card.icon} Tout est réparé + plein fait !`, player: p };
  }

  if (card.isBrico) {
    if (!p.hazard && !p.stopped) return { ok: false, msg: 'Inutile, vous roulez deja !' };
    p.hazard = null;
    p.hazardHidden = false;
    p.stopped = false;
    p.speedLimit = true;
    refillFuel(p, 35);
    return { ok: true, msg: `${card.icon} Bricolage ! +35 carburant (Max 50)`, player: p };
  }

  if (card.value === 'feu_vert') {
    if (!p.stopped && !p.hazard) return { ok: false, msg: 'Vous roulez deja !' };
    if (p.hazard === 'feu_rouge') {
      p.hazard = null;
      p.hazardHidden = false;
      p.stopped = false;
      refillFuel(p, 10);
      return { ok: true, msg: `${card.icon} En route ! +10 carburant`, player: p };
    }
    if (p.stopped && !p.hazard) {
      p.stopped = false;
      refillFuel(p, 10);
      return { ok: true, msg: `${card.icon} En route ! +10 carburant`, player: p };
    }
    return { ok: false, msg: "Soignez d'abord votre panne." };
  }

  if (card.value === 'fin_limite') {
    if (!p.speedLimit) return { ok: false, msg: 'Pas de limite active.' };
    p.speedLimit = false;
    return { ok: true, msg: `${card.icon} Limite levee !`, player: p };
  }

  if (p.hazard === card.fixes) {
    p.hazard = null;
    p.hazardHidden = false;
    if (card.value === 'essence') refillFuel(p);
    else if (card.value === 'reparation' || card.value === 'roue') refillFuel(p, 35);
    const fuelNote = card.value === 'essence' ? ' + plein fait' : (card.value === 'reparation' || card.value === 'roue') ? ' +35 carburant' : '';
    return { ok: true, msg: `${card.icon} Soigné !${fuelNote}`, player: p };
  }

  return { ok: false, msg: 'Ce remede ne correspond pas.' };
}

function applySelf(card = {}, player = {}, options = {}) {
  if (!card || !player) return { ok: false, msg: 'Carte invalide.' };

  const vehicles = options.vehicles || VEHICLES;
  const p = cloneSelfPlayer(player);
  const limit = normalizeTargetKm(options.targetKm || p.targetKm || 1000);
  const effects = options.effects || getVehicleEffects(p.vid, vehicles);
  const context = { effects, limit };

  if (card.type === 'boost') return applyBoost(card, p, context);
  if (card.type === 'shield') {
    const add = card.isShieldPlus ? 2 : 1;
    p.tank_shield = (p.tank_shield || 0) + add;
    return { ok: true, msg: `${card.icon} Blindage +${add} (total ${p.tank_shield})`, player: p };
  }
  if (card.type === 'draw') return { ok: true, msg: `${card.icon} +3 cartes`, player: p, drawBonus: 3 };
  if (card.type === 'reroll') return { ok: true, msg: `${card.icon} Nouveau plan !`, player: p, rerollHand: true };
  if (card.type === 'botte') return applyBotte(card, p);
  if (card.type === 'distance') return applyDistance(card, p, context);
  if (card.type === 'remedy') return applyRemedy(card, p);

  return { ok: false, msg: 'Carte invalide.' };
}

module.exports = {
  TARGET_KM_OPTIONS,
  applyBotte,
  applyBoost,
  applyDistance,
  applyRemedy,
  applySelf,
  cloneSelfPlayer,
  getVehicleEffects,
  normalizeTargetKm,
  refillFuel,
};
