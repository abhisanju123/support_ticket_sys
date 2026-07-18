import { useNavigate } from 'react-router-dom';

import { RegisterForm } from '../features/auth/components/RegisterForm.jsx';
import { useRegisterMutation } from '../features/auth/index.js';
import { ROUTE_PATHS } from '../constants/routes.constants.js';
import { useAppDispatch } from '../hooks/index.js';
import { showNotification } from '../store/notification/notificationSlice.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (values) => {
    await register(values).unwrap();

    dispatch(
      showNotification({
        message: 'Account created successfully. Please sign in.',
        severity: 'success',
      }),
    );

    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return <RegisterForm onSubmit={handleSubmit} isSubmitting={isLoading} />;
}
