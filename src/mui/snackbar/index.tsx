import React from 'react';
import { Snackbar } from '@mui/material';
import { type AppDispatch, type RootState } from '../../state';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { snackbarClose } from '../../slices/snackbar.slice';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * @see https://material-ui.com/components/snackbars/
 */
export default function StateJsxSnackbar () {
  const {
    open, anchorOrigin, autoHideDuration, variant, content, message
  } = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(snackbarClose());
  }

  const SnackbarContent = () => content || <>{message}</>;

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open ?? false}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert severity={variant}>
        <SnackbarContent />
      </Alert>
    </Snackbar>
  );
}
