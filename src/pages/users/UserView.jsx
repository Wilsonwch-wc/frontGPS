import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const UserView = ({ open, onClose, user }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disablePortal disableEnforceFocus disableAutoFocus>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            {getInitials(user.nombre, user.apellido)}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {user.nombre} {user.apellido}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Información Personal */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              Información Personal
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                ID de Usuario
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                #{user.id}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Nombre de Usuario
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.username}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Nombre Completo
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.nombre} {user.apellido}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon fontSize="small" />
                Fecha de Nacimiento
              </Typography>
              <Typography variant="body1">
                {formatDate(user.fecha_nacimiento)}
              </Typography>
            </Box>
          </Grid>

          {/* Información de Contacto */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <EmailIcon color="primary" />
              Información de Contacto
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon fontSize="small" />
                Email
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon fontSize="small" />
                Teléfono
              </Typography>
              <Typography variant="body1">
                {user.telefono || 'No especificado'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationIcon fontSize="small" />
                Dirección
              </Typography>
              <Typography variant="body1">
                {user.direccion || 'No especificada'}
              </Typography>
            </Box>
          </Grid>

          {/* Información del Sistema */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <SecurityIcon color="primary" />
              Información del Sistema
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Rol
              </Typography>
              <Chip
                label={user.rol_nombre || 'Sin rol'}
                color={getRoleColor(user.rol_nombre)}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Estado
              </Typography>
              <Chip
                label={user.activo ? 'Activo' : 'Inactivo'}
                color={getStatusColor(user.activo)}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" />
                Último Acceso
              </Typography>
              <Typography variant="body1">
                {formatDateTime(user.ultimo_acceso)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Fecha de Registro
              </Typography>
              <Typography variant="body1">
                {formatDateTime(user.fecha_creacion)}
              </Typography>
            </Box>
          </Grid>

          {user.fecha_actualizacion && (
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Última Actualización
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(user.fecha_actualizacion)}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserView;