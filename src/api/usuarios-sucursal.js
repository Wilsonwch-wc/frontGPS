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

// Funciones para manejar usuarios de sucursal
export const usuariosSucursalAPI = {
  // Obtener todos los usuarios de la sucursal
  getUsuariosSucursal: async (idSucursal) => {
    try {
      const response = await api.get(`/usuarios-sucursal?id_sucursal=${idSucursal}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios de sucursal:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  getUsuarioSucursalById: async (id) => {
    try {
      const response = await api.get(`/usuarios-sucursal/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario de sucursal:', error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUsuarioSucursal: async (usuarioData) => {
    try {
      const response = await api.post('/usuarios-sucursal', usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario de sucursal:', error);
      throw error;
    }
  },

  // Actualizar un usuario
  updateUsuarioSucursal: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuarios-sucursal/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario de sucursal:', error);
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUsuarioSucursal: async (id) => {
    try {
      const response = await api.delete(`/usuarios-sucursal/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario de sucursal:', error);
      throw error;
    }
  }
};

// Exportar funciones individuales para facilitar el uso
export const {
  getUsuariosSucursal,
  getUsuarioSucursalById,
  createUsuarioSucursal,
  updateUsuarioSucursal,
  deleteUsuarioSucursal
} = usuariosSucursalAPI;

export default usuariosSucursalAPI;