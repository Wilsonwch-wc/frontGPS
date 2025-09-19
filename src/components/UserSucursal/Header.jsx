import React, { useState } from 'react';
import { useAuthUsuarioSucursal } from '../../contexts/AuthUsuarioSucursalContext';
import './Header.css';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user } = useAuthUsuarioSucursal();

  // Función para obtener las iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="user-sucursal-header">
      <div className="header-content">
        <div className="header-left">
          <button className="hamburger-menu" onClick={onToggleSidebar}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <h1 className="header-title">SGT - Sistema de Gestión Técnica</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-initials">{getInitials(user?.nombre_completo)}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user?.nombre_completo || 'Usuario'}</span>
              <span className="user-role">{user?.rol?.nombre || 'Sin rol'}</span>
              <span className="user-sucursal">{user?.sucursal?.nombre || 'Sin sucursal'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;