import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createSucursal, updateSucursal } from '../../api/sucursales';
import { getRolesSucursal } from '../../api/rolesSucursal';

// Esquema de validación
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  descripcion: Yup.string()
    .required('La descripción es requerida')
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(255, 'La descripción no puede exceder 255 caracteres'),
  direccion: Yup.string()
    .max(500, 'La dirección no puede exceder 500 caracteres'),
  telefono: Yup.string()
    .matches(/^[+]?[0-9\s\-()]*$/, 'Formato de teléfono inválido')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  tipo_sucursal_id: Yup.number()
    .required('El tipo de sucursal es requerido')
    .positive('Debe seleccionar un tipo válido'),
  activo: Yup.boolean()
});

const SucursalForm = ({ sucursal, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tiposSucursal, setTiposSucursal] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const isEditing = !!sucursal;

  // Cargar tipos de sucursales
  useEffect(() => {
    const loadTiposSucursal = async () => {
      try {
        setLoadingTipos(true);
        const response = await getRolesSucursal();
        if (response.success) {
          setTiposSucursal(response.data);
        }
      } catch (error) {
        console.error('Error al cargar tipos de sucursales:', error);
        setError('Error al cargar tipos de sucursales');
      } finally {
        setLoadingTipos(false);
      }
    };

    loadTiposSucursal();
  }, []);

  // Valores iniciales del formulario
  const initialValues = {
    nombre: sucursal?.nombre || '',
    descripcion: sucursal?.descripcion || '',
    direccion: sucursal?.direccion || '',
    telefono: sucursal?.telefono || '',
    tipo_sucursal_id: sucursal?.tipo_sucursal_id || '',
    activo: sucursal?.activo !== undefined ? sucursal.activo : true
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (isEditing) {
        response = await updateSucursal(sucursal.id, values);
      } else {
        response = await createSucursal(values);
      }

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Datos inválidos';
        setError(errorMessage);
        
        // Si el error es específico de un campo, marcarlo
        if (errorMessage.includes('nombre')) {
          setFieldError('nombre', errorMessage);
        }
      } else {
        setError('Error al procesar la solicitud. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Información Básica */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Básica
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="nombre"
                  label="Nombre de la Sucursal"
                  fullWidth
                  variant="outlined"
                  error={touched.nombre && !!errors.nombre}
                  helperText={touched.nombre && errors.nombre}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="telefono"
                  label="Teléfono"
                  fullWidth
                  variant="outlined"
                  error={touched.telefono && !!errors.telefono}
                  helperText={touched.telefono && errors.telefono}
                  disabled={loading}
                  placeholder="Ej: +1234567890"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  error={touched.tipo_sucursal_id && !!errors.tipo_sucursal_id}
                  disabled={loading || loadingTipos}
                >
                  <InputLabel>Tipo de Sucursal</InputLabel>
                  <Select
                    name="tipo_sucursal_id"
                    value={values.tipo_sucursal_id}
                    onChange={(e) => setFieldValue('tipo_sucursal_id', e.target.value)}
                    label="Tipo de Sucursal"
                  >
                    {tiposSucursal.map((tipo) => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.tipo_sucursal_id && errors.tipo_sucursal_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.tipo_sucursal_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="descripcion"
                  label="Descripción"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  error={touched.descripcion && !!errors.descripcion}
                  helperText={touched.descripcion && errors.descripcion}
                  disabled={loading}
                  placeholder="Descripción detallada de la sucursal"
                />
              </Grid>

              {/* Información de Ubicación */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Información de Ubicación
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="direccion"
                  label="Dirección"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  error={touched.direccion && !!errors.direccion}
                  helperText={touched.direccion && errors.direccion}
                  disabled={loading}
                  placeholder="Dirección completa de la sucursal"
                />
              </Grid>

              {/* Configuración */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Configuración
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.activo}
                        onChange={(e) => setFieldValue('activo', e.target.checked)}
                        disabled={loading}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">
                          Sucursal Activa
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {values.activo 
                            ? 'La sucursal está activa y disponible para operaciones' 
                            : 'La sucursal está inactiva y no disponible para operaciones'
                          }
                        </Typography>
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
                  <Button
                    onClick={onCancel}
                    disabled={loading}
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || isSubmitting}
                    sx={{ minWidth: 100 }}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading 
                      ? 'Procesando...' 
                      : isEditing 
                        ? 'Actualizar' 
                        : 'Crear'
                    }
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SucursalForm;