var express = require("express");
const getPort = require("get-port");
const fetch = require("node-fetch");
const cors = require("cors");
var app = express();

app.use(cors());

var cache = {};
var gPairs = {};
var conversionCache = {};
const COIN_MARKET_URL = "https://api.coinmarketcap.com/v2/ticker/";
setInterval(() => {
  fetch(COIN_MARKET_URL)
    .then(res => res.json())
    .then(json => {
      cache = json;
      let prices = cache["data"];
      for (let price in prices) gPairs[prices[price].symbol] = prices[price];
    });
}, 5000);

app.get("/convert/:id", async function(req, res) {
  try {
    const id = req.params.id ? req.params.id : 1027;
    if (conversionCache.hasOwnProperty("lastCalled")) {
      const lastFetch = Math.round((new Date().getTime() - conversionCache.lastCalled) / 1000) / 60; // Get minutes
      if (lastFetch < 20) {
        res.json(conversionCache);
        return;
      } else {
        await conversionResBuild(id);
      }
    } else {
      await conversionResBuild(id);
    }
  } catch (e) {
    res.send(JSON.stringify({ error: true, message: e }, null, 3));
  }

  res.json(conversionCache);
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
  var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
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

let conversionResBuild = async function(id) {
  const supported = ["BTC", "REP", "CHF", "USD", "EUR", "GBP"];
  for (const curr of supported) {
    const price = await fetch(`${COIN_MARKET_URL}${id}/?convert=${curr}`);
    const parsedPrice = await price.json();
    conversionCache[curr] = parsedPrice.data.quotes[curr].price;
  }
  conversionCache["lastCalled"] = new Date().getTime();
};
