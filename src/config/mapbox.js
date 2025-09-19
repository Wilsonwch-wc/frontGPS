// Configuración de Mapbox
export const MAPBOX_CONFIG = {
  // Reemplaza 'YOUR_MAPBOX_ACCESS_TOKEN' con tu token real de Mapbox
  accessToken: import.meta.env.VITE_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example_token_here',
  
  // Estilos de mapa disponibles
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12'
  },
  
  // Configuración por defecto
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  defaultZoom: 16,
  defaultCenter: [-17.7833, -63.1821], // Santa Cruz, Bolivia
  
  // Configuración de controles
  controls: {
    navigation: true,
    geolocate: true,
    fullscreen: true,
    scale: true
  },
  
  // Configuración de geolocalización
  geolocateOptions: {
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    },
    trackUserLocation: true,
    showUserHeading: true
  }
};

// Función para validar el token de Mapbox
export const validateMapboxToken = (token) => {
  if (!token || token === 'YOUR_MAPBOX_ACCESS_TOKEN' || token.includes('example')) {
    return {
      valid: false,
      message: 'Token de Mapbox no configurado o inválido'
    };
  }
  
  if (!token.startsWith('pk.')) {
    return {
      valid: false,
      message: 'Token de Mapbox debe comenzar con "pk."'
    };
  }
  
  return {
    valid: true,
    message: 'Token de Mapbox válido'
  };
};