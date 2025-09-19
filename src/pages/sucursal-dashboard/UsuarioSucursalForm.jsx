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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import { createUsuarioSucursal, updateUsuarioSucursal } from '../../api/usuarios-sucursal';
import { getRolesUsuariosSucursal } from '../../api/rol-usuarios-sucursal';

const UsuarioSucursalForm = ({ usuario, onSuccess, onCancel, isEditing }) => {
  const { admin } = useAuthSucursal();
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    confirmPassword: '',
    nombre_completo: '',
    email: '',
    id_rol: '',
    activo: true
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isEditing && usuario) {
      setFormData({
        usuario: usuario.usuario || '',
        password: '',
        confirmPassword: '',
        nombre_completo: usuario.nombre_completo || '',
        email: usuario.email || '',
        id_rol: usuario.id_rol || '',
        activo: usuario.activo !== undefined ? usuario.activo : true
      });
    }
  }, [usuario, isEditing]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await getRolesUsuariosSucursal(admin?.sucursal?.id);
      setRoles(response.data?.filter(rol => rol.activo) || []);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setAlert({
        show: true,
        message: 'Error al cargar los roles disponibles',
        severity: 'error'
      });
    } finally {
      setLoadingRoles(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    } else if (formData.usuario.length > 50) {
      newErrors.usuario = 'El usuario no puede exceder 50 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      newErrors.usuario = 'El usuario solo puede contener letras, números y guiones bajos';
    }

    // Validar contraseña (solo en creación o si se está cambiando)
    if (!isEditing || formData.password) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (formData.password.length > 100) {
        newErrors.password = 'La contraseña no puede exceder 100 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    // Validar nombre completo
    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre completo es obligatorio';
    } else if (formData.nombre_completo.length < 2) {
      newErrors.nombre_completo = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre_completo.length > 100) {
      newErrors.nombre_completo = 'El nombre no puede exceder 100 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    } else if (formData.email.length > 100) {
      newErrors.email = 'El email no puede exceder 100 caracteres';
    }

    // Validar rol
    if (!formData.id_rol) {
      newErrors.id_rol = 'Debe seleccionar un rol';
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
        usuario: formData.usuario,
        nombre_completo: formData.nombre_completo,
        correo: formData.email, // El backend espera 'correo' no 'email'
        id_rol: formData.id_rol,
        id_sucursal: admin?.sucursal?.id, // Campo requerido por el backend
        activo: formData.activo
      };

      // Solo incluir password si se está creando o si se está cambiando
      if (!isEditing || formData.password) {
        dataToSend.password = formData.password;
      }

      let response;
      if (isEditing) {
        response = await updateUsuarioSucursal(usuario.id, dataToSend);
      } else {
        response = await createUsuarioSucursal(dataToSend);
      }

      if (response.success) {
        onSuccess(response.message || `Usuario ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
      } else {
        setAlert({
          show: true,
          message: response.message || 'Error al procesar la solicitud',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      let errorMessage = 'Error al guardar el usuario';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifique la información ingresada';
      } else if (error.response?.status === 409) {
        errorMessage = 'El usuario o email ya existe en esta sucursal';
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

  if (loadingRoles) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {alert.show && (
        <Alert 
          severity={alert.severity} 
          sx={{ mb: 2 }}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Nombre de Usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleInputChange}
            error={!!errors.usuario}
            helperText={errors.usuario}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Ej: juan_perez"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Nombre Completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleInputChange}
            error={!!errors.nombre_completo}
            helperText={errors.nombre_completo}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Ej: Juan Pérez García"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Ej: juan.perez@empresa.com"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password || (isEditing ? "Dejar vacío para mantener la actual" : "")}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Mínimo 6 caracteres"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={loading || (isEditing && !formData.password)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Repetir contraseña"
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth error={!!errors.id_rol}>
            <InputLabel>Rol</InputLabel>
            <Select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleInputChange}
              disabled={loading}
              startAdornment={
                <InputAdornment position="start">
                  <SecurityIcon color="action" />
                </InputAdornment>
              }
            >
              {roles.map((rol) => (
                <MenuItem key={rol.id} value={rol.id}>
                  <Box>
                    <Typography variant="body1">{rol.nombre_rol}</Typography>
                    {rol.descripcion && (
                      <Typography variant="caption" color="text.secondary">
                        {rol.descripcion}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.id_rol && <FormHelperText>{errors.id_rol}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.activo}
                onChange={handleInputChange}
                name="activo"
                disabled={loading}
              />
            }
            label="Usuario activo"
          />
        </Grid>
      </Grid>

      <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
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
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
        </Button>
      </Box>
    </Box>
  );
};

export default UsuarioSucursalForm;