import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material';
import { LocationOn, MyLocation, Edit } from '@mui/icons-material';

const LocationForm = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [showManualInput, setShowManualInput] = useState(false);

  // Función para obtener ubicación usando API externa
  const getLocationFromAPI = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name,
          type: 'aproximada (IP)'
        });
      } else {
        throw new Error('No se pudieron obtener las coordenadas');
      }
    } catch (err) {
      setError('No se pudo obtener la ubicación automáticamente');
    } finally {
      setLoading(false);
    }
  };

  // Función para solicitar permisos de geolocalización
  const requestLocationPermission = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
      }
      return 'granted';
    } catch (error) {
      console.error('Error checking permissions:', error);
      return 'unknown';
    }
  };

  // Función para obtener ubicación precisa
  const getCurrentLocation = async () => {
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada en este navegador');
      getLocationFromAPI();
      return;
    }

    // Verificar permisos
    const permissionState = await requestLocationPermission();
    
    if (permissionState === 'denied') {
      setError('Permisos de ubicación denegados. Habilita los permisos en tu navegador para usar GPS.');
      return;
    }

    if (!isSecureContext) {
      setError('Contexto no seguro detectado. Para mejor precisión GPS, accede via HTTPS.');
      getLocationFromAPI();
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          type: 'precisa (GPS)'
        });
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
        
        let errorMessage = 'Error al obtener ubicación GPS.';
        let useAPIFallback = true;
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permisos de ubicación denegados. Habilita los permisos en configuración del navegador.';
            useAPIFallback = false;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Señal GPS no disponible. Intenta moverte al aire libre.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado. Obteniendo ubicación aproximada...';
            break;
          default:
            errorMessage = 'Error desconocido al obtener ubicación GPS.';
            break;
        }
        
        setError(errorMessage);
        
        if (useAPIFallback) {
          getLocationFromAPI();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  // Función para establecer coordenadas manualmente
  const setManualLocation = () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Por favor ingresa coordenadas válidas');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      setError('La latitud debe estar entre -90 y 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      setError('La longitud debe estar entre -180 y 180');
      return;
    }
    
    setLocation({
      latitude: lat,
      longitude: lng,
      type: 'manual'
    });
    setError('');
    setShowManualInput(false);
  };

  const clearLocation = () => {
    setLocation(null);
    setError('');
    setManualCoords({ lat: '', lng: '' });
    setShowManualInput(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" />
            Mi Ubicación Actual
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Obtén tu ubicación actual de forma automática o ingrésala manualmente
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {location && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Ubicación obtenida ({location.type})</Typography>
              <Typography variant="body2">
                <strong>Latitud:</strong> {location.latitude.toFixed(6)}<br/>
                <strong>Longitud:</strong> {location.longitude.toFixed(6)}
                {location.city && <><br/><strong>Ciudad:</strong> {location.city}</>}
                {location.country && <><br/><strong>País:</strong> {location.country}</>}
                {location.accuracy && <><br/><strong>Precisión:</strong> ±{Math.round(location.accuracy)}m</>}
              </Typography>
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MyLocation />}
                onClick={getCurrentLocation}
                disabled={loading}
              >
                {loading ? 'Obteniendo...' : 'Obtener Ubicación'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Edit />}
                onClick={() => setShowManualInput(!showManualInput)}
              >
                Ingresar Manual
              </Button>
            </Grid>
          </Grid>

          {showManualInput && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Coordenadas Manuales
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Latitud"
                    type="number"
                    value={manualCoords.lat}
                    onChange={(e) => setManualCoords(prev => ({ ...prev, lat: e.target.value }))}
                    placeholder="Ej: -12.046374"
                    helperText="Entre -90 y 90"
                    inputProps={{ step: 'any' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longitud"
                    type="number"
                    value={manualCoords.lng}
                    onChange={(e) => setManualCoords(prev => ({ ...prev, lng: e.target.value }))}
                    placeholder="Ej: -77.042793"
                    helperText="Entre -180 y 180"
                    inputProps={{ step: 'any' }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={setManualLocation}
                sx={{ mr: 1 }}
              >
                Establecer Ubicación
              </Button>
              <Button
                variant="text"
                onClick={() => setShowManualInput(false)}
              >
                Cancelar
              </Button>
            </>
          )}

          {location && (
            <>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearLocation}
                fullWidth
              >
                Limpiar Ubicación
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LocationForm;