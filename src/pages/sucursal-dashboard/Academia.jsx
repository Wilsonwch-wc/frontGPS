import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import MainCard from "../../components/MainCard";
import usePageTitle from '../../hooks/usePageTitle';

const Academia = () => {
  usePageTitle('Academia');
  const { admin } = useAuthSucursal();
  const [usuarios, setUsuarios] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAsignacion, setEditingAsignacion] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id_usuario_sucursal: '',
    id_ubicacion_control: '',
    dias_semana: [],
    hora_inicio: '',
    hora_fin: ''
  });

  const diasSemana = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  useEffect(() => {
    if (admin?.sucursal?.id) {
      cargarDatos();
    }
  }, [admin]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarUsuarios(),
        cargarUbicaciones(),
        cargarAsignaciones()
      ]);
    } catch (error) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('sucursal_token');
      const response = await fetch('/api/usuarios-sucursal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.data);
      } else {
        setError('Error al cargar usuarios: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      setError('Error de conexión al cargar usuarios');
    }
  };

  const cargarUbicaciones = async () => {
    try {
      const token = localStorage.getItem('sucursal_token');
      
      if (!admin?.sucursal?.id) {
        return;
      }
      
      const response = await fetch(`/api/ubicaciones-gps/sucursal/${admin.sucursal.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUbicaciones(data.data);
      } else {
        setError('Error al cargar ubicaciones: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      setError('Error de conexión al cargar ubicaciones');
    }
  };

  const cargarAsignaciones = async () => {
    try {
      const token = localStorage.getItem('sucursal_token');
      const response = await fetch('/api/control-asistencia/sucursal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAsignaciones(data.data);
      }
    } catch (error) {
      setError('Error de conexión al cargar asignaciones');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiaChange = (dia) => {
    setFormData(prev => {
      const newDias = prev.dias_semana.includes(dia)
        ? prev.dias_semana.filter(d => d !== dia)
        : [...prev.dias_semana, dia];
      return {
        ...prev,
        dias_semana: newDias
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('sucursal_token');
      const url = editingAsignacion 
        ? `/api/control-asistencia/${editingAsignacion.id}`
        : '/api/control-asistencia';
      
      const method = editingAsignacion ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingAsignacion ? 'Asignación actualizada exitosamente' : 'Asignación creada exitosamente');
        setOpenDialog(false);
        resetForm();
        cargarAsignaciones();
      } else {
        setError(data.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asignacion) => {
    setEditingAsignacion(asignacion);
    setFormData({
      id_usuario_sucursal: asignacion.id_usuario_sucursal,
      id_ubicacion_control: asignacion.id_ubicacion_control,
      dias_semana: asignacion.dias_semana,
      hora_inicio: asignacion.hora_inicio,
      hora_fin: asignacion.hora_fin
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignación?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('sucursal_token');
      const response = await fetch(`/api/control-asistencia/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Asignación eliminada exitosamente');
        cargarAsignaciones();
      } else {
        setError(data.message || 'Error al eliminar la asignación');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id_usuario_sucursal: '',
      id_ubicacion_control: '',
      dias_semana: [],
      hora_inicio: '',
      hora_fin: ''
    });
    setEditingAsignacion(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const getUsuarioNombre = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    return usuario ? usuario.nombre_completo : 'Usuario no encontrado';
  };

  const getUbicacionNombre = (id) => {
    const ubicacion = ubicaciones.find(u => u.id === id);
    return ubicacion ? ubicacion.nombre : 'Ubicación no encontrada';
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        Registro de Control de Asistencia
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Asignaciones de Control de Asistencia
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: '1.5rem' }} />}
            onClick={handleOpenDialog}
            disabled={loading}
            size="large"
            sx={{ 
              py: 2, 
              px: 4, 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Nueva Asignación de Control
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
          <Table size="large">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Docente</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Ubicación</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Días</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Horario</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asignaciones.map((asignacion) => (
                <TableRow key={asignacion.id} sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }} />
                      <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        {getUsuarioNombre(asignacion.id_usuario_sucursal)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ mr: 2, color: 'secondary.main', fontSize: '1.5rem' }} />
                      <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        {getUbicacionNombre(asignacion.id_ubicacion_control)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {asignacion.dias_semana.map((dia) => (
                        <Chip 
                          key={dia} 
                          label={dia} 
                          size="medium" 
                          variant="filled" 
                          color="primary"
                          sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimeIcon sx={{ mr: 2, color: 'info.main', fontSize: '1.5rem' }} />
                      <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        {asignacion.hora_inicio} - {asignacion.hora_fin}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(asignacion)}
                          disabled={loading}
                          size="large"
                          sx={{ 
                            backgroundColor: 'primary.light',
                            '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                          }}
                        >
                          <EditIcon sx={{ fontSize: '1.3rem' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(asignacion.id)}
                          disabled={loading}
                          size="large"
                          sx={{ 
                            backgroundColor: 'error.light',
                            '&:hover': { backgroundColor: 'error.main', color: 'white' }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {asignaciones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 6, 
                      px: 4, 
                      backgroundColor: 'grey.50', 
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'grey.300'
                    }}>
                      <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                        📋 No hay asignaciones de control registradas
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Haz clic en "Nueva Asignación de Control" para comenzar
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* Dialog para crear/editar asignación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>
          {editingAsignacion ? 'Editar Asignación' : 'Nueva Asignación de Control'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <FormControl fullWidth required>
                  <InputLabel>Docente</InputLabel>
                  <Select
                    value={formData.id_usuario_sucursal}
                    onChange={(e) => handleInputChange('id_usuario_sucursal', e.target.value)}
                    label="Docente"
                    sx={{
                      '& .MuiSelect-select': {
                        minWidth: '300px'
                      }
                    }}
                  >
                    {usuarios.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nombre_completo} - {usuario.nombre_rol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, md: 8 }}>
                <FormControl fullWidth required>
                  <InputLabel>Ubicación de Control</InputLabel>
                  <Select
                    value={formData.id_ubicacion_control}
                    onChange={(e) => handleInputChange('id_ubicacion_control', e.target.value)}
                    label="Ubicación de Control"
                    sx={{
                      '& .MuiSelect-select': {
                        minWidth: '300px'
                      }
                    }}
                  >
                    {ubicaciones.map((ubicacion) => (
                      <MenuItem key={ubicacion.id} value={ubicacion.id}>
                        {ubicacion.nombre} - {ubicacion.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Hora de Inicio"
                  value={formData.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Hora de Fin"
                  value={formData.hora_fin}
                  onChange={(e) => handleInputChange('hora_fin', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid size={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Días de la Semana
                </Typography>
                <FormGroup row>
                  {diasSemana.map((dia) => (
                    <FormControlLabel
                      key={dia.value}
                      control={
                        <Checkbox
                          checked={formData.dias_semana.includes(dia.value)}
                          onChange={() => handleDiaChange(dia.value)}
                        />
                      }
                      label={dia.label}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {editingAsignacion ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Academia;
