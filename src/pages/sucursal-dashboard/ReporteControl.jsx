import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import MainCard from 'components/MainCard';
import usePageTitle from '../../hooks/usePageTitle';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// ==============================|| REPORTE CONTROL PAGE ||============================== //

const ReporteControl = () => {
  const theme = useTheme();
  const { admin } = useAuthSucursal();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    usuario_id: '',
    limite: 50
  });
  const [error, setError] = useState('');
  const [modalMapa, setModalMapa] = useState({
    abierto: false,
    ubicacionMarcaje: null,
    ubicacionRequerida: null
  });
  
  usePageTitle('Reporte Control de Asistencia');

  // Crear instancia de axios con token de admin sucursal
  const apiReporte = axios.create({
    baseURL: `${API_BASE_URL}/confirmacion-asistencia`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Interceptor para agregar token
  apiReporte.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('sucursal_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Cargar datos iniciales
  useEffect(() => {
    if (admin) {
      cargarReportes();
    }
  }, [admin]);

  const cargarReportes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
      if (filtros.limite) params.append('limite', filtros.limite.toString());

      const response = await apiReporte.get(`/reporte?${params.toString()}`);
      if (response.data.success) {
        setReportes(response.data.data);
        setError('');
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setError('Error al cargar reportes de asistencia');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    cargarReportes();
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: '',
      fecha_fin: '',
      usuario_id: '',
      limite: 50
    });
    setTimeout(() => cargarReportes(), 100);
  };

  const getEstadoChip = (dentroUbicacion) => {
    return dentroUbicacion ? (
      <Chip 
        label="Dentro del rango" 
        color="success" 
        size="small" 
      />
    ) : (
      <Chip 
        label="Fuera del rango" 
        color="error" 
        size="small" 
      />
    );
  };

  const verUbicacionEnMapa = (ubicacionMarcaje, ubicacionRequerida) => {
    setModalMapa({
      abierto: true,
      ubicacionMarcaje,
      ubicacionRequerida
    });
  };

  const cerrarModalMapa = () => {
    setModalMapa({
      abierto: false,
      ubicacionMarcaje: null,
      ubicacionRequerida: null
    });
  };

  const abrirEnGoogleMaps = () => {
    if (modalMapa.ubicacionMarcaje && modalMapa.ubicacionRequerida) {
      const { latitud: lat1, longitud: lng1 } = modalMapa.ubicacionMarcaje;
      const { latitud: lat2, longitud: lng2 } = modalMapa.ubicacionRequerida;
      const url = `https://www.google.com/maps/dir/${lat2},${lng2}/${lat1},${lng1}`;
      window.open(url, '_blank');
    }
  };

  if (!admin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Reporte Control de Asistencia
        </Typography>
      </Grid>



      {/* Filtros */}
      <Grid item xs={12}>
        <MainCard>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FilterIcon color="primary" />
            <TextField
              label="Fecha Inicio"
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              select
              label="Límite"
              value={filtros.limite}
              onChange={(e) => handleFiltroChange('limite', parseInt(e.target.value))}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={aplicarFiltros}
              disabled={loading}
              startIcon={<FilterIcon />}
            >
              Aplicar
            </Button>
            <Button
              variant="outlined"
              onClick={limpiarFiltros}
              disabled={loading}
              startIcon={<RefreshIcon />}
            >
              Limpiar
            </Button>
          </Stack>
        </MainCard>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}

      {/* Tabla de Reportes */}
      <Grid item xs={12}>
        <MainCard title={`Reportes de Asistencia (${reportes.length} registros)`}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 2,
                maxHeight: '70vh',
                overflow: 'auto'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 80 }}>Hora</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 200 }}>Usuario</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 150 }}>Ubicación</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Distancia</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportes.map((reporte) => (
                    <TableRow key={reporte.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(reporte.fecha_confirmacion).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {reporte.hora_marcaje}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {reporte.usuario.nombre_completo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {reporte.usuario.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {reporte.ubicacion.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reporte.ubicacion.descripcion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getEstadoChip(reporte.resultado.dentro_ubicacion)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {(reporte.resultado.distancia_metros || 0).toFixed(0)}m
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Ver ubicación en mapa">
                          <IconButton
                            onClick={() => verUbicacionEnMapa(
                              reporte.ubicacion_marcaje,
                              reporte.ubicacion
                            )}
                            color="primary"
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reportes.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No hay reportes de asistencia disponibles
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
      </Grid>

      {/* Modal de Mapa */}
      <Dialog
        open={modalMapa.abierto}
        onClose={cerrarModalMapa}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Ubicaciones en Mapa</Typography>
            <IconButton onClick={cerrarModalMapa} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {modalMapa.ubicacionMarcaje && modalMapa.ubicacionRequerida && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, backgroundColor: theme.palette.success.light }}>
                    <Typography variant="h6" gutterBottom color="success.dark">
                      📍 Ubicación Requerida
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Nombre:</strong> {modalMapa.ubicacionRequerida.nombre}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Descripción:</strong> {modalMapa.ubicacionRequerida.descripcion}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Coordenadas:</strong> {modalMapa.ubicacionRequerida.latitud}, {modalMapa.ubicacionRequerida.longitud}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Radio permitido:</strong> {modalMapa.ubicacionRequerida.radio_metros}m
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, backgroundColor: theme.palette.info.light }}>
                    <Typography variant="h6" gutterBottom color="info.dark">
                      📱 Ubicación de Marcaje
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Coordenadas:</strong> {modalMapa.ubicacionMarcaje.latitud}, {modalMapa.ubicacionMarcaje.longitud}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Precisión:</strong> {modalMapa.ubicacionMarcaje.precision || 'N/A'}m
                    </Typography>
                    <Typography variant="body2">
                      <strong>Distancia:</strong> {modalMapa.ubicacionMarcaje.distancia_metros ? `${modalMapa.ubicacionMarcaje.distancia_metros.toFixed(0)}m` : 'N/A'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Haz clic en el botón para ver las ubicaciones en Google Maps
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalMapa} color="inherit">
            Cerrar
          </Button>
          <Button 
            onClick={abrirEnGoogleMaps} 
            variant="contained" 
            color="primary"
            startIcon={<LocationIcon />}
          >
            Ver en Google Maps
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ReporteControl;