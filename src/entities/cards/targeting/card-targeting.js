const { VEHICLES } = require('../../vehicles/data/vehicles.data');

const TARGET_KM_OPTIONS = Object.freeze([1000, 2000, 3000]);

function normalizeTargetKm(value) {
  const normalized = Number(value);
  return TARGET_KM_OPTIONS.includes(normalized) ? normalized : 1000;
}

const ATTACK_IMMUNITY_EFFECTS = Object.freeze({
  accident: 'immune_accident',
  crevaison: 'immune_crevaison',
  feu_rouge: 'immune_feu_rouge',
  limite: 'immune_limite',
  panne_essence: 'immune_panne',
});

function getVehicleEffectsForPlayer(player = {}, vehicles = VEHICLES) {
  return vehicles.find((vehicle) => vehicle.id === player.vid)?.effects || {};
}

function hasBotteImmunity(player = {}, value) {
  const bottes = Array.isArray(player.bottes) ? player.bottes : [];
  return bottes.some((botte) => {
    if (Array.isArray(botte.immuneTo)) return botte.immuneTo.includes(value);
    return botte.immuneTo === value;
  });
}

function hasVehicleImmunity(player = {}, value, vehicles = VEHICLES) {
  const effectKey = ATTACK_IMMUNITY_EFFECTS[value];
  if (!effectKey) return false;
  const effects = getVehicleEffectsForPlayer(player, vehicles);
  return !!effects[effectKey];
}

function isImmune(player = {}, value, options = {}) {
  const vehicles = options.vehicles || VEHICLES;
  return hasBotteImmunity(player, value) || hasVehicleImmunity(player, value, vehicles);
}

function evaluateAttackTarget(card = {}, target = {}, options = {}) {
  if (!target) return { valid: false, reason: 'Cible indisponible' };
  if (isImmune(target, card.value, options)) return { valid: false, reason: 'La cible est immune !', immune: true };

  if ((target.tank_shield || 0) > 0) {
    return {
      valid: true,
      reason: 'Bouclier actif : la carte sera parée',
      protected: true,
    };
  }

  if (card.isHack || card.isSabo || card.isTrap || card.isSlow) return { valid: true, reason: '' };

  if (card.value === 'limite') {
    return target.speedLimit
      ? { valid: false, reason: 'La cible a déjà une limite.', alreadyAffected: true }
      : { valid: true, reason: '' };
  }

  if (card.value === 'feu_rouge') {
    return target.stopped || target.hazard === 'feu_rouge'
      ? { valid: false, reason: 'La cible est déjà bloquée.', alreadyAffected: true }
      : { valid: true, reason: '' };
  }

  if (target.hazard) return { valid: false, reason: 'La cible a déjà une panne.', alreadyAffected: true };
  return { valid: true, reason: '' };
}

function evaluateActionTarget(card = {}, target = {}) {
  if (!target) return { valid: false, reason: 'Cible indisponible' };
  if (card.value === 'vol') {
    if (!Array.isArray(target.hand) || target.hand.length === 0) {
      return { valid: false, reason: 'Main cible vide', emptyHand: true };
    }
    if ((target.tank_shield || 0) > 0) {
      return {
        valid: true,
        reason: 'Bouclier actif : le vol sera repoussé',
        protected: true,
      };
    }
  }
  return { valid: true, reason: '' };
}

function evaluateTargetForCard(card = {}, target = {}, options = {}) {
  if (!card || !target) return { valid: false, reason: 'Cible indisponible' };
  if (card.isZone || card.isChaos) return { valid: true, reason: 'Effet global', global: true };
  if (card.type === 'attack') return evaluateAttackTarget(card, target, options);
  if (card.type === 'action') return evaluateActionTarget(card, target, options);
  return { valid: false, reason: 'Cette carte ne cible pas un adversaire' };
}

function buildTargetOptions({ players = [], ai = null, currentIndex = 0, card = null, playerIds = [], vehicles = VEHICLES } = {}) {
  return [
    ...players
      .map((player, index) => ({
        kind: 'player',
        index,
        playerId: playerIds[index] || `host:${index}`,
        name: player?.name || `Joueur ${index + 1}`,
        player,
      }))
      .filter((target) => target.index !== currentIndex && target.player),
    ...(ai ? [{ kind: 'ai', index: 'ai', playerId: 'ai', name: ai.name || 'IA', player: ai }] : []),
  ].map((target) => {
    const status = card ? evaluateTargetForCard(card, target.player, { vehicles }) : { valid: true, reason: '' };
    const { player, ...safeTarget } = target;
    return {
      ...safeTarget,
      valid: !!status.valid,
      reason: status.reason || '',
      immune: !!status.immune,
      protected: !!status.protected,
      alreadyAffected: !!status.alreadyAffected,
      emptyHand: !!status.emptyHand,
    };
  });
}

