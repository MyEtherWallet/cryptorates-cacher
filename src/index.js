import api from "./api";
import { DynamoStore } from "./stores";
import { ticker, convert, meta } from "./methods";
const store = new DynamoStore(2 * 60 * 1000); // 2 mins
api.get("/", request => "MyEtherWallet CoinGecko cached API");
api.get("/convert/{symbol}", request => {
  return convert(request, store);
});
api.get("/meta", request => {
  return meta(request, store);
});
api.get("/ticker", request => {
  return ticker(request, store);
});
module.exports = api;
