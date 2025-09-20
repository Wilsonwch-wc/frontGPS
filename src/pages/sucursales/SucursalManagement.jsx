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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { getSucursales } from '../../api/sucursales';
import SucursalForm from './SucursalForm';
import SucursalView from './SucursalView';
import DeleteSucursalDialog from './DeleteSucursalDialog';

const SucursalManagement = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadSucursales();
  }, []);

  const loadSucursales = async () => {
    try {
      setLoading(true);
      const response = await getSucursales();
      if (response.success) {
        setSucursales(response.data);
      } else {
        showSnackbar('Error al cargar sucursales', 'error');
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      showSnackbar('Error al cargar sucursales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenForm = (sucursal = null) => {
    setSelectedSucursal(sucursal);
    setIsEditing(!!sucursal);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedSucursal(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    loadSucursales();
    showSnackbar(
      isEditing ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente'
    );
  };

  const handleView = (sucursal) => {
    setSelectedSucursal(sucursal);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedSucursal(null);
  };

  const handleDeleteClick = (sucursal) => {
    setSelectedSucursal(sucursal);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSuccess = () => {
    showSnackbar('Sucursal eliminada exitosamente');
    loadSucursales();
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedSucursal(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <StoreIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                Gestión de Sucursales
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              sx={{ borderRadius: 2 }}
            >
              Nueva Sucursal
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dirección</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Creación</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sucursales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No hay sucursales registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sucursales.map((sucursal) => (
                    <TableRow key={sucursal.id} hover>
                      <TableCell>{sucursal.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {sucursal.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={sucursal.tipo_sucursal || 'Sin tipo'}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {sucursal.descripcion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {sucursal.direccion || 'No especificada'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {sucursal.telefono || 'No especificado'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={sucursal.activo ? 'Activa' : 'Inactiva'}
                          color={sucursal.activo ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(sucursal.fecha_creacion)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => handleView(sucursal)}
                              color="info"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenForm(sucursal)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(sucursal)}
                              color="error"
                            >
                              <DeleteIcon />
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

      {/* Formulario de Sucursal */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm} 
        maxWidth="lg" 
        fullWidth 
        disablePortal 
        disableEnforceFocus 
        disableAutoFocus
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            minHeight: '75vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 3, 
          pt: 4,
          px: 4,
          borderBottom: '2px solid', 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontSize: '1.5rem',
          fontWeight: 600,
        }}>
          <StoreIcon sx={{ fontSize: 32 }} />
          {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </DialogTitle>
        <DialogContent sx={{ p: 4, backgroundColor: 'grey.50' }}>
          <SucursalForm
            sucursal={selectedSucursal}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Vista de Sucursal */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
        <SucursalView 
          sucursal={selectedSucursal} 
          onEdit={() => {
            handleCloseView();
            handleOpenForm(selectedSucursal);
          }}
          onClose={handleCloseView}
        />
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <DeleteSucursalDialog
        open={openDeleteDialog}
        sucursal={selectedSucursal}
        onClose={handleDeleteCancel}
        onSuccess={handleDeleteSuccess}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SucursalManagement;