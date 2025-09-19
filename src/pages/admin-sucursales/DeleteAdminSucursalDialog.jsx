import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Warning as WarningIcon,
  Person as PersonIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { deleteAdminSucursal } from '../../api/admin-sucursales';

const DeleteAdminSucursalDialog = ({ open, admin, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!admin) return;

    setLoading(true);
    setError('');

    try {
      await deleteAdminSucursal(admin.id);
      onSuccess('Usuario de sucursal eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting admin sucursal:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al eliminar el usuario de sucursal');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  if (!admin) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          <Typography variant="h6" component="span">
            Confirmar Eliminación
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" gutterBottom>
          ¿Estás seguro de que deseas eliminar este usuario de sucursal? Esta acción no se puede deshacer.
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Información del Usuario:
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PersonIcon color="action" fontSize="small" />
            <Typography variant="body2">
              <strong>Usuario:</strong> {admin.usuario}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="body2">
              <strong>Correo:</strong> {admin.correo}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <StoreIcon color="action" fontSize="small" />
            <Typography variant="body2">
              <strong>Sucursal:</strong> {admin.sucursal_nombre || `ID: ${admin.id_sucursal}`}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">
              <strong>Estado:</strong>
            </Typography>
            <Chip
              label={admin.activo ? 'Activo' : 'Inactivo'}
              color={admin.activo ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Advertencia:</strong> Al eliminar este usuario, perderá acceso al sistema y no podrá gestionar la sucursal asignada.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={20} /> : <WarningIcon />}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAdminSucursalDialog;