import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
// Removed date-fns dependency

const SucursalView = ({ sucursal, onEdit, onClose }) => {
  if (!sucursal) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No se encontró información de la sucursal
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con título y acciones */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <BusinessIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              {sucursal.nombre}
            </Typography>
            <Chip
              icon={sucursal.activo ? <ActiveIcon /> : <InactiveIcon />}
              label={sucursal.activo ? 'Activa' : 'Inactiva'}
              color={sucursal.activo ? 'success' : 'error'}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        
        <Box display="flex" gap={1}>
          <Tooltip title="Editar sucursal">
            <IconButton onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cerrar">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Información Básica */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Información Básica
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  ID de Sucursal
                </Typography>
                <Typography variant="body1">
                  #{sucursal.id}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Nombre
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {sucursal.nombre}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Tipo de Sucursal
                </Typography>
                <Chip
                  label={sucursal.tipo_sucursal || 'Sin tipo'}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Descripción
                </Typography>
                <Typography variant="body1">
                  {sucursal.descripcion || 'Sin descripción'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Estado
                </Typography>
                <Chip
                  icon={sucursal.activo ? <ActiveIcon /> : <InactiveIcon />}
                  label={sucursal.activo ? 'Sucursal Activa' : 'Sucursal Inactiva'}
                  color={sucursal.activo ? 'success' : 'error'}
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de Contacto y Ubicación */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Contacto y Ubicación
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Teléfono
                </Typography>
                <Typography variant="body1">
                  {sucursal.telefono || 'No especificado'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Dirección
                </Typography>
                <Typography variant="body1">
                  {sucursal.direccion || 'No especificada'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de Auditoría */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Información de Auditoría
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(sucursal.fecha_creacion)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Última Actualización
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(sucursal.fecha_actualizacion)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SucursalView;