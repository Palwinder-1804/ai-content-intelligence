import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

// Add request interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default API;
