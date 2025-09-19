import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { getAllUsers, deleteUser } from '../../api/users';
import UserForm from './UserForm';
import UserView from './UserView';
import { testLogin, checkAuthStatus } from '../../utils/testAuth';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const { isAuthenticated, user, token, updateAuthState } = useAuth();

  // Función para hacer login de prueba
  const handleTestLogin = async () => {
    console.log('Iniciando test login...');
    const result = await testLogin();
    console.log('Resultado del test login:', result);
    
    if (result.success) {
      console.log('Login exitoso, actualizando contexto...');
      updateAuthState(); // Actualizar el contexto de autenticación
      console.log('Recargando usuarios...');
      loadUsers(); // Recargar usuarios después del login
    } else {
      console.error('Error en login:', result.message);
      setError(result.message);
    }
  };

  // Verificar estado de autenticación
  const handleCheckAuth = () => {
    const authStatus = checkAuthStatus();
    console.log('Estado de autenticación:', authStatus);
    console.log('isAuthenticated desde contexto:', isAuthenticated);
    console.log('Usuario desde contexto:', user);
    console.log('Token desde contexto:', token);
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando carga de usuarios...');
      console.log('Token disponible:', localStorage.getItem('token') ? 'Sí' : 'No');
      
      const response = await getAllUsers();
      console.log('Respuesta completa de getAllUsers:', response);
      
      if (response.success) {
        console.log('Datos de usuarios recibidos:', response.data);
        setUsers(response.data || []);
      } else {
        console.error('Error en respuesta:', response.message);
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error capturado en loadUsers:', err);
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteUser(selectedUser.id);
      if (response.success) {
        await loadUsers(); // Recargar la lista
        setOpenDelete(false);
        setSelectedUser(null);
      } else {
        setError(response.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedUser(null);
    loadUsers(); // Recargar la lista
  };

  const getRoleColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'administrador':
        return 'error';
      case 'moderador':
        return 'warning';
      case 'usuario':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (activo) => {
    return activo ? 'success' : 'default';
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
        <CardHeader
          title="Gestión de Usuarios"
          subheader="Administra los usuarios del sistema"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckAuth}
              >
                Verificar Auth
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleTestLogin}
              >
                Login Test
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateUser}
              >
                Agregar Usuario
              </Button>
            </Box>
          }
        />
        <CardContent>
          {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Error:</strong> {error}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              <strong>Estado de autenticación:</strong> {isAuthenticated ? 'Autenticado' : 'No autenticado'}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              <strong>Usuario:</strong> {user ? user.username : 'No hay usuario'}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              <strong>Token:</strong> {token ? 'Presente' : 'No hay token'}
            </Typography>
          </Alert>
        )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Último Acceso</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay usuarios registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {user.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {user.nombre} {user.apellido}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.rol_nombre || 'Sin rol'}
                          color={getRoleColor(user.rol_nombre)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.activo ? 'Activo' : 'Inactivo'}
                          color={getStatusColor(user.activo)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.ultimo_acceso
                          ? new Date(user.ultimo_acceso).toLocaleDateString()
                          : 'Nunca'
                        }
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleViewUser(user)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Formulario de usuario */}
      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
        user={selectedUser}
        mode={formMode}
      />

      {/* Vista de detalles del usuario */}
      <UserView
        open={openView}
        onClose={() => setOpenView(false)}
        user={selectedUser}
      />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} disablePortal disableEnforceFocus disableAutoFocus>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{selectedUser?.username}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;