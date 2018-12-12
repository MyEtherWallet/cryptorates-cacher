import fetch from "node-fetch";
import configs from "../configs";
const oldify = list => {
  const oldObj = {
    data: {},
    metadata: {
      timestamp: new Date(list.status.timestamp).getTime(),
      num_cryptocurrencies: list.data.length,
      error: null,
      cacherTimestamp: new Date().getTime()
    }
  };
  for (let i in list.data) {
    const coin = list.data[i];
    coin.quotes = coin.quote;
    oldObj.data[coin.id] = coin;
  }
  return oldObj;
};
export default () => {
  return new Promise((resolve, reject) => {
    fetch(configs.COIN_MARKET_URL, {
      headers: {
        "Content-Type": "application/json",
        method: "GET",
        "X-CMC_PRO_API_KEY": `${configs.COIN_MARKET_KEY}`
      }
    })
      .then(res => res.json())
      .then(async json => {
        if (json.status.error_code !== 0)
          return reject(new Error(json.status.error_message));
        json = oldify(json);
        resolve(json);
      })
      .catch(reject);
  });
};
