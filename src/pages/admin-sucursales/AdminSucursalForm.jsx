import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { createAdminSucursal, updateAdminSucursal } from '../../api/admin-sucursales';
import { getSucursalesActivas } from '../../api/sucursales';

const AdminSucursalForm = ({ admin, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: '',
    confirmPassword: '',
    activo: true,
    id_sucursal: ''
  });
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSucursales, setLoadingSucursales] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!admin;

  useEffect(() => {
    loadSucursales();
    if (admin) {
      setFormData({
        usuario: admin.usuario || '',
        correo: admin.correo || '',
        password: '',
        confirmPassword: '',
        activo: admin.activo !== undefined ? admin.activo : true,
        id_sucursal: admin.id_sucursal || ''
      });
    }
  }, [admin]);

  const loadSucursales = async () => {
    try {
      setLoadingSucursales(true);
      const response = await getSucursalesActivas();
      // Asegurar que response.data sea un array
      setSucursales(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading sucursales:', error);
      setError('Error al cargar las sucursales');
      setSucursales([]); // Establecer array vacío en caso de error
    } finally {
      setLoadingSucursales(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'activo' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
    }

    if (!isEditing || formData.password) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (!formData.id_sucursal) {
      newErrors.id_sucursal = 'La sucursal es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        usuario: formData.usuario,
        correo: formData.correo,
        activo: formData.activo,
        id_sucursal: formData.id_sucursal
      };

      // Solo incluir password si se está creando o si se proporcionó una nueva
      if (!isEditing || formData.password) {
        submitData.password = formData.password;
      }

      if (isEditing) {
        await updateAdminSucursal(admin.id, submitData);
        onSuccess('Usuario de sucursal actualizado exitosamente');
      } else {
        await createAdminSucursal(submitData);
        onSuccess('Usuario de sucursal creado exitosamente');
      }
    } catch (error) {
      console.error('Error saving admin sucursal:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al guardar el usuario de sucursal');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingSucursales) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            error={!!errors.usuario}
            helperText={errors.usuario}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              )
            }}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            error={!!errors.correo}
            helperText={errors.correo}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              )
            }}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password || (isEditing ? "Dejar vacío para mantener la contraseña actual" : "")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            required={!isEditing}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            required={!isEditing || !!formData.password}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.id_sucursal}>
            <InputLabel>Sucursal</InputLabel>
            <Select
              name="id_sucursal"
              value={formData.id_sucursal}
              onChange={handleChange}
              label="Sucursal"
              startAdornment={(
                <InputAdornment position="start">
                  <StoreIcon color="action" sx={{ mr: 1 }} />
                </InputAdornment>
              )}
            >
              {sucursales.map((sucursal) => (
                <MenuItem key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre} - {sucursal.descripcion}
                </MenuItem>
              ))}
            </Select>
            {errors.id_sucursal && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.id_sucursal}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Usuario Activo"
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSucursalForm;