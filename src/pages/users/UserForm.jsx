import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createUser, updateUser, getRoles } from '../../api/users';

const UserForm = ({ open, onClose, onSuccess, user, mode }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = mode === 'edit';

  // Esquema de validación
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('El nombre de usuario es requerido')
      .min(3, 'Mínimo 3 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    email: Yup.string()
      .email('Email inválido')
      .required('El email es requerido'),
    password: isEdit
      ? Yup.string().min(6, 'Mínimo 6 caracteres')
      : Yup.string().required('La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
    nombre: Yup.string()
      .required('El nombre es requerido')
      .max(100, 'Máximo 100 caracteres'),
    apellido: Yup.string()
      .required('El apellido es requerido')
      .max(100, 'Máximo 100 caracteres'),
    telefono: Yup.string().max(20, 'Máximo 20 caracteres'),
    direccion: Yup.string().max(255, 'Máximo 255 caracteres'),
    fecha_nacimiento: Yup.date(),
    rol_id: Yup.number().required('El rol es requerido')
  });

  // Valores iniciales
  const initialValues = {
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    fecha_nacimiento: user?.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : '',
    rol_id: user?.rol_id || '',
    activo: user?.activo !== undefined ? user.activo : true
  };

  // Cargar roles al abrir el formulario
  useEffect(() => {
    if (open) {
      loadRoles();
    }
  }, [open]);

  const loadRoles = async () => {
    try {
      const response = await getRoles();
      if (response.success) {
        setRoles(response.data || []);
      }
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setLoading(true);
      setError(null);

      // Preparar datos para enviar
      const userData = { ...values };
      
      // Si es edición y no se proporcionó contraseña, no enviarla
      if (isEdit && !userData.password) {
        delete userData.password;
      }

      let response;
      if (isEdit) {
        response = await updateUser(user.id, userData);
      } else {
        response = await createUser(userData);
      }

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Error al guardar usuario');
      }
    } catch (err) {
      if (err.errors) {
        // Errores de validación del servidor
        Object.keys(err.errors).forEach(field => {
          setFieldError(field, err.errors[field]);
        });
      } else {
        setError(err.message || 'Error al guardar usuario');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
      <DialogTitle>
        {isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </DialogTitle>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={3}>
                {/* Información de Acceso */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                      Información de Acceso
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="username"
                    label="Nombre de Usuario"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    disabled={isEdit}
                    autoComplete="username"
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    autoComplete="email"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label={isEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    autoComplete={isEdit ? 'new-password' : 'new-password'}
                    variant="outlined"
                  />
                </Grid>

                {/* Información Personal */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                      Información Personal
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="nombre"
                    label="Nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.nombre && Boolean(errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                    autoComplete="given-name"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="apellido"
                    label="Apellido"
                    value={values.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.apellido && Boolean(errors.apellido)}
                    helperText={touched.apellido && errors.apellido}
                    autoComplete="family-name"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="telefono"
                    label="Teléfono"
                    value={values.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.telefono && Boolean(errors.telefono)}
                    helperText={touched.telefono && errors.telefono}
                    autoComplete="tel"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="fecha_nacimiento"
                    label="Fecha de Nacimiento"
                    type="date"
                    value={values.fecha_nacimiento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fecha_nacimiento && Boolean(errors.fecha_nacimiento)}
                    helperText={touched.fecha_nacimiento && errors.fecha_nacimiento}
                    InputLabelProps={{ shrink: true }}
                    autoComplete="bday"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="direccion"
                    label="Dirección"
                    multiline
                    rows={3}
                    value={values.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.direccion && Boolean(errors.direccion)}
                    helperText={touched.direccion && errors.direccion}
                    autoComplete="street-address"
                    variant="outlined"
                  />
                </Grid>

                {/* Configuración del Sistema */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                      Configuración del Sistema
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.rol_id && Boolean(errors.rol_id)} variant="outlined">
                    <InputLabel>Rol del Usuario</InputLabel>
                    <Select
                      name="rol_id"
                      value={values.rol_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Rol del Usuario"
                    >
                      {roles.map((rol) => (
                        <MenuItem key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.rol_id && errors.rol_id && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                        {errors.rol_id}
                      </Box>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pl: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="activo"
                          checked={values.activo}
                          onChange={handleChange}
                          color="primary"
                        />
                      }
                      label="Usuario Activo"
                      sx={{ 
                        '& .MuiFormControlLabel-label': { 
                          fontSize: '1rem',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {isEdit ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserForm;