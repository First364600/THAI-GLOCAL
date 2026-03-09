import axios from 'axios';

// Create a globally configured Axios instance
export const apiClient = axios.create({
  // BaseURL is / to allow /api and /client to properly process
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to easily extract data or catch format errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default apiClient;
