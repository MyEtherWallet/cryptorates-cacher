require("dotenv").config();
export default {
  FUNCTION_NAME: process.env.FUNCTION_NAME || "unknown",
  BUCKET_NAME: process.env.BUCKET_NAME || "unknown",
  COIN_MARKET_URL: "https://api.coinmarketcap.com/v2/ticker/",
  DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || "unknown",
  AWS_REGION: "us-east-1"
};
