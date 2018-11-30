import fetch from "node-fetch";
import configs from "../configs";
export default () => {
  return new Promise((resolve, reject) => {
    fetch(configs.COIN_MARKET_URL)
      .then(res => res.json())
      .then(async json => {
        json.metadata.cacherTimestamp = new Date().getTime();
        resolve(json);
      })
      .catch(reject);
  });
};
