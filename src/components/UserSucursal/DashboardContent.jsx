import React, { useState, useEffect } from 'react';
import { useAuthUsuarioSucursal } from '../../contexts/AuthUsuarioSucursalContext';
import { Alert, Snackbar } from '@mui/material';
import CardAsignacionAsistencia from '../ConfirmacionAsistencia/CardAsignacionAsistencia';
import MapaConfirmacionAsistencia from '../ConfirmacionAsistencia/MapaConfirmacionAsistencia';
import './DashboardContent.css';

const DashboardContent = () => {
  const { user, loading } = useAuthUsuarioSucursal();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const [notificacion, setNotificacion] = useState({ open: false, mensaje: '', tipo: 'success' });

  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Funciones de módulos removidas - se accederá a través del sidebar

  // Remover datos estáticos - las estadísticas se obtendrán de la API en el futuro

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const manejarAbrirMapa = (asignacion) => {
    setAsignacionSeleccionada(asignacion);
    setMapaAbierto(true);
  };

  const manejarCerrarMapa = () => {
    setMapaAbierto(false);
    setAsignacionSeleccionada(null);
  };

  const manejarConfirmacionExitosa = (resultado) => {
    const mensaje = resultado.dentro_ubicacion 
      ? `¡Asistencia confirmada correctamente! Estás dentro del área permitida (${resultado.distancia_metros}m del centro).`
      : `Asistencia registrada, pero estás fuera del área permitida (${resultado.distancia_metros}m del centro, ${Math.abs(resultado.distancia_metros - resultado.radio_permitido)}m fuera del radio).`;
    
    setNotificacion({
      open: true,
      mensaje,
      tipo: resultado.dentro_ubicacion ? 'success' : 'warning'
    });
  };

  const cerrarNotificacion = () => {
    setNotificacion({ ...notificacion, open: false });
  };

  return (
    <div className="dashboard-content-container">
      <div className="dashboard-header-section">
        <h1 className="dashboard-title">Dashboard - {user?.rol?.nombre}</h1>
        <p className="dashboard-subtitle">
          Bienvenido, {user?.nombre_completo}. Aquí tienes un resumen de tu actividad en {user?.sucursal?.nombre}
        </p>
        <div className="current-time">
          <span className="time-label">Última actualización:</span>
          <span className="time-value">{currentTime.toLocaleString()}</span>
        </div>
      </div>

      {/* Tarjeta de Confirmación de Asistencia */}
      <div className="dashboard-cards-section">
        <CardAsignacionAsistencia onAbrirMapa={manejarAbrirMapa} />
      </div>

      {/* Modal del Mapa de Confirmación */}
      <MapaConfirmacionAsistencia
        open={mapaAbierto}
        onClose={manejarCerrarMapa}
        asignacion={asignacionSeleccionada}
        onConfirmacionExitosa={manejarConfirmacionExitosa}
      />

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={6000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={cerrarNotificacion} 
          severity={notificacion.tipo}
          sx={{ width: '100%' }}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DashboardContent;