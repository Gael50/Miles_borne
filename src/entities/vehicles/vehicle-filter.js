function getThemeSkinKey(themeKey, themes = {}) {
  return themes?.[themeKey]?.skin || themeKey || 'classic';
}

function getVehiclesForTheme(themeKey, vehicles = [], themes = {}) {
  const skinKey = getThemeSkinKey(themeKey, themes);
  const scoped = vehicles.filter((vehicle) => vehicle.theme === skinKey || vehicle.theme === themeKey);
  if (scoped.length) return scoped;
  return vehicles.filter((vehicle) => vehicle.theme === 'classic');
}

module.exports = {
  getThemeSkinKey,
  getVehiclesForTheme,
};

