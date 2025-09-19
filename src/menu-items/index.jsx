// project import
import dashboard from './dashboard';
import pages from './page';
import users from './users';
import sucursales from './sucursales';
import adminSucursales from './admin-sucursales';
import location from './location';

// ==============================|| MENU ITEMS ||==============================

const menuItems = {
  items: [dashboard, sucursales, adminSucursales, users, location, pages].filter(Boolean)
};

export default menuItems;
