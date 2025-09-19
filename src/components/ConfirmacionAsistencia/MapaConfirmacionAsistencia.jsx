import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  Divider
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import ConfirmacionAsistenciaService from '../../services/confirmacionAsistenciaService';
import MapaLeafletConfirmacion from './MapaLeafletConfirmacion';

const MapaConfirmacionAsistencia = ({ 
  open, 
  onClose, 
  asignacion, 
  onConfirmacionExitosa 
}) => {
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [verificacionRango, setVerificacionRango] = useState(null);
   const [mapReady, setMapReady] = useState(false);

  // Cargar ubicación cuando se abre el modal
  useEffect(() => {
    if (open && asignacion) {
      obtenerUbicacionUsuario();
    }
  }, [open, asignacion]);

  // Verificar rango cuando cambia la ubicación
  useEffect(() => {
    if (ubicacionUsuario && asignacion) {
      const verificacion = ConfirmacionAsistenciaService.verificarRango(
        ubicacionUsuario,
        asignacion.ubicacion,
        asignacion.ubicacion.radio_metros
      );
      setVerificacionRango(verificacion);
    }
  }, [ubicacionUsuario, asignacion]);

  const obtenerUbicacionUsuario = async () => {
    try {
      setCargandoUbicacion(true);
      setErrorUbicacion(null);
      
      const ubicacion = await ConfirmacionAsistenciaService.obtenerUbicacionActual({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      });
      
      setUbicacionUsuario(ubicacion);
    } catch (error) {
      setErrorUbicacion(error.message);
    } finally {
      setCargandoUbicacion(false);
    }
  };

  // Función para manejar cuando el mapa está listo
  const handleMapReady = () => {
    setMapReady(true);
  };

  const manejarConfirmacion = async () => {
    if (!ubicacionUsuario || !asignacion) return;

    try {
      setConfirmando(true);
      
      const datos = {
        asignacion_id: asignacion.asignacion_id,
        latitud: ubicacionUsuario.latitud,
        longitud: ubicacionUsuario.longitud,
        observaciones: observaciones.trim() || null
      };

      const response = await ConfirmacionAsistenciaService.confirmarAsistencia(datos);
      
      if (response.success) {
        if (onConfirmacionExitosa) {
          onConfirmacionExitosa(response.data);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error al confirmar asistencia:', error);
      // El error se mostrará en el componente padre
    } finally {
      setConfirmando(false);
    }
  };

  const formatearHora = (hora) => {
    return ConfirmacionAsistenciaService.formatearTiempo(hora);
  };

  if (!asignacion) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Confirmar Asistencia - {asignacion.ubicacion.nombre}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Información de la asignación */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            {asignacion.ubicacion.descripcion}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Horario: {formatearHora(asignacion.horario.inicio)} - {formatearHora(asignacion.horario.fin)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ventana de confirmación: {formatearHora(asignacion.horario.ventana_confirmacion.desde)} - {formatearHora(asignacion.horario.ventana_confirmacion.hasta)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Estado de ubicación */}
        {cargandoUbicacion && (
          <Box display="flex" alignItems="center" mb={2}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography>Obteniendo tu ubicación...</Typography>
          </Box>
        )}

        {errorUbicacion && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={obtenerUbicacionUsuario}>
                <RefreshIcon />
              </Button>
            }
          >
            {errorUbicacion}
          </Alert>
        )}

        {verificacionRango && (
          <Alert 
            severity={verificacionRango.dentroRango ? 'success' : 'warning'}
            sx={{ mb: 2 }}
            icon={verificacionRango.dentroRango ? <CheckIcon /> : <ErrorIcon />}
          >
            <Typography variant="body2">
              {verificacionRango.dentroRango ? (
                `Estás dentro del área permitida (${verificacionRango.distancia}m del centro)`
              ) : (
                `Estás fuera del área permitida (${verificacionRango.distancia}m del centro, ${Math.abs(verificacionRango.diferencia)}m fuera del radio)`
              )}
            </Typography>
          </Alert>
        )}

        {/* Mapa */}
        <Box sx={{ height: 400, width: '100%', mb: 2, position: 'relative' }}>
          <MapaLeafletConfirmacion
            asignacion={asignacion}
            ubicacionUsuario={ubicacionUsuario}
            dentroDelRango={verificacionRango?.dentroRango}
            distancia={verificacionRango?.distancia}
            onMapReady={handleMapReady}
          />
        </Box>

        {/* Leyenda */}
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box display="flex" alignItems="center">
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                backgroundColor: '#f44336',
                mr: 1 
              }} 
            />
            <Typography variant="body2">Ubicación requerida</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                backgroundColor: '#2196f3',
                mr: 1 
              }} 
            />
            <Typography variant="body2">Tu ubicación</Typography>
          </Box>
        </Box>

        {/* Campo de observaciones */}
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Observaciones (opcional)"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Agrega cualquier comentario sobre tu confirmación..."
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={confirmando}>
          Cancelar
        </Button>
        
        <Button 
          onClick={obtenerUbicacionUsuario}
          disabled={cargandoUbicacion || confirmando}
          startIcon={<MyLocationIcon />}
        >
          Actualizar Ubicación
        </Button>
        
        <Button
          onClick={manejarConfirmacion}
          variant="contained"
          disabled={!ubicacionUsuario || confirmando || !asignacion.puede_confirmar}
          startIcon={confirmando ? <CircularProgress size={16} /> : <CheckIcon />}
        >
          {confirmando ? 'Confirmando...' : 'Confirmar Asistencia'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapaConfirmacionAsistencia;