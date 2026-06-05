const { normalizeTargetKm } = require('../progression/target-distance');
const { getDifficultyMultiplier } = require('../difficulty/difficulty.data');

function calcScore({ winnerIsAI, players = [], aiPlayer = null, diff, turns = 0, targetKm = 1000 } = {}) {
  const raceTarget = normalizeTargetKm(targetKm);
  const rows = [];
  const multiplier = getDifficultyMultiplier(diff);
  let total = 0;
  const playerList = Array.isArray(players) ? players : [];
  const winner = winnerIsAI ? aiPlayer : playerList.find((player) => (player?.km || 0) >= raceTarget) || playerList[0];

  if (!winner) return { rows: [], total: 0 };

  rows.push({ l: 'Victoire', pts: 200, color: '#fbbf24' });
  total += 200;

  const distancePoints = Math.round((winner.km || 0) / 10);
  rows.push({ l: `Distance (${winner.km || 0})`, pts: distancePoints, color: '#4ade80' });
  total += distancePoints;

  const opponents = [...playerList, ...(aiPlayer ? [aiPlayer] : [])].filter((player) => player !== winner);
  if (opponents.length > 0) {
    const bestOpponentDistance = Math.max(...opponents.map((player) => player?.km || 0));
    const lead = Math.max(0, raceTarget - bestOpponentDistance);
    const leadPoints = Math.round(lead * 0.5);
    rows.push({ l: `Avance (+${lead})`, pts: leadPoints, color: '#34d399' });
    total += leadPoints;
  }

  const bootCount = winner.bottes_count || 0;
  if (bootCount > 0) {
    rows.push({ l: `Bottes (x${bootCount})`, pts: bootCount * 30, color: '#f59e0b' });
    total += bootCount * 30;
  }

  const coupFourreCount = winner.coupsFourres || 0;
  if (coupFourreCount > 0) {
    rows.push({ l: `Coups Fourres (x${coupFourreCount})`, pts: coupFourreCount * 300, color: '#ec4899' });
    total += coupFourreCount * 300;
  }

  if (turns <= 15) {
    rows.push({ l: 'Victoire éclair !', pts: 80, color: '#a78bfa' });
    total += 80;
  } else if (turns <= 25) {
    rows.push({ l: 'Victoire rapide', pts: 40, color: '#818cf8' });
    total += 40;
  }

  const beforeDifficulty = total;
  total = Math.round(total * multiplier);
  if (multiplier > 1) {
    rows.push({ l: `Difficulté (x${multiplier})`, pts: total - beforeDifficulty, color: '#f87171' });
  }

  return { rows, total: Math.max(0, total) };
}

module.exports = {
  calcScore,
};

