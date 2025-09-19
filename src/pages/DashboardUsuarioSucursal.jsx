import React from 'react';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import Layout from '../components/UserSucursal/Layout';
import DashboardContent from '../components/UserSucursal/DashboardContent';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/Dashboard.css';

const DashboardUsuarioSucursal = () => {
  const { user } = useAuthUsuarioSucursal();
  usePageTitle('Dashboard Usuario');

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
      <DashboardContent />
    </Layout>
  );
};

export default DashboardUsuarioSucursal;