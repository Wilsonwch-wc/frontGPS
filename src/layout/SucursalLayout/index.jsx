import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Drawer, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import SucursalHeader from './Header';
import SucursalSidebar from './Sidebar';
import { drawerWidth } from 'store/constant';

// ==============================|| MAIN LAYOUT ||============================== //

const SucursalLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  // Handle left drawer
  const [leftDrawerOpened, setLeftDrawerOpened] = useState(true);
  const handleLeftDrawerToggle = () => {
    setLeftDrawerOpened(!leftDrawerOpened);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          width: {
            xs: '100%',
            md: leftDrawerOpened ? `calc(100% - ${drawerWidth}px)` : '100%'
          },
          marginLeft: {
            xs: 0,
            md: leftDrawerOpened ? `${drawerWidth}px` : 0
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Toolbar>
          <SucursalHeader handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Drawer
        variant={matchDownMd ? 'temporary' : 'persistent'}
        anchor="left"
        open={leftDrawerOpened}
        onClose={handleLeftDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ 
          keepMounted: true,
          disableEnforceFocus: true,
          disableAutoFocus: true
        }}
        color="inherit"
      >
        <SucursalSidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />
      </Drawer>

      {/* main content */}
      <Box
        component="main"
        sx={{
          width: {
            xs: '100%',
            md: leftDrawerOpened ? `calc(100% - ${drawerWidth}px)` : '100%'
          },
          marginLeft: {
            xs: 0,
            md: leftDrawerOpened ? `${drawerWidth}px` : 0
          },
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default SucursalLayout;