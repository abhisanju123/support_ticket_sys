import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { baseApi } from '../api/baseApi.js';
import '../features/auth/api/authApi.js';
import '../features/comments/api/commentsApi.js';
import '../features/tickets/api/ticketsApi.js';
import '../features/users/api/usersApi.js';

import { apiListenerMiddleware } from './apiListener.js';
import { rootReducer } from './rootReducer.js';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['api.queries', 'api.mutations'],
      },
    })
      .concat(baseApi.middleware)
      .prepend(apiListenerMiddleware.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */
