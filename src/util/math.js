export function clamp(a, min, max) {
  return Math.min(Math.max(a, min), max);
};

export function getRandomIntBetween(min, max) {
  return min + Math.random() * (max - min);
};
