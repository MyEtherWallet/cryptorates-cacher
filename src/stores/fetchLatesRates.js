import fetch from "node-fetch";
import configs from "../configs";
const formatter = list => {
  const newList = list.map(item => {
    delete item["image"];
    delete item["roi"];
    item.symbol = item.symbol.toUpperCase();
    return item;
  });
  const newObj = {};
  newList.forEach(item => {
    newObj[item.symbol] = item;
  });
  return {
    data: newObj,
    metadata: {
      timestamp: new Date(newList[0].last_updated).getTime(),
      num_cryptocurrencies: newList.length,
      error: null,
      cacherTimestamp: new Date().getTime()
    }
  };
};
export default () => {
  return new Promise((resolve, reject) => {
    fetch(configs.COIN_GECKO_URL, {
      headers: {
        "Content-Type": "application/json",
        method: "GET"
      }
    })
      .then(res => res.json())
      .then(async json => {
        json = formatter(json);
        resolve(json);
      })
      .catch(reject);
  });
};
