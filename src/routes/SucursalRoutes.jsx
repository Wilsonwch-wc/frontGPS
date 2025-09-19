import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import ProtectedSucursalRoute from 'components/ProtectedSucursalRoute';
import SucursalLayout from 'layout/SucursalLayout';

// render - Sucursal Auth
const LoginSucursal = Loadable(lazy(() => import('pages/sucursal-auth/LoginSucursal')));

// render - Sucursal Dashboard
const DashboardSucursal = Loadable(lazy(() => import('pages/sucursal-dashboard/DashboardSucursal')));
const ReportesSucursal = Loadable(lazy(() => import('pages/sucursal-dashboard/ReportesSucursal')));
const ConfiguracionSucursal = Loadable(lazy(() => import('pages/sucursal-dashboard/ConfiguracionSucursal')));
const RolesUsuariosSucursal = Loadable(lazy(() => import('pages/sucursal-dashboard/RolesUsuariosSucursal')));
const UsuariosSucursal = Loadable(lazy(() => import('pages/sucursal-dashboard/UsuariosSucursal')));

// render - Instituto Pages
const Academia = Loadable(lazy(() => import('pages/sucursal-dashboard/Academia')));
const Control = Loadable(lazy(() => import('pages/sucursal-dashboard/Control')));
const ReporteControl = Loadable(lazy(() => import('pages/sucursal-dashboard/ReporteControl')));

// render - Tienda Pages
const Ventas = Loadable(lazy(() => import('pages/sucursal-dashboard/Ventas')));
const ReportesVentas = Loadable(lazy(() => import('pages/sucursal-dashboard/ReportesVentas')));

// ==============================|| SUCURSAL ROUTING ||============================== //

const SucursalRoutes = {
  path: '/',
  children: [
    {
      path: '/index',
      element: <LoginSucursal />
    },
    {
      path: '/',
      element: (
        <ProtectedSucursalRoute>
          <SucursalLayout />
        </ProtectedSucursalRoute>
      ),
      children: [
        {
          path: 'dashboard-sucursal',
          element: <DashboardSucursal />
        },
        {
          path: 'reportes-sucursal',
          element: <ReportesSucursal />
        },
        {
          path: 'configuracion-sucursal',
          element: <ConfiguracionSucursal />
        },
        {
          path: 'roles-usuarios-sucursal',
          element: <RolesUsuariosSucursal />
        },
        {
          path: 'usuarios-sucursal',
          element: <UsuariosSucursal />
        },
        {
          path: 'academia',
          element: <Academia />
        },
        {
          path: 'control',
          element: <Control />
        },
        {
          path: 'reporte-control',
          element: <ReporteControl />
        },
        {
          path: 'ventas',
          element: <Ventas />
        },
        {
          path: 'reportes-ventas',
          element: <ReportesVentas />
        }
      ]
    }
  ]
};

export default SucursalRoutes;