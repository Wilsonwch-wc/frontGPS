import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render- Users
const UserManagement = Loadable(lazy(() => import('pages/users/UserManagement')));

// render- Sucursales
const SucursalManagement = Loadable(lazy(() => import('pages/sucursales/SucursalManagement')));

// render- Admin Sucursales
const AdminSucursalManagement = Loadable(lazy(() => import('pages/admin-sucursales/AdminSucursalManagement')));

// render- Tipos Sucursal
const TiposSucursalManagement = Loadable(lazy(() => import('pages/tipos-sucursal/TiposSucursalManagement')));

// render- Location Form
const LocationForm = Loadable(lazy(() => import('pages/LocationForm')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'users',
      element: <UserManagement />
    },
    {
      path: 'sucursales',
      element: <SucursalManagement />
    },
    {
      path: 'admin-sucursales',
      element: <AdminSucursalManagement />
    },
    {
      path: 'tipos-sucursal',
      element: <TiposSucursalManagement />
    },
    {
      path: 'mi-ubicacion',
      element: <LocationForm />
    }
  ]
};

export default MainRoutes;
