import React, { useState, useEffect, useRef, Fragment } from 'react';

// material-ui
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  MyLocation as MyLocationIcon,
  RadioButtonUnchecked as CircleIcon,
  CropSquare as SquareIcon
} from '@mui/icons-material';

// leaflet imports
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// project imports
import MainCard from '../../components/MainCard';
import MapboxMap from '../../components/MapboxMap';
import Ubicaciones from '../../components/Ubicaciones';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import { API_BASE_URL } from '../../config/api';
import usePageTitle from '../../hooks/usePageTitle';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map components
const LocationToMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

// ==============================|| CONTROL GPS LOCATIONS ||============================== //

const Control = () => {
  usePageTitle('Control GPS');
  const { admin: user, isLoading: authLoading } = useAuthSucursal();
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [mapCenter, setMapCenter] = useState([-12.0464, -77.0428]); // Lima, Peru default
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showLocationInfo, setShowLocationInfo] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [mapType, setMapType] = useState('leaflet'); // 'leaflet' o 'mapbox'
  const [showUbicacionesModal, setShowUbicacionesModal] = useState(false);
  const mapRef = useRef();

  // Función para validar la calidad de la ubicación GPS
  const validateGPSQuality = (position) => {
    const { accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
    
    let quality = {
      score: 0,
      level: 'poor',
      recommendations: []
    };
    
    // Evaluar precisión horizontal
    if (accuracy <= 5) {
      quality.score += 40;
    } else if (accuracy <= 10) {
      quality.score += 30;
    } else if (accuracy <= 20) {
      quality.score += 20;
    } else if (accuracy <= 50) {
      quality.score += 10;
    } else {
      quality.recommendations.push('Muévete a un área con mejor señal GPS');
    }
    
    // Evaluar disponibilidad de datos adicionales
    if (altitude !== null && altitude !== undefined) {
      quality.score += 10;
    }
    
    if (altitudeAccuracy !== null && altitudeAccuracy !== undefined && altitudeAccuracy <= 10) {
      quality.score += 10;
    }
    
    if (heading !== null && heading !== undefined) {
      quality.score += 5;
    }
    
    if (speed !== null && speed !== undefined) {
      quality.score += 5;
    }
    
    // Determinar nivel de calidad
    if (quality.score >= 70) {
      quality.level = 'excellent';
    } else if (quality.score >= 50) {
      quality.level = 'good';
    } else if (quality.score >= 30) {
      quality.level = 'fair';
    } else {
      quality.level = 'poor';
      quality.recommendations.push('Sal al exterior para mejor señal');
      quality.recommendations.push('Asegúrate de que el GPS esté habilitado');
    }
    
    return quality;
  };

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        if (user && user.sucursal && user.sucursal.id) {
          await loadUbicaciones();
        } else {
          setLoading(false);
        }
        // Solo obtener ubicación actual si el usuario lo solicita explícitamente
        // getCurrentLocation();
      } catch (error) {
        console.error('Error initializing component:', error);
        setLoading(false);
      }
    };
    
    // Timeout de seguridad para evitar carga infinita
    const timeoutId = setTimeout(() => {
      console.warn('Timeout: Forzando fin de carga');
      setLoading(false);
    }, 10000); // 10 segundos
    
    initializeComponent().finally(() => {
      clearTimeout(timeoutId);
    });
    
    return () => clearTimeout(timeoutId);
  }, [user]);



  // Función para solicitar permisos de geolocalización explícitamente
  const requestLocationPermission = async () => {
    try {
      // Verificar si la API de permisos está disponible
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          throw new Error('PERMISSION_DENIED');
        }
        
        if (permission.state === 'prompt') {
          // Mostrar mensaje explicativo antes de solicitar permiso
          setSnackbar({
            open: true,
            message: '🔐 Se solicitará permiso para acceder a tu ubicación. Por favor, permite el acceso para obtener tu posición exacta.',
            severity: 'info'
          });
          
          // Esperar un momento para que el usuario lea el mensaje
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        return permission.state;
      }
      
      return 'granted'; // Asumir que está permitido si no hay API de permisos
    } catch (error) {
      console.error('Error checking permissions:', error);
      return 'unknown';
    }
  };

  // Función para mostrar ubicación actual del usuario
  const showMyLocation = async () => {
    // Verificar si estamos en un contexto seguro (HTTPS)
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    
    if (!navigator.geolocation) {
      // Si no hay geolocalización, usar API externa
      showLocationFromAPI();
      return;
    }

    // Solicitar permisos explícitamente
    const permissionState = await requestLocationPermission();
    
    if (permissionState === 'denied') {
      setSnackbar({
        open: true,
        message: '❌ Permisos de ubicación denegados. Para usar GPS, ve a configuración del navegador y permite el acceso a ubicación para este sitio.',
        severity: 'error'
      });
      
      // Mostrar información de cómo habilitar permisos
      setLocationInfo({
        latitude: 'Permisos denegados',
        longitude: 'Permisos denegados',
        city: 'No disponible',
        region: 'No disponible',
        country: 'No disponible',
        method: 'Permisos requeridos',
        error: true,
        permissionDenied: true,
        suggestions: [
          '• Haz clic en el ícono de candado/ubicación en la barra de direcciones',
          '• Selecciona "Permitir" para ubicación',
          '• Recarga la página después de cambiar los permisos',
          '• En móviles: Configuración > Sitios web > Permisos > Ubicación'
        ]
      });
      setShowLocationInfo(true);
      return;
    }

    if (!isSecureContext) {
      setSnackbar({
        open: true,
        message: '⚠️ Contexto no seguro detectado. Para mejor precisión GPS, accede via HTTPS. Usando ubicación aproximada...',
        severity: 'warning'
      });
      showLocationFromAPI();
      return;
    }

    setSnackbar({
      open: true,
      message: '🛰️ Obteniendo tu ubicación GPS precisa... Mantente al aire libre para mejores resultados.',
      severity: 'info'
    });

    // Función para intentar múltiples veces la geolocalización
    const attemptGPSLocation = (attempt = 1, maxAttempts = 3) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, timestamp } = position.coords;
          
          // Validar calidad de la ubicación GPS
          const gpsQuality = validateGPSQuality(position);
          
          // Si la calidad es muy baja y aún tenemos intentos, reintentar
          if (gpsQuality.level === 'poor' && accuracy > 100 && attempt < maxAttempts) {
            setSnackbar({
              open: true,
              message: `Calidad GPS baja (±${Math.round(accuracy)}m). Reintentando... (${attempt}/${maxAttempts})`,
              severity: 'warning'
            });
            
            setTimeout(() => {
              attemptGPSLocation(attempt + 1, maxAttempts);
            }, 3000); // Esperar más tiempo entre intentos
            return;
          }
          
          const locationData = {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: Math.round(accuracy),
            timestamp: new Date(timestamp).toLocaleString(),
            method: `GPS ${gpsQuality.level === 'excellent' ? 'Excelente' : 
                          gpsQuality.level === 'good' ? 'Bueno' : 
                          gpsQuality.level === 'fair' ? 'Aceptable' : 'Básico'}`,
            quality: gpsQuality,
            city: 'Detectando...',
            region: 'Detectando...',
            country: 'Detectando...'
          };

  // Función para obtener información de ciudad usando reverse geocoding
  const getReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Actualizar la información de ubicación con los datos de la ciudad
        setLocationInfo(prev => ({
          ...prev,
          city: data.city || data.locality || 'Ciudad no disponible',
          region: data.principalSubdivision || 'Región no disponible',
          country: data.countryName || 'País no disponible'
        }));
      }
    } catch (error) {
      console.error('Error getting reverse geocode:', error);
      // Mantener los valores por defecto si falla
    }
  };
          
          // Centrar el mapa en la ubicación del usuario
          const newPosition = [latitude, longitude];
          setMapCenter(newPosition);
          setCurrentLocation(newPosition);
          
          setLocationInfo(locationData);
          setShowLocationInfo(true);
          
          // Mensaje de éxito basado en la calidad GPS
          let qualityMessage = '';
          let severity = 'success';
          
          switch(gpsQuality.level) {
            case 'excellent':
              qualityMessage = 'excelente';
              severity = 'success';
              break;
            case 'good':
              qualityMessage = 'buena';
              severity = 'success';
              break;
            case 'fair':
              qualityMessage = 'aceptable';
              severity = 'warning';
              break;
            case 'poor':
              qualityMessage = 'básica';
              severity = 'warning';
              break;
          }
          
          let message = `Ubicación GPS obtenida con calidad ${qualityMessage}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`;
          
          if (gpsQuality.recommendations.length > 0) {
            message += `\n💡 Sugerencias: ${gpsQuality.recommendations.join(', ')}`;
          }
          
          setSnackbar({
            open: true,
            message: message,
            severity: severity
          });
          
          // Intentar obtener información de ciudad usando reverse geocoding
          getReverseGeocode(latitude, longitude);
        },

        (error) => {
          console.error(`GPS attempt ${attempt}/${maxAttempts} failed:`, error);
          
          let errorMessage = 'Error de GPS: ';
          let shouldRetry = false;
          let retryDelay = 1000;
          let useAPIFallback = true;
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += '🚫 Permisos de ubicación denegados por el usuario.';
              useAPIFallback = false; // No usar API si el usuario denegó explícitamente
              
              // Mostrar guía detallada para habilitar permisos
              setLocationInfo({
                latitude: 'Permisos denegados',
                longitude: 'Permisos denegados',
                city: 'No disponible',
                region: 'No disponible',
                country: 'No disponible',
                method: 'Permisos requeridos',
                error: true,
                permissionDenied: true,
                suggestions: [
                  '🔧 Cómo habilitar ubicación:',
                  '• Chrome/Edge: Haz clic en el ícono de candado → Ubicación → Permitir',
                  '• Firefox: Haz clic en el escudo → Permisos → Ubicación → Permitir',
                  '• Safari: Safari → Preferencias → Sitios web → Ubicación → Permitir',
                  '• Móvil: Configuración → Aplicaciones → Navegador → Permisos → Ubicación',
                  '• Después de cambiar, recarga la página completamente'
                ]
              });
              setShowLocationInfo(true);
              break;
              
            case error.POSITION_UNAVAILABLE:
              errorMessage += '📡 Señal GPS no disponible. Intenta moverte al aire libre.';
              shouldRetry = attempt < maxAttempts;
              retryDelay = 2000;
              break;
              
            case error.TIMEOUT:
              errorMessage += `⏱️ Tiempo agotado (intento ${attempt}/${maxAttempts}).`;
              shouldRetry = attempt < maxAttempts;
              retryDelay = 1500;
              break;
              
            default:
              errorMessage += `❓ Error desconocido (código: ${error.code}).`;
              shouldRetry = attempt < maxAttempts;
              retryDelay = 2000;
          }
          
          // Mostrar mensaje de progreso durante reintentos
          if (shouldRetry) {
            errorMessage += ` Reintentando en ${retryDelay/1000}s con configuración menos estricta...`;
            setSnackbar({
              open: true,
              message: errorMessage,
              severity: 'info'
            });
            setTimeout(() => {
              // Para reintentos, usar configuración menos estricta
              const retryOptions = {
                enableHighAccuracy: attempt === 1, // Solo alta precisión en el primer intento
                timeout: Math.min(15000, 5000 * attempt), // Aumentar timeout gradualmente
                maximumAge: attempt > 1 ? 60000 : 300000 // Permitir ubicaciones más antiguas en reintentos
              };
              
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  // Usar la misma lógica de éxito que antes
                  const { latitude, longitude, accuracy, timestamp } = position.coords;
                  const gpsQuality = validateGPSQuality(position);
                  
                  const locationData = {
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                    accuracy: Math.round(accuracy),
                    timestamp: new Date(timestamp).toLocaleString(),
                    method: `GPS ${gpsQuality.level === 'excellent' ? 'Excelente' : 
                                  gpsQuality.level === 'good' ? 'Bueno' : 
                                  gpsQuality.level === 'fair' ? 'Aceptable' : 'Básico'} (Reintento ${attempt})`,
                    quality: gpsQuality,
                    city: 'Detectando...',
                    region: 'Detectando...',
                    country: 'Detectando...'
                  };
                  
                  const newPosition = [latitude, longitude];
                  setMapCenter(newPosition);
                  setCurrentLocation(newPosition);
                  setLocationInfo(locationData);
                  setShowLocationInfo(true);
                  
                  getReverseGeocode(latitude, longitude);
                  
                  setSnackbar({
                    open: true,
                    message: `✅ Ubicación GPS obtenida en reintento ${attempt}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`,
                    severity: 'success'
                  });
                },
                (retryError) => {
                  console.error(`Retry ${attempt} failed:`, retryError);
                  attemptGPSLocation(attempt + 1, maxAttempts);
                },
                retryOptions
              );
            }, retryDelay);
            return;
          } else {
            // Último intento fallido, usar API como respaldo si está permitido
            if (useAPIFallback) {
              errorMessage += ' Obteniendo ubicación aproximada...';
              setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'warning'
              });
              showLocationFromAPI();
            } else {
              setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
              });
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Timeout más largo para mejor precisión
          maximumAge: 0 // Siempre obtener ubicación fresca, no usar caché
        }
      );
    };
    
    if (navigator.geolocation) {
      // Iniciar el proceso de geolocalización
      attemptGPSLocation();
    } else {
      setSnackbar({
        open: true,
        message: 'Geolocalización no soportada en este navegador. Usando ubicación aproximada...',
        severity: 'info'
      });
      showLocationFromAPI();
    }
  };

  // Función para mostrar ubicación usando API externa con múltiples respaldos
  const showLocationFromAPI = async () => {
    const apis = [
      {
        url: 'https://ipapi.co/json/',
        name: 'ipapi.co',
        parser: (data) => ({
          latitude: data.latitude?.toFixed(6),
          longitude: data.longitude?.toFixed(6),
          city: data.city,
          region: data.region,
          country: data.country_name
        })
      },
      {
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        name: 'ipgeolocation.io',
        parser: (data) => ({
          latitude: data.latitude?.toFixed(6),
          longitude: data.longitude?.toFixed(6),
          city: data.city,
          region: data.state_prov,
          country: data.country_name
        })
      },
      {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        name: 'geojs.io',
        parser: (data) => ({
          latitude: data.latitude?.toFixed(6),
          longitude: data.longitude?.toFixed(6),
          city: data.city,
          region: data.region,
          country: data.country
        })
      },
      {
        url: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
        name: 'bigdatacloud.net',
        parser: (data) => ({
          latitude: data.latitude?.toFixed(6),
          longitude: data.longitude?.toFixed(6),
          city: data.city,
          region: data.principalSubdivision,
          country: data.countryName
        })
      },
      {
        url: 'https://ipinfo.io/json',
        name: 'ipinfo.io',
        parser: (data) => {
          const [lat, lng] = data.loc ? data.loc.split(',') : [null, null];
          return {
            latitude: lat ? parseFloat(lat).toFixed(6) : null,
            longitude: lng ? parseFloat(lng).toFixed(6) : null,
            city: data.city,
            region: data.region,
            country: data.country
          };
        }
      },
      {
        url: 'https://api.db-ip.com/v2/free/self',
        name: 'db-ip.com',
        parser: (data) => ({
          latitude: data.latitude?.toFixed(6),
          longitude: data.longitude?.toFixed(6),
          city: data.city,
          region: data.stateProv,
          country: data.countryName
        })
      }
    ];

    setSnackbar({
      open: true,
      message: 'Obteniendo ubicación aproximada...',
      severity: 'info'
    });

    for (let i = 0; i < apis.length; i++) {
      const api = apis[i];
      try {
        console.log(`Intentando API: ${api.name} - ${api.url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch(api.url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log(`Respuesta de ${api.name}:`, response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Datos recibidos de ${api.name}:`, data);
        
        const locationData = api.parser(data);
        console.log(`Datos procesados de ${api.name}:`, locationData);
        
        if (locationData.latitude && locationData.longitude && 
            !isNaN(parseFloat(locationData.latitude)) && 
            !isNaN(parseFloat(locationData.longitude))) {
           
           const lat = parseFloat(locationData.latitude);
           const lng = parseFloat(locationData.longitude);
           
           // Validar que las coordenadas estén en rangos válidos
           if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
             const finalLocationData = {
               ...locationData,
               method: 'IP',
               source: api.name
             };
             
             // Centrar el mapa en la ubicación aproximada del usuario
             setMapCenter([lat, lng]);
             setCurrentLocation([lat, lng]);
             
             setLocationInfo(finalLocationData);
             setShowLocationInfo(true);
             
             setSnackbar({
               open: true,
               message: `Ubicación aproximada obtenida y mostrada en el mapa: ${locationData.city || 'Ubicación'}, ${locationData.country || 'País'}`,
               severity: 'success'
             });
             return; // Éxito, salir del bucle
           } else {
             throw new Error(`Coordenadas inválidas: lat=${lat}, lng=${lng}`);
           }
        } else {
          throw new Error(`Datos de ubicación incompletos o inválidos: lat=${locationData.latitude}, lng=${locationData.longitude}`);
        }
      } catch (error) {
        console.error(`Error con API ${api.name}:`, error.message);
        if (error.name === 'AbortError') {
          console.log(`Timeout en API ${api.name}`);
        }
        
        // Si es el último intento, mostrar error
        if (i === apis.length - 1) {
          // Diagnóstico detallado del error
          const errorDiagnostic = {
            hasGeolocation: !!navigator.geolocation,
            isSecureContext: window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost',
            isOnline: navigator.onLine,
            userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
          };

          let detailedMessage = 'No se pudo obtener la ubicación automáticamente.';
          let suggestions = [];

          if (!errorDiagnostic.isOnline) {
            suggestions.push('• Verifica tu conexión a internet');
          }
          if (!errorDiagnostic.isSecureContext) {
            suggestions.push('• Accede desde HTTPS para mejor precisión GPS');
          }
          if (!errorDiagnostic.hasGeolocation) {
            suggestions.push('• Tu navegador no soporta geolocalización');
          }
          if (errorDiagnostic.userAgent === 'Mobile') {
            suggestions.push('• Activa el GPS en tu dispositivo móvil');
            suggestions.push('• Permite el acceso a ubicación en tu navegador');
          } else {
            suggestions.push('• Permite el acceso a ubicación en tu navegador');
            suggestions.push('• Intenta desde un dispositivo móvil para mayor precisión');
          }
          suggestions.push('• Recarga la página e intenta nuevamente');
          suggestions.push('• Usa "Nueva Ubicación GPS" para ingresar coordenadas manualmente');

          setSnackbar({
            open: true,
            message: `${detailedMessage}\n\nSoluciones sugeridas:\n${suggestions.join('\n')}`,
            severity: 'error'
          });
          
          // Mostrar diálogo con opciones manuales y diagnóstico
          setLocationInfo({
            latitude: 'No disponible',
            longitude: 'No disponible',
            city: 'No disponible',
            region: 'No disponible',
            country: 'No disponible',
            method: 'Error',
            error: true,
            diagnostic: errorDiagnostic,
            suggestions: suggestions
          });
          setShowLocationInfo(true);
        }
      }
    }
  };



  // Función para cargar ubicaciones
  const loadUbicaciones = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sucursal_token');
      const response = await fetch(`${API_BASE_URL}/ubicaciones-gps/sucursal/${user.sucursal.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUbicaciones(data.data || []);
      } else {
        throw new Error('Error al cargar ubicaciones');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las ubicaciones GPS',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };





  // Función para obtener ubicación usando API externa
  const getLocationFromAPI = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Obteniendo ubicación aproximada...',
        severity: 'info'
      });

      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const newPosition = [data.latitude, data.longitude];
        
        // Actualizar centro del mapa
        setMapCenter(newPosition);
        setCurrentLocation(newPosition);
        
        // Crear marcador temporal
        setTempMarker({
          position: newPosition
        });
        
        // Actualizar formulario
        setFormData(prev => ({
          ...prev,
          latitud: data.latitude.toFixed(6),
          longitud: data.longitude.toFixed(6)
        }));
        
        setSnackbar({
          open: true,
          message: `Ubicación aproximada obtenida: ${data.city}, ${data.country_name}`,
          severity: 'success'
        });
      } else {
        throw new Error('No se pudieron obtener las coordenadas');
      }
    } catch (error) {
      console.error('Error getting location from API:', error);
      setSnackbar({
        open: true,
        message: 'No se pudo obtener la ubicación. Usa el mapa para seleccionar manualmente.',
        severity: 'warning'
      });
    }
  };

  // Función para obtener ubicación actual
  const getCurrentLocation = async () => {
    // Verificar si estamos en un contexto seguro (HTTPS)
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    
    if (!navigator.geolocation) {
      // Si no hay geolocalización, usar API externa
      getLocationFromAPI();
      return;
    }

    // Solicitar permisos explícitamente
    const permissionState = await requestLocationPermission();
    
    if (permissionState === 'denied') {
      setSnackbar({
        open: true,
        message: '❌ Permisos de ubicación denegados. Habilita los permisos en tu navegador para usar GPS.',
        severity: 'error'
      });
      return;
    }

    if (!isSecureContext) {
      setSnackbar({
        open: true,
        message: '⚠️ Contexto no seguro. Para mejor precisión GPS, accede via HTTPS. Usando ubicación aproximada...',
        severity: 'warning'
      });
      getLocationFromAPI();
      return;
    }

    setSnackbar({
      open: true,
      message: '🛰️ Obteniendo ubicación GPS precisa...',
      severity: 'info'
    });

    // Intentar geolocalización nativa con configuración optimizada
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newPosition = [latitude, longitude];
        
        // Actualizar centro del mapa
        setMapCenter(newPosition);
        setCurrentLocation(newPosition);
        
        setSnackbar({
          open: true,
          message: `✅ Ubicación GPS obtenida: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`,
          severity: 'success'
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = 'Error al obtener ubicación GPS.';
        let useAPIFallback = true;
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '🚫 Permisos de ubicación denegados. Habilita los permisos en configuración del navegador.';
            useAPIFallback = false;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '📡 Señal GPS no disponible. Intenta moverte al aire libre.';
            break;
          case error.TIMEOUT:
            errorMessage = '⏱️ Tiempo de espera agotado. Obteniendo ubicación aproximada...';
            break;
          default:
            errorMessage = '❓ Error desconocido al obtener ubicación GPS.';
            break;
        }
        
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: useAPIFallback ? 'warning' : 'error'
        });
        
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSaveUbicacion = async (ubicacionData) => {
    try {
      const token = localStorage.getItem('sucursal_token');
      
      // Transformar datos del frontend al formato del backend
      let latitud, longitud, radio_metros;
      
      if (ubicacionData.tipo_area === 'circle' && ubicacionData.coordenadas) {
        // Para círculos, las coordenadas son [lat, lng] del centro
        latitud = ubicacionData.coordenadas[0];
        longitud = ubicacionData.coordenadas[1];
        radio_metros = ubicacionData.radio || 50;
      } else if (ubicacionData.tipo_area === 'rectangle' && ubicacionData.coordenadas) {
        // Para rectángulos, calcular el centro y un radio aproximado
        const bounds = ubicacionData.coordenadas;
        latitud = (bounds[0][0] + bounds[1][0]) / 2;
        longitud = (bounds[0][1] + bounds[1][1]) / 2;
        // Calcular radio como la distancia del centro a una esquina
        const deltaLat = Math.abs(bounds[1][0] - bounds[0][0]) / 2;
        const deltaLng = Math.abs(bounds[1][1] - bounds[0][1]) / 2;
        radio_metros = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) * 111000; // Aproximación en metros
      } else {
        throw new Error('Datos de ubicación inválidos');
      }
      
      const dataToSend = {
        nombre: ubicacionData.nombre,
        descripcion: ubicacionData.descripcion,
        latitud: parseFloat(latitud.toFixed(6)),
        longitud: parseFloat(longitud.toFixed(6)),
        radio_metros: Math.round(radio_metros),
        sucursal_id: user.sucursal.id
      };
      
      console.log('Enviando datos al backend:', dataToSend);
      
      const response = await fetch(`${API_BASE_URL}/ubicaciones-gps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la ubicación de control');
      }

      const result = await response.json();
      
      setSnackbar({
        open: true,
        message: '✅ Punto de control registrado exitosamente',
        severity: 'success'
      });

      // Recargar ubicaciones después de guardar
      await loadUbicaciones();
      
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
      setSnackbar({
        open: true,
        message: '❌ Error al registrar el punto de control',
        severity: 'error'
      });
      throw error;
    }
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <MainCard>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <LocationIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                Control de Ubicaciones GPS
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<MyLocationIcon />}
                onClick={showMyLocation}
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: '#e3f2fd',
                  borderColor: '#2196f3',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#bbdefb',
                    borderColor: '#1976d2'
                  }
                }}
              >
                Ver Mi Ubicación GPS
              </Button>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowUbicacionesModal(true)}
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#45a049'
                  }
                }}
              >
                Registrar Puntos de Control
              </Button>

            </Box>
          </Box>

          {/* Tabs para navegación */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Ubicaciones Registradas" />
              <Tab label="Mapa de Control" />
            </Tabs>
          </Box>

          {/* Contenido de las tabs */}
          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Puntos de Control GPS Registrados
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : ubicaciones.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <LocationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay ubicaciones registradas
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Comienza registrando tu primer punto de control GPS
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowUbicacionesModal(true)}
                    sx={{ backgroundColor: '#4caf50' }}
                  >
                    Registrar Primera Ubicación
                  </Button>
                </Paper>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Coordenadas</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Radio (m)</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Creado por</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ubicaciones.map((ubicacion) => (
                        <TableRow key={ubicacion.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {ubicacion.nombre}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ubicacion.descripcion || 'Sin descripción'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {parseFloat(ubicacion.latitud).toFixed(6)}, {parseFloat(ubicacion.longitud).toFixed(6)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${ubicacion.radio_metros}m`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ubicacion.admin_creador_nombre || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(ubicacion.fecha_creacion).toLocaleDateString('es-ES')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Ver en mapa">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setMapCenter([parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud)]);
                                  setTabValue(1); // Cambiar a la tab del mapa
                                }}
                                sx={{ color: 'primary.main' }}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Tab del Mapa */}
          {tabValue === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Mapa de Ubicaciones de Control
              </Typography>
              <Paper sx={{ height: 500, borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  zoomControl={true}
                  doubleClickZoom={true}
                  dragging={true}
                  touchZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationToMap center={mapCenter} />
                  
                  {/* Marcadores de ubicaciones registradas */}
                  {ubicaciones.map((ubicacion) => (
                    <Fragment key={ubicacion.id}>
                      <Marker position={[parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud)]}>
                        <Popup>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {ubicacion.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ubicacion.descripcion}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              Radio: {ubicacion.radio_metros}m
                            </Typography>
                            <Typography variant="caption" display="block">
                              Creado: {new Date(ubicacion.fecha_creacion).toLocaleDateString('es-ES')}
                            </Typography>
                          </Box>
                        </Popup>
                      </Marker>
                      <Circle
                        center={[parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud)]}
                        radius={ubicacion.radio_metros}
                        pathOptions={{
                          color: '#2196f3',
                          fillColor: '#2196f3',
                          fillOpacity: 0.1,
                          weight: 2
                        }}
                      />
                     </Fragment>
                   ))}
                  
                  {/* Marcador de ubicación actual del usuario */}
                  {currentLocation && (
                    <Marker position={currentLocation}>
                      <Popup>
                        <Typography variant="body2">
                          Tu ubicación actual
                        </Typography>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Paper>
            </Box>
          )}

        </CardContent>
      </MainCard>



      {/* Diálogo para mostrar información de ubicación */}
      <Dialog
        open={showLocationInfo}
        onClose={() => setShowLocationInfo(false)}
        maxWidth="sm"
        fullWidth
        disablePortal
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <MyLocationIcon color={locationInfo?.error ? "error" : "primary"} />
            <Box>
              <Typography variant="h6">
                {locationInfo?.error ? 'Error de Ubicación GPS' : 'Mi Ubicación GPS Actual'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {locationInfo?.error ? 'No se pudo detectar tu ubicación' : 'Aquí puedes ver exactamente dónde te encuentras'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {locationInfo && (
            <Box>
              {locationInfo.error ? (
                <>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      No se pudo obtener tu ubicación automáticamente
                    </Typography>
                  </Alert>
                  
                  {/* Diagnóstico del sistema */}
                  {locationInfo.diagnostic && (
                    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        🔍 Diagnóstico del sistema:
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color={locationInfo.diagnostic.hasGeolocation ? 'success.main' : 'error.main'}>
                            GPS: {locationInfo.diagnostic.hasGeolocation ? '✓ Disponible' : '✗ No disponible'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color={locationInfo.diagnostic.isSecureContext ? 'success.main' : 'warning.main'}>
                            Seguridad: {locationInfo.diagnostic.isSecureContext ? '✓ HTTPS' : '⚠ HTTP'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color={locationInfo.diagnostic.isOnline ? 'success.main' : 'error.main'}>
                            Internet: {locationInfo.diagnostic.isOnline ? '✓ Conectado' : '✗ Sin conexión'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Dispositivo: {locationInfo.diagnostic.userAgent}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>💡 Soluciones recomendadas:</strong>
                      </Typography>
                      <Typography variant="body2" component="div" sx={{ ml: 2, mb: 2 }}>
                        {locationInfo.suggestions ? 
                          locationInfo.suggestions.map((suggestion, index) => (
                            <span key={index}>{suggestion}<br/></span>
                          )) :
                          <>• Verifica tu conexión a internet<br/>
                          • Recarga la página e intenta nuevamente<br/>
                          • Permite el acceso a ubicación en tu navegador<br/>
                          • Usa la opción "Nueva Ubicación GPS" para ingresar coordenadas manualmente</>
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      📍 ¡Aquí estás!
                    </Typography>
                    <Typography variant="body1">
                      {locationInfo.city && locationInfo.country ? 
                        `${locationInfo.city}, ${locationInfo.country}` : 
                        'Tu ubicación actual'}
                    </Typography>
                  </Alert>
                  
                  {/* Selector de tipo de mapa */}
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ minWidth: 'fit-content' }}>
                      🗺️ Tipo de mapa:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={mapType}
                        onChange={(e) => setMapType(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="leaflet">🌍 OpenStreetMap</MenuItem>
                        <MenuItem value="mapbox">🗺️ Mapbox HD</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary">
                      {mapType === 'mapbox' ? '(Requiere API key)' : '(Gratuito)'}
                    </Typography>
                  </Box>
                  
                  <Paper sx={{ height: 350, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                    {mapType === 'mapbox' ? (
                      <MapboxMap
                        latitude={parseFloat(locationInfo.latitude)}
                        longitude={parseFloat(locationInfo.longitude)}
                        zoom={16}
                        address={locationInfo.city && locationInfo.country ? 
                          `${locationInfo.city}, ${locationInfo.country}` : 
                          'Tu ubicación actual'
                        }
                      />
                    ) : (
                      <MapContainer
                        center={[parseFloat(locationInfo.latitude), parseFloat(locationInfo.longitude)]}
                        zoom={16}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        zoomControl={true}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                          subdomains="abcd"
                          maxZoom={20}
                        />
                        <Marker position={[parseFloat(locationInfo.latitude), parseFloat(locationInfo.longitude)]}>
                          <Popup>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Tu ubicación
                              </Typography>
                              {locationInfo.city && (
                                <Typography variant="body2">
                                  {locationInfo.city}, {locationInfo.country}
                                </Typography>
                              )}
                            </Box>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    )}
                  </Paper>
                  
                  {locationInfo.method === 'IP' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        💡 Esta es tu ubicación aproximada basada en tu IP. Para mayor precisión, permite el acceso a GPS en tu navegador.
                      </Typography>
                    </Alert>
                  )}
                  
                  {/* Información sobre precisión GPS */}
                  {locationInfo.accuracy && (
                    <Alert severity={locationInfo.accuracy < 50 ? "success" : locationInfo.accuracy < 100 ? "warning" : "info"} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        📡 Precisión GPS: ±{locationInfo.accuracy}m
                        {locationInfo.accuracy < 50 && " (Excelente)"}
                        {locationInfo.accuracy >= 50 && locationInfo.accuracy < 100 && " (Buena)"}
                        {locationInfo.accuracy >= 100 && " (Básica - intenta al aire libre)"}
                      </Typography>
                    </Alert>
                  )}
                  
                  {/* Información sobre APIs de mapas gratuitas */}
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      🗺️ APIs de Mapas Gratuitas Disponibles:
                    </Typography>
                    <Typography variant="body2" component="div">
                      • <strong>OpenStreetMap</strong> - Completamente gratuito (actual)<br/>
                      • <strong>Mapbox</strong> - 50,000 vistas/mes gratis<br/>
                      • <strong>Google Maps</strong> - $200 crédito mensual<br/>
                      • <strong>HERE Maps</strong> - 250,000 transacciones/mes gratis<br/>
                      • <strong>MapTiler</strong> - 100,000 cargas/mes gratis
                    </Typography>
                  </Alert>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowLocationInfo(false);
              showMyLocation(); // Actualizar ubicación
            }} 
            color="secondary"
            variant="outlined"
            startIcon={<MyLocationIcon />}
          >
            Actualizar Ubicación
          </Button>
          
          {/* Botón para obtener ubicación de alta precisión */}
          <Button 
            onClick={() => {
              setShowLocationInfo(false);
              setSnackbar({
                open: true,
                message: '🎯 Obteniendo ubicación de alta precisión... Mantente quieto y al aire libre para mejores resultados.',
                severity: 'info'
              });
              // Forzar nueva ubicación con configuración de alta precisión
              setTimeout(() => showMyLocation(), 1000);
            }} 
            color="success"
            variant="outlined"
            startIcon={<LocationIcon />}
          >
            Alta Precisión
          </Button>
          
          <Button 
            onClick={() => {
              setShowLocationInfo(false);
              if (locationInfo?.error) {
                showMyLocation(); // Reintentar
              }
            }} 
            color="primary"
            variant={locationInfo?.error ? "contained" : "contained"}
          >
            {locationInfo?.error ? 'Reintentar' : 'Entendido'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Ubicaciones */}
       <Ubicaciones
         open={showUbicacionesModal}
         onClose={() => setShowUbicacionesModal(false)}
         onSave={handleSaveUbicacion}
       />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Control;