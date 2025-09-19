import PropTypes from 'prop-types';

// material-ui
import { Box, Drawer, useMediaQuery, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Store as StoreIcon,
  School as SchoolIcon,
  Warehouse as WarehouseIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuList from './MenuList';
import { drawerWidth } from 'store/constant';
import { useAuthSucursal } from '../../../contexts/AuthSucursalContext';

// ==============================|| SIDEBAR DRAWER ||==============================

// Función para obtener el icono según el tipo de sucursal
const getSucursalIcon = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'tienda':
      return <StoreIcon sx={{ fontSize: 24, color: 'primary.main' }} />;
    case 'instituto':
      return <SchoolIcon sx={{ fontSize: 24, color: 'primary.main' }} />;
    case 'almacén':
    case 'almacen':
      return <WarehouseIcon sx={{ fontSize: 24, color: 'primary.main' }} />;
    default:
      return <BusinessIcon sx={{ fontSize: 24, color: 'primary.main' }} />;
  }
};

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const { admin } = useAuthSucursal();
  
  // Obtener información de la sucursal del contexto
  const sucursalNombre = admin?.sucursal?.nombre || 'Sucursal';
  const sucursalDireccion = admin?.sucursal?.direccion || 'Dirección no disponible';
  const sucursalDescripcion = admin?.sucursal?.descripcion || '';

  const drawer = (
    <>
      {/* Header del Sidebar con nombre y tipo de sucursal */}
       <Box sx={{ 
         display: 'flex', 
         flexDirection: 'column',
         alignItems: 'center', 
         justifyContent: 'center',
         py: 1.5, 
         px: 1,
         borderBottom: `1px solid ${theme.palette.divider}`,
         backgroundColor: theme.palette.background.paper
       }}>
         {/* Icono de la sucursal */}
         <Box sx={{ mb: 0.5 }}>
           {getSucursalIcon(sucursalDescripcion)}
         </Box>
         
         <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 0.25, fontSize: '1rem' }}>
           {sucursalNombre}
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {sucursalDireccion}
          </Typography>
       </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '1px'
          }}
        >
          <MenuList />
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2, pt: 1 }}>
          <MenuList />
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return drawer;
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;