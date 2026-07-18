import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';

import { clearCredentials } from '../features/auth/store/authSlice.js';
import { API_ERROR_CODES, getApiErrorNotificationMessage, getValidationFieldErrors, parseApiError } from '../utils/apiError.js';

import { showNotification } from './notification/notificationSlice.js';

export const apiListenerMiddleware = createListenerMiddleware();

apiListenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const fieldErrors = getValidationFieldErrors(action.payload);

    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      return;
    }

    const parsed = parseApiError(action.payload);

    if (parsed.status === 401) {
      listenerApi.dispatch(clearCredentials());
    }

    if (parsed.status === 422 || parsed.code === API_ERROR_CODES.VALIDATION_ERROR) {
      return;
    }

    const message = getApiErrorNotificationMessage(action.payload);
    listenerApi.dispatch(showNotification({ message, severity: 'error' }));
  },
});
