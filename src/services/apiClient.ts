import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/ecommerce",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const emailId = localStorage.getItem("emailId");
  const password = localStorage.getItem("password");

  if (!emailId || !password) {
    localStorage.removeItem("emailId");
    localStorage.removeItem("password");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(new Error("Authentication required"));
  }

  config.headers.emailId = emailId;
  config.headers.password = password;
  config.headers["Content-Type"] = "application/json";

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("emailId");
      localStorage.removeItem("password");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
