import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import PropTypes from 'prop-types';

// Crear contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función de login
  const login = async (username, password) => {
    try {
      console.log('🔄 AuthContext: Iniciando login...');
      setIsLoading(true);
      const response = await authAPI.login(username, password);
      console.log('📡 AuthContext: Respuesta de API:', response);
      
      if (response.success) {
        console.log('✅ AuthContext: Login exitoso');
        const { token: userToken, user: userData } = response.data;
        
        // Guardar en localStorage
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('💾 AuthContext: Datos guardados en localStorage');
        
        // Actualizar estado
        setToken(userToken);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('🔄 AuthContext: Estado actualizado');
        
        return { success: true };
      } else {
        console.log('❌ AuthContext: Login fallido:', response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('💥 AuthContext: Error en login:', error);
      return { success: false, error: error.message || 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar el estado de autenticación
  const updateAuthState = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
          // Verificar que el token siga siendo válido
          const profileResponse = await authAPI.getProfile();
          
          if (profileResponse.data.success) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpiar
            logout();
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;