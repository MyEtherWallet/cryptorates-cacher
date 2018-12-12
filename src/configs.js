require("dotenv").config();
export default {
  FUNCTION_NAME: process.env.FUNCTION_NAME || "unknown",
  BUCKET_NAME: process.env.BUCKET_NAME || "unknown",
  COIN_MARKET_URL:
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=200",
  COIN_MARKET_KEY: process.env.COIN_MARKET_KEY || "",
  DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || "unknown",
  AWS_REGION: "us-east-1"
};
