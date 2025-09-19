// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Edificio principal */}
      <rect x="6" y="6" width="23" height="23" fill={theme.palette.primary.main} rx="2" />
      <rect x="8" y="8" width="19" height="19" fill={theme.palette.primary.light} rx="1" />
      
      {/* Ventanas del edificio */}
      <rect x="10" y="10" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="15" y="10" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="20" y="10" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="10" y="15" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="15" y="15" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="20" y="15" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="10" y="20" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="15" y="20" width="3" height="3" fill={theme.palette.background.paper} />
      <rect x="20" y="20" width="3" height="3" fill={theme.palette.background.paper} />
      
      {/* Puerta */}
      <rect x="15" y="24" width="5" height="5" fill={theme.palette.primary.dark} />
      
      {/* Sucursales pequeñas */}
      <rect x="1" y="16" width="7" height="13" fill={theme.palette.secondary.main} rx="1" />
      <rect x="27" y="16" width="7" height="13" fill={theme.palette.secondary.main} rx="1" />
      
      {/* Ventanas sucursales */}
      <rect x="2" y="18" width="2" height="2" fill={theme.palette.background.paper} />
      <rect x="5" y="18" width="2" height="2" fill={theme.palette.background.paper} />
      <rect x="2" y="22" width="2" height="2" fill={theme.palette.background.paper} />
      <rect x="5" y="22" width="2" height="2" fill={theme.palette.background.paper} />
      
      <rect x="28" y="18" width="2" height="2" fill={theme.palette.background.paper} />
      <rect x="31" y="18" width="2" height="2" fill={theme.palette.background.paper} />
      <rect x="28" y="22" width="2" height="2" fill={theme.palette.background.paper} />
      <rect x="31" y="22" width="2" height="2" fill={theme.palette.background.paper} />
      
      {/* Puertas sucursales */}
      <rect x="3" y="26" width="2" height="3" fill={theme.palette.secondary.dark} />
      <rect x="29" y="26" width="2" height="3" fill={theme.palette.secondary.dark} />
    </svg>
  );
}
