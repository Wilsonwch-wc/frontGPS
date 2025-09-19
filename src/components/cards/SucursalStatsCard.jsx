import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import { ShopOutlined } from '@ant-design/icons';
import { getSucursales } from '../../api/sucursales';

const SucursalStatsCard = () => {
  const [stats, setStats] = useState({
    total: 0,
    activas: 0,
    inactivas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getSucursales();
      
      if (response.success && response.data) {
        const sucursales = response.data;
        const total = sucursales.length;
        const activas = sucursales.filter(s => s.activo === 1 || s.activo === true).length;
        const inactivas = total - activas;
        
        setStats({ total, activas, inactivas });
      }
    } catch (err) {
      console.error('Error al cargar estadísticas de sucursales:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 1,
              backgroundColor: 'primary.lighter',
              color: 'primary.main',
              mr: 2
            }}
          >
            <ShopOutlined style={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" color="textSecondary">
            Sucursales
          </Typography>
        </Box>
        
        <Typography variant="h3" sx={{ mb: 1 }}>
          {stats.total}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`${stats.activas} Activas`} 
            color="success" 
            size="small" 
            variant="outlined"
          />
          {stats.inactivas > 0 && (
            <Chip 
              label={`${stats.inactivas} Inactivas`} 
              color="default" 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SucursalStatsCard;