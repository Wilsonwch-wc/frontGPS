import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import DashboardContent from './DashboardContent';
// import RegistrarContent from './RegistrarContent'; // Eliminado - ya no se usa
import './Layout.css';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      // case 'registrar': // Eliminado - ya no se usa
      //   return <RegistrarContent />;
      case 'inventario':
        return (
          <div className="section-placeholder">
            <h2>Módulo de Inventario</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'reportes':
        return (
          <div className="section-placeholder">
            <h2>Módulo de Reportes</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="user-sucursal-layout">
      <Header 
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="layout-body">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <main className="main-content">
          <div className="content-wrapper">
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;