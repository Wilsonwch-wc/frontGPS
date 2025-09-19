import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Store as StoreIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

const AdminSucursalView = ({ admin, onClose }) => {
  if (!admin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="body1" color="text.secondary">
          No hay datos para mostrar
        </Typography>
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

  const getStatusChip = (activo) => {
    return (
      <Chip
        label={activo ? 'Activo' : 'Inactivo'}
        color={activo ? 'success' : 'error'}
        variant="filled"
        size="medium"
      />
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Información Personal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PersonIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información Personal
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ID de Usuario
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  #{admin.id}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Nombre de Usuario
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {admin.usuario}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Correo Electrónico
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body1">
                    {admin.correo}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estado
                </Typography>
                {getStatusChip(admin.activo)}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de Sucursal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <StoreIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información de Sucursal
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ID de Sucursal
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  #{admin.id_sucursal}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Nombre de Sucursal
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {admin.sucursal_nombre || 'No disponible'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Descripción
                </Typography>
                <Typography variant="body1">
                  {admin.sucursal_descripcion || 'No disponible'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Dirección
                </Typography>
                <Typography variant="body1">
                  {admin.sucursal_direccion || 'No disponible'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de Fechas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Información de Fechas
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Fecha de Creación
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon color="action" fontSize="small" />
                      <Typography variant="body1">
                        {formatDate(admin.fecha_creacion)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Última Actualización
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <UpdateIcon color="action" fontSize="small" />
                      <Typography variant="body1">
                        {formatDate(admin.fecha_actualizacion)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSucursalView;