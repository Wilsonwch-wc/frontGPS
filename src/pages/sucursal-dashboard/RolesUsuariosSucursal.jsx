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
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import { getRolesUsuariosSucursal, deleteRolUsuarioSucursal } from '../../api/rol-usuarios-sucursal';
import RolUsuarioSucursalForm from './RolUsuarioSucursalForm';
import RolUsuarioSucursalView from './RolUsuarioSucursalView';
import DeleteRolUsuarioSucursalDialog from './DeleteRolUsuarioSucursalDialog';
import usePageTitle from '../../hooks/usePageTitle';

const RolesUsuariosSucursal = () => {
  usePageTitle('Roles Usuarios');
  const { admin } = useAuthSucursal();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      
      if (!admin?.sucursal?.id) {
        setSnackbar({
          open: true,
          message: 'Error: No se pudo identificar la sucursal',
          severity: 'error'
        });
        return;
      }
      
      const response = await getRolesUsuariosSucursal(admin.sucursal.id);
      
      if (response.success) {
        setRoles(response.data);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Error al cargar los roles',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los roles',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (rol = null) => {
    setSelectedRol(rol);
    setIsEditing(!!rol);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedRol(null);
    setIsEditing(false);
  };

  const handleFormSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
    handleCloseForm();
    loadRoles();
  };

  const handleView = (rol) => {
    setSelectedRol(rol);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedRol(null);
  };

  const handleDeleteClick = (rol) => {
    setSelectedRol(rol);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteRolUsuarioSucursal(selectedRol.id);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Rol eliminado exitosamente',
          severity: 'success'
        });
        loadRoles();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Error al eliminar el rol',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el rol',
        severity: 'error'
      });
    } finally {
      setOpenDeleteDialog(false);
      setSelectedRol(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
              <SecurityIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                Gestión de Roles de Usuario
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              sx={{ borderRadius: 2 }}
            >
              Nuevo Rol
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Rol</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Creado por</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Creación</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.length > 0 ? (
                  roles.map((rol) => (
                    <TableRow key={rol.id} hover>
                      <TableCell>{rol.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {rol.nombre_rol}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {rol.descripcion || 'Sin descripción'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {rol.admin_creador || 'No especificado'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(rol.fecha_creacion).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rol.activo ? 'Activo' : 'Inactivo'}
                          color={rol.activo ? 'success' : 'error'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => handleView(rol)}
                              color="info"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenForm(rol)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(rol)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay roles registrados
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
          {isEditing ? 'Editar Rol' : 'Nuevo Rol'}
        </DialogTitle>
        <DialogContent>
          <RolUsuarioSucursalForm
            rol={selectedRol}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>Detalles del Rol</DialogTitle>
        <DialogContent>
          <RolUsuarioSucursalView
            rol={selectedRol}
            onClose={handleCloseView}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteRolUsuarioSucursalDialog
        open={openDeleteDialog}
        rol={selectedRol}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setSelectedRol(null);
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RolesUsuariosSucursal;