import React, { useState, useEffect } from 'react';
import {
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
  Typography,
  InputAdornment,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import {
  Store as StoreIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
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

const SucursalForm = ({ sucursal, onSuccess, onCancel, open, onClose }) => {
  const [tiposSucursal, setTiposSucursal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!sucursal;

  // Valores iniciales del formulario
  const initialValues = {
    nombre: sucursal?.nombre || '',
    descripcion: sucursal?.descripcion || '',
    direccion: sucursal?.direccion || '',
    telefono: sucursal?.telefono || '',
    tipo_sucursal_id: sucursal?.tipo_sucursal_id || null,
    activo: sucursal?.activo !== undefined ? sucursal.activo : true
  };

  // Cargar tipos de sucursal
  useEffect(() => {
    const loadTiposSucursal = async () => {
      try {
        const response = await getRolesSucursal();
        if (response.success) {
          setTiposSucursal(response.data);
        }
      } catch (error) {
        console.error('Error al cargar tipos de sucursal:', error);
        setError('Error al cargar tipos de sucursal');
      }
    };

    loadTiposSucursal();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setLoading(true);
      setError('');

      const sucursalData = {
        nombre: values.nombre.trim(),
        descripcion: values.descripcion.trim(),
        direccion: values.direccion.trim(),
        telefono: values.telefono.trim(),
        tipo_sucursal_id: values.tipo_sucursal_id,
        activo: values.activo
      };

      let response;
      if (isEditing) {
        response = await updateSucursal(sucursal.id, sucursalData);
      } else {
        response = await createSucursal(sucursalData);
      }

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setError('Error al procesar la solicitud');
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
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Stack spacing={4}>
              {/* Información Básica */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3,
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  <InfoIcon />
                  Información Básica
                </Typography>
                
                <Grid container spacing={4}>
                  {/* Primera fila - Nombre completo */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="nombre"
                      label="Nombre de la Sucursal"
                      value={values.nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nombre && !!errors.nombre}
                      helperText={touched.nombre && errors.nombre}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StoreIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: 56,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Segunda fila - Tipo de Sucursal */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      name="tipo_sucursal_id"
                      label="Tipo de Sucursal"
                      value={values.tipo_sucursal_id || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.tipo_sucursal_id && !!errors.tipo_sucursal_id}
                      helperText={touched.tipo_sucursal_id && errors.tipo_sucursal_id}
                      placeholder="Selecciona un tipo de sucursal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: 56,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Selecciona un tipo de sucursal</em>
                      </MenuItem>
                      {tiposSucursal.map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Tercera fila - Teléfono y Descripción */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="telefono"
                      label="Teléfono"
                      value={values.telefono}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.telefono && !!errors.telefono}
                      helperText={touched.telefono && errors.telefono}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: 56,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="descripcion"
                      label="Descripción"
                      multiline
                      rows={2}
                      value={values.descripcion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.descripcion && !!errors.descripcion}
                      helperText={touched.descripcion && errors.descripcion}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <DescriptionIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Información de Ubicación */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3,
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  <LocationIcon />
                  Información de Ubicación
                </Typography>

                <TextField
                  fullWidth
                  name="direccion"
                  label="Dirección Completa"
                  multiline
                  rows={2}
                  value={values.direccion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.direccion && !!errors.direccion}
                  helperText={touched.direccion && errors.direccion}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <LocationIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Paper>

              {/* Configuración */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3,
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  <SettingsIcon />
                  Configuración
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      name="activo"
                      checked={values.activo}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Sucursal Activa"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500,
                      color: 'text.primary',
                    },
                  }}
                />
              </Paper>
            </Stack>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
               <Button
                 variant="outlined"
                 onClick={onCancel}
                 disabled={isSubmitting}
                 sx={{
                   borderRadius: 2,
                   px: 4,
                   py: 1.5,
                   textTransform: 'none',
                   fontWeight: 500,
                   borderWidth: 2,
                   '&:hover': {
                     borderWidth: 2,
                   },
                 }}
               >
                 Cancelar
               </Button>
               <Button
                 type="submit"
                 variant="contained"
                 disabled={isSubmitting}
                 sx={{
                   borderRadius: 2,
                   px: 4,
                   py: 1.5,
                   textTransform: 'none',
                   fontWeight: 500,
                   boxShadow: 3,
                   '&:hover': {
                     boxShadow: 6,
                   },
                 }}
               >
                 {isSubmitting ? (
                   <CircularProgress size={20} color="inherit" />
                 ) : (
                   sucursal ? 'Actualizar' : 'Crear'
                 )}
               </Button>
             </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SucursalForm;