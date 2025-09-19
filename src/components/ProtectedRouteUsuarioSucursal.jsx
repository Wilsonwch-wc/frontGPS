import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import '../styles/UsuarioSucursal.css';

const ProtectedRouteUsuarioSucursal = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuthUsuarioSucursal();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/us" state={{ from: location }} replace />;
  }

  // Verificar rol específico si se requiere
  if (requiredRole && user?.rol?.nombre?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="fas fa-ban"></i>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p>Rol requerido: <strong>{requiredRole}</strong></p>
          <p>Tu rol actual: <strong>{user?.rol?.nombre}</strong></p>
          <button 
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            <i className="fas fa-arrow-left"></i>
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Verificar que el usuario esté activo
  if (!user?.activo) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="fas fa-user-slash"></i>
          <h2>Usuario Inactivo</h2>
          <p>Tu cuenta ha sido desactivada. Contacta al administrador.</p>
        </div>
      </div>
    );
  }

  // Renderizar el componente protegido
  return children;
};

export default ProtectedRouteUsuarioSucursal;