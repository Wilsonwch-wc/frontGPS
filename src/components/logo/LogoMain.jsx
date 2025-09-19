// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <svg width="40" height="35" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Edificio principal */}
        <rect x="8" y="8" width="24" height="24" fill={theme.palette.primary.main} rx="2" />
        <rect x="10" y="10" width="20" height="20" fill={theme.palette.primary.light} rx="1" />
        
        {/* Ventanas del edificio */}
        <rect x="12" y="12" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="17" y="12" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="22" y="12" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="12" y="17" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="17" y="17" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="22" y="17" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="12" y="22" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="17" y="22" width="3" height="3" fill={theme.palette.background.paper} />
        <rect x="22" y="22" width="3" height="3" fill={theme.palette.background.paper} />
        
        {/* Puerta */}
        <rect x="17" y="26" width="6" height="6" fill={theme.palette.primary.dark} />
        
        {/* Sucursales pequeñas */}
        <rect x="2" y="18" width="8" height="14" fill={theme.palette.secondary.main} rx="1" />
        <rect x="30" y="18" width="8" height="14" fill={theme.palette.secondary.main} rx="1" />
        
        {/* Ventanas sucursales */}
        <rect x="4" y="20" width="2" height="2" fill={theme.palette.background.paper} />
        <rect x="6" y="20" width="2" height="2" fill={theme.palette.background.paper} />
        <rect x="4" y="24" width="2" height="2" fill={theme.palette.background.paper} />
        <rect x="6" y="24" width="2" height="2" fill={theme.palette.background.paper} />
        
        <rect x="32" y="20" width="2" height="2" fill={theme.palette.background.paper} />
        <rect x="34" y="20" width="2" height="2" fill={theme.palette.background.paper} />
        <rect x="32" y="24" width="2" height="2" fill={theme.palette.background.paper} />
        <rect x="34" y="24" width="2" height="2" fill={theme.palette.background.paper} />
        
        {/* Puertas sucursales */}
        <rect x="5" y="28" width="2" height="4" fill={theme.palette.secondary.dark} />
        <rect x="33" y="28" width="2" height="4" fill={theme.palette.secondary.dark} />
      </svg>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          color: theme.palette.primary.main,
          letterSpacing: '0.5px'
        }}
      >
        SGS
      </Typography>
    </Box>
  );
}
