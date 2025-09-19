import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Crear instancia de axios para control de asistencia
const apiControlAsistencia = axios.create({
  baseURL: `${API_BASE_URL}/control-asistencia-view`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
apiControlAsistencia.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_usuario_sucursal');
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
apiControlAsistencia.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token_usuario_sucursal');
      localStorage.removeItem('user_usuario_sucursal');
      window.location.href = '/us';
    }
    return Promise.reject(error);
  }
);

// Obtener todas las asignaciones del usuario
export const obtenerMisAsignaciones = async () => {
  try {
    const response = await apiControlAsistencia.get('/mis-asignaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    throw error;
  }
};

// Obtener asignaciones para hoy
export const obtenerAsignacionesHoy = async () => {
  try {
    const response = await apiControlAsistencia.get('/asignaciones-hoy');
    return response.data;
  } catch (error) {
    console.error('Error al obtener asignaciones de hoy:', error);
    throw error;
  }
};

// Verificar asignaciones pendientes
export const verificarAsignacionesPendientes = async () => {
  try {
    const response = await apiControlAsistencia.get('/pendientes');
    return response.data;
  } catch (error) {
    console.error('Error al verificar asignaciones pendientes:', error);
    throw error;
  }
};

export default apiControlAsistencia;