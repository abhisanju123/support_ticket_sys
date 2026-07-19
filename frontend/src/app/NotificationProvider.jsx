import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';

import { useAppDispatch, useAppSelector } from '../hooks';
import { hideNotification, selectNotification } from '../store/notification/notificationSlice.js';

const TOAST_AUTO_HIDE_MS = 10000;

function ToastTransition(props) {
  return <Slide {...props} direction="left" mountOnEnter unmountOnExit />;
}

export function NotificationProvider() {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector(selectNotification);

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={TOAST_AUTO_HIDE_MS}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={ToastTransition}
      TransitionProps={{ timeout: { enter: 320, exit: 300 } }}
      className="app-toast"
      sx={{
        top: { xs: 76, md: 84 },
        right: { xs: 16, md: 24 },
        left: 'auto',
        transform: 'none',
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        className={`app-toast__alert app-toast__alert--${severity}`}
        sx={{
          width: '100%',
          minWidth: { xs: 280, sm: 320 },
          maxWidth: 420,
          alignItems: 'center',
          borderRadius: 2,
          fontWeight: 500,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
