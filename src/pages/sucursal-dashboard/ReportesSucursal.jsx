import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Description as FileTextIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import usePageTitle from '../../hooks/usePageTitle';

const ReportesSucursal = () => {
  const theme = useTheme();
  const { admin } = useAuthSucursal();
  const [reportes, setReportes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('mes');
  const [loading, setLoading] = useState(false);
  usePageTitle('Reportes Sucursal');

  // Datos de ejemplo para reportes
  const reportesEjemplo = [
    {
      id: 1,
      nombre: 'Reporte de Ventas Mensual',
      tipo: 'ventas',
      fecha: '2024-01-15',
      estado: 'completado',
      tamaño: '2.5 MB'
    },
    {
      id: 2,
      nombre: 'Inventario Actual',
      tipo: 'inventario',
      fecha: '2024-01-14',
      estado: 'completado',
      tamaño: '1.8 MB'
    },
    {
      id: 3,
      nombre: 'Reporte de Usuarios',
      tipo: 'usuarios',
      fecha: '2024-01-13',
      estado: 'procesando',
      tamaño: '0.9 MB'
    },
    {
      id: 4,
      nombre: 'Análisis de Rendimiento',
      tipo: 'rendimiento',
      fecha: '2024-01-12',
      estado: 'completado',
      tamaño: '3.2 MB'
    }
  ];

  useEffect(() => {
    setReportes(reportesEjemplo);
  }, []);

  const handleGenerarReporte = (tipo) => {
    setLoading(true);
    // Simular generación de reporte
    setTimeout(() => {
      setLoading(false);
      console.log(`Generando reporte de ${tipo}`);
    }, 2000);
  };

  const handleDescargarReporte = (reporte) => {
    console.log(`Descargando reporte: ${reporte.nombre}`);
  };

  const getEstadoChip = (estado) => {
    const config = {
      completado: { color: 'success', label: 'Completado' },
      procesando: { color: 'warning', label: 'Procesando' },
      error: { color: 'error', label: 'Error' }
    };
    return (
      <Chip
        label={config[estado]?.label || estado}
        color={config[estado]?.color || 'default'}
        size="small"
      />
    );
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      ventas: <TrendingUpIcon />,
      inventario: <BarChartIcon />,
      usuarios: <PieChartIcon />,
      rendimiento: <BarChartIcon />
    };
    return icons[tipo] || <FileTextIcon />;
  };

  const reportesFiltrados = reportes.filter(reporte => {
    if (filtroTipo !== 'todos' && reporte.tipo !== filtroTipo) return false;
    return true;
  });

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <FileTextIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Reportes de Sucursal
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Actualizar">
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Grid>

      {/* Estadísticas Rápidas */}
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce 
          title="Reportes Generados" 
          count="24" 
          percentage={15.3} 
          extra="Este mes" 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce 
          title="Descargas" 
          count="156" 
          percentage={8.7} 
          extra="Total" 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce 
          title="Reportes Pendientes" 
          count="3" 
          percentage={-2.1} 
          isLoss 
          color="warning" 
          extra="En proceso" 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce 
          title="Tamaño Total" 
          count="45.2 MB" 
          percentage={12.4} 
          extra="Almacenados" 
        />
      </Grid>

      {/* Generación Rápida de Reportes */}
      <Grid item xs={12}>
        <MainCard title="Generar Nuevos Reportes">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleGenerarReporte('ventas')}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Reporte de Ventas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Análisis de ventas y ingresos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleGenerarReporte('inventario')}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <BarChartIcon sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Inventario
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado actual del inventario
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleGenerarReporte('usuarios')}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <PieChartIcon sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Usuarios
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Actividad de usuarios
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleGenerarReporte('rendimiento')}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <BarChartIcon sx={{ fontSize: 48, color: theme.palette.info.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Rendimiento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Métricas de rendimiento
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* Filtros */}
      <Grid item xs={12}>
        <MainCard>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FilterIcon color="primary" />
            <TextField
              select
              label="Tipo de Reporte"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="todos">Todos los tipos</MenuItem>
              <MenuItem value="ventas">Ventas</MenuItem>
              <MenuItem value="inventario">Inventario</MenuItem>
              <MenuItem value="usuarios">Usuarios</MenuItem>
              <MenuItem value="rendimiento">Rendimiento</MenuItem>
            </TextField>
            <TextField
              select
              label="Período"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="dia">Hoy</MenuItem>
              <MenuItem value="semana">Esta semana</MenuItem>
              <MenuItem value="mes">Este mes</MenuItem>
              <MenuItem value="trimestre">Trimestre</MenuItem>
              <MenuItem value="año">Este año</MenuItem>
            </TextField>
          </Stack>
        </MainCard>
      </Grid>

      {/* Lista de Reportes */}
      <Grid item xs={12}>
        <MainCard title="Reportes Generados">
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tamaño</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportesFiltrados.map((reporte) => (
                  <TableRow key={reporte.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getTipoIcon(reporte.tipo)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {reporte.tipo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {reporte.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(reporte.fecha).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getEstadoChip(reporte.estado)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {reporte.tamaño}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Descargar">
                        <IconButton
                          onClick={() => handleDescargarReporte(reporte)}
                          disabled={reporte.estado !== 'completado'}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {reportesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No hay reportes disponibles
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ReportesSucursal;