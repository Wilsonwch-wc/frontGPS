import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  Stack,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// project imports
import { useAuthSucursal } from '../../contexts/AuthSucursalContext';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import usePageTitle from '../../hooks/usePageTitle';

// ==============================|| DASHBOARD - SUCURSAL ||============================== //

export default function DashboardSucursal() {
  const navigate = useNavigate();
  const { admin } = useAuthSucursal();
  const [currentTime, setCurrentTime] = useState(new Date());
  usePageTitle('Dashboard Sucursal');

  useEffect(() => {
    if (!admin) {
      navigate('/index');
    }
  }, [admin, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!admin) {
    return null;
  }

  // Dashboard limpio - aquí irán los reportes

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Dashboard - Administración Sucursal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentTime.toLocaleString()}
          </Typography>
        </Box>
      </Grid>

      {/* Contenido vacío - aquí irán los reportes */}
      <Grid size={12}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" color="text.secondary">
            Dashboard en construcción
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aquí se mostrarán los reportes y métricas de la sucursal
          </Typography>
        </Box>
      </Grid>


    </Grid>
  );
}