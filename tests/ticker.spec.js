import { MemStore } from "../src/stores";
import ticker from "../src/methods/ticker";
const memstore = new MemStore(5 * 1000);
test("Get Ticker data", async done => {
  expect.assertions(2);
  ticker({ queryString: {} }, memstore)
    .then(response => {
      const result = response.response;
      expect(result.data).not.toBe(null);
      expect(result.data["ETH"].name).toBe("Ethereum");
      done();
    })
    .catch(console.log);
});
test("Get Ticker data, filter", async done => {
  expect.assertions(5);
  ticker({ queryString: { filter: "BTC,ETH,REP" } }, memstore)
    .then(response => {
      const result = response.response;
      expect(result.data).not.toBe(undefined);
      expect(result.data.ETH.name).toBe("Ethereum");
      expect(result.data.BTC.name).toBe("Bitcoin");
      expect(result.data.REP.name).toBe("Augur");
      expect(result.data.BCH).toBe(undefined);
      done();
    })
    .catch(console.log);
});
test("Get Ticker data, filter strict fail", async done => {
  expect.assertions(1);
  ticker({ queryString: { filter: "BTC,ETH,REP,MEW", strict: true } }, memstore)
    .then(response => {
      const result = response.response;
      expect(result.error).toBe(true);
      done();
    })
    .catch(console.log);
});
