import PropTypes from 'prop-types';

// ==============================|| ANIMATE BUTTON ||============================== //

export default function AnimateButton({ children, type = 'scale', direction = 'right', offset = 10, scale = { hover: 1.05, tap: 0.954 } }) {
  // Simplified version without framer-motion - just render children
  if (typeof children === 'object') {
    return <div>{children}</div>;
  }
  return <span>{children}</span>;
}

AnimateButton.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['slide', 'scale', 'rotate']),
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  offset: PropTypes.number,
  scale: PropTypes.object
};
