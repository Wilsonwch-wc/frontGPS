import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Configuración base de la API

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
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

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authAPI = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post('/usuarios/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error en authAPI.login:', error);
      throw error;
    }
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/usuarios/profile');
    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;