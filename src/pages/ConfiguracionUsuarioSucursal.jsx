import React from 'react';
import Layout from '../components/UserSucursal/Layout';
import Configuracion from '../components/UserSucursal/Configuracion';
import usePageTitle from '../hooks/usePageTitle';

const ConfiguracionUsuarioSucursal = () => {
  usePageTitle('Configuración');
  return (
    <Layout>
      <Configuracion />
    </Layout>
  );
};

export default ConfiguracionUsuarioSucursal;