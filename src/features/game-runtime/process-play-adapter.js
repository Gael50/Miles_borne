const PROCESS_PLAY_ROUTES = Object.freeze({
  CHAOS_EVENT: 'chaos-event',
  SELF_EFFECT: 'self-effect',
  TARGET_ACTION: 'target-action',
  TARGET_ATTACK: 'target-attack',
  ZONE_ATTACK: 'zone-attack',
});

const RESPONSIBILITY_GROUPS = Object.freeze([
  {
    id: 'guards',
    label: 'Guards runtime',
    owner: 'processPlay',
    details: ['bloque tour IA', 'bloque fin de partie', 'bloque evenement interactif', 'valide getPlayability'],
  },
  {
    id: 'source-card',
    label: 'Selection carte source',
    owner: 'processPlay',
    details: ['main ou inventaire', 'index de carte', 'choix de vol differe'],
  },
  {
    id: 'target-resolution',
    label: 'Resolution cible',
    owner: 'processPlay',
    details: ['IA en solo', 'targetIdx local', 'targetIsAI', 'prompt de vol avant resolution'],
  },
  {
    id: 'effect-core',
    label: 'Regles metier carte',
    owner: 'modules extraits',
    details: ['applySelf', 'applyAttack', 'applyAction', 'zone/chaos encore runtime'],
  },
  {
    id: 'card-consumption',
    label: 'Consommation carte + refill',
    owner: 'processPlay puis deck-actions adapter',
    details: ['retire main/inventaire', 'defausse', 'refill acteur', 'refill cible apres vol'],
  },
  {
    id: 'feedback',
    label: 'Feedbacks joueur',
    owner: 'processPlay',
    details: ['setMsg', 'setMt', 'tflash', 'AudioSys', 'triggerShake', 'triggerCardFx'],
  },
  {
    id: 'state-commit',
    label: 'Commit et transitions',
    owner: 'processPlay',
    details: ['setPlayers', 'setAi', 'setDeck', 'setDisc', 'checkMilestones', 'nxt/applyT/pass screen'],
  },
]);

function classifyProcessPlayCard(card = {}) {
  if (card.isZone) {
    return {
      route: PROCESS_PLAY_ROUTES.ZONE_ATTACK,
      effectModule: 'processPlay zone branch',
      extractedModuleReady: false,
      runtimeOnly: true,
      needsTarget: false,
      needsChoice: false,
      couplings: ['multi-target', 'hideNightHazards', 'shield/immunity per target', 'discard/refill', 'feedbacks', 'turn-transition'],
      nextAction: 'extract zone resolution as a dedicated runtime helper before branch swap',
    };
  }

  if (card.isChaos) {
    return {
      route: PROCESS_PLAY_ROUTES.CHAOS_EVENT,
      effectModule: 'triggerRandomEvent/processPlay',
      extractedModuleReady: false,
      runtimeOnly: true,
      needsTarget: false,
      needsChoice: false,
      couplings: ['triggerRandomEvent', 'interactive event state', 'discard/refill', 'logs', 'turn-transition'],
      nextAction: 'keep legacy until event factory and event runner are isolated',
    };
  }

  if (card.type === 'attack') {
    return {
      route: PROCESS_PLAY_ROUTES.TARGET_ATTACK,
      effectModule: 'applyAttack',
      extractedModuleReady: true,
      runtimeOnly: false,
      needsTarget: true,
      needsChoice: false,
      couplings: ['target resolution', 'night hazard masking', 'discard/refill', 'logs', 'shake/fx', 'turn-transition'],
      nextAction: 'branch after target resolution and card consumption seams are tested',
    };
  }

  if (card.type === 'action') {
    return {
      route: PROCESS_PLAY_ROUTES.TARGET_ACTION,
      effectModule: card.value === 'vol' ? 'applyAction' : 'processPlay/unknown action guard',
      extractedModuleReady: card.value === 'vol',
      runtimeOnly: card.value !== 'vol',
      needsTarget: true,
      needsChoice: card.value === 'vol',
      couplings: ['target resolution', 'steal prompt', 'discard/refill', 'target refill after steal', 'logs', 'turn-transition'],
      nextAction: card.value === 'vol'
        ? 'branch steal after prompt seam and target refill seam are tested'
        : 'keep legacy until action type is specified',
    };
  }

  return {
    route: PROCESS_PLAY_ROUTES.SELF_EFFECT,
    effectModule: 'applySelf',
    extractedModuleReady: true,
    runtimeOnly: false,
    needsTarget: false,
    needsChoice: false,
    couplings: ['discard/refill', 'reroll/drawBonus', 'bumpSafe', 'movement fx', 'logs', 'win/milestones', 'turn-transition'],
    nextAction: 'branch after card consumption/refill seam is tested',
  };
}

function buildProcessPlaySwitchPlan() {
  return [
    {
      id: 'prep-consume-card',
      order: 1,
      label: 'Extract played-card consumption seam',
      go: ['source main/inventory covered', 'discard/refill covered', 'reroll/drawBonus unaffected'],
      noGo: ['deck/discard mutation remains implicit', 'inventory removal not characterized'],
    },
    {
      id: 'branch-self',
      order: 2,
      label: 'Switch self-effect branch to applySelf',
      go: ['consume-card seam stable', 'draw/reroll/bumpSafe expectations covered', 'milestones unchanged'],
      noGo: ['movement/log side effects mixed with effect return'],
    },
    {
      id: 'branch-steal',
      order: 3,
      label: 'Switch vol branch to applyAction',
      go: ['steal prompt characterized', 'target refill after steal covered', 'shield parry covered'],
      noGo: ['choice prompt still mutates runtime before validation'],
    },
    {
      id: 'branch-target-attack',
      order: 4,
      label: 'Switch single-target attacks to applyAttack',
      go: ['target resolution stable', 'night hazard masking covered', 'shake/fx/logs preserved'],
      noGo: ['zone branch mixed with single-target branch'],
    },
    {
      id: 'branch-zone-chaos',
      order: 5,
      label: 'Keep zone and chaos last',
      go: ['event factory isolated', 'zone multi-target helper tested', 'interactive events covered'],
      noGo: ['triggerRandomEvent and processPlay still intertwined'],
    },
  ];
}

module.exports = {
  PROCESS_PLAY_ROUTES,
  RESPONSIBILITY_GROUPS,
  buildProcessPlaySwitchPlan,
  classifyProcessPlayCard,
};
