import React from 'react';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import Layout from '../components/UserSucursal/Layout';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/ModuleContent.css';

const CalificacionesUsuarioSucursal = () => {
  usePageTitle('Calificaciones');
  const { user } = useAuthUsuarioSucursal();

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <div className="module-content">
        <div className="module-header">
          <h1>📊 Gestión de Calificaciones</h1>
          <p>Administra las calificaciones y evaluaciones de tus estudiantes</p>
        </div>
        
        <div className="content-grid">
          <div className="card">
            <h3>Registrar Calificaciones</h3>
            <p>Ingresa las calificaciones de evaluaciones</p>
            <span className="status">🔧 En desarrollo...</span>
          </div>
          
          <div className="card">
            <h3>Consultar Notas</h3>
            <p>Consulta las calificaciones registradas</p>
            <span className="status">🔧 En desarrollo...</span>
          </div>
          
          <div className="card">
            <h3>Reportes</h3>
            <p>Genera reportes de calificaciones</p>
            <span className="status">🔧 En desarrollo...</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalificacionesUsuarioSucursal;