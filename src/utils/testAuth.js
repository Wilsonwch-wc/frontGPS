// Función de prueba para hacer login automático con credenciales por defecto
import { authAPI } from '../api/auth';

export const testLogin = async () => {
  try {
    const response = await authAPI.login('admin', '123456');
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, message: 'Login exitoso' };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Error en login: ' + error.message };
  }
};

// Función para verificar el estado actual de autenticación
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token en localStorage:', token ? 'Presente' : 'No encontrado');
  console.log('Usuario en localStorage:', user ? JSON.parse(user) : 'No encontrado');
  
  return {
    hasToken: !!token,
    hasUser: !!user,
    token,
    user: user ? JSON.parse(user) : null
  };
};