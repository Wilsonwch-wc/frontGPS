import { createBrowserRouter } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import SucursalRoutes from './SucursalRoutes';
import UsuarioSucursalRoutes from './UsuarioSucursalRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, LoginRoutes, SucursalRoutes, UsuarioSucursalRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
