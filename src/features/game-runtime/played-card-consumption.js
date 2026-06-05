const { MIN_HAND_SIZE, refillHand } = require('../deck-discard/deck-actions');

const PLAYED_CARD_SOURCE = Object.freeze({
  HAND: 'hand',
  INVENTORY: 'inventory',
});

const PLAYED_CARD_STATUS = Object.freeze({
  CONSUMED: 'consumed',
  PENDING: 'pending',
  SKIPPED: 'skipped',
});

function normalizePlayedCardSource(source = PLAYED_CARD_SOURCE.HAND) {
  return source === PLAYED_CARD_SOURCE.INVENTORY || source === 'inv'
    ? PLAYED_CARD_SOURCE.INVENTORY
    : PLAYED_CARD_SOURCE.HAND;
}

function cloneRuntimePlayer(player = {}) {
  return {
    ...player,
    hand: Array.isArray(player.hand) ? [...player.hand] : [],
    inventory: Array.isArray(player.inventory) ? [...player.inventory] : [],
    bottes: Array.isArray(player.bottes) ? [...player.bottes] : [],
  };
}

function selectPlayedCard(actor = {}, cardIndex = -1, source = PLAYED_CARD_SOURCE.HAND) {
  const normalizedSource = normalizePlayedCardSource(source);
  const pile = normalizedSource === PLAYED_CARD_SOURCE.INVENTORY ? actor.inventory : actor.hand;
  const cards = Array.isArray(pile) ? pile : [];

  return {
    card: cardIndex >= 0 && cardIndex < cards.length ? cards[cardIndex] : null,
    cardIndex,
    source: normalizedSource,
  };
}

function createPlayedCardState({ actor, cardIndex = -1, source = PLAYED_CARD_SOURCE.HAND, card = null, reason = 'resolving' } = {}) {
  const selected = card ? { card, cardIndex, source: normalizePlayedCardSource(source) } : selectPlayedCard(actor, cardIndex, source);

  return {
    card: selected.card,
    cardIndex: selected.cardIndex,
    reason,
    source: selected.source,
    status: selected.card ? PLAYED_CARD_STATUS.PENDING : PLAYED_CARD_STATUS.SKIPPED,
  };
}

function removeCardAt(cards = [], cardIndex = -1) {
  if (cardIndex < 0 || cardIndex >= cards.length) {
    return { card: null, cards: [...cards] };
  }

  const nextCards = [...cards];
  const [card] = nextCards.splice(cardIndex, 1);
  return { card, cards: nextCards };
}

function shouldDeferConsumption(resolution = {}) {
  return Boolean(resolution.deferConsumption || resolution.requiresPending || resolution.keepInPlayedState);
}

function shouldSkipConsumption(resolution = {}) {
  return resolution.ok === false || resolution.interrupted || resolution.cancelled;
}

function buildSkippedResult({ actor, deck, disc, playedCard, playedState, reason }) {
  return {
    actor: cloneRuntimePlayer(actor),
    deck: Array.isArray(deck) ? [...deck] : [],
    disc: Array.isArray(disc) ? [...disc] : [],
    discardedCards: [],
    playedCard: playedCard || null,
    playedState: {
      ...(playedState || {}),
      status: PLAYED_CARD_STATUS.SKIPPED,
      reason,
    },
    status: PLAYED_CARD_STATUS.SKIPPED,
  };
}

