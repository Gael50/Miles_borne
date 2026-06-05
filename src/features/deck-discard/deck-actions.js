const { VEHICLES } = require('../../entities/vehicles/data/vehicles.data');

const MIN_HAND_SIZE = 10;
const MAX_HAND_SIZE = 14;

function shuffleCards(cards = [], rng = Math.random) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getVehicleEffects(roleId, vehicles = VEHICLES) {
  return vehicles.find((vehicle) => vehicle.id === roleId)?.effects || {};
}

function targetHandSizeForRole(roleId, options = {}) {
  const min = options.minHandSize ?? MIN_HAND_SIZE;
  const effects = getVehicleEffects(roleId, options.vehicles || VEHICLES);
  return Math.max(1, min + (effects.hand_size || 0));
}

function drawCard(deck = [], discard = [], options = {}) {
  const currentDeck = Array.isArray(deck) ? [...deck] : [];
  const currentDiscard = Array.isArray(discard) ? [...discard] : [];
  const shuffle = options.shuffleCards || ((cards) => shuffleCards(cards, options.rng || Math.random));

  if (currentDeck.length > 0) {
    const [card, ...remainingDeck] = currentDeck;
    return { card, deck: remainingDeck, disc: currentDiscard };
  }

  if (currentDiscard.length > 1) {
    const topDiscard = currentDiscard[currentDiscard.length - 1];
    const recycled = shuffle(currentDiscard.slice(0, -1));
    const [card, ...remainingDeck] = recycled;
    return { card: card || null, deck: remainingDeck, disc: [topDiscard], recycled: true };
  }

  return { card: null, deck: currentDeck, disc: currentDiscard };
}

function clonePlayerWithHand(player = {}) {
  return {
    ...player,
    hand: Array.isArray(player.hand) ? [...player.hand] : [],
  };
}

function refillHand(player = {}, deck = [], discard = [], min = MIN_HAND_SIZE, options = {}) {
  const nextPlayer = clonePlayerWithHand(player);
  let nextDeck = Array.isArray(deck) ? [...deck] : [];
  let nextDiscard = Array.isArray(discard) ? [...discard] : [];
  let safety = options.safety ?? 200;

  while (nextPlayer.hand.length < min && safety-- > 0) {
    const draw = drawCard(nextDeck, nextDiscard, options);
    nextDeck = draw.deck;
    nextDiscard = draw.disc;
    if (!draw.card) break;
    nextPlayer.hand.push(draw.card);
  }

  return { player: nextPlayer, deck: nextDeck, disc: nextDiscard };
}

function refillHandMutable(player = {}, deck = [], discard = [], min = MIN_HAND_SIZE, options = {}) {
  const result = refillHand(player, deck, discard, min, options);
  player.hand = result.player.hand;
  return { deck: result.deck, disc: result.disc, player };
}

function drawCardsIntoHand(player = {}, deck = [], discard = [], count = 1, options = {}) {
  const nextPlayer = clonePlayerWithHand(player);
  let nextDeck = Array.isArray(deck) ? [...deck] : [];
  let nextDiscard = Array.isArray(discard) ? [...discard] : [];
  const drawn = [];

  for (let i = 0; i < count; i++) {
    const draw = drawCard(nextDeck, nextDiscard, options);
    nextDeck = draw.deck;
    nextDiscard = draw.disc;
    if (!draw.card) break;
    drawn.push(draw.card);
    nextPlayer.hand.push(draw.card);
  }

  return { player: nextPlayer, deck: nextDeck, disc: nextDiscard, drawn };
}

function discardCardFromHand(player = {}, cardIndex = -1, discard = []) {
  const nextPlayer = clonePlayerWithHand(player);
  const nextDiscard = Array.isArray(discard) ? [...discard] : [];

  if (cardIndex < 0 || cardIndex >= nextPlayer.hand.length) {
    return { player: nextPlayer, disc: nextDiscard, card: null };
  }

  const [card] = nextPlayer.hand.splice(cardIndex, 1);
  nextDiscard.push(card);
  return { player: nextPlayer, disc: nextDiscard, card };
}

function dealAll(cards = [], playerCount = 0, roles = [], options = {}) {
  const vehicles = options.vehicles || VEHICLES;
  const shuffle = options.shuffleCards || ((deck) => shuffleCards(deck, options.rng || Math.random));
  const deck = shuffle(Array.isArray(cards) ? cards : []);
  const hands = Array.from({ length: Math.max(0, playerCount) }, () => []);
  const greenIndexes = deck.reduce((acc, card, index) => {
    if (card?.value === 'feu_vert') acc.push(index);
    return acc;
  }, []);
  const thiefIndexes = deck.reduce((acc, card, index) => {
    if (card?.value === 'vol') acc.push(index);
    return acc;
  }, []);
  const used = new Set();

  for (let playerIndex = 0; playerIndex < hands.length; playerIndex++) {
    const effects = getVehicleEffects(roles[playerIndex], vehicles);
    if (effects.start_thief) {
      const thiefIndex = thiefIndexes.find((index) => !used.has(index));
      if (thiefIndex !== undefined) {
        used.add(thiefIndex);
        hands[playerIndex].push(deck[thiefIndex]);
      }
    }
    if (!effects.start_green) {
      const greenIndex = greenIndexes.find((index) => !used.has(index));
      if (greenIndex !== undefined) {
        used.add(greenIndex);
        hands[playerIndex].push(deck[greenIndex]);
      }
    }
  }

  let playerIndex = 0;
  let safety = deck.length * 2;
  while (hands.length > 0 && safety-- > 0) {
    const allDone = hands.every((hand, index) => hand.length >= targetHandSizeForRole(roles[index], { vehicles }));
    if (allDone) break;

    const targetSize = targetHandSizeForRole(roles[playerIndex], { vehicles });
    if (hands[playerIndex].length < targetSize) {
      const nextCardIndex = deck.findIndex((_, index) => !used.has(index));
      if (nextCardIndex < 0) break;
      used.add(nextCardIndex);
      hands[playerIndex].push(deck[nextCardIndex]);
    }

    playerIndex = (playerIndex + 1) % hands.length;
  }

  return {
    hands,
    remaining: deck.filter((_, index) => !used.has(index)),
  };
}

function countCardsInZones({ deck = [], disc = [], hands = [] } = {}) {
  return (
    (Array.isArray(deck) ? deck.length : 0) +
    (Array.isArray(disc) ? disc.length : 0) +
    (Array.isArray(hands) ? hands.reduce((total, hand) => total + (Array.isArray(hand) ? hand.length : 0), 0) : 0)
  );
}

module.exports = {
  MAX_HAND_SIZE,
  MIN_HAND_SIZE,
  clonePlayerWithHand,
  countCardsInZones,
  dealAll,
  discardCardFromHand,
  drawCard,
  drawCardsIntoHand,
  getVehicleEffects,
  refillHand,
  refillHandMutable,
  shuffleCards,
  targetHandSizeForRole,
};
