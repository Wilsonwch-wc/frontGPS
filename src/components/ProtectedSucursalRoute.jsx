import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthSucursal } from '../contexts/AuthSucursalContext';

// Componente de carga mientras se verifica la autenticación
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

// Componente para proteger rutas que requieren autenticación de admin sucursal
const ProtectedSucursalRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthSucursal();
  const location = useLocation();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, redirigir a login de sucursal
  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/index" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

ProtectedSucursalRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedSucursalRoute;