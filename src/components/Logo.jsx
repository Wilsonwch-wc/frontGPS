import PropTypes from 'prop-types';

// project imports
import LogoMain from './logo/LogoMain';
import LogoIcon from './logo/LogoIcon';

// ==============================|| LOGO ||============================== //

export default function Logo({ reverse, isIcon, ...others }) {
  return isIcon ? <LogoIcon {...others} /> : <LogoMain reverse={reverse} {...others} />;
}

Logo.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool
};