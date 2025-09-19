import { API_BASE_URL } from '../config/api';
import axios from 'axios';

// Crear instancia de axios para confirmación de asistencia
const api = axios.create({
  baseURL: `${API_BASE_URL}/confirmacion-asistencia`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
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
api.interceptors.response.use(
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

/**
 * Servicio para manejar la confirmación de asistencia
 */
class ConfirmacionAsistenciaService {
  /**
   * Obtener las asignaciones del día actual para el usuario
   * @returns {Promise<Object>} Respuesta con las asignaciones del día
   */
  static async obtenerAsignacionesHoy() {
    try {
      const response = await api.get('/hoy');
      return response.data;
    } catch (error) {
      console.error('Error al obtener asignaciones del día:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Registrar confirmación de asistencia
   * @param {Object} datos - Datos de la confirmación
   * @param {number} datos.asignacion_id - ID de la asignación
   * @param {number} datos.latitud - Latitud actual del usuario
   * @param {number} datos.longitud - Longitud actual del usuario
   * @param {string} [datos.observaciones] - Observaciones opcionales
   * @returns {Promise<Object>} Respuesta con el resultado de la confirmación
   */
  static async confirmarAsistencia(datos) {
    try {
      const response = await api.post('/confirmar', datos);
      return response.data;
    } catch (error) {
      console.error('Error al confirmar asistencia:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtener historial de confirmaciones del usuario
   * @param {Object} filtros - Filtros para el historial
   * @param {string} [filtros.fecha_inicio] - Fecha de inicio (YYYY-MM-DD)
   * @param {string} [filtros.fecha_fin] - Fecha de fin (YYYY-MM-DD)
   * @param {number} [filtros.limite] - Límite de resultados
   * @returns {Promise<Object>} Respuesta con el historial
   */
  static async obtenerHistorial(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros.limite) params.append('limite', filtros.limite.toString());

      const url = `/historial${params.toString() ? '?' + params.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtener información del sistema de confirmación
   * @returns {Promise<Object>} Información del sistema
   */
  static async obtenerInfo() {
    try {
      const response = await api.get('/info');
      return response.data;
    } catch (error) {
      console.error('Error al obtener información del sistema:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtener ubicación actual del usuario usando la API de geolocalización
   * @param {Object} opciones - Opciones de geolocalización
   * @returns {Promise<Object>} Coordenadas del usuario
   */
  static async obtenerUbicacionActual(opciones = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por este navegador'));
        return;
      }

      const opcionesDefault = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...opciones
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            precision: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let mensaje = 'Error al obtener ubicación';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              mensaje = 'Permiso de ubicación denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              mensaje = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              mensaje = 'Tiempo de espera agotado para obtener ubicación';
              break;
          }
          reject(new Error(mensaje));
        },
        opcionesDefault
      );
    });
  }

  /**
   * Calcular distancia entre dos puntos GPS (en metros)
   * @param {number} lat1 - Latitud del primer punto
   * @param {number} lon1 - Longitud del primer punto
   * @param {number} lat2 - Latitud del segundo punto
   * @param {number} lon2 - Longitud del segundo punto
   * @returns {number} Distancia en metros
   */
  static calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Verificar si el usuario está dentro del rango de una ubicación
   * @param {Object} ubicacionUsuario - Ubicación actual del usuario
   * @param {Object} ubicacionObjetivo - Ubicación objetivo
   * @param {number} radioPermitido - Radio permitido en metros
   * @returns {Object} Resultado de la verificación
   */
  static verificarRango(ubicacionUsuario, ubicacionObjetivo, radioPermitido) {
    const distancia = this.calcularDistancia(
      ubicacionUsuario.latitud,
      ubicacionUsuario.longitud,
      ubicacionObjetivo.latitud,
      ubicacionObjetivo.longitud
    );

    return {
      distancia: Math.round(distancia),
      dentroRango: distancia <= radioPermitido,
      radioPermitido,
      diferencia: Math.round(distancia - radioPermitido)
    };
  }

  /**
   * Formatear tiempo para mostrar en la interfaz
   * @param {string} tiempo - Tiempo en formato HH:MM:SS
   * @returns {string} Tiempo formateado
   */
  static formatearTiempo(tiempo) {
    if (!tiempo) return '';
    return tiempo.substring(0, 5); // HH:MM
  }

  /**
   * Formatear fecha para mostrar en la interfaz
   * @param {string} fecha - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  static formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Obtener el estado de una asignación con colores para la UI
   * @param {string} estado - Estado de la asignación
   * @returns {Object} Configuración del estado
   */
  static obtenerConfigEstado(estado) {
    const configuraciones = {
      'pendiente': {
        color: 'gray',
        icono: '⏳',
        texto: 'Pendiente',
        descripcion: 'Aún no es hora de confirmar'
      },
      'disponible_confirmacion': {
        color: 'blue',
        icono: '📍',
        texto: 'Disponible',
        descripcion: 'Puedes confirmar tu asistencia'
      },
      'confirmado': {
        color: 'green',
        icono: '✅',
        texto: 'Confirmado',
        descripcion: 'Asistencia confirmada correctamente'
      },
      'confirmado_fuera_rango': {
        color: 'orange',
        icono: '⚠️',
        texto: 'Fuera de rango',
        descripcion: 'Confirmado pero fuera del área permitida'
      },
      'perdido': {
        color: 'red',
        icono: '❌',
        texto: 'Perdido',
        descripcion: 'No se confirmó en el tiempo permitido'
      }
    };

    return configuraciones[estado] || configuraciones['pendiente'];
  }

  /**
   * Manejar errores de las peticiones
   * @param {Error} error - Error de la petición
   * @returns {Error} Error procesado
   */
  static handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const mensaje = error.response.data?.message || 'Error del servidor';
      return new Error(mensaje);
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error de configuración
      return new Error(error.message || 'Error desconocido');
    }
  }
}

export default ConfirmacionAsistenciaService;