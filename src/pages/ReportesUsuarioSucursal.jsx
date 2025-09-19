import React from 'react';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import Layout from '../components/UserSucursal/Layout';
import usePageTitle from '../hooks/usePageTitle';

const ReportesUsuarioSucursal = () => {
  usePageTitle('Reportes');
  const { user } = useAuthUsuarioSucursal();

  // Verificar si el usuario está autenticado
  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="section-placeholder">
        <h2>Módulo de Reportes</h2>
        <p>Funcionalidad en desarrollo...</p>
      </div>
    </Layout>
  );
};

export default ReportesUsuarioSucursal;