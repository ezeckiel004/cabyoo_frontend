import axios from 'axios';

// Configuration de l'API
// baseURL: 'https://api.cabyoo.com/api',
//export const API_BASE_URL = 'https://api.cabyoo.com'; // Au lieu de 'http://localhost:8000'
// export const API_BASE_URL = 'http://localhost:8000'; 
export const API_BASE_URL = 'https://api.cabyoo.com'; 
export const API_URL = `${API_BASE_URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


 // baseURL: 'https://api.cabyoo.com/api',