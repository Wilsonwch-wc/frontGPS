import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAdminSucursal,
  getProfileAdminSucursal,
  logoutAdminSucursal,
  isAuthenticatedAdminSucursal,
  getAdminSucursalData
} from '../api/auth-sucursales';
import PropTypes from 'prop-types';

// Crear contexto
const AuthSucursalContext = createContext();

// Hook para usar el contexto
export const useAuthSucursal = () => {
  const context = useContext(AuthSucursalContext);
  if (!context) {
    throw new Error('useAuthSucursal debe ser usado dentro de AuthSucursalProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthSucursalProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función de login
  const login = async (usuario, password) => {
    try {
      console.log('🔄 AuthSucursalContext: Iniciando login...');
      setIsLoading(true);
      const response = await loginAdminSucursal(usuario, password);
      console.log('📡 AuthSucursalContext: Respuesta de API:', response);
      
      if (response.success) {
        console.log('✅ AuthSucursalContext: Login exitoso');
        const { token: userToken, admin: adminData } = response.data;
        
        // Guardar en localStorage
        localStorage.setItem('sucursal_token', userToken);
        localStorage.setItem('sucursal_admin', JSON.stringify(adminData));
        console.log('💾 AuthSucursalContext: Datos guardados en localStorage');
        
        // Actualizar estado
        setToken(userToken);
        setAdmin(adminData);
        setIsAuthenticated(true);
        console.log('🔄 AuthSucursalContext: Estado actualizado');
        
        return { success: true };
      } else {
        console.log('❌ AuthSucursalContext: Login fallido:', response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('💥 AuthSucursalContext: Error en login:', error);
      return { success: false, error: error.message || 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    logoutAdminSucursal();
    setAdmin(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar el estado de autenticación
  const updateAuthState = () => {
    const savedToken = localStorage.getItem('sucursal_token');
    const savedAdmin = localStorage.getItem('sucursal_admin');
    
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
      setIsAuthenticated(true);
    } else {
      setAdmin(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('sucursal_token');
        const savedAdmin = localStorage.getItem('sucursal_admin');
        
        if (savedToken && savedAdmin) {
          // Verificar que el token siga siendo válido
          try {
            const profileResponse = await getProfileAdminSucursal();
            
            if (profileResponse.success) {
              setToken(savedToken);
              setAdmin(JSON.parse(savedAdmin));
              setIsAuthenticated(true);
            } else {
              // Token inválido, limpiar
              logout();
            }
          } catch (error) {
            // Error al verificar perfil, limpiar
            logout();
          }
        } else {
          setAdmin(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setAdmin(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    admin,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateAuthState
  };

  return (
    <AuthSucursalContext.Provider value={value}>
      {children}
    </AuthSucursalContext.Provider>
  );
};

AuthSucursalProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthSucursalContext;