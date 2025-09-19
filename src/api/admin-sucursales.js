import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

// Configuración de la API
const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token de autenticación
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

// Funciones de la API
export const getAdminSucursales = async () => {
  try {
    const response = await api.get('/admin-sucursales');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching admin sucursales:', error);
    throw error;
  }
};

export const getAdminSucursalById = async (id) => {
  try {
    const response = await api.get(`/admin-sucursales/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching admin sucursal:', error);
    throw error;
  }
};

export const createAdminSucursal = async (adminData) => {
  try {
    const response = await api.post('/admin-sucursales', adminData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin sucursal:', error);
    throw error;
  }
};

export const updateAdminSucursal = async (id, adminData) => {
  try {
    const response = await api.put(`/admin-sucursales/${id}`, adminData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin sucursal:', error);
    throw error;
  }
};

export const deleteAdminSucursal = async (id) => {
  try {
    const response = await api.delete(`/admin-sucursales/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admin sucursal:', error);
    throw error;
  }
};

export const getAdminSucursalesActivos = async () => {
  try {
    const response = await api.get('/admin-sucursales/activos');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching active admin sucursales:', error);
    throw error;
  }
};

export const getAdminBySucursal = async (idSucursal) => {
  try {
    const response = await api.get(`/admin-sucursales/sucursal/${idSucursal}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching admin by sucursal:', error);
    throw error;
  }
};

export default api;