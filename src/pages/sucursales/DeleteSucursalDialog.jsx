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
  Business as BusinessIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { deleteSucursal } from '../../api/sucursales';

const DeleteSucursalDialog = ({ open, sucursal, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!sucursal?.id) {
      setError('ID de sucursal no válido');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await deleteSucursal(sucursal.id);
      
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Error al eliminar la sucursal');
      }
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
      
      if (error.response?.status === 404) {
        setError('La sucursal no existe o ya fue eliminada');
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || 'No se puede eliminar la sucursal');
      } else if (error.response?.status === 403) {
        setError('No tienes permisos para eliminar sucursales');
      } else {
        setError('Error al eliminar la sucursal. Intente nuevamente.');
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
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" sx={{ fontSize: 28 }} />
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            ¿Está seguro que desea eliminar la siguiente sucursal?
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </Box>

        {sucursal && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1, 
              border: '1px solid', 
              borderColor: 'grey.200' 
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <BusinessIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="medium">
                {sucursal.nombre}
              </Typography>
              <Chip
                label={sucursal.activo ? 'Activa' : 'Inactiva'}
                color={sucursal.activo ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>ID:</strong> #{sucursal.id}
            </Typography>
            
            {sucursal.descripcion && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Descripción:</strong> {sucursal.descripcion}
              </Typography>
            )}
            
            {sucursal.direccion && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Dirección:</strong> {sucursal.direccion}
              </Typography>
            )}
            
            {sucursal.telefono && (
              <Typography variant="body2" color="textSecondary">
                <strong>Teléfono:</strong> {sucursal.telefono}
              </Typography>
            )}
          </Box>
        )}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Advertencia:</strong> Al eliminar esta sucursal, se perderán todos los datos asociados 
            y no podrá recuperarse posteriormente.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="contained"
          color="error"
          sx={{ minWidth: 100 }}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSucursalDialog;