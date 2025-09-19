import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUsuarioSucursal,
  getProfileUsuarioSucursal,
  logoutUsuarioSucursal
} from '../api/auth-usuarios-sucursal';

const AuthUsuarioSucursalContext = createContext();

export const useAuthUsuarioSucursal = () => {
  const context = useContext(AuthUsuarioSucursalContext);
  if (!context) {
    throw new Error('useAuthUsuarioSucursal debe ser usado dentro de AuthUsuarioSucursalProvider');
  }
  return context;
};

export const AuthUsuarioSucursalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token_usuario_sucursal');
      const savedUser = localStorage.getItem('user_usuario_sucursal');

      if (token && savedUser) {
        // Establecer estado inmediatamente con datos guardados
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Verificar que el token siga siendo válido en segundo plano
        try {
          const profileResponse = await getProfileUsuarioSucursal();
          if (profileResponse.success) {
            // Actualizar con datos frescos del servidor
            setUser(profileResponse.user);
            localStorage.setItem('user_usuario_sucursal', JSON.stringify(profileResponse.user));
          } else {
            // Token inválido, limpiar datos
            localStorage.removeItem('token_usuario_sucursal');
            localStorage.removeItem('user_usuario_sucursal');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (verifyError) {
          console.error('Error verificando token:', verifyError);
          // Si hay error de red, mantener sesión local pero registrar el error
          // Solo limpiar si es un error 401 (no autorizado)
          if (verifyError.response?.status === 401) {
            localStorage.removeItem('token_usuario_sucursal');
            localStorage.removeItem('user_usuario_sucursal');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        // No hay datos guardados
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
      // Limpiar datos si hay error
      localStorage.removeItem('token_usuario_sucursal');
      localStorage.removeItem('user_usuario_sucursal');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usuario, password) => {
    try {
      setLoading(true);
      const response = await loginUsuarioSucursal(usuario, password);
      
      if (response.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token_usuario_sucursal', response.token);
        localStorage.setItem('user_usuario_sucursal', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUsuarioSucursal();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado
      localStorage.removeItem('token_usuario_sucursal');
      localStorage.removeItem('user_usuario_sucursal');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await getProfileUsuarioSucursal();
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user_usuario_sucursal', JSON.stringify(response.user));
        return response.user;
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (roleName) => {
    return user?.rol?.nombre === roleName;
  };

  // Función para verificar si el usuario pertenece a una sucursal específica
  const belongsToSucursal = (sucursalId) => {
    return user?.sucursal?.id === sucursalId;
  };

  // Función para obtener el tipo de sucursal
  const getSucursalType = () => {
    return user?.sucursal?.tipo || null;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    hasRole,
    belongsToSucursal,
    getSucursalType,
    checkAuthStatus
  };

  return (
    <AuthUsuarioSucursalContext.Provider value={value}>
      {children}
    </AuthUsuarioSucursalContext.Provider>
  );
};

export default AuthUsuarioSucursalContext;