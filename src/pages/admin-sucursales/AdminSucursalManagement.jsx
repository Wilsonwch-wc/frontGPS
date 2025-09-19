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
  People as PeopleIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { getAdminSucursales } from '../../api/admin-sucursales';
import AdminSucursalForm from './AdminSucursalForm';
import AdminSucursalView from './AdminSucursalView';
import DeleteAdminSucursalDialog from './DeleteAdminSucursalDialog';

const AdminSucursalManagement = () => {
  const [adminSucursales, setAdminSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadAdminSucursales();
  }, []);

  const loadAdminSucursales = async () => {
    try {
      setLoading(true);
      const data = await getAdminSucursales();
      // Asegurar que data sea un array
      setAdminSucursales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading admin sucursales:', error);
      // En caso de error, establecer un array vacío
      setAdminSucursales([]);
      setSnackbar({
        open: true,
        message: 'Error al cargar los usuarios de sucursales',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (admin = null) => {
    setSelectedAdmin(admin);
    setIsEditing(!!admin);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedAdmin(null);
    setIsEditing(false);
  };

  const handleOpenView = (admin) => {
    setSelectedAdmin(admin);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedAdmin(null);
  };

  const handleOpenDeleteDialog = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAdmin(null);
  };

  const handleFormSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
    loadAdminSucursales();
    handleCloseForm();
  };

  const handleDeleteSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
    loadAdminSucursales();
    handleCloseDeleteDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (activo) => {
    return (
      <Chip
        label={activo ? 'Activo' : 'Inactivo'}
        color={activo ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    );
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
              <PeopleIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                Usuarios Sucursales
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              sx={{ borderRadius: 2 }}
            >
              Nuevo Usuario
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Correo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sucursal</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Creación</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminSucursales.map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {admin.usuario}
                      </Typography>
                    </TableCell>
                    <TableCell>{admin.correo}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <StoreIcon color="action" fontSize="small" />
                        <Typography variant="body2">
                          {admin.sucursal_nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(admin.activo)}</TableCell>
                    <TableCell>
                      {new Date(admin.fecha_creacion).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenView(admin)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenForm(admin)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(admin)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {adminSucursales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No hay usuarios de sucursales registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>
          {isEditing ? 'Editar Usuario Sucursal' : 'Nuevo Usuario Sucursal'}
        </DialogTitle>
        <DialogContent>
          <AdminSucursalForm
            admin={selectedAdmin}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>Detalles del Usuario Sucursal</DialogTitle>
        <DialogContent>
          <AdminSucursalView admin={selectedAdmin} onClose={handleCloseView} />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteAdminSucursalDialog
        open={openDeleteDialog}
        admin={selectedAdmin}
        onClose={handleCloseDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />

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

export default AdminSucursalManagement;