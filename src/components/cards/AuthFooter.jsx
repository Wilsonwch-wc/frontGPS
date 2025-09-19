// material-ui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        sx={{ justifyContent: 'center', textAlign: 'center' }}
      >
        <Typography variant="subtitle2" color="secondary">
          © 2025 Sistema de Gestión de Sucursales
        </Typography>
      </Stack>
    </Container>
  );
}
