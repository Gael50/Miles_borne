function humanizeCardValue(value) {
  return String(value || 'carte')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

module.exports = {
  humanizeCardValue,
};

