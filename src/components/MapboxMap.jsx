import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Map, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Alert, Typography, Chip, Tooltip, IconButton, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SettingsIcon from '@mui/icons-material/Settings';
import { MAPBOX_CONFIG, validateMapboxToken } from '../config/mapbox';

const MapboxMap = ({ 
  latitude = -12.0464, 
  longitude = -77.0428, 
  zoom = 16,
  address = '',
  onLocationUpdate = null,
  style = 'streets'
}) => {
  const [viewState, setViewState] = useState({
    longitude: longitude,
    latitude: latitude,
    zoom: zoom
  });
  
  const [mapError, setMapError] = useState(null);
  const [geolocateError, setGeolocateError] = useState(null);
  const [permissionState, setPermissionState] = useState('unknown');
  const mapRef = useRef();
  const geolocateRef = useRef();
  
  // Validar token de Mapbox
  const tokenValidation = validateMapboxToken(MAPBOX_CONFIG.accessToken);
  
  // Verificar permisos de geolocalización al montar el componente
  useEffect(() => {
    const checkGeolocationPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionState(permission.state);
          
          // Escuchar cambios en los permisos
          permission.addEventListener('change', () => {
            setPermissionState(permission.state);
            if (permission.state === 'granted') {
              setGeolocateError(null);
            }
          });
        } catch (error) {
          console.error('Error checking geolocation permission:', error);
        }
      }
    };
    
    checkGeolocationPermission();
  }, []);
  
  const handleViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);
  
  // Función para solicitar permisos explícitamente
  const requestLocationPermission = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }
      
      // Solicitar ubicación para activar el modal de permisos
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissionState('granted');
          setGeolocateError(null);
          resolve(position);
        },
        (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setPermissionState('denied');
              setGeolocateError('Permisos de ubicación denegados. Haz clic en el ícono de candado en la barra de direcciones y permite el acceso a ubicación.');
              break;
            case error.POSITION_UNAVAILABLE:
              setPermissionState('unavailable');
              setGeolocateError('Ubicación no disponible. Intenta moverte al aire libre.');
              break;
            case error.TIMEOUT:
              setPermissionState('timeout');
              setGeolocateError('Tiempo de espera agotado. Intenta nuevamente.');
              break;
            default:
              setPermissionState('error');
              setGeolocateError('Error desconocido al obtener ubicación.');
          }
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }, []);
  
  const handleGeolocate = useCallback((e) => {
    setGeolocateError(null);
    setPermissionState('granted');
    if (onLocationUpdate) {
      onLocationUpdate({
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
        accuracy: e.coords.accuracy
      });
    }
  }, [onLocationUpdate]);
  
  const handleGeolocateError = useCallback((error) => {
    console.error('Geolocate error:', error);
    let errorMessage = 'Error al obtener ubicación';
    
    switch(error.code) {
      case 1: // PERMISSION_DENIED
        errorMessage = 'Permisos de ubicación denegados. Haz clic en el ícono de candado en la barra de direcciones y permite el acceso a ubicación.';
        setPermissionState('denied');
        break;
      case 2: // POSITION_UNAVAILABLE
        errorMessage = 'Ubicación no disponible. Intenta moverte al aire libre.';
        setPermissionState('unavailable');
        break;
      case 3: // TIMEOUT
        errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.';
        setPermissionState('timeout');
        break;
      default:
        errorMessage = 'Error desconocido al obtener ubicación.';
        setPermissionState('error');
    }
    
    setGeolocateError(errorMessage);
  }, []);
  
  const handleMapError = useCallback((error) => {
    console.error('Mapbox error:', error);
    setMapError(error.message || 'Error al cargar el mapa');
  }, []);
  
  // Si el token no es válido, mostrar mensaje de error
  if (!tokenValidation.valid) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
          position: 'relative'
        }}
      >
        <LocationOnIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
        
        <Alert severity="warning" sx={{ mb: 2, maxWidth: '80%' }}>
          <Typography variant="h6" gutterBottom>
            Mapbox HD - Token requerido
          </Typography>
          <Typography variant="body2">
            {tokenValidation.message}
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Ubicación actual: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          {address && (
            <><br />Dirección: {address}</>
          )}
        </Typography>

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Chip 
            label="Mapbox HD" 
            color="primary" 
            size="small"
            sx={{ backgroundColor: '#1976d2' }}
          />
        </Box>
      </Box>
    );
  }
  
  // Si hay error en el mapa, mostrar mensaje
  if (mapError) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: '#f5f5f5'
        }}
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: '80%' }}>
          <Typography variant="h6" gutterBottom>
            Error de Mapbox
          </Typography>
          <Typography variant="body2">
            {mapError}
          </Typography>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleViewStateChange}
        mapboxAccessToken={MAPBOX_CONFIG.accessToken}
        mapStyle={MAPBOX_CONFIG.styles[style] || MAPBOX_CONFIG.defaultStyle}
        onError={handleMapError}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Marcador de ubicación */}
        <Marker
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
        >
          <LocationOnIcon 
            sx={{ 
              fontSize: 32, 
              color: '#1976d2',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </Marker>
        
        {/* Controles de navegación */}
        <NavigationControl position="top-right" />
        
        {/* Control de geolocalización */}
        <GeolocateControl
          ref={geolocateRef}
          position="top-right"
          positionOptions={MAPBOX_CONFIG.geolocateOptions.positionOptions}
          trackUserLocation={MAPBOX_CONFIG.geolocateOptions.trackUserLocation}
          showUserHeading={MAPBOX_CONFIG.geolocateOptions.showUserHeading}
          onGeolocate={handleGeolocate}
          onError={handleGeolocateError}
          onTrackUserLocationStart={() => {
            // Solicitar permisos cuando el usuario hace clic en el botón
            if (permissionState === 'prompt' || permissionState === 'denied') {
              requestLocationPermission().catch(() => {
                // Error ya manejado en requestLocationPermission
              });
            }
          }}
        />
        
        {/* Control de pantalla completa */}
        <FullscreenControl position="top-right" />
        
        {/* Control de escala */}
        <ScaleControl position="bottom-left" />
      </Map>
      
      {/* Chip indicador */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1
        }}
      >
        <Chip 
          label="Mapbox HD" 
          color="primary" 
          size="small"
          sx={{ backgroundColor: '#1976d2' }}
        />
      </Box>
      
      {/* Indicador de estado de permisos de ubicación */}
       {permissionState !== 'unknown' && (
         <Tooltip 
           title={
             permissionState === 'granted' ? 'Permisos de ubicación concedidos' :
             permissionState === 'denied' ? 'Permisos de ubicación denegados - Haz clic en el candado para habilitar' :
             permissionState === 'prompt' ? 'Se solicitarán permisos de ubicación al usar GPS' :
             'Estado de permisos desconocido'
           }
           placement="left"
         >
           <Box
             sx={{
               position: 'absolute',
               top: 40,
               right: 8,
               zIndex: 1
             }}
           >
             <Chip 
               label={
                 permissionState === 'granted' ? '🟢 GPS' :
                 permissionState === 'denied' ? '🔴 GPS' :
                 permissionState === 'prompt' ? '🟡 GPS' :
                 '⚪ GPS'
               }
               size="small"
               sx={{ 
                 backgroundColor: 
                   permissionState === 'granted' ? '#4caf50' :
                   permissionState === 'denied' ? '#f44336' :
                   permissionState === 'prompt' ? '#ff9800' :
                   '#9e9e9e',
                 color: 'white',
                 fontSize: '0.75rem'
               }}
             />
           </Box>
         </Tooltip>
       )}
       
       {/* Botón para solicitar permisos explícitamente */}
       {(permissionState === 'prompt' || permissionState === 'denied') && (
         <Tooltip 
           title="Haz clic para solicitar permisos de ubicación"
           placement="left"
         >
           <Box
             sx={{
               position: 'absolute',
               top: 70,
               right: 8,
               zIndex: 1
             }}
           >
             <IconButton
               onClick={() => {
                 requestLocationPermission().catch(() => {
                   // Error ya manejado en requestLocationPermission
                 });
               }}
               sx={{
                 backgroundColor: '#2196f3',
                 color: 'white',
                 width: 40,
                 height: 40,
                 '&:hover': {
                   backgroundColor: '#1976d2'
                 },
                 boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
               }}
             >
               <MyLocationIcon fontSize="small" />
             </IconButton>
           </Box>
         </Tooltip>
       )}
      
      {/* Alerta de error de geolocalización */}
      {geolocateError && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            zIndex: 1000,
            maxWidth: '450px',
            margin: '0 auto'
          }}
        >
          <Alert 
            severity="warning" 
            onClose={() => setGeolocateError(null)}
            sx={{ fontSize: '0.875rem' }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {geolocateError}
            </Typography>
            {permissionState === 'denied' && (
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                <strong>📍 Para habilitar la ubicación manualmente:</strong>
                <br /><br />
                <strong>Método 1 - Desde la barra de direcciones:</strong>
                <br />• Haz clic en el candado 🔒 o ícono de información ℹ️ en la barra de direcciones
                <br />• Busca "Ubicación" y cambia a "Permitir"
                <br />• Recarga la página
                <br /><br />
                <strong>Método 2 - Configuración del navegador:</strong>
                <br />• <strong>Chrome:</strong> chrome://settings/content/location
                <br />• <strong>Edge:</strong> edge://settings/content/location  
                <br />• <strong>Firefox:</strong> about:preferences#privacy → Permisos → Ubicación
                <br />• Busca este sitio y cambia a "Permitir"
                <br /><br />
                <strong>Método 3 - Restablecer permisos:</strong>
                 <br />• Haz clic en "Restablecer permisos" en la configuración del sitio
                 <br />• Recarga la página y acepta cuando aparezca el modal
                 <br /><br />
                 <Button
                   variant="outlined"
                   size="small"
                   startIcon={<SettingsIcon />}
                   onClick={() => {
                     // Intentar abrir configuración de Chrome/Edge
                     if (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edge')) {
                       window.open('chrome://settings/content/location', '_blank');
                     } else if (navigator.userAgent.includes('Firefox')) {
                       window.open('about:preferences#privacy', '_blank');
                     } else {
                       // Fallback: mostrar instrucciones
                       alert('Ve a Configuración del navegador > Privacidad > Permisos > Ubicación y permite este sitio.');
                     }
                   }}
                   sx={{ mt: 1, fontSize: '0.75rem' }}
                 >
                   Abrir Configuración
                 </Button>
              </Typography>
            )}
          </Alert>
        </Box>
      )}
      
      {/* Información de ubicación */}
      {address && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 1,
            borderRadius: 1,
            zIndex: 1
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {address}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapboxMap;