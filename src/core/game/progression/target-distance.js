const RACE_TARGET_OPTIONS = Object.freeze([1000, 2000, 3000]);
const DEFAULT_TARGET_KM = 1000;
const EVENT_MILESTONE_RATIOS = Object.freeze([0.2, 0.4, 0.6, 0.8]);

function normalizeTargetKm(value) {
  const normalized = Number(value);
  return RACE_TARGET_OPTIONS.includes(normalized) ? normalized : DEFAULT_TARGET_KM;
}

function buildEventMilestones(targetKm = DEFAULT_TARGET_KM) {
  const normalizedTarget = normalizeTargetKm(targetKm);
  return EVENT_MILESTONE_RATIOS.map((ratio) => Math.round(normalizedTarget * ratio));
}

module.exports = {
  DEFAULT_TARGET_KM,
  EVENT_MILESTONE_RATIOS,
  RACE_TARGET_OPTIONS,
  buildEventMilestones,
  normalizeTargetKm,
};

