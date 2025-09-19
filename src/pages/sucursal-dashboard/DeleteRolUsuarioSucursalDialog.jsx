import React from 'react';
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

const DeleteRolUsuarioSucursalDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  rol, 
  loading = false 
}) => {
  if (!rol) return null;

  const handleConfirm = () => {
    onConfirm(rol.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Esta acción no se puede deshacer. El rol será marcado como inactivo.
          </Typography>
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          ¿Está seguro que desea eliminar el siguiente rol?
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
            Nombre del Rol:
          </Typography>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {rol.nombre_rol}
          </Typography>
          
          {rol.descripcion && (
            <>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
                Descripción:
              </Typography>
              <Typography variant="body2">
                {rol.descripcion}
              </Typography>
            </>
          )}
          
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
            ID del Rol:
          </Typography>
          <Typography variant="body2">
            {rol.id}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Nota: Los usuarios que tengan asignado este rol mantendrán su acceso hasta que se les asigne un nuevo rol.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button 
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
        >
          {loading ? 'Eliminando...' : 'Eliminar Rol'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRolUsuarioSucursalDialog;