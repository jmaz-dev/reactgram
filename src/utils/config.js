export const api = "http://localhost:5000/api";
export const uploads = "http://localhost:5000/uploads";

export const requestConfig = (method, data, token = null, image = null) => {
  let config;
  // Image request
  if (image) {
    config = {
      method: method,
      body: data,
      headers: {},
    };
    // Get with null data and delete requests
  } else if (method === "DELETE" || data === null) {
    config = {
      method: method,
      headers: {},
    };
    // Register requests need body inputs
  } else {
    config = {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
