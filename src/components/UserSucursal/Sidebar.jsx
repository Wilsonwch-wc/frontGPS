import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthUsuarioSucursal } from '../../contexts/AuthUsuarioSucursalContext';
import './Sidebar.css';

const Sidebar = ({ activeSection, onSectionChange, isOpen, onClose }) => {
  const { user, logout } = useAuthUsuarioSucursal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Definir módulos disponibles según el rol
  const getAvailableModules = () => {
    if (!user?.rol?.nombre) return [];
    
    const roleName = user.rol.nombre.toLowerCase();
    const modules = [];
    
    // Dashboard siempre disponible
    modules.push({
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      isRoute: true,
      path: '/us/dashboard'
    });
    
    // Configuración siempre disponible
    modules.push({
      id: 'configuracion',
      name: 'Configuración',
      icon: '⚙️',
      isRoute: true,
      path: '/us/configuracion'
    });
    
    // Módulos según rol removidos - Registrar eliminado
    
    // Módulos específicos para docentes
    if (['docente'].includes(roleName)) {
      modules.push({
        id: 'clases',
        name: 'Clases',
        icon: '🏫',
        isRoute: true,
        path: '/us/clases'
      });
      modules.push({
        id: 'asistencia',
        name: 'Asistencia',
        icon: '✅',
        isRoute: true,
        path: '/us/asistencia'
      });
      modules.push({
        id: 'calificaciones',
        name: 'Calificaciones',
        icon: '📊',
        isRoute: true,
        path: '/us/calificaciones'
      });
    }
    
    if (['administrador', 'guardador'].includes(roleName)) {
      modules.push({
        id: 'inventario',
        name: 'Inventario',
        icon: '📦',
        isRoute: true,
        path: '/us/inventario'
      });
    }
    
    if (['administrador', 'cajero', 'guardador'].includes(roleName)) {
      modules.push({
        id: 'reportes',
        name: 'Reportes',
        icon: '📈',
        isRoute: true,
        path: '/us/reportes'
      });
    }
    
    return modules;
  };

  const availableModules = getAvailableModules();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`user-sucursal-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {availableModules.map((module) => (
              <button 
                key={module.id}
                className={`nav-button ${
                  module.isRoute 
                    ? (location.pathname === module.path ? 'active' : '')
                    : (activeSection === module.id ? 'active' : '')
                }`}
                onClick={() => {
                  if (module.isRoute) {
                    navigate(module.path);
                  } else {
                    onSectionChange && onSectionChange(module.id);
                  }
                  onClose && onClose();
                }}
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-text">{module.name}</span>
              </button>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <button className="logout-button" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;