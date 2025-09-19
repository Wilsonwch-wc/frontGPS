import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import Logo from 'components/logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
  <ButtonBase disableRipple component={Link} to="/dashboard-sucursal">
    <Logo />
  </ButtonBase>
);

export default LogoSection;