module.exports = function getRandomInt(min, max, excluded) {
  let n = Math.floor(Math.random() * (max-min - 1) + min);
  if (n >= excluded) n++;
  return n;
};