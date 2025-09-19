import React, { useState } from 'react';
import { useAuthUsuarioSucursal } from '../../contexts/AuthUsuarioSucursalContext';
import './Configuracion.css';

const Configuracion = () => {
  const { user, loading } = useAuthUsuarioSucursal();
  const [activeTab, setActiveTab] = useState('perfil');

  if (loading) {
    return (
      <div className="config-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="config-error">
        <h2>Error</h2>
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="configuracion-container">
      <div className="config-header">
        <h1 className="config-title">Configuración</h1>
        <p className="config-subtitle">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="config-tabs">
        <button 
          className={`tab-button ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <span className="tab-icon">👤</span>
          Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'cuenta' ? 'active' : ''}`}
          onClick={() => setActiveTab('cuenta')}
        >
          <span className="tab-icon">⚙️</span>
          Cuenta
        </button>
      </div>

      <div className="config-content">
        {activeTab === 'perfil' && (
          <div className="config-section">
            <div className="section-header">
              <h2>Información Personal</h2>
              <p>Información básica de tu perfil</p>
            </div>
            
            <div className="info-grid">
              <div className="info-card">
                <div className="info-header">
                  <span className="info-icon">👤</span>
                  <h3>Datos Personales</h3>
                </div>
                <div className="info-content">
                  <div className="info-row">
                    <label>Nombre Completo:</label>
                    <span>{user.nombre_completo || 'No disponible'}</span>
                  </div>
                  <div className="info-row">
                    <label>Usuario:</label>
                    <span>{user.usuario || 'No disponible'}</span>
                  </div>
                  <div className="info-row">
                    <label>Correo Electrónico:</label>
                    <span>{user.correo || 'No disponible'}</span>
                  </div>
                  <div className="info-row">
                    <label>Estado:</label>
                    <span className={`status ${user.activo ? 'active' : 'inactive'}`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <span className="info-icon">🏢</span>
                  <h3>Información Laboral</h3>
                </div>
                <div className="info-content">
                  <div className="info-row">
                    <label>Rol:</label>
                    <span>{user.rol?.nombre || 'No asignado'}</span>
                  </div>
                  <div className="info-row">
                    <label>Descripción del Rol:</label>
                    <span>{user.rol?.descripcion || 'No disponible'}</span>
                  </div>
                  <div className="info-row">
                    <label>Sucursal:</label>
                    <span>{user.sucursal?.nombre || 'No asignada'}</span>
                  </div>
                  <div className="info-row">
                    <label>Tipo de Sucursal:</label>
                    <span>{user.sucursal?.tipo || 'No disponible'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cuenta' && (
          <div className="config-section">
            <div className="section-header">
              <h2>Información de Cuenta</h2>
              <p>Detalles técnicos y fechas importantes</p>
            </div>
            
            <div className="info-grid">
              <div className="info-card">
                <div className="info-header">
                  <span className="info-icon">📅</span>
                  <h3>Fechas Importantes</h3>
                </div>
                <div className="info-content">
                  <div className="info-row">
                    <label>Fecha de Creación:</label>
                    <span>{formatDate(user.fecha_creacion)}</span>
                  </div>
                  <div className="info-row">
                    <label>Última Actualización:</label>
                    <span>{formatDate(user.fecha_actualizacion)}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <span className="info-icon">🔧</span>
                  <h3>Configuración Técnica</h3>
                </div>
                <div className="info-content">
                  <div className="info-row">
                    <label>ID de Usuario:</label>
                    <span>{user.id || 'No disponible'}</span>
                  </div>
                  <div className="info-row">
                    <label>ID de Rol:</label>
                    <span>{user.rol?.id || 'No disponible'}</span>
                  </div>
                  <div className="info-row">
                    <label>ID de Sucursal:</label>
                    <span>{user.sucursal?.id || 'No disponible'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card full-width">
              <div className="info-header">
                <span className="info-icon">ℹ️</span>
                <h3>Información Adicional</h3>
              </div>
              <div className="info-content">
                <div className="info-note">
                  <p><strong>Nota:</strong> Si necesitas actualizar alguna información de tu perfil, contacta al administrador del sistema.</p>
                  <p>Para cambios de contraseña o configuraciones de seguridad, utiliza las opciones disponibles en el menú principal.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;