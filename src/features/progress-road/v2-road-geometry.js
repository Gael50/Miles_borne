function clampProgress(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function getV2RoadPoint(progress) {
  const clamped = clampProgress(progress);
  const angle = Math.PI * (0.94 - 0.88 * clamped);
  return {
    x: 500 + Math.cos(angle) * 462,
    y: 198 - Math.sin(angle) * 168,
  };
}

module.exports = {
  clampProgress,
  getV2RoadPoint,
};

