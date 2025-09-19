// Configuración dinámica de API basada en el entorno
const getApiBaseUrl = () => {
  // Si hay una variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    // Si es una URL relativa, construir la URL completa
    if (import.meta.env.VITE_API_URL.startsWith('/')) {
      const protocol = window.location.protocol;
      const host = window.location.hostname;
      return `${protocol}//${host}${import.meta.env.VITE_API_URL}`;
    }
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback: construir dinámicamente basado en el host actual
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  
  // Para desarrollo local, usar puerto 3002
  if (host === 'localhost' || host === '127.0.0.1') {
    return `${protocol}//${host}:3002/api`;
  }
  
  // Para producción, usar sin puerto específico
  return `${protocol}//${host}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
export const AUTH_SUCURSALES_URL = `${API_BASE_URL}/auth-sucursales`;

export default {
  API_BASE_URL,
  AUTH_SUCURSALES_URL
};