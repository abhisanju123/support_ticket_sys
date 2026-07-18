import { createSlice } from '@reduxjs/toolkit';

const MAX_ACTIVITY_ITEMS = 30;

const activityFeedSlice = createSlice({
  name: 'activityFeed',
  initialState: {
    items: [],
  },
  reducers: {
    addActivityEvent(state, action) {
      state.items.unshift({
        id: action.payload.id ?? `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        read: false,
        timestamp: action.payload.timestamp ?? new Date().toISOString(),
        type: action.payload.type ?? 'info',
        message: action.payload.message,
        path: action.payload.path ?? null,
        ticketId: action.payload.ticketId ?? null,
      });

      if (state.items.length > MAX_ACTIVITY_ITEMS) {
        state.items.length = MAX_ACTIVITY_ITEMS;
      }
    },
    markActivityRead(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);

      if (item) {
        item.read = true;
      }
    },
    markAllActivityRead(state) {
      state.items.forEach((item) => {
        item.read = true;
      });
    },
    clearActivityFeed(state) {
      state.items = [];
    },
  },
});

export const { addActivityEvent, markActivityRead, markAllActivityRead, clearActivityFeed } =
  activityFeedSlice.actions;
export const activityFeedReducer = activityFeedSlice.reducer;

export const selectActivityFeed = (state) => state.activityFeed.items;
export const selectUnreadActivityCount = (state) =>
  state.activityFeed.items.filter((item) => !item.read).length;
