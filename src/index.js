import api from "./api";
import { S3Store } from "./stores";
import { ticker, convert, meta } from "./methods";
const s3store = new S3Store(2 * 60 * 1000); // 2 mins
api.get("/", request => "MyEtherWallet CoinmarketCap cached API");
api.get("/convert/{symbol}", request => {
  return convert(request, s3store);
});
api.get("/meta", request => {
  return meta(request, s3store);
});
api.get("/ticker", request => {
  return ticker(request, s3store);
});
module.exports = api;
