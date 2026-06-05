const PLAYER_SLOT_LAYOUTS = Object.freeze({
  1: Object.freeze([{ x: 50, y: 45, r: 0, s: 1.08 }]),
  2: Object.freeze([{ x: 36, y: 64, r: -2, s: 1.05 }, { x: 64, y: 64, r: 2, s: 1.05 }]),
  3: Object.freeze([{ x: 29, y: 66, r: -3, s: 1.01 }, { x: 50, y: 46, r: 0, s: 1.08 }, { x: 71, y: 66, r: 3, s: 1.01 }]),
  4: Object.freeze([{ x: 18, y: 78, r: -4, s: 0.98 }, { x: 40, y: 55, r: -1.5, s: 1.04 }, { x: 60, y: 55, r: 1.5, s: 1.04 }, { x: 82, y: 78, r: 4, s: 0.98 }]),
  5: Object.freeze([{ x: 12, y: 82, r: -4.5, s: 0.94 }, { x: 31, y: 61, r: -2.4, s: 1 }, { x: 50, y: 50, r: 0, s: 1.04 }, { x: 69, y: 61, r: 2.4, s: 1 }, { x: 88, y: 82, r: 4.5, s: 0.94 }]),
  6: Object.freeze([{ x: 10, y: 83, r: -5, s: 0.9 }, { x: 27, y: 64, r: -3.3, s: 0.96 }, { x: 42, y: 53, r: -1.1, s: 1 }, { x: 58, y: 53, r: 1.1, s: 1 }, { x: 73, y: 64, r: 3.3, s: 0.96 }, { x: 90, y: 83, r: 5, s: 0.9 }]),
  7: Object.freeze([{ x: 8, y: 84, r: -5, s: 0.86 }, { x: 23, y: 68, r: -3.6, s: 0.92 }, { x: 38, y: 56, r: -1.8, s: 0.96 }, { x: 50, y: 50, r: 0, s: 0.99 }, { x: 62, y: 56, r: 1.8, s: 0.96 }, { x: 77, y: 68, r: 3.6, s: 0.92 }, { x: 92, y: 84, r: 5, s: 0.86 }]),
});

function getV2PlayerWidth(count) {
  const clamped = Math.max(1, Math.min(7, count || 1));
  if (clamped <= 2) return 236;
  if (clamped === 3) return 224;
  if (clamped === 4) return 214;
  if (clamped === 5) return 202;
  if (clamped === 6) return 190;
  return 178;
}

function getV2PlayerSlot(count, index) {
  const clampedCount = Math.max(1, Math.min(7, count || 1));
  const layout = PLAYER_SLOT_LAYOUTS[clampedCount] || PLAYER_SLOT_LAYOUTS[6];
  const slot = layout[Math.min(index, clampedCount - 1)] || PLAYER_SLOT_LAYOUTS[1][0];
  return { ...slot, width: getV2PlayerWidth(clampedCount) };
}

module.exports = {
  PLAYER_SLOT_LAYOUTS,
  getV2PlayerSlot,
  getV2PlayerWidth,
};

