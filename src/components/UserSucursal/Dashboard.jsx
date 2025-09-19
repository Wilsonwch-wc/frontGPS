import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  // Datos de ejemplo para las estadísticas
  const stats = [
    {
      title: 'Productos Registrados',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: '📦'
    },
    {
      title: 'Stock Disponible',
      value: '8,932',
      change: '+5%',
      changeType: 'positive',
      icon: '📊'
    },
    {
      title: 'Movimientos Hoy',
      value: '156',
      change: '+23%',
      changeType: 'positive',
      icon: '🔄'
    },
    {
      title: 'Alertas Pendientes',
      value: '7',
      change: '-2',
      changeType: 'negative',
      icon: '⚠️'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Registro de entrada',
      product: 'Tornillos M8x20',
      quantity: '+150 unidades',
      time: 'Hace 15 min',
      user: 'José Ortega'
    },
    {
      id: 2,
      action: 'Salida de material',
      product: 'Cables eléctricos',
      quantity: '-25 metros',
      time: 'Hace 32 min',
      user: 'María González'
    },
    {
      id: 3,
      action: 'Actualización de stock',
      product: 'Tuberías PVC',
      quantity: 'Inventario verificado',
      time: 'Hace 1 hora',
      user: 'Carlos Ruiz'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard - Almacén Teo</h1>
        <p className="dashboard-subtitle">
          Bienvenido, José Ortega. Aquí tienes un resumen de la actividad de tu sucursal.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.changeType}`}>
                {stat.change} desde el mes pasado
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2 className="card-title">Acciones Rápidas</h2>
          <div className="actions-grid">
            <button className="action-btn primary">
              <span className="action-icon">📝</span>
              <span className="action-text">Registrar Entrada</span>
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">📤</span>
              <span className="action-text">Registrar Salida</span>
            </button>
            <button className="action-btn tertiary">
              <span className="action-icon">🔍</span>
              <span className="action-text">Buscar Producto</span>
            </button>
            <button className="action-btn quaternary">
              <span className="action-icon">📊</span>
              <span className="action-text">Ver Reportes</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card recent-activities">
          <h2 className="card-title">Actividad Reciente</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-details">
                    <span className="activity-product">{activity.product}</span>
                    <span className="activity-quantity">{activity.quantity}</span>
                  </div>
                  <div className="activity-user">Por: {activity.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom">
        <div className="dashboard-card alerts">
          <h2 className="card-title">Alertas y Notificaciones</h2>
          <div className="alerts-list">
            <div className="alert-item warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <span className="alert-title">Stock Bajo</span>
                <span className="alert-message">Tornillos M6x15 - Solo quedan 23 unidades</span>
              </div>
            </div>
            <div className="alert-item info">
              <span className="alert-icon">ℹ️</span>
              <div className="alert-content">
                <span className="alert-title">Recordatorio</span>
                <span className="alert-message">Inventario mensual programado para mañana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;