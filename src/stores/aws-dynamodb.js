import AWS from "aws-sdk";
import configs from "../configs";
import fetchLatest from "./fetchLatesRates";
const dbClient = new AWS.DynamoDB.DocumentClient({
  region: configs.AWS_REGION
});

const writeParams = {
  Item: {
    key: "CACHE"
  },
  TableName: configs.DYNAMO_TABLE_NAME
};
const readParams = {
  TableName: configs.DYNAMO_TABLE_NAME,
  Key: {
    key: "CACHE"
  }
};

class DynamoStore {
  constructor(updateInterval) {
    this.updateInterval = updateInterval;
    this.store = {};
  }
  set(store) {
    const _store = {
      timestamp: new Date().getTime(),
      data: JSON.stringify(store)
    };
    return new Promise((resolve, reject) => {
      writeParams.Item.value = _store;
      dbClient.put(writeParams, err => {
        if (err) reject(err);
        this.store = {
          timestamp: _store.timestamp,
          data: store
        };
        resolve();
      });
    });
  }
  get() {
    if (
      this.store.timestamp &&
      new Date().getTime() < this.store.timestamp + this.updateInterval
    )
      return Promise.resolve(this.store.data);
    else
      return new Promise((resolve, reject) => {
        dbClient.get(readParams, (err, data) => {
          if (err) reject(err);
          else if (Object.keys(data).length !== 0)
            this.store = {
              timestamp: data.Item.value.timestamp,
              data: JSON.parse(data.Item.value.data)
            };
          if (
            this.store.timestamp &&
            new Date().getTime() < this.store.timestamp + this.updateInterval
          )
            resolve(this.store.data);
          else {
            fetchLatest()
              .then(data => {
                this.set(data).then(() => {
                  resolve(data);
                });
              })
              .catch(reject);
          }
        });
      });
  }
}
export default DynamoStore;
