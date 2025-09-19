import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import ConfirmacionAsistenciaService from '../../services/confirmacionAsistenciaService';

const CardAsignacionAsistencia = ({ onAbrirMapa }) => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horaActual, setHoraActual] = useState(new Date());

  // Actualizar hora cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Cargar asignaciones del día
  useEffect(() => {
    cargarAsignaciones();
  }, []);

  const cargarAsignaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ConfirmacionAsistenciaService.obtenerAsignacionesHoy();
      
      if (response.success) {
        setAsignaciones(response.data.asignaciones || []);
      } else {
        setError('No se pudieron cargar las asignaciones');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const obtenerConfigEstado = (estado) => {
    return ConfirmacionAsistenciaService.obtenerConfigEstado(estado);
  };

  const formatearHora = (hora) => {
    return ConfirmacionAsistenciaService.formatearTiempo(hora);
  };

  const manejarClickAsignacion = (asignacion) => {
    if (onAbrirMapa) {
      onAbrirMapa(asignacion);
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={2}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Cargando asignaciones...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={cargarAsignaciones}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (asignaciones.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box textAlign="center" py={2}>
            <CheckIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              No tienes asignaciones de asistencia para hoy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ¡Disfruta tu día libre!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2, cursor: 'pointer' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Control de Asistencia
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Tienes {asignaciones.length} asignación{asignaciones.length !== 1 ? 'es' : ''} para hoy
        </Typography>

        {asignaciones.map((asignacion, index) => {
          const config = obtenerConfigEstado(asignacion.estado);
          const puedeConfirmar = asignacion.puede_confirmar;
          
          return (
            <Box key={asignacion.asignacion_id} mb={index < asignaciones.length - 1 ? 2 : 0}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              
              <Box 
                onClick={() => manejarClickAsignacion(asignacion)}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: puedeConfirmar ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  backgroundColor: puedeConfirmar ? 'primary.50' : 'grey.50',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: puedeConfirmar ? 'primary.100' : 'grey.100',
                    transform: 'translateY(-1px)',
                    boxShadow: 1
                  }
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {asignacion.ubicacion.nombre}
                  </Typography>
                  <Chip
                    label={config.texto}
                    color={config.color}
                    size="small"
                    icon={<span>{config.icono}</span>}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {asignacion.ubicacion.descripcion}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Horario: {formatearHora(asignacion.horario.inicio)} - {formatearHora(asignacion.horario.fin)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Confirmación: {formatearHora(asignacion.horario.ventana_confirmacion.desde)} - {formatearHora(asignacion.horario.ventana_confirmacion.hasta)}
                  </Typography>
                </Box>

                {asignacion.confirmacion && (
                  <Box mt={1}>
                    <Typography variant="body2" color="success.main">
                      ✓ Confirmado a las {formatearHora(asignacion.confirmacion.hora_marcaje)}
                      {asignacion.confirmacion.dentro_ubicacion ? 
                        ' (Dentro del área)' : 
                        ` (Fuera del área - ${asignacion.confirmacion.distancia_metros}m)`
                      }
                    </Typography>
                  </Box>
                )}

                {puedeConfirmar && (
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<LocationIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        manejarClickAsignacion(asignacion);
                      }}
                    >
                      Confirmar Asistencia
                    </Button>
                  </Box>
                )}

                {asignacion.estado === 'disponible_confirmacion' && !puedeConfirmar && (
                  <Box mt={1}>
                    <Alert severity="info" size="small">
                      Ventana de confirmación disponible. Haz clic para abrir el mapa.
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Última actualización: {horaActual.toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardAsignacionAsistencia;