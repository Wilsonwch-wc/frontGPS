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
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import { getUsuariosSucursal, deleteUsuarioSucursal } from '../../api/usuarios-sucursal';
import UsuarioSucursalForm from './UsuarioSucursalForm';
import UsuarioSucursalView from './UsuarioSucursalView';
import DeleteUsuarioSucursalDialog from './DeleteUsuarioSucursalDialog';
import usePageTitle from '../../hooks/usePageTitle';

const UsuariosSucursal = () => {
  const { admin } = useAuthSucursal();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  usePageTitle('Usuarios Sucursal');

  useEffect(() => {
    if (admin?.sucursal?.id) {
      fetchUsuarios();
    }
  }, [admin]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsuariosSucursal(admin.sucursal.id);
      setUsuarios(response.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showSnackbar('Error al cargar usuarios', 'error');
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

  const handleOpenForm = (usuario = null) => {
    setSelectedUsuario(usuario);
    setIsEditing(!!usuario);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUsuario(null);
    setIsEditing(false);
  };

  const handleFormSuccess = (message) => {
    handleCloseForm();
    fetchUsuarios();
    showSnackbar(message, 'success');
  };

  const handleView = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedUsuario(null);
  };

  const handleDelete = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUsuario(null);
  };

  const handleDeleteSuccess = (message) => {
    handleCloseDeleteDialog();
    fetchUsuarios();
    showSnackbar(message, 'success');
  };

  const getStatusChip = (activo) => {
    return (
      <Chip
        label={activo ? 'Activo' : 'Inactivo'}
        color={activo ? 'success' : 'default'}
        size="small"
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
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon color="primary" />
              <Typography variant="h5" component="h1">
                Gestión de Usuarios
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

          <Typography variant="body2" color="text.secondary" mb={3}>
            Administra los usuarios de la sucursal {admin?.sucursal?.nombre}
          </Typography>

          {usuarios.length === 0 ? (
            <Box textAlign="center" py={4}>
              <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay usuarios registrados
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Comienza creando el primer usuario para tu sucursal
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenForm()}
              >
                Crear Primer Usuario
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell><strong>Usuario</strong></TableCell>
                    <TableCell><strong>Nombre Completo</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Rol</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell><strong>Fecha Creación</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {usuario.usuario}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {usuario.nombre_completo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {usuario.correo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={usuario.nombre_rol || 'Sin rol'}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {getStatusChip(usuario.activo)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(usuario.fecha_creacion).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => handleView(usuario)}
                              color="info"
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenForm(usuario)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(usuario)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Formulario de Usuario */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <UsuarioSucursalForm
            usuario={selectedUsuario}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Vista de Usuario */}
      <Dialog
        open={openView}
        onClose={handleCloseView}
        maxWidth="md"
        fullWidth
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          Detalles del Usuario
        </DialogTitle>
        <DialogContent>
          <UsuarioSucursalView
            usuario={selectedUsuario}
            onClose={handleCloseView}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de Eliminación */}
      <DeleteUsuarioSucursalDialog
        open={openDeleteDialog}
        usuario={selectedUsuario}
        onClose={handleCloseDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsuariosSucursal;