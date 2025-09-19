// assets
import { EnvironmentOutlined } from '@ant-design/icons';

// icons
const icons = {
  EnvironmentOutlined
};

// ==============================|| MENU ITEMS - LOCATION ||============================== //

const location = {
  id: 'group-location',
  title: 'Herramientas',
  type: 'group',
  children: [
    {
      id: 'mi-ubicacion',
      title: 'Mi Ubicación',
      type: 'item',
      url: '/mi-ubicacion',
      icon: icons.EnvironmentOutlined,
      breadcrumbs: false
    }
  ]
};

export default location;