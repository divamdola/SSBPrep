import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://ssbprep.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, //  Ensures cookies are sent
});

// Automatically attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); //  read freshly each time
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
