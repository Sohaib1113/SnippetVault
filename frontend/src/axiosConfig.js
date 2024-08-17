import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Base URL from environment variable or default to localhost
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a timeout of 10 seconds for requests
});

// Optional: Add a request interceptor to include the auth token if needed
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
