import React, { useState, useEffect } from 'react';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import Layout from '../components/UserSucursal/Layout';
import { obtenerMisAsignaciones, obtenerAsignacionesHoy, verificarAsignacionesPendientes } from '../api/control-asistencia';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/ModuleContent.css';

const AsistenciaUsuarioSucursal = () => {
  usePageTitle('Control de Asistencia');
  const { user } = useAuthUsuarioSucursal();
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionesHoy, setAsignacionesHoy] = useState([]);
  const [pendientes, setPendientes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todas');

  // Mapeo de días en español
  const diasSemanaMap = {
    'lunes': 'Lunes',
    'martes': 'Martes',
    'miercoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [todasResponse, hoyResponse, pendientesResponse] = await Promise.all([
        obtenerMisAsignaciones(),
        obtenerAsignacionesHoy(),
        verificarAsignacionesPendientes()
      ]);

      if (todasResponse.success) {
        setAsignaciones(todasResponse.data);
      }
      
      if (hoyResponse.success) {
        setAsignacionesHoy(hoyResponse.data);
      }
      
      if (pendientesResponse.success) {
        setPendientes(pendientesResponse.data);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatearHora = (hora) => {
    return hora ? hora.substring(0, 5) : '';
  };

  const formatearDias = (dias) => {
    if (!Array.isArray(dias)) return '';
    return dias.map(dia => diasSemanaMap[dia] || dia).join(', ');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  if (loading) {
    return (
      <Layout>
        <div className="module-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando asignaciones...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="module-content">
        <div className="module-header">
          <h1>✅ Control de Asistencia</h1>
          <p>Consulta tus horarios y ubicaciones asignadas</p>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={cargarDatos} className="retry-button">
              Reintentar
            </button>
          </div>
        )}

        {/* Resumen de pendientes */}
        {pendientes && (
          <div className="summary-cards">
            <div className="summary-card">
              <h3>📅 Hoy</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{pendientes.total_asignaciones_hoy}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat">
                  <span className="stat-number pending">{pendientes.pendientes}</span>
                  <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat">
                  <span className="stat-number completed">{pendientes.confirmadas}</span>
                  <span className="stat-label">Confirmadas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestañas */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveTab('todas')}
          >
            Todas las Asignaciones ({asignaciones.length})
          </button>
          <button 
            className={`tab ${activeTab === 'hoy' ? 'active' : ''}`}
            onClick={() => setActiveTab('hoy')}
          >
            Hoy ({asignacionesHoy.length})
          </button>
        </div>

        {/* Contenido de pestañas */}
        <div className="tab-content">
          {activeTab === 'todas' && (
            <div className="asignaciones-grid">
              {asignaciones.length === 0 ? (
                <div className="empty-state">
                  <p>📋 No tienes asignaciones de control de asistencia</p>
                </div>
              ) : (
                asignaciones.map((asignacion) => (
                  <div key={asignacion.id} className="asignacion-card">
                    <div className="card-header">
                      <h3>📍 {asignacion.ubicacion_nombre}</h3>
                      <span className="sucursal-badge">{asignacion.sucursal_nombre}</span>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span className="label">📅 Días:</span>
                        <span className="value">{formatearDias(asignacion.dias_semana)}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">🕐 Horario:</span>
                        <span className="value">
                          {formatearHora(asignacion.hora_inicio)} - {formatearHora(asignacion.hora_fin)}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">📝 Descripción:</span>
                        <span className="value">{asignacion.ubicacion_descripcion || 'Sin descripción'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">📏 Radio:</span>
                        <span className="value">{asignacion.radio_metros}m</span>
                      </div>
                      <div className="info-row">
                        <span className="label">📆 Creada:</span>
                        <span className="value">{formatearFecha(asignacion.fecha_creacion)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'hoy' && (
            <div className="asignaciones-grid">
              {asignacionesHoy.length === 0 ? (
                <div className="empty-state">
                  <p>📅 No tienes asignaciones para hoy</p>
                </div>
              ) : (
                asignacionesHoy.map((asignacion) => (
                  <div key={asignacion.id} className="asignacion-card today">
                    <div className="card-header">
                      <h3>📍 {asignacion.ubicacion_nombre}</h3>
                      <span className="today-badge">HOY</span>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span className="label">🕐 Horario:</span>
                        <span className="value highlight">
                          {formatearHora(asignacion.hora_inicio)} - {formatearHora(asignacion.hora_fin)}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">📝 Descripción:</span>
                        <span className="value">{asignacion.ubicacion_descripcion || 'Sin descripción'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">📏 Radio:</span>
                        <span className="value">{asignacion.radio_metros}m</span>
                      </div>
                      <div className="location-coords">
                        <small>📌 Lat: {asignacion.latitud}, Lng: {asignacion.longitud}</small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AsistenciaUsuarioSucursal;