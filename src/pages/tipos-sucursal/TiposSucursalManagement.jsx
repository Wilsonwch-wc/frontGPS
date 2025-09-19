import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  CircularProgress,
  TextField,
  FormControl
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getRolesSucursal, createRolSucursal, updateRolSucursal, deleteRolSucursal } from '../../api/rolesSucursal';

const TiposSucursalManagement = () => {
  const [tiposSucursal, setTiposSucursal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [submitting, setSubmitting] = useState(false);

  // Esquema de validación
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required('El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
  });

  // Cargar tipos de sucursal
  const loadTiposSucursal = async () => {
    try {
      setLoading(true);
      const response = await getRolesSucursal();
      setTiposSucursal(response.data || []);
    } catch (error) {
      console.error('Error al cargar tipos de sucursal:', error);
      showSnackbar('Error al cargar tipos de sucursal', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTiposSucursal();
  }, []);

  // Mostrar snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Abrir diálogo para crear
  const handleCreate = () => {
    setSelectedTipo(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar
  const handleEdit = (tipo) => {
    setSelectedTipo(tipo);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Abrir diálogo de confirmación para eliminar
  const handleDelete = (tipo) => {
    setSelectedTipo(tipo);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogos
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTipo(null);
    setIsEditing(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedTipo(null);
  };

  // Enviar formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      
      if (isEditing) {
        await updateRolSucursal(selectedTipo.id, values);
        showSnackbar('Tipo de sucursal actualizado exitosamente');
      } else {
        await createRolSucursal(values);
        showSnackbar('Tipo de sucursal creado exitosamente');
      }
      
      await loadTiposSucursal();
      handleCloseDialog();
      resetForm();
    } catch (error) {
      console.error('Error al guardar tipo de sucursal:', error);
      showSnackbar(
        error.response?.data?.message || 'Error al guardar tipo de sucursal',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await deleteRolSucursal(selectedTipo.id);
      showSnackbar('Tipo de sucursal eliminado exitosamente');
      await loadTiposSucursal();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error al eliminar tipo de sucursal:', error);
      showSnackbar(
        error.response?.data?.message || 'Error al eliminar tipo de sucursal',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Gestión de Tipos de Sucursal
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra los tipos de sucursal disponibles en el sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ borderRadius: 2 }}
        >
          Nuevo Tipo
        </Button>
      </Box>

      {/* Tabla */}
      <Card elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Actualización</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tiposSucursal.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No hay tipos de sucursal registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tiposSucursal.map((tipo) => (
                    <TableRow key={tipo.id} hover>
                      <TableCell>{tipo.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {tipo.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(tipo.fecha_actualizacion)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(tipo)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(tipo)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Diálogo de formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>
          {isEditing ? 'Editar Tipo de Sucursal' : 'Crear Nuevo Tipo de Sucursal'}
        </DialogTitle>
        <Formik
          initialValues={{
            nombre: selectedTipo?.nombre || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="nombre"
                    label="Nombre del Tipo"
                    fullWidth
                    variant="outlined"
                    error={touched.nombre && !!errors.nombre}
                    helperText={touched.nombre && errors.nombre}
                    disabled={isSubmitting}
                    placeholder="Ej: Tienda, Almacén, Instituto"
                  />
                </FormControl>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDialog} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isEditing ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el tipo de sucursal "{selectedTipo?.nombre}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TiposSucursalManagement;