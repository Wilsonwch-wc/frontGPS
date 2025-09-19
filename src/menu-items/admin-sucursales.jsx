// assets
import { TeamOutlined } from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined
};

// ==============================|| MENU ITEMS - ADMIN SUCURSALES ||==============================

const adminSucursales = {
  id: 'group-admin-sucursales',
  title: 'Administración Sucursales',
  type: 'group',
  children: [
    {
      id: 'admin-sucursal-management',
      title: 'Usuarios Sucursales',
      type: 'item',
      url: '/admin-sucursales',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    }
  ]
};

export default adminSucursales;