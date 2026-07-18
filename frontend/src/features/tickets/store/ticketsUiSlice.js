import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listFilters: {
    status: '',
    priority: '',
    search: '',
  },
  pagination: {
    page: 0,
    pageSize: 10,
  },
  sorting: {
    sortBy: 'ticketNumber',
    sortOrder: 'asc',
  },
};

const ticketsUiSlice = createSlice({
  name: 'ticketsUi',
  initialState,
  reducers: {
    setListFilters(state, action) {
      state.listFilters = { ...state.listFilters, ...action.payload };
    },
    resetListFilters(state) {
      state.listFilters = initialState.listFilters;
    },
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetPagination(state) {
      state.pagination = initialState.pagination;
    },
    setSorting(state, action) {
      state.sorting = { ...state.sorting, ...action.payload };
    },
    resetSorting(state) {
      state.sorting = initialState.sorting;
    },
  },
});

export const { setListFilters, resetListFilters, setPagination, resetPagination, setSorting, resetSorting } =
  ticketsUiSlice.actions;

export const ticketsUiReducer = ticketsUiSlice.reducer;

export const selectTicketsListFilters = (state) => state.ticketsUi.listFilters;
export const selectTicketsPagination = (state) => state.ticketsUi.pagination;
export const selectTicketsSorting = (state) => state.ticketsUi.sorting;
