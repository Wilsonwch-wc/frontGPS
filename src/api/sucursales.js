import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API_URL = API_BASE_URL;

// Configurar axios para incluir el token automáticamente
const api = axios.create({
  baseURL: `${API_URL}/sucursales`
});

// Interceptor para agregar el token a todas las peticiones
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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Obtener todas las sucursales
export const getSucursales = async () => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    throw error;
  }
};

// Obtener sucursales activas
export const getSucursalesActivas = async () => {
  try {
    const response = await api.get('activas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener sucursales activas:', error);
    throw error;
  }
};

// Obtener sucursal por ID
export const getSucursalById = async (id) => {
  try {
    const response = await api.get(`${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener sucursal:', error);
    throw error;
  }
};

// Crear nueva sucursal
export const createSucursal = async (sucursalData) => {
  try {
    const response = await api.post('', sucursalData);
    return response.data;
  } catch (error) {
    console.error('Error al crear sucursal:', error);
    throw error;
  }
};

// Actualizar sucursal
export const updateSucursal = async (id, sucursalData) => {
  try {
    const response = await api.put(`${id}`, sucursalData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar sucursal:', error);
    throw error;
  }
};

// Eliminar sucursal
export const deleteSucursal = async (id) => {
  try {
    const response = await api.delete(`${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar sucursal:', error);
    throw error;
  }
};

// Exportar la instancia de axios configurada para uso directo si es necesario
export default api;