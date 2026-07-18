import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { FormErrorAlert } from '../../../components/business/shared/FormErrorAlert.jsx';
import { ROUTE_PATHS } from '../../../constants/routes.constants.js';
import { useValidatedForm } from '../../../utils/validation/index.js';
import { PASSWORD_POLICY_MESSAGE, registerFormSchema } from '../schemas/authForm.schema.js';

import { AuthFormCard } from './AuthFormCard.jsx';

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function RegisterForm({ onSubmit, isSubmitting = false }) {
  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema: registerFormSchema,
    defaultValues,
    onSubmit,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthFormCard
      title="Create account"
      description="Register to start managing support tickets."
      onSubmit={submitHandler}
      footer={
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTE_PATHS.LOGIN} underline="hover">
            Sign in
          </Link>
        </Typography>
      }
    >
      <>
        <FormErrorAlert message={globalError} onClose={clearGlobalError} />

        <TextField
          {...register('name')}
          label="Full name"
          autoComplete="name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          fullWidth
          required
        />

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
          autoComplete="new-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message ?? PASSWORD_POLICY_MESSAGE}
          fullWidth
          required
        />

        <TextField
          {...register('confirmPassword')}
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting || !isFormComplete}
          className={isSubmitting || !isFormComplete ? undefined : 'interactive-press'}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </>
    </AuthFormCard>
  );
}
