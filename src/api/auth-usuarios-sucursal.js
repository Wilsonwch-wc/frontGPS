import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Crear instancia de axios para usuarios de sucursal
const apiUsuarioSucursal = axios.create({
  baseURL: `${API_BASE_URL}/auth-usuarios-sucursal`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
apiUsuarioSucursal.interceptors.request.use(
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
apiUsuarioSucursal.interceptors.response.use(
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

// Función de login
export const loginUsuarioSucursal = async (usuario, password) => {
  try {
    const response = await apiUsuarioSucursal.post('/login', {
      usuario,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener perfil
export const getProfileUsuarioSucursal = async () => {
  try {
    const response = await apiUsuarioSucursal.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función de logout
export const logoutUsuarioSucursal = async () => {
  try {
    const response = await apiUsuarioSucursal.post('/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener sucursales disponibles para login
export const getSucursalesParaLogin = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sucursales`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

export default apiUsuarioSucursal;