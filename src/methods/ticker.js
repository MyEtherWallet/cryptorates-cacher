import { success, error } from "../response";
import { validatePairs, processPairs } from "./utils";
export default (request, store) => {
  return new Promise(async (resolve, reject) => {
    store
      .get()
      .then(cache => {
        console.log(request.queryString);
        if (!request.queryString.filter) {
          resolve(success(cache));
        } else {
          let pairs = request.queryString.filter.split(",");
          let valid = true;
          if (request.queryString.strict) valid = validatePairs(pairs, cache);
          if (valid) {
            let tCache = processPairs(pairs, cache);
            resolve(success(tCache));
          } else {
            resolve(error("Invalid Pairs"));
          }
        }
      })
      .catch(err => {
        resolve(error(err.message));
      });
  });
};