function hasAnyValidTarget(card = {}, targets = []) {
  if (card.isZone || card.isChaos) return true;
  return targets.some((target) => target.valid);
}

function evaluateSelfCardPlayability(card = {}, player = {}, options = {}) {
  const targetKm = normalizeTargetKm(options.targetKm || player.targetKm || 1000);
  const effects = getVehicleEffectsForPlayer(player, options.vehicles || VEHICLES);

  if (card.type === 'distance') {
    if (player.stopped || player.hazard) return { ok: false, reason: 'Vous devez être en route' };
    if (player.speedLimit && card.value > 50) return { ok: false, reason: 'Limite active : max 50' };
    if (card.value === 200 && effects.no_200) return { ok: false, reason: 'Votre véhicule ne peut pas jouer de 200' };
    if (card.value === 100 && effects.no_100) return { ok: false, reason: 'Votre véhicule ne peut pas jouer de 100' };
    if ((player.km || 0) + card.value > targetKm) return { ok: false, reason: `Dépasse ${targetKm}` };
    return { ok: true, reason: '' };
  }

  if (card.type === 'boost') {
    if (card.isWild) return { ok: true, reason: '' };
    if (player.stopped || player.hazard) return { ok: false, reason: "Boost impossible à l'arrêt" };
    return { ok: true, reason: '' };
  }

  if (card.type === 'remedy') {
    if (card.value === 'premium' || card.isBrico) {
      return player.hazard || player.stopped ? { ok: true, reason: '' } : { ok: false, reason: 'Aucune panne à soigner' };
    }
    if (card.value === 'feu_vert') {
      return player.stopped || player.hazard === 'feu_rouge' ? { ok: true, reason: '' } : { ok: false, reason: 'Déjà en route' };
    }
    if (card.value === 'fin_limite') return player.speedLimit ? { ok: true, reason: '' } : { ok: false, reason: 'Pas de limite active' };
    return player.hazard === card.fixes ? { ok: true, reason: '' } : { ok: false, reason: 'Remède non adapté' };
  }

  if (card.type === 'botte') {
    if ((player.bottes || []).some((botte) => botte.value === card.value)) return { ok: false, reason: 'Botte déjà active' };
    return { ok: true, reason: '' };
  }

  return { ok: true, reason: '' };
}

function evaluateCardPlayability(card = {}, player = {}, options = {}) {
  if (!card || !player) return { ok: false, reason: 'Carte indisponible' };
  if (options.isAITurn) return { ok: false, reason: 'Attendez la fin du tour IA' };
  if (options.actionBlocked) return { ok: false, reason: options.blockedReason || 'Action en cours' };

  if (card.type !== 'attack' && card.type !== 'action') return evaluateSelfCardPlayability(card, player, options);

  if (card.isChaos || card.isZone) return { ok: true, reason: '', targets: [] };

  const targets = options.targets || buildTargetOptions({
    players: options.players || [],
    ai: options.ai || null,
    currentIndex: options.currentIndex,
    card,
    playerIds: options.playerIds || [],
    vehicles: options.vehicles || VEHICLES,
  });

  if (!targets.length) return { ok: false, reason: 'Aucune cible disponible', targets };
  if (card.type === 'action' && card.value === 'vol' && !targets.some((target) => target.valid)) {
    return { ok: false, reason: 'Aucune main à voler', targets };
  }
  if (!hasAnyValidTarget(card, targets)) return { ok: false, reason: 'Aucune cible valide', targets };

  return { ok: true, reason: '', targets };
}

module.exports = {
  ATTACK_IMMUNITY_EFFECTS,
  TARGET_KM_OPTIONS,
  buildTargetOptions,
  evaluateActionTarget,
  evaluateAttackTarget,
  evaluateCardPlayability,
  evaluateSelfCardPlayability,
  evaluateTargetForCard,
  getVehicleEffectsForPlayer,
  hasAnyValidTarget,
  hasBotteImmunity,
  hasVehicleImmunity,
  isImmune,
  normalizeTargetKm,
};
