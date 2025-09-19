import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Store as StoreIcon
} from '@mui/icons-material';

const UsuarioSucursalView = ({ usuario }) => {
  if (!usuario) {
    return (
      <Box p={3}>
        <Typography>No hay información del usuario disponible.</Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Información básica del usuario */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <PersonIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información del Usuario
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ID del Usuario
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.id}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Nombre de Usuario
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.usuario}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.nombre_completo}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.correo}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Estado
                  </Typography>
                  <Chip
                    label={usuario.activo ? 'Activo' : 'Inactivo'}
                    color={usuario.activo ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del rol */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información del Rol
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ID del Rol
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.id_rol || 'No asignado'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Nombre del Rol
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.nombre_rol || 'Sin rol asignado'}
                  </Typography>
                </Grid>
                
                {usuario.descripcion && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Descripción del Rol
                    </Typography>
                    <Typography variant="body1">
                      {usuario.descripcion}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de la sucursal */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <StoreIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información de la Sucursal
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ID de la Sucursal
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.id_sucursal || 'No disponible'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Nombre de la Sucursal
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.sucursal_nombre || 'No disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de auditoría */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CalendarIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información de Auditoría
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(usuario.fecha_creacion)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Última Actualización
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(usuario.fecha_actualizacion)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Creado por (Admin ID)
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.id_admin_creador || 'No disponible'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Actualizado por (Admin ID)
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {usuario.id_admin || 'No disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsuarioSucursalView;