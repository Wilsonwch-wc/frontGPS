// Configuración de Google Maps
const GOOGLE_MAPS_CONFIG = {
  // Clave de API desde variables de entorno
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  
  // Librerías necesarias
  libraries: ['geometry'],
  
  // Configuración del mapa por defecto
  defaultMapOptions: {
    zoom: 17,
    mapTypeId: 'hybrid',
    gestureHandling: 'cooperative',
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true
  },
  
  // Configuración de geolocalización
  geolocationOptions: {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 30000
  },
  
  // Estilos de marcadores
  markerStyles: {
    target: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#f44336" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    },
    user: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#2196f3" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    }
  },
  
  // Estilos de círculos
  circleStyles: {
    allowed: {
      strokeColor: '#4caf50',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4caf50',
      fillOpacity: 0.2
    },
    restricted: {
      strokeColor: '#f44336',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#f44336',
      fillOpacity: 0.2
    }
  }
};

// Función para cargar Google Maps API dinámicamente
export const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    // Si ya está cargado, resolver inmediatamente
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    
    // Si ya hay un script cargándose, esperar
    if (window.googleMapsLoading) {
      window.googleMapsLoading.then(resolve).catch(reject);
      return;
    }
    
    // Crear promesa global para evitar múltiples cargas
    window.googleMapsLoading = new Promise((resolveLoading, rejectLoading) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google && window.google.maps) {
          resolveLoading(window.google.maps);
        } else {
          rejectLoading(new Error('Google Maps API no se cargó correctamente'));
        }
      };
      
      script.onerror = () => {
        rejectLoading(new Error('Error al cargar Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
    
    window.googleMapsLoading.then(resolve).catch(reject);
  });
};

// Función para verificar si Google Maps está disponible
export const isGoogleMapsAvailable = () => {
  return !!(window.google && window.google.maps);
};

// Función para verificar si la API key es válida
export const isValidApiKey = () => {
  return GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY';
};

export default GOOGLE_MAPS_CONFIG;