import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
      title="Sign in"
      description="Access your support ticket workspace."
      onSubmit={submitHandler}
      footer={
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to={ROUTE_PATHS.REGISTER} underline="hover">
            Create one
          </Link>
        </Typography>
      }
    >
      <>
        <FormErrorAlert message={globalError} onClose={clearGlobalError} />

        <TextField
          {...register('email')}
          label="Email"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          fullWidth
          required
        />

        <TextField
          {...register('password')}
          label="Password"
          type="password"
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting || !isFormComplete}
          className={isSubmitting || !isFormComplete ? 'app-btn--submit' : 'app-btn--submit interactive-press'}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </>
    </AuthFormCard>
  );
}
