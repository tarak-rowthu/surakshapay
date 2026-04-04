import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 0;
    }
    if (config.retry < 1 && error.message === 'Network Error') {
      config.retry += 1;
      console.log('Retrying request due to Network Error...');
      return new Promise((resolve) => setTimeout(() => resolve(api(config)), 1000));
    }
    return Promise.reject(error);
  }
);

export default api;
