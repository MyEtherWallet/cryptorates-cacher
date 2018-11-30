import { success, error } from "../response";
export default (request, store) => {
  return new Promise(resolve => {
    store
      .get()
      .then(data => {
        resolve(success(data.metadata));
      })
      .catch(err => {
        resolve(error(err.message));
      });
  });
};