function consumePlayedCard({
  actor = {},
  cardIndex = -1,
  source = PLAYED_CARD_SOURCE.HAND,
  deck = [],
  disc = [],
  resolution = { ok: true },
  playedState = null,
  minHandSize = MIN_HAND_SIZE,
  refill = refillHand,
  appendStolen = true,
} = {}) {
  const currentState = playedState || createPlayedCardState({ actor, cardIndex, source });
  const normalizedSource = normalizePlayedCardSource(currentState.source || source);
  const selected = selectPlayedCard(actor, currentState.cardIndex ?? cardIndex, normalizedSource);
  const playedCard = currentState.card || selected.card;
  const nextDeck = Array.isArray(deck) ? [...deck] : [];
  const nextDisc = Array.isArray(disc) ? [...disc] : [];

  if (currentState.status === PLAYED_CARD_STATUS.CONSUMED) {
    return buildSkippedResult({ actor, deck, disc, playedCard, playedState: currentState, reason: 'already-consumed' });
  }

  if (!playedCard) {
    return buildSkippedResult({ actor, deck, disc, playedCard: null, playedState: currentState, reason: 'missing-card' });
  }

  if (shouldSkipConsumption(resolution)) {
    return buildSkippedResult({ actor, deck, disc, playedCard, playedState: currentState, reason: resolution.reason || 'resolution-not-complete' });
  }

  if (shouldDeferConsumption(resolution)) {
    return {
      actor: cloneRuntimePlayer(actor),
      deck: nextDeck,
      disc: nextDisc,
      discardedCards: [],
      playedCard,
      playedState: {
        ...currentState,
        reason: resolution.reason || currentState.reason || 'pending-resolution',
        status: PLAYED_CARD_STATUS.PENDING,
      },
      status: PLAYED_CARD_STATUS.PENDING,
    };
  }

  const nextActor = cloneRuntimePlayer(actor);
  let refillResult = { player: nextActor, deck: nextDeck, disc: nextDisc };
  let discardedCards = [];

  if (normalizedSource === PLAYED_CARD_SOURCE.INVENTORY) {
    const removed = removeCardAt(nextActor.inventory, currentState.cardIndex ?? cardIndex);
    nextActor.inventory = removed.cards;
  } else {
    const removed = removeCardAt(nextActor.hand, currentState.cardIndex ?? cardIndex);
    nextActor.hand = removed.cards;
    discardedCards = [playedCard];

    if (resolution.rerollHand) {
      const tossed = [...nextActor.hand];
      nextActor.hand = [];
      discardedCards = [playedCard, ...tossed];
      refillResult = refill(nextActor, nextDeck, [...nextDisc, ...discardedCards], minHandSize);
    } else {
      refillResult = refill(nextActor, nextDeck, [...nextDisc, playedCard], minHandSize);

      if (resolution.drawBonus && resolution.drawBonus > 0) {
        const targetSize = refillResult.player.hand.length + resolution.drawBonus;
        refillResult = refill(refillResult.player, refillResult.deck, refillResult.disc, targetSize);
      }
    }
  }

  const finalActor = cloneRuntimePlayer(refillResult.player);
  if (appendStolen && resolution.stolen) {
    finalActor.hand.push(resolution.stolen);
  }

  return {
    actor: finalActor,
    deck: refillResult.deck,
    disc: refillResult.disc,
    discardedCards,
    playedCard,
    playedState: {
      ...currentState,
      status: PLAYED_CARD_STATUS.CONSUMED,
    },
    status: PLAYED_CARD_STATUS.CONSUMED,
  };
}

function refillTargetAfterSteal({ target = {}, deck = [], disc = [], resolution = {}, minHandSize = MIN_HAND_SIZE, refill = refillHand } = {}) {
  if (!resolution.ok || resolution.parried || !resolution.stolen) {
    return {
      deck: Array.isArray(deck) ? [...deck] : [],
      disc: Array.isArray(disc) ? [...disc] : [],
      target: cloneRuntimePlayer(target),
      refilled: false,
    };
  }

  const result = refill(cloneRuntimePlayer(target), deck, disc, minHandSize);
  return {
    deck: result.deck,
    disc: result.disc,
    target: result.player,
    refilled: true,
  };
}

module.exports = {
  PLAYED_CARD_SOURCE,
  PLAYED_CARD_STATUS,
  cloneRuntimePlayer,
  consumePlayedCard,
  createPlayedCardState,
  normalizePlayedCardSource,
  refillTargetAfterSteal,
  selectPlayedCard,
};
