// assets
import { UserOutlined, TagsOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  TagsOutlined
};

// ==============================|| MENU ITEMS - USERS ||============================== //

const users = {
  id: 'group-users',
  title: 'Administración',
  type: 'group',
  children: [
    {
      id: 'user-management',
      title: 'Gestión Usuarios',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'tipos-sucursal-management',
      title: 'Tipos de Sucursal',
      type: 'item',
      url: '/tipos-sucursal',
      icon: icons.TagsOutlined,
      breadcrumbs: false
    }
  ]
};

export default users;