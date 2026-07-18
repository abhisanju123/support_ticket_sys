import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  statsRange: '7d',
};

const dashboardUiSlice = createSlice({
  name: 'dashboardUi',
  initialState,
  reducers: {
    setStatsRange(state, action) {
      state.statsRange = action.payload;
    },
  },
});

export const { setStatsRange } = dashboardUiSlice.actions;

export const dashboardUiReducer = dashboardUiSlice.reducer;

export const selectDashboardStatsRange = (state) => state.dashboardUi.statsRange;
