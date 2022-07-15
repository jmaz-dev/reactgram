import { api, requestConfig } from "../utils/config";

// Register a user
const register = async (data) => {
  const config = requestConfig("POST", data);

  // Backend "endpoints"
  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    //Only locally store user's with uniq Id and get token
    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Sign in a user
const login = async (data) => {
  const config = requestConfig("POST", data);
  // Backend "endpoints"
  try {
    const res = await fetch(api + "/users/login", config)
      .then((res) => res.json())
      .catch((err) => err);

    //Only locally store user's with uniq Id
    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Logout a user cleaning localStorage and disallow the auth
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
