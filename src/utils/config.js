import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL


export const api = apiUrl



// export const api = process.env.REACT_APP_API_URL //process.env.REACT_APP_API_UPLOADS
export const uploads = process.env.REACT_APP_API_UPLOADS

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
