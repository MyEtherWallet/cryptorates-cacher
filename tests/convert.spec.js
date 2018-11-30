import { MemStore } from "../src/stores";
import convert from "../src/methods/convert";
const memstore = new MemStore(5 * 1000);
test("Convert currency data", async done => {
  expect.assertions(2);
  convert({ pathParams: { symbol: "ETH" } }, memstore)
    .then(response => {
      const result = response.response;
      expect(result.BTC).not.toBe(null);
      expect(result.LTC).toBeGreaterThan(0);
      done();
    })
    .catch(console.log);
});
