import { MemStore } from "../src/stores";
import meta from "../src/methods/meta";
const memstore = new MemStore(2 * 1000);
let timestamp = null;
test("Get Meta", async done => {
  expect.assertions(2);
  meta({}, memstore)
    .then(response => {
      const result = response.response;
      expect(result.error).toBe(null);
      expect(result.num_cryptocurrencies).toBeGreaterThan(2000);
      timestamp = result.cacherTimestamp;
      done();
    })
    .catch(console.log);
});
test("Check caching", async done => {
  expect.assertions(1);
  meta({}, memstore)
    .then(response => {
      const result = response.response;
      expect(result.cacherTimestamp).toBe(timestamp);
      setTimeout(done, 2000);
    })
    .catch(console.log);
});
test("Check caching, should be new", async done => {
  expect.assertions(1);
  meta({}, memstore)
    .then(response => {
      const result = response.response;
      expect(result.cacherTimestamp).not.toBe(timestamp);
      done();
    })
    .catch(console.log);
});
