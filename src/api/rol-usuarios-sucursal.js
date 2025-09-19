import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API_URL = API_BASE_URL;

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('sucursal_token');
      localStorage.removeItem('sucursal_user');
      window.location.href = '/sucursal/login';
    }
    return Promise.reject(error);
  }
);

// Funciones para manejar roles de usuarios de sucursal
export const rolUsuariosSucursalAPI = {
  // Obtener todos los roles de la sucursal
  getRolesUsuariosSucursal: async (idSucursal) => {
    try {
      const response = await api.get(`/rol-usuarios-sucursal?id_sucursal=${idSucursal}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles de usuarios de sucursal:', error);
      throw error;
    }
  },

  // Obtener un rol específico por ID
  getRolUsuarioSucursalById: async (id) => {
    try {
      const response = await api.get(`/rol-usuarios-sucursal/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener rol de usuario de sucursal:', error);
      throw error;
    }
  },

  // Crear un nuevo rol
  createRolUsuarioSucursal: async (rolData) => {
    try {
      const response = await api.post('/rol-usuarios-sucursal', rolData);
      return response.data;
    } catch (error) {
      console.error('Error al crear rol de usuario de sucursal:', error);
      throw error;
    }
  },

  // Actualizar un rol existente
  updateRolUsuarioSucursal: async (id, rolData) => {
    try {
      const response = await api.put(`/rol-usuarios-sucursal/${id}`, rolData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar rol de usuario de sucursal:', error);
      throw error;
    }
  },

  // Eliminar un rol (soft delete)
  deleteRolUsuarioSucursal: async (id) => {
    try {
      const response = await api.delete(`/rol-usuarios-sucursal/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar rol de usuario de sucursal:', error);
      throw error;
    }
  }
};

// Exportar funciones individuales para compatibilidad
export const {
  getRolesUsuariosSucursal,
  getRolUsuarioSucursalById,
  createRolUsuarioSucursal,
  updateRolUsuarioSucursal,
  deleteRolUsuarioSucursal
} = rolUsuariosSucursalAPI;

export default rolUsuariosSucursalAPI;