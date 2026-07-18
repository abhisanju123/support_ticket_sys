import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expandedTicketId: null,
};

const commentsUiSlice = createSlice({
  name: 'commentsUi',
  initialState,
  reducers: {
    setExpandedTicketId(state, action) {
      state.expandedTicketId = action.payload;
    },
    clearExpandedTicketId(state) {
      state.expandedTicketId = null;
    },
  },
});

export const { setExpandedTicketId, clearExpandedTicketId } = commentsUiSlice.actions;

export const commentsUiReducer = commentsUiSlice.reducer;

export const selectExpandedTicketId = (state) => state.commentsUi.expandedTicketId;
