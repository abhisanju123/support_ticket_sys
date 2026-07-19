import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { FormErrorAlert } from '../../../components/business/shared/FormErrorAlert.jsx';
import { ROUTE_PATHS } from '../../../constants/routes.constants.js';
import { useValidatedForm } from '../../../utils/validation/index.js';
import { loginFormSchema } from '../schemas/authForm.schema.js';

import { AuthFormCard } from './AuthFormCard.jsx';

const defaultValues = {
  email: '',
  password: '',
};

export function LoginForm({ onSubmit, isSubmitting = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema: loginFormSchema,
    defaultValues,
    onSubmit,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthFormCard
      icon={LoginOutlinedIcon}
      badge="Secure access"
      title="Sign in"
      description="Welcome back. Enter your credentials to access your workspace."
      onSubmit={submitHandler}
      footer={
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don&apos;t have an account?{' '}
          <Link
            component={RouterLink}
            to={ROUTE_PATHS.REGISTER}
            underline="hover"
            fontWeight={600}
          >
            Create one
          </Link>
        </Typography>
      }
    >
      <>
        <FormErrorAlert message={globalError} onClose={clearGlobalError} />

        <TextField
          {...register('email')}
          label="Email address"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          fullWidth
          required
          className="auth-field"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon fontSize="small" className="auth-field__icon" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          {...register('password')}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          fullWidth
          required
          className="auth-field"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" className="auth-field__icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting || !isFormComplete}
          className={
            isSubmitting || !isFormComplete ? 'app-btn--submit' : 'app-btn--submit interactive-press'
          }
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <Box className="auth-form-card__trust" component="p">
          <ShieldOutlinedIcon fontSize="inherit" aria-hidden="true" />
          <span>Your session is protected with encrypted authentication.</span>
        </Box>
      </>
    </AuthFormCard>
  );
}
