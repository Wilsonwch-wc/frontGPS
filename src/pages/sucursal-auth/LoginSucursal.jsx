import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Container,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import usePageTitle from '../../hooks/usePageTitle';

const LoginSucursal = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  usePageTitle('Login Sucursal');
  
  const { login, isAuthenticated } = useAuthSucursal();
  const navigate = useNavigate();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.usuario || !formData.password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.usuario, formData.password);
      
      if (result.success) {
        navigate('/dashboard-sucursal');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}
          >
            <StoreIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Panel de Sucursal
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Acceso para Administradores de Sucursal
            </Typography>
          </Box>

          {/* Form */}
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <Box
            sx={{
              bgcolor: 'grey.50',
              p: 2,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2025 Sistema de Gestión de Sucursales
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginSucursal;