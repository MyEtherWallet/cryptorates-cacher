require('dotenv').config();
const express = require("express");
const getPort = require("get-port");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(cors());

let cache = {};
let gPairs = {};
let conversionCache = {};
const COIN_MARKET_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
setInterval(() => {
  fetch(COIN_MARKET_URL, {
    headers: {
      'Content-Type': 'application/json',
      'method': 'GET',
      'X-CMC_PRO_API_KEY': `${process.env.COIN_MARKET_KEY}`
    }
  })
    .then(res => {
      const response = res.json();
      console.log(response)
      return response;
    })
    .then(json => {
      cache = json;
      console.log(json);
      let prices = cache["data"];
      for (let price in prices) gPairs[prices[price].symbol] = prices[price];
    }).catch(e => {
      console.log(e)
    });
}, 5000);

app.get("/convert/:symbol", async function(req, res) {
  const symbol = req.params.symbol ? req.params.symbol : 'ETH';
  try {
    if (conversionCache[symbol] && conversionCache[symbol].hasOwnProperty("lastCalled")) {
      const lastFetch = Math.round((new Date().getTime() - conversionCache[symbol].lastCalled) / 1000) / 60; // Get minutes
      if (lastFetch < 20) {
        res.json(conversionCache[symbol]);
        return;
      } else {
        await conversionResBuild(symbol);
      }
    } else {
      await conversionResBuild(symbol);
    }
  } catch (e) {
    res.json({ error: true, message: e }, null, 3);
  }

  res.json(conversionCache[symbol]);
});

app.get("/ticker", async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  try {
    if (!req.query.filter) {
      res.send(JSON.stringify(cache, null, 3));
    } else {
      let pairs = req.query.filter.split(",");
      let valid = true;
      if (req.query.strict) {
        valid = await validatePairs(pairs);
      }
      if (valid) {
        let tCache = await processPairs(pairs);
        res.send(JSON.stringify(tCache, null, 3));
      } else {
        res.send(
          JSON.stringify(
            {
              error: true,
              message: "invalid pairs"
            },
            null,
            3
          )
        );
      }
    }
  } catch (e) {
    res.send(
      JSON.stringify(
        {
          error: true,
          message: e
        },
        null,
        3
      )
    );
  }
});

app.get("/meta", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(cache.metadata, null, 3));
});

getPort({
  port: process.env.PORT || 8081
}).then(port => {
  const server = app.listen(port, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Server running and listening at http://%s:%s", host, port);
  });
});

let processPairs = function(pairs) {
  return new Promise((resolve, reject) => {
    try {
      let tCache = Object.assign({}, cache);
      tCache.data = {};
      pairs.forEach(_pair => {
        if (typeof gPairs[_pair] !== "undefined") {
          tCache.data[_pair] = gPairs[_pair];
        }
      });
      resolve(tCache);
    } catch (e) {
      reject(e);
    }
  });
};

let validatePairs = function(pairs) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < pairs.length; i++) {
      if (typeof gPairs[pairs[i]] === "undefined") reject("invalid pairs");
    }
    resolve(pairs);
  });
};

let conversionResBuild = async function(symbol) {
  conversionCache[symbol] = {};
  const supported = ["BTC", "REP", "CHF", "USD", "EUR", "GBP"];
  for (const curr of supported) {
    const price = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${curr}`, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'GET',
        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_KEY
      }
    })
    const parsedPrice = await price.json();
    conversionCache[symbol][curr] = parsedPrice.data.quotes[curr].price;
  }
  conversionCache[symbol]["lastCalled"] = new Date().getTime();
};
