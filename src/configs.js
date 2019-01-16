require("dotenv").config();
export default {
  FUNCTION_NAME: process.env.FUNCTION_NAME || "unknown",
  BUCKET_NAME: process.env.BUCKET_NAME || "unknown",
  COIN_GECKO_URL:
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=200&order=market_cap_desc",
  DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || "unknown",
  AWS_REGION: "us-east-1"
};
