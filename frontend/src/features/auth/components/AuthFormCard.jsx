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
  icon: Icon,
  badge,
  showPlaceholderNotice = AUTH_PLACEHOLDER_MODE,
}) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      className="surface-card shadow-elevated app-form app-form--auth auth-form-card"
    >
      <Box className="auth-form-card__header">
        {Icon || badge ? (
          <Box className="auth-form-card__intro">
            {Icon ? (
              <Box className="auth-form-card__icon" aria-hidden="true">
                <Icon />
              </Box>
            ) : null}
            {badge ? <span className="auth-form-card__badge">{badge}</span> : null}
          </Box>
        ) : null}

        <Box className="app-form__header">
          <Typography variant="h5" component="h1" className="auth-form-card__title">
            {title}
          </Typography>

          {description ? (
            <Typography variant="body2" color="text.secondary" className="auth-form-card__description">
              {description}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {showPlaceholderNotice ? (
        <Alert severity="info" sx={{ py: 0.5 }}>
          {AUTH_PLACEHOLDER_NOTICE}
        </Alert>
      ) : null}

      <Box className="app-form-fields auth-form-card__fields">{children}</Box>

      {footer ? <Box className="auth-form-card__footer">{footer}</Box> : null}
    </Box>
  );
}
