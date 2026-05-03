import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/ecommerce",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const emailId = localStorage.getItem("userEmail") || localStorage.getItem("emailId");
  const password = localStorage.getItem("userPassword") || localStorage.getItem("password");

  if (emailId) config.headers.emailId = emailId;
  if (password) config.headers.password = password;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("emailId");
      localStorage.removeItem("password");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPassword");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
