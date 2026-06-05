const DIFFICULTIES = Object.freeze({
  facile: Object.freeze({
    name: 'Facile',
    emoji: '😊',
    blunder: 0.55,
    atk: 0.15,
    safe: 6,
    desc: "L'IA fait des erreurs.",
    ml: false,
  }),
  normal: Object.freeze({
    name: 'Normal',
    emoji: '🙂',
    blunder: 0.20,
    atk: 0.45,
    safe: 3,
    desc: 'Joue prudemment.',
    ml: false,
  }),
  difficile: Object.freeze({
    name: 'Difficile',
    emoji: '😤',
    blunder: 0.10,
    atk: 0.65,
    safe: 1,
    desc: 'Attaque prioritaire.',
    ml: false,
  }),
  expert: Object.freeze({
    name: 'Cauchemar',
    emoji: '💀',
    blunder: 0,
    atk: 1,
    safe: 0,
    desc: 'Impitoyable ! Traque le leader.',
    ml: true,
  }),
  apocalypse: Object.freeze({
    name: 'Apocalypse',
    emoji: '☄️',
    blunder: 0,
    atk: 1,
    safe: 0,
    desc: 'Pression maximale : événements tous les 2 tours.',
    ml: true,
    eventEveryTurns: 2,
  }),
});

const DIFFICULTY_MULTIPLIERS = Object.freeze({
  facile: 1,
  normal: 1.5,
  difficile: 2,
  expert: 3.5,
  apocalypse: 5,
});

function getDifficultyMultiplier(difficultyKey) {
  return DIFFICULTY_MULTIPLIERS[difficultyKey] || 1;
}

module.exports = {
  DIFFICULTIES,
  DIFFICULTY_MULTIPLIERS,
  getDifficultyMultiplier,
};

