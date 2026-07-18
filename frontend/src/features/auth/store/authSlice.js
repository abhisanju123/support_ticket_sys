import { createSlice } from '@reduxjs/toolkit';

import { AUTH_STORAGE_KEY } from '../constants/auth.constants.js';

const loadPersistedAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return { user: null, token: null };
    }

    const parsed = JSON.parse(raw);

    if (parsed?.user && parsed?.token) {
      return { user: parsed.user, token: parsed.token };
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return { user: null, token: null };
};

const persistAuth = (state) => {
  if (state.user && state.token) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: state.user, token: state.token }),
    );
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const persisted = loadPersistedAuth();

const initialState = {
  user: persisted.user,
  token: persisted.token,
  status: persisted.token ? 'authenticated' : 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'authenticated';
      persistAuth(state);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      persistAuth(state);
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth.user && state.auth.token);
export const selectAuthStatus = (state) => state.auth.status;
