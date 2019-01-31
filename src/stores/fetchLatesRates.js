import fetch from "node-fetch";
import configs from "../configs";
const formatter = list => {
  const newList = list.map(item => {
    item.symbol = item.symbol.toUpperCase();
    item.quotes = {
      USD: {
        price: item.current_price,
        market_cap: item.market_cap,
        last_updated: item.last_updated,
        total_volume: item.total_volume,
        percent_change_24h: item.price_change_percentage_24h,
        price_change_24h: item.price_change_24h
      }
    };
    const keepList = [
      "id",
      "symbol",
      "name",
      "market_cap_rank",
      "circulating_supply",
      "total_supply",
      "last_updated",
      "quotes"
    ];
    for (const key in item) if (keepList.indexOf(key) < 0) delete item[key];
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
