import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { AuthProvider } from 'contexts/AuthContext';
import { AuthSucursalProvider } from 'contexts/AuthSucursalContext';
import { AuthUsuarioSucursalProvider } from 'contexts/AuthUsuarioSucursalContext';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <AuthProvider>
      <AuthSucursalProvider>
        <AuthUsuarioSucursalProvider>
          <ThemeCustomization>
            <ScrollTop>
              <RouterProvider router={router} />
            </ScrollTop>
          </ThemeCustomization>
        </AuthUsuarioSucursalProvider>
      </AuthSucursalProvider>
    </AuthProvider>
  );
}
