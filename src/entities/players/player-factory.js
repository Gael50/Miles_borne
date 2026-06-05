const { normalizeTargetKm } = require('../../core/game/progression/target-distance');
const { VEHICLES } = require('../vehicles/data/vehicles.data');

function getVehicleEffects(vehicleId, vehicles = VEHICLES) {
  return vehicles.find((vehicle) => vehicle.id === vehicleId)?.effects || {};
}

function createPlayer(name, colorIdx, vehicleId = 'v1', targetKm = 1000, vehicles = VEHICLES) {
  const effects = getVehicleEffects(vehicleId, vehicles);
  const raceTarget = normalizeTargetKm(targetKm);

  return {
    name,
    km: effects.start_km || 0,
    hand: [],
    inventory: [],
    bottes: [],
    hazard: null,
    speedLimit: !!effects.start_limite,
    stopped: !effects.start_green,
    colorIdx,
    bottes_count: 0,
    coupsFourres: 0,
    vid: vehicleId,
    tank_shield: effects.tank_shield ? (effects.tank_shield_x2 ? 2 : 1) : 0,
    maxFuel: 100,
    fuel: 100,
    hazardHidden: false,
    targetKm: raceTarget,
  };
}

module.exports = {
  createPlayer,
  getVehicleEffects,
  newP: createPlayer,
};
