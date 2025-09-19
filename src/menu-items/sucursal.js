// assets
import { 
  IconDashboard, 
  IconUsers, 
  IconClipboardList, 
  IconSettings, 
  IconShield,
  IconSchool,
  IconClipboard,
  IconReportAnalytics,
  IconShoppingCart,
  IconChartBar
} from '@tabler/icons-react';

// constant
const icons = { 
  IconDashboard, 
  IconUsers, 
  IconClipboardList, 
  IconSettings, 
  IconShield,
  IconSchool,
  IconClipboard,
  IconReportAnalytics,
  IconShoppingCart,
  IconChartBar
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

// Función para generar menú según tipo de sucursal
const getSucursalMenu = (tipoSucursal) => {
  const baseMenu = {
    items: [
      {
        id: 'sucursal',
        title: 'Panel de Sucursal',
        type: 'group',
        children: [
          {
            id: 'dashboard-sucursal',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard-sucursal',
            icon: icons.IconDashboard,
            breadcrumbs: false
          }
        ]
      }
    ]
  };

  // Menú específico según tipo de sucursal
  if (tipoSucursal?.toLowerCase() === 'instituto') {
    // Menú para Instituto
    baseMenu.items[0].children.push(
      {
        id: 'gestion-instituto',
        title: 'Gestión Académica',
        type: 'collapse',
        icon: icons.IconSchool,
        children: [
          {
            id: 'academia',
            title: 'Registro de control',
            type: 'item',
            url: '/academia',
            icon: icons.IconSchool,
            breadcrumbs: false
          },
          {
            id: 'control',
            title: 'Registro de ubicación',
            type: 'item',
            url: '/control',
            icon: icons.IconClipboard,
            breadcrumbs: false
          },
          {
            id: 'reporte-control',
            title: 'Reporte Control',
            type: 'item',
            url: '/reporte-control',
            icon: icons.IconReportAnalytics,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'gestion-usuarios',
        title: 'Gestión de Usuarios',
        type: 'collapse',
        icon: icons.IconClipboardList,
        children: [
          {
            id: 'roles-usuarios-sucursal',
            title: 'Roles de Usuario',
            type: 'item',
            url: '/roles-usuarios-sucursal',
            icon: icons.IconShield,
            breadcrumbs: false
          },
          {
            id: 'usuarios-sucursal',
            title: 'Usuarios',
            type: 'item',
            url: '/usuarios-sucursal',
            icon: icons.IconUsers,
            breadcrumbs: false
          }
        ]
      }
    );
  } else if (tipoSucursal?.toLowerCase() === 'tienda') {
    // Menú para Tienda
    baseMenu.items[0].children.push(
      {
        id: 'gestion-ventas',
        title: 'Gestión de Ventas',
        type: 'collapse',
        icon: icons.IconShoppingCart,
        children: [
          {
            id: 'ventas',
            title: 'Ventas',
            type: 'item',
            url: '/ventas',
            icon: icons.IconShoppingCart,
            breadcrumbs: false
          },
          {
            id: 'reportes-ventas',
            title: 'Reportes Ventas',
            type: 'item',
            url: '/reportes-ventas',
            icon: icons.IconChartBar,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'gestion-usuarios',
        title: 'Gestión de Usuarios',
        type: 'collapse',
        icon: icons.IconClipboardList,
        children: [
          {
            id: 'roles-usuarios-sucursal',
            title: 'Roles de Usuario',
            type: 'item',
            url: '/roles-usuarios-sucursal',
            icon: icons.IconShield,
            breadcrumbs: false
          },
          {
            id: 'usuarios-sucursal',
            title: 'Usuarios',
            type: 'item',
            url: '/usuarios-sucursal',
            icon: icons.IconUsers,
            breadcrumbs: false
          }
        ]
      }
    );
  } else {
    // Menú por defecto (gestión básica)
    baseMenu.items[0].children.push(
      {
        id: 'gestion-sucursal',
        title: 'Gestión',
        type: 'collapse',
        icon: icons.IconClipboardList,
        children: [
          {
            id: 'roles-usuarios-sucursal',
            title: 'Roles de Usuario',
            type: 'item',
            url: '/roles-usuarios-sucursal',
            icon: icons.IconShield,
            breadcrumbs: false
          },
          {
            id: 'usuarios-sucursal',
            title: 'Usuarios',
            type: 'item',
            url: '/usuarios-sucursal',
            icon: icons.IconUsers,
            breadcrumbs: false
          },
          {
            id: 'reportes-sucursal',
            title: 'Reportes',
            type: 'item',
            url: '/reportes-sucursal',
            icon: icons.IconClipboardList,
            breadcrumbs: false
          }
        ]
      }
    );
  }

  // Agregar configuración al final
  baseMenu.items[0].children.push(
    {
      id: 'configuracion-sucursal',
      title: 'Configuración',
      type: 'item',
      url: '/configuracion-sucursal',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  );

  return baseMenu;
};

// Menú por defecto
const sucursal = getSucursalMenu();

export default sucursal;
export { getSucursalMenu };