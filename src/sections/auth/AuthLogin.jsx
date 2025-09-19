import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          username: 'admin',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(50).required('Username is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log('🔐 Iniciando proceso de login...');
            console.log('📝 Datos de login:', { username: values.username, password: '***' });
            
            setStatus(null);
            setSubmitting(true);
            
            const result = await login(values.username, values.password);
            console.log('📊 Resultado del login:', result);
            
            if (result.success) {
              console.log('✅ Login exitoso, redirigiendo...');
              // Redirigir a la página anterior o al dashboard
              const from = location.state?.from?.pathname || '/';
              console.log('🎯 Redirigiendo a:', from);
              navigate(from, { replace: true });
            } else {
              console.log('❌ Login fallido:', result.error);
              setStatus({ success: false });
              setErrors({ submit: result.error });
            }
          } catch (err) {
            console.log('💥 Error en login:', err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="username-login">Username</InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter username"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                    autoComplete="username"
                  />
                </Stack>
                {touched.username && errors.username && (
                  <FormHelperText error id="standard-weight-helper-text-username-login">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete="current-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button 
                    fullWidth 
                    size="large" 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? 'Iniciando sesión...' : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
