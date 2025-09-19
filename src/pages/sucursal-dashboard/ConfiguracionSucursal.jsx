import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Chip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Store as StoreIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import MainCard from '../../components/MainCard';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import usePageTitle from '../../hooks/usePageTitle';

const ConfiguracionSucursal = () => {
  const { admin } = useAuthSucursal();
  const [configuracion, setConfiguracion] = useState({
    nombreSucursal: admin?.sucursal?.nombre || 'Cargando...',
    direccion: admin?.sucursal?.direccion || 'Cargando...',
    telefono: admin?.sucursal?.telefono || 'Sin teléfono',
    nombreAdmin: admin?.usuario || 'Cargando...',
    emailAdmin: admin?.correo || 'Cargando...'
  });
  usePageTitle('Configuración Sucursal');

  // Actualizar configuración cuando cambien los datos del admin
  useEffect(() => {
    if (admin) {
      setConfiguracion({
        nombreSucursal: admin?.sucursal?.nombre || 'Sin nombre',
        direccion: admin?.sucursal?.direccion || 'Sin dirección',
        telefono: admin?.sucursal?.telefono || 'Sin teléfono',
        nombreAdmin: admin?.usuario || 'Sin usuario',
        emailAdmin: admin?.correo || 'Sin correo'
      });
    }
  }, [admin]);



  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid size={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <SettingsIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Información de Sucursal
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Información de la Sucursal */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <StoreIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" component="h2">
              Información de la Sucursal
            </Typography>
          </Box>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Nombre de la Sucursal
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {configuracion.nombreSucursal}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dirección
              </Typography>
              <Typography variant="body1">
                {configuracion.direccion}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Teléfono
              </Typography>
              <Typography variant="body1">
                {configuracion.telefono}
              </Typography>
            </Box>
          </Stack>
        </MainCard>
      </Grid>

      {/* Información del Administrador */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <PersonIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" component="h2">
              Perfil del Administrador
            </Typography>
          </Box>
          <Stack spacing={3}>
             <Box>
               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                 Nombre de Usuario
               </Typography>
               <Typography variant="body1" fontWeight="medium">
                 {configuracion.nombreAdmin}
               </Typography>
             </Box>
             <Box>
               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                 Correo Electrónico
               </Typography>
               <Typography variant="body1">
                 {configuracion.emailAdmin}
               </Typography>
             </Box>
             <Box>
               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                 Estado
               </Typography>
               <Chip
                 label={admin?.activo ? 'Activo' : 'Inactivo'}
                 color={admin?.activo ? 'success' : 'error'}
                 size="small"
               />
             </Box>
           </Stack>
        </MainCard>
      </Grid>


    </Grid>
  );
};

export default ConfiguracionSucursal;