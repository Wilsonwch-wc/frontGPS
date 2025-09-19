import React from 'react';

// material-ui
import {
  Box,
  Typography
} from '@mui/material';

import usePageTitle from '../../hooks/usePageTitle';

// ==============================|| REPORTES VENTAS PAGE ||============================== //

const ReportesVentas = () => {
  usePageTitle('Reportes Ventas');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reportes Ventas
      </Typography>
    </Box>
  );
};

export default ReportesVentas;