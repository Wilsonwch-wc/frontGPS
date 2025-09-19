// assets
import { ShopOutlined } from '@ant-design/icons';

// icons
const icons = {
  ShopOutlined
};

// ==============================|| MENU ITEMS - SUCURSALES ||============================== //

const sucursales = {
  id: 'group-sucursales',
  title: 'Sucursales',
  type: 'group',
  children: [
    {
      id: 'sucursal-management',
      title: 'Gestión Sucursales',
      type: 'item',
      url: '/sucursales',
      icon: icons.ShopOutlined,
      breadcrumbs: false
    }
  ]
};

export default sucursales;