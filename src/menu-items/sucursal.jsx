// assets
import {
  DashboardOutlined,
  LogoutOutlined
} from '@ant-design/icons';

// ==============================|| MENU ITEMS - SUCURSAL ||============================== //

const sucursal = {
  id: 'sucursal',
  title: 'Administración Sucursal',
  type: 'group',
  children: [
    {
      id: 'dashboard-sucursal',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard-sucursal',
      icon: DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'logout-sucursal',
      title: 'Cerrar Sesión',
      type: 'item',
      url: '/login-sucursal',
      icon: LogoutOutlined,
      breadcrumbs: false,
      external: true
    }
  ]
};

const menuItems = {
  items: [sucursal]
};

export default menuItems;