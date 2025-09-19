import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUsuarioSucursal } from '../contexts/AuthUsuarioSucursalContext';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/UsuarioSucursal.css';

const LoginUsuarioSucursal = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  usePageTitle('Login Usuario');

  const { login, isAuthenticated } = useAuthUsuarioSucursal();
  const navigate = useNavigate();



  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/us/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!formData.usuario.trim()) {
      setError('El usuario es requerido');
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      setLoading(false);
      return;
    }

    try {
      const result = await login(
        formData.usuario.trim(),
        formData.password
      );

      if (result.success) {
        navigate('/us/dashboard');
      } else {
        setError(result.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Gestión Técnica</h1>
          <h2>Acceso de Usuario</h2>
          <p>Ingrese sus credenciales para acceder al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="usuario">
              <i className="fas fa-user"></i>
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>



          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Problemas para acceder? Contacte al administrador de su sucursal</p>
          <div className="login-links">
            <a href="/" className="back-link">
              <i className="fas fa-arrow-left"></i>
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUsuarioSucursal;