import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  severity: 'error',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity ?? 'error';
    },
    hideNotification(state) {
      state.open = false;
    },
  },
});

export const { hideNotification, showNotification } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;

export const selectNotification = (state) => state.notification;
