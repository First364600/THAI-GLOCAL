import axios from 'axios';

// Create a globally configured Axios instance
export const apiClient = axios.create({
  // BaseURL is / to allow /api and /client to properly process
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: extract data on success, handle 401 globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear persisted auth state and redirect to login
      localStorage.removeItem('tg_auth');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
