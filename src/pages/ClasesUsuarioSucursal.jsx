import React from 'react';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import Layout from '../components/UserSucursal/Layout';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/ModuleContent.css';

const ClasesUsuarioSucursal = () => {
  usePageTitle('Clases');
  const { user } = useAuthUsuarioSucursal();

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <div className="module-content">
        <div className="module-header">
          <h1>🏫 Gestión de Clases</h1>
          <p>Administra tus clases y horarios</p>
        </div>
        
        <div className="content-grid">
          <div className="card">
            <h3>Mis Clases</h3>
            <p>Gestiona tus clases asignadas</p>
            <span className="status">🔧 En desarrollo...</span>
          </div>
          
          <div className="card">
            <h3>Horarios</h3>
            <p>Consulta los horarios de clases</p>
            <span className="status">🔧 En desarrollo...</span>
          </div>
          
          <div className="card">
            <h3>Planificación</h3>
            <p>Planifica tus clases y actividades</p>
            <span className="status">🔧 En desarrollo...</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClasesUsuarioSucursal;