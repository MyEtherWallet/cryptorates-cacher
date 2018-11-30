import AWS from "aws-sdk";
import configs from "../configs";
import fetchLatest from "./fetchLatesRates";
const s3 = new AWS.S3();

const writeParams = {
  Bucket: configs.BUCKET_NAME,
  Key: configs.FUNCTION_NAME + "/data.json",
  ContentType: "application/json"
};
const readParams = {
  Bucket: configs.BUCKET_NAME,
  Key: configs.FUNCTION_NAME + "/data.json"
};

class S3Store {
  constructor(updateInterval) {
    this.updateInterval = updateInterval;
    this.store = {};
  }
  set(store) {
    const _store = {
      timestamp: new Date().getTime(),
      data: store
    };
    return new Promise((resolve, reject) => {
      writeParams.Body = JSON.stringify(_store);
      s3.upload(writeParams, err => {
        if (err) reject(err);
        this.store = _store;
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
        s3.getObject(readParams, (err, data) => {
          if (err && err.code != "NoSuchKey") reject(err);
          else if (!err) this.store = JSON.parse(data.Body.toString());
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
export default S3Store;
