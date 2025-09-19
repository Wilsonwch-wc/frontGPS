import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Alert, Button, Grid, Chip, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MapboxMap from '../components/MapboxMap';
import { API_BASE_URL } from '../config/api';

const GeoTest = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: -12.0464, // Lima, Perú por defecto
    longitude: -77.0428,
    address: 'Ubicación por defecto - Lima, Perú'
  });
  const [locationStatus, setLocationStatus] = useState('default');
  const [locationInfo, setLocationInfo] = useState(null);
  const [dbStatus, setDbStatus] = useState('idle'); // idle, loading, success, error
  const [dbInfo, setDbInfo] = useState(null);

  const handleLocationUpdate = (locationData) => {
    setCurrentLocation({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      address: `Lat: ${locationData.latitude.toFixed(6)}, Lng: ${locationData.longitude.toFixed(6)}`
    });
    setLocationInfo(locationData);
    setLocationStatus('success');
  };

  const getCurrentLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        handleLocationUpdate({ latitude, longitude, accuracy });
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const testDatabaseConnection = async () => {
    setDbStatus('loading');
    setDbInfo(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ubicaciones-gps/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDbStatus('success');
        setDbInfo({
          message: data.message,
          timestamp: data.timestamp,
          apiUrl: API_BASE_URL
        });
      } else {
        setDbStatus('error');
        setDbInfo({
          error: data.message || 'Error desconocido',
          status: response.status,
          apiUrl: API_BASE_URL
        });
      }
    } catch (error) {
      setDbStatus('error');
      setDbInfo({
        error: error.message,
        details: 'No se pudo conectar con el servidor',
        apiUrl: API_BASE_URL
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <GpsFixedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          Prueba de Geolocalización
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Página de prueba para verificar la funcionalidad de geolocalización
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Esta página funciona sin autenticación y puede ser desplegada solo con el frontend
        </Typography>
      </Box>

      {/* Status Alert */}
      {locationStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">¡Ubicación obtenida exitosamente!</Typography>
          {locationInfo && (
            <Typography variant="body2">
              Precisión: ±{Math.round(locationInfo.accuracy)}m
            </Typography>
          )}
        </Alert>
      )}
      
      {locationStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Error al obtener ubicación</Typography>
          <Typography variant="body2">
            Verifica que hayas permitido el acceso a ubicación en tu navegador
          </Typography>
        </Alert>
      )}
      
      {locationStatus === 'loading' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Obteniendo ubicación...</Typography>
          <Typography variant="body2">
            Por favor, permite el acceso a ubicación cuando se solicite
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Map Section */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapIcon color="primary" />
                Mapa Interactivo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Usa los controles del mapa para obtener tu ubicación actual
              </Typography>
              
              <Box sx={{ height: 500, width: '100%' }}>
                <MapboxMap
                  latitude={currentLocation.latitude}
                  longitude={currentLocation.longitude}
                  zoom={16}
                  address={currentLocation.address}
                  onLocationUpdate={handleLocationUpdate}
                  style="streets"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Section */}
        <Grid item xs={12} lg={4}>
          {/* Database Connection Test */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon color="primary" />
                Prueba de Conexión
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Verifica que el backend y la base de datos estén funcionando correctamente
              </Typography>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={dbStatus === 'loading' ? <CircularProgress size={20} /> : <StorageIcon />}
                onClick={testDatabaseConnection}
                disabled={dbStatus === 'loading'}
                sx={{ mb: 2 }}
              >
                {dbStatus === 'loading' ? 'Probando...' : 'Probar Conexión BD'}
              </Button>
              
              {/* Status Indicators */}
              {dbStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon fontSize="small" />
                    <Typography variant="subtitle2">¡Conexión exitosa!</Typography>
                  </Box>
                  {dbInfo && (
                    <Typography variant="body2">
                      <strong>API:</strong> {dbInfo.apiUrl}<br/>
                      <strong>Mensaje:</strong> {dbInfo.message}<br/>
                      <strong>Timestamp:</strong> {new Date(dbInfo.timestamp).toLocaleString()}
                    </Typography>
                  )}
                </Alert>
              )}
              
              {dbStatus === 'error' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ErrorIcon fontSize="small" />
                    <Typography variant="subtitle2">Error de conexión</Typography>
                  </Box>
                  {dbInfo && (
                    <Typography variant="body2">
                      <strong>API:</strong> {dbInfo.apiUrl}<br/>
                      <strong>Error:</strong> {dbInfo.error}<br/>
                      {dbInfo.details && <><strong>Detalles:</strong> {dbInfo.details}<br/></>}
                      {dbInfo.status && <><strong>Status:</strong> {dbInfo.status}</>}
                    </Typography>
                  )}
                </Alert>
              )}
              
              {dbStatus === 'idle' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Haz clic en "Probar Conexión BD" para verificar que el backend esté funcionando
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                Información de Ubicación
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Coordenadas Actuales:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                  Latitud: {currentLocation.latitude.toFixed(6)}<br/>
                  Longitud: {currentLocation.longitude.toFixed(6)}
                </Typography>
              </Box>

              {locationInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información Adicional:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Precisión:</strong> ±{Math.round(locationInfo.accuracy)}m<br/>
                    <strong>Estado:</strong> {locationStatus === 'success' ? 'Activa' : 'Inactiva'}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                startIcon={<GpsFixedIcon />}
                onClick={getCurrentLocation}
                disabled={locationStatus === 'loading'}
                sx={{ mb: 2 }}
              >
                {locationStatus === 'loading' ? 'Obteniendo...' : 'Obtener Mi Ubicación'}
              </Button>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>💡 Consejos:</strong><br/>
                  • Usa el botón azul de ubicación en el mapa<br/>
                  • Permite el acceso cuando se solicite<br/>
                  • Para mejor precisión, usa desde un dispositivo móvil<br/>
                  • Asegúrate de estar al aire libre para GPS
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Esta página funciona independientemente del backend y puede ser desplegada solo con el frontend.<br/>
          Ideal para probar la funcionalidad de geolocalización antes del despliegue completo.
        </Typography>
      </Box>
    </Container>
  );
};

export default GeoTest;