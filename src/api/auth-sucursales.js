import axios from 'axios';
import { AUTH_SUCURSALES_URL } from '../config/api.js';

// Configurar la instancia de axios
const api = axios.create({
  baseURL: AUTH_SUCURSALES_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sucursal_token');
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
      // Token expirado o inválido
      localStorage.removeItem('sucursal_token');
      localStorage.removeItem('sucursal_admin');
      window.location.href = '/index';
    }
    return Promise.reject(error);
  }
);

// Función de login para administradores de sucursales
export const loginAdminSucursal = async (usuario, password) => {
  try {
    const response = await api.post('/login', {
      usuario,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error de conexión' };
  }
};

// Función para obtener el perfil del administrador
export const getProfileAdminSucursal = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error de conexión' };
  }
};

// Función de logout
export const logoutAdminSucursal = () => {
  localStorage.removeItem('sucursal_token');
  localStorage.removeItem('sucursal_admin');
};

// Función para verificar si está autenticado
export const isAuthenticatedAdminSucursal = () => {
  const token = localStorage.getItem('sucursal_token');
  const admin = localStorage.getItem('sucursal_admin');
  return !!(token && admin);
};

// Función para obtener los datos del admin desde localStorage
export const getAdminSucursalData = () => {
  const adminData = localStorage.getItem('sucursal_admin');
  return adminData ? JSON.parse(adminData) : null;
};

export default {
  loginAdminSucursal,
  getProfileAdminSucursal,
  logoutAdminSucursal,
  isAuthenticatedAdminSucursal,
  getAdminSucursalData
};