import api from "./api";

let success = result => {
  return new api.ApiResponse(
    result,
    {
      contentType: "application/json"
    },
    200
  );
};
let error = msg => {
  return new api.ApiResponse(
    { error: true, message: msg },
    { contentType: "application/json" },
    403
  );
};

export { success, error };
