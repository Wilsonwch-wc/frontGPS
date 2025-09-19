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
  Security as SecurityIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Store as StoreIcon
} from '@mui/icons-material';

const RolUsuarioSucursalView = ({ rol }) => {
  if (!rol) {
    return (
      <Box p={3}>
        <Typography>No hay información del rol disponible.</Typography>
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
        {/* Información básica del rol */}
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
                    {rol.id}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Nombre del Rol
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rol.nombre_rol}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Estado
                  </Typography>
                  <Chip
                    label={rol.activo ? 'Activo' : 'Inactivo'}
                    color={rol.activo ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <DescriptionIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Descripción
                </Typography>
              </Box>
              
              <Typography variant="body1">
                {rol.descripcion || 'Sin descripción proporcionada'}
              </Typography>
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
                    ID de Sucursal
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rol.id_sucursal}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Nombre de la Sucursal
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rol.nombre_sucursal || 'No disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de creación */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <PersonIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información de Creación
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Creado por
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rol.admin_creador || 'No disponible'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ID del Administrador
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {rol.id_admin_creador || 'No disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Fechas */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CalendarIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Fechas
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(rol.fecha_creacion)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Última Modificación
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(rol.fecha_modificacion)}
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

export default RolUsuarioSucursalView;