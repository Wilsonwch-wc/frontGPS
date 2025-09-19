import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import ProtectedRouteUsuarioSucursal from 'components/ProtectedRouteUsuarioSucursal';

// login routing
const LoginUsuarioSucursal = Loadable(lazy(() => import('pages/LoginUsuarioSucursal')));
const DashboardUsuarioSucursal = Loadable(lazy(() => import('pages/DashboardUsuarioSucursal')));
const ConfiguracionUsuarioSucursal = Loadable(lazy(() => import('pages/ConfiguracionUsuarioSucursal')));
const InventarioUsuarioSucursal = Loadable(lazy(() => import('pages/InventarioUsuarioSucursal')));
const ReportesUsuarioSucursal = Loadable(lazy(() => import('pages/ReportesUsuarioSucursal')));
const ClasesUsuarioSucursal = Loadable(lazy(() => import('pages/ClasesUsuarioSucursal')));
const AsistenciaUsuarioSucursal = Loadable(lazy(() => import('pages/AsistenciaUsuarioSucursal')));
const CalificacionesUsuarioSucursal = Loadable(lazy(() => import('pages/CalificacionesUsuarioSucursal')));

// ==============================|| USUARIO SUCURSAL ROUTING ||============================== //

const UsuarioSucursalRoutes = {
  path: '/us',
  children: [
    {
      path: '',
      element: <LoginUsuarioSucursal />
    },
    {
      path: 'dashboard',
      element: (
        <ProtectedRouteUsuarioSucursal>
          <DashboardUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'configuracion',
      element: (
        <ProtectedRouteUsuarioSucursal>
          <ConfiguracionUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    },
    // Rutas específicas por rol
    {
      path: 'ventas',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Vendedor">
          <div className="coming-soon">
            <h2>Módulo de Ventas</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'productos',
      element: (
        <ProtectedRouteUsuarioSucursal>
          <div className="coming-soon">
            <h2>Módulo de Productos</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'clientes',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Vendedor">
          <div className="coming-soon">
            <h2>Módulo de Clientes</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'caja',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Cajero">
          <div className="coming-soon">
            <h2>Módulo de Caja</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'clases',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Docente">
          <ClasesUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'asistencia',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Docente">
          <AsistenciaUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'estudiantes',
      element: (
        <ProtectedRouteUsuarioSucursal>
          <div className="coming-soon">
            <h2>Módulo de Estudiantes</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'calificaciones',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Docente">
          <CalificacionesUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'docentes',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Secretario Académico">
          <div className="coming-soon">
            <h2>Módulo de Docentes</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'horarios',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="Secretario Académico">
          <div className="coming-soon">
            <h2>Módulo de Horarios</h2>
            <p>En desarrollo...</p>
          </div>
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'inventario',
      element: (
        <ProtectedRouteUsuarioSucursal requiredRole="guardador">
          <InventarioUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    },
    {
      path: 'reportes',
      element: (
        <ProtectedRouteUsuarioSucursal>
          <ReportesUsuarioSucursal />
        </ProtectedRouteUsuarioSucursal>
      )
    }
  ]
};

export default UsuarioSucursalRoutes;