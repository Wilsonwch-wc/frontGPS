// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import { useAuth } from 'contexts/AuthContext';
import SucursalStatsCard from 'components/cards/SucursalStatsCard';
import usePageTitle from 'hooks/usePageTitle';



// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const { user } = useAuth();
  usePageTitle('Dashboard Principal');

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      {/* Estadísticas */}
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SucursalStatsCard />
      </Grid>

      {/* Contenido del dashboard - espacio para más tarjetas */}
    </Grid>
  );
}
