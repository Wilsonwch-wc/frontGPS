// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog() {
  return {
    MuiDialog: {
      defaultProps: {
        disablePortal: true,
        disableEnforceFocus: true,
        disableAutoFocus: true
      }
    }
  };
}