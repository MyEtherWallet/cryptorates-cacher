import BN from "bignumber.js";
const getGPairs = cache => {
  return cache["data"];
};
const validatePairs = (pairs, cache) => {
  const gPairs = getGPairs(cache);
  for (let i = 0; i < pairs.length; i++) {
    if (typeof gPairs[pairs[i]] === "undefined") return false;
  }
  return true;
};
const processPairs = function(pairs, cache) {
  const gPairs = getGPairs(cache);
  let tCache = Object.assign({}, cache);
  tCache.data = {};
  pairs.forEach(_pair => {
    if (typeof gPairs[_pair] !== "undefined") {
      tCache.data[_pair] = gPairs[_pair];
    }
  });
  return tCache;
};
const getRates = (pair, cache) => {
  const gPairs = getGPairs(cache);
  const usdVal = gPairs[pair].current_price;
  const result = {};
  for (let _pair in gPairs) {
    if (_pair === pair) continue;
    result[_pair] = new BN(usdVal)
      .div(new BN(gPairs[_pair].current_price))
      .toNumber();
  }
  return result;
};
export { getGPairs, validatePairs, processPairs, getRates };
