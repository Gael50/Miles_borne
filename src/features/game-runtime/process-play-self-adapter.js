const { applySelf } = require('../../entities/cards/effects/apply-self');
const {
  PLAYED_CARD_SOURCE,
  consumePlayedCard,
} = require('./played-card-consumption');

function resolveSelfCardPlay({
  actor = {},
  card = null,
  cardIndex = -1,
  source = PLAYED_CARD_SOURCE.HAND,
  deck = [],
  disc = [],
  targetKm = 1000,
  applySelfEffect = applySelf,
  consume = consumePlayedCard,
  effectOptions = {},
  minHandSize,
} = {}) {
  if (!card) {
    return {
      ok: false,
      msg: 'Carte introuvable.',
      reason: 'missing-card',
    };
  }

  const effect = applySelfEffect(card, actor, { ...effectOptions, targetKm });
  if (!effect.ok) {
    return {
      ok: false,
      msg: effect.msg,
      effect,
      reason: 'effect-refused',
    };
  }

  const consumption = consume({
    actor: effect.player,
    cardIndex,
    source,
    deck,
    disc,
    minHandSize,
    resolution: effect,
  });

  if (consumption.status !== 'consumed') {
    return {
      ok: false,
      msg: effect.msg,
      effect,
      consumption,
      reason: consumption.playedState?.reason || 'not-consumed',
    };
  }

  return {
    ok: true,
    msg: effect.msg,
    card,
    effect,
    player: consumption.actor,
    deck: consumption.deck,
    disc: consumption.disc,
    consumption,
  };
}

function isSelfRuntimeCard(card = {}) {
  return Boolean(card) && card.type !== 'attack' && card.type !== 'action' && !card.isZone && !card.isChaos;
}

module.exports = {
  isSelfRuntimeCard,
  resolveSelfCardPlay,
};
