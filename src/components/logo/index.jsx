import PropTypes from 'prop-types';

// project imports
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ reverse, isIcon, sx }) {
  return (
    <div style={sx}>
      {isIcon ? <LogoIcon /> : <Logo reverse={reverse} />}
    </div>
  );
}

LogoSection.propTypes = { reverse: PropTypes.bool, isIcon: PropTypes.bool, sx: PropTypes.any };
