import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("REQUEST TOKEN:", token)
  if (!token) return config;

  if (config.method?.toLowerCase() === "get") {
    config.params = {
      ...(config.params || {}),
      token,
    };
  } else {
    config.data = {
      ...(config.data || {}),
      token,
    };
  }

  return config;
});

export default api;