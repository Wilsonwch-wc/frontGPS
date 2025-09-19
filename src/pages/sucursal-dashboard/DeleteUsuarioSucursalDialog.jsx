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
  CircularProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { deleteUsuarioSucursal } from '../../api/usuarios-sucursal';

const DeleteUsuarioSucursalDialog = ({ 
  open, 
  onClose, 
  onSuccess,
  usuario
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!usuario) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await deleteUsuarioSucursal(usuario.id);
      
      if (response.success) {
        onSuccess(response.message || 'Usuario eliminado exitosamente');
      } else {
        setError(response.message || 'Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      let errorMessage = 'Error al eliminar el usuario';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tiene permisos para eliminar este usuario';
      }
      
      setError(errorMessage);
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
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <WarningIcon color="warning" fontSize="large" />
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
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Esta acción no se puede deshacer. El usuario será marcado como inactivo.
          </Typography>
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          ¿Está seguro que desea eliminar el siguiente usuario?
        </Typography>
        
        <Box 
          sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Nombre de Usuario:
          </Typography>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {usuario.usuario}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Nombre Completo:
          </Typography>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {usuario.nombre_completo}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Email:
          </Typography>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {usuario.correo}
          </Typography>
          
          {usuario.nombre_rol && (
            <>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Rol:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {usuario.nombre_rol}
              </Typography>
            </>
          )}
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          El usuario no podrá acceder al sistema después de esta acción.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
        >
          {loading ? 'Eliminando...' : 'Eliminar Usuario'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUsuarioSucursalDialog;