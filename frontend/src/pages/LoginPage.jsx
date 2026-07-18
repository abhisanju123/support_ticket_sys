import { useLocation, useNavigate } from 'react-router-dom';

import { LoginForm } from '../features/auth/components/LoginForm.jsx';
import { useLoginMutation, setCredentials } from '../features/auth/index.js';
import { ROUTE_PATHS } from '../constants/routes.constants.js';
import { useAppDispatch } from '../hooks/index.js';
import { showNotification } from '../store/notification/notificationSlice.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values) => {
    const result = await login(values).unwrap();

    dispatch(setCredentials(result));

    dispatch(
      showNotification({
        message: 'Signed in successfully.',
        severity: 'success',
      }),
    );

    const redirectPath = location.state?.from?.pathname ?? ROUTE_PATHS.DASHBOARD;
    navigate(redirectPath, { replace: true });
  };

  return <LoginForm onSubmit={handleSubmit} isSubmitting={isLoading} />;
}
