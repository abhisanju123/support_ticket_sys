import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '../api/baseApi.js';
import { activityFeedReducer } from '../features/activity/store/activityFeedSlice.js';
import { authReducer } from '../features/auth/store/authSlice.js';
import { commandPaletteReducer } from '../features/command-palette/store/commandPaletteSlice.js';
import { commentsUiReducer } from '../features/comments/store/commentsUiSlice.js';
import { dashboardUiReducer } from '../features/dashboard/store/dashboardUiSlice.js';
import { ticketsUiReducer } from '../features/tickets/store/ticketsUiSlice.js';

import { notificationReducer } from './notification/notificationSlice.js';

/**
 * Application root reducer.
 * - `api` — RTK Query server cache (single slice, feature endpoints injected later)
 * - `auth` — client session state (user + token)
 * - `*Ui` — client-only feature state (filters, view preferences, panel state)
 * - `notification` — global toast notification state
 */
export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  activityFeed: activityFeedReducer,
  commandPalette: commandPaletteReducer,
  ticketsUi: ticketsUiReducer,
  dashboardUi: dashboardUiReducer,
  commentsUi: commentsUiReducer,
  notification: notificationReducer,
});
