import { success, error } from "../response";
import { validatePairs, getRates } from "./utils";
export default (request, store) => {
  let symbol = "ETH";
  if (request.pathParams.symbol)
    symbol = request.pathParams.symbol.toUpperCase();
  return new Promise(async (resolve, reject) => {
    store
      .get()
      .then(cache => {
        if (!validatePairs([symbol], cache)) resolve(error("Invalid Pair"));
        else {
          resolve(success(getRates(symbol, cache)));
        }
      })
      .catch(err => {
        resolve(error(err.message));
      });
  });
};
