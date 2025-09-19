import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment
} from '@mui/material';
import {
  Security as SecurityIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import { createRolUsuarioSucursal, updateRolUsuarioSucursal } from '../../api/rol-usuarios-sucursal';

const RolUsuarioSucursalForm = ({ rol, onSuccess, onCancel }) => {
  const { admin } = useAuthSucursal();
  const [formData, setFormData] = useState({
    nombre_rol: '',
    descripcion: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  const isEditing = !!rol;

  useEffect(() => {
    if (isEditing && rol) {
      setFormData({
        nombre_rol: rol.nombre_rol || '',
        descripcion: rol.descripcion || '',
        activo: rol.activo !== undefined ? rol.activo : true
      });
    }
  }, [rol, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre_rol.trim()) {
      newErrors.nombre_rol = 'El nombre del rol es obligatorio';
    } else if (formData.nombre_rol.length < 3) {
      newErrors.nombre_rol = 'El nombre del rol debe tener al menos 3 caracteres';
    } else if (formData.nombre_rol.length > 50) {
      newErrors.nombre_rol = 'El nombre del rol no puede exceder 50 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 255) {
      newErrors.descripcion = 'La descripción no puede exceder 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert({ show: false, message: '', severity: 'info' });

    try {
      const dataToSend = {
        ...formData,
        id_sucursal: admin?.sucursal?.id
      };

      let response;
      if (isEditing) {
        response = await updateRolUsuarioSucursal(rol.id, dataToSend);
      } else {
        response = await createRolUsuarioSucursal(dataToSend);
      }

      if (response.success) {
        onSuccess(isEditing ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente');
      } else {
        setAlert({
          show: true,
          message: response.message || 'Error al procesar la solicitud',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al guardar rol:', error);
      let errorMessage = 'Error al procesar la solicitud';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        show: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del Rol"
            name="nombre_rol"
            value={formData.nombre_rol}
            onChange={handleInputChange}
            error={!!errors.nombre_rol}
            helperText={errors.nombre_rol}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SecurityIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Ej: Vendedor, Cajero, Supervisor"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            error={!!errors.descripcion}
            helperText={errors.descripcion || 'Descripción opcional del rol y sus responsabilidades'}
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Describe las responsabilidades y permisos de este rol..."
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.activo}
                onChange={handleInputChange}
                name="activo"
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Estado del Rol
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formData.activo ? 'El rol está activo y disponible para asignar' : 'El rol está inactivo y no se puede asignar'}
                </Typography>
              </Box>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
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
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Rol')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RolUsuarioSucursalForm;