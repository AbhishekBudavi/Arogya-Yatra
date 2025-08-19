import axios from "axios";

// Create an Axios instance for your API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for auth
});

// Request interceptor: attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    // Use custom token if provided, otherwise fallback to default token from localStorage
    const token = config.headers._useToken || localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Remove the custom property before sending the request
    delete config.headers._useToken;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirect to login.");
      // Optional: redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Helper wrapper for GET requests
 * Example: api.getRequest('/patients')
 */
const getRequest = async (url, config = {}) => {
  return api.get(url, config);
};

/**
 * Helper wrapper for POST requests
 * Example: api.postRequest('/patient/select-profile', { patient_id: 1 })
 */
const postRequest = async (url, data, config = {}) => {
  return api.post(url, data, config);
};

// Export both axios instance and helpers
export default {
  api,          // full axios instance if needed
  get: getRequest,
  post: postRequest,
};
