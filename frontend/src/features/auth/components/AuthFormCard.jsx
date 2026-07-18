import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AUTH_PLACEHOLDER_MODE, AUTH_PLACEHOLDER_NOTICE } from '../constants/auth.constants.js';

export function AuthFormCard({
  title,
  description,
  children,
  footer,
  onSubmit,
  showPlaceholderNotice = AUTH_PLACEHOLDER_MODE,
}) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      className="surface-card shadow-elevated app-form app-form--auth"
    >
      <Box className="app-form__header">
        <Typography variant="h5" component="h1" fontWeight={600}>
          {title}
        </Typography>

        {description ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Box>

      {showPlaceholderNotice ? (
        <Alert severity="info" sx={{ py: 0.5 }}>
          {AUTH_PLACEHOLDER_NOTICE}
        </Alert>
      ) : null}

      <Box className="app-form-fields">{children}</Box>

      {footer ? <Box sx={{ pt: 0.25 }}>{footer}</Box> : null}
    </Box>
  );
}
