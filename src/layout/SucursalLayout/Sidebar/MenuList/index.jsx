// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import { getSucursalMenu } from 'menu-items/sucursal';
import { useAuthSucursal } from '../../../../contexts/AuthSucursalContext';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const { admin } = useAuthSucursal();
  
  // Obtener el tipo de sucursal del usuario autenticado
  const tipoSucursal = admin?.sucursal?.tipo;
  
  // Generar menú dinámico basado en el tipo de sucursal
  const menuItem = getSucursalMenu(tipoSucursal);
  
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;