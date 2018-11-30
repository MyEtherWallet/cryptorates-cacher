import fetchLatest from "./fetchLatesRates";
class MemStore {
  constructor(updateInterval) {
    this.updateInterval = updateInterval;
    this.store = {};
  }
  set(store) {
    this.store = { timestamp: new Date().getTime(), data: store };
    return Promise.resolve();
  }
  get() {
    if (
      this.store.timestamp &&
      new Date().getTime() < this.store.timestamp + this.updateInterval
    )
      return Promise.resolve(this.store.data);
    else
      return new Promise((resolve, reject) => {
        fetchLatest()
          .then(data => {
            this.set(data).then(() => {
              resolve(data);
            });
          })
          .catch(reject);
      });
  }
}
export default MemStore;
