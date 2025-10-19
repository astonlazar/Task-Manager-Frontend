

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // use this only if your backend uses cookies/auth
});

// ===== REQUEST INTERCEPTOR =====
// Attach token to every request if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or any state management (Redux/Context)
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Handle responses globally (e.g., refresh token, logout on 401)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // Example: Handle Unauthorized (401)
      if (error.response.status === 401) {
        // Optional: redirect to login or refresh token
        console.log("Unauthorized! Redirecting to login...");
        window.location.href = "/login";
      }

      // Example: Handle Forbidden (403)
      if (error.response.status === 403) {
        console.log("Access forbidden!");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
