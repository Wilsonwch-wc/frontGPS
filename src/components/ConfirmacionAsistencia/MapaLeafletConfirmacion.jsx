import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Alert, Button, Stack } from '@mui/material';
import { MyLocation, ZoomIn, Person } from '@mui/icons-material';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados para diferentes tipos de marcadores
const createCustomIcon = (color, isUser = false) => {
  const iconHtml = isUser 
    ? `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      "></div>`
    : `<div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      "></div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
  });
};

const MapaLeafletConfirmacion = ({ 
  asignacion, 
  ubicacionUsuario, 
  distancia, 
  dentroDelRango,
  onMapReady 
}) => {
  const mapRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Función para centrar en la ubicación requerida
  const centerOnRequiredLocation = () => {
    if (mapRef.current && asignacion) {
      const map = mapRef.current;
      const targetLocation = [asignacion.ubicacion.latitud, asignacion.ubicacion.longitud];
      
      // Centrar en la ubicación requerida con zoom apropiado para ver calles
      map.setView(targetLocation, 17, { animate: true });
    }
  };

  // Función para centrar en la ubicación del usuario
  const centerOnUserLocation = () => {
    if (mapRef.current && ubicacionUsuario) {
      const map = mapRef.current;
      const userLocation = [ubicacionUsuario.latitud, ubicacionUsuario.longitud];
      
      // Centrar en la ubicación del usuario con zoom apropiado para ver calles
      map.setView(userLocation, 17, { animate: true });
    }
  };

  // Función para mostrar ambas ubicaciones
  const showBothLocations = () => {
    if (mapRef.current && asignacion && ubicacionUsuario) {
      try {
        const map = mapRef.current;
        
        // Crear bounds para ajustar la vista
        const bounds = L.latLngBounds([
          [asignacion.ubicacion.latitud, asignacion.ubicacion.longitud],
          [ubicacionUsuario.latitud, ubicacionUsuario.longitud]
        ]);
        
        // Ajustar la vista con padding
        map.fitBounds(bounds, { padding: [20, 20] });
        
        // Asegurar un zoom máximo
        setTimeout(() => {
          if (map.getZoom() > 18) {
            map.setZoom(18);
          }
        }, 100);
      } catch (err) {
        console.error('Error al configurar el mapa:', err);
        setError('Error al configurar el mapa');
      }
    }
  };

  useEffect(() => {
    if (mapRef.current && asignacion && ubicacionUsuario && !mapLoaded) {
      // Solo centrar inicialmente una vez cuando el mapa se carga por primera vez
      setTimeout(() => {
        // Iniciar con vista completa para que el usuario vea ambas ubicaciones
        showBothLocations();
        setMapLoaded(true);
        if (onMapReady) {
          onMapReady();
        }
      }, 100);
    }
  }, [asignacion, ubicacionUsuario, onMapReady, mapLoaded]);

  if (!asignacion || !asignacion.ubicacion || !ubicacionUsuario) {
    return (
      <Box 
        sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Cargando ubicaciones...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="body2">
          {error}
        </Typography>
      </Alert>
    );
  }

  const targetLocation = [asignacion.ubicacion.latitud, asignacion.ubicacion.longitud];
  const userLocation = [ubicacionUsuario.latitud, ubicacionUsuario.longitud];
  const centerLocation = [
    (asignacion.ubicacion.latitud + ubicacionUsuario.latitud) / 2,
    (asignacion.ubicacion.longitud + ubicacionUsuario.longitud) / 2
  ];

  // Validar y asegurar que el radio sea un número válido
  const radioPermitido = isNaN(asignacion.ubicacion.rango) || asignacion.ubicacion.rango <= 0 
    ? 100 // Radio por defecto de 100 metros
    : Number(asignacion.ubicacion.rango);

  return (
    <Box sx={{ position: 'relative', height: 400, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
      {/* Botones de control del mapa */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Button
           variant="contained"
           size="small"
           onClick={centerOnRequiredLocation}
           startIcon={<MyLocation />}
           sx={{ 
             bgcolor: 'primary.main',
             '&:hover': { bgcolor: 'primary.dark' },
             fontSize: '0.75rem',
             px: 1.5,
             py: 0.5
           }}
         >
           Ubicación Requerida
         </Button>
         <Button
           variant="contained"
           size="small"
           onClick={centerOnUserLocation}
           startIcon={<Person />}
           sx={{ 
             bgcolor: 'success.main',
             '&:hover': { bgcolor: 'success.dark' },
             fontSize: '0.75rem',
             px: 1.5,
             py: 0.5
           }}
         >
           Mi Ubicación
         </Button>
         <Button
           variant="outlined"
           size="small"
           onClick={showBothLocations}
           startIcon={<ZoomIn />}
           sx={{ 
             bgcolor: 'white',
             '&:hover': { bgcolor: 'grey.50' },
             fontSize: '0.75rem',
             px: 1.5,
             py: 0.5
           }}
         >
           Ver Todo
         </Button>
      </Box>
      
      <MapContainer
        ref={mapRef}
        center={centerLocation}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        keyboard={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador de la ubicación objetivo (rojo) */}
        <Marker 
          position={targetLocation}
          icon={createCustomIcon('#f44336', false)}
        >
          <Popup>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="error">
                📍 Ubicación de Trabajo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asignacion.sucursal?.nombre || asignacion.ubicacion?.nombre || 'Ubicación de trabajo'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asignacion.sucursal?.direccion || asignacion.ubicacion?.direccion || 'Dirección no disponible'}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Radio permitido: {asignacion.ubicacion.rango}m
              </Typography>
            </Box>
          </Popup>
        </Marker>
        
        {/* Círculo del rango permitido */}
        <Circle
          center={targetLocation}
          radius={radioPermitido}
          pathOptions={{
            color: dentroDelRango ? '#4caf50' : '#f44336',
            fillColor: dentroDelRango ? '#4caf50' : '#f44336',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: dentroDelRango ? null : '5, 5'
          }}
        />
        
        {/* Marcador de la ubicación del usuario (azul) */}
        <Marker 
          position={userLocation}
          icon={createCustomIcon('#2196f3', true)}
        >
          <Popup>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                📱 Tu Ubicación
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distancia: {distancia ? `${distancia.toFixed(0)}m` : 'Calculando...'}
              </Typography>
              <Typography 
                variant="body2" 
                color={dentroDelRango ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {dentroDelRango ? '✓ Dentro del rango' : '✗ Fuera del rango'}
              </Typography>
            </Box>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default MapaLeafletConfirmacion;