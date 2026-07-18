import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebouncedValue } from '../../../hooks/useDebouncedValue.js';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  resetListFilters,
  resetPagination,
  selectTicketsListFilters,
  selectTicketsPagination,
  selectTicketsSorting,
  setListFilters,
  setPagination,
  setSorting,
} from '../store/ticketsUiSlice.js';

const URL_KEYS = {
  keyword: 'keyword',
  status: 'status',
  page: 'page',
  sortBy: 'sortBy',
  sortOrder: 'sortOrder',
};

const buildUrlParams = (filters, pagination, sorting) => {
  const params = new URLSearchParams();
  const keyword = filters.search?.trim();

  if (keyword) {
    params.set(URL_KEYS.keyword, keyword);
  }

  if (filters.status) {
    params.set(URL_KEYS.status, filters.status);
  }

  if (pagination.page > 0) {
    params.set(URL_KEYS.page, String(pagination.page + 1));
  }

  if (sorting.sortBy && sorting.sortBy !== 'ticketNumber') {
    params.set(URL_KEYS.sortBy, sorting.sortBy);
  }

  if (sorting.sortOrder && sorting.sortOrder !== 'asc') {
    params.set(URL_KEYS.sortOrder, sorting.sortOrder);
  }

  return params;
};

const readStateFromParams = (searchParams, pageSize) => {
  const keyword = searchParams.get(URL_KEYS.keyword) ?? '';
  const status = searchParams.get(URL_KEYS.status) ?? '';
  const page = Number(searchParams.get(URL_KEYS.page) ?? '1');
  const sortBy = searchParams.get(URL_KEYS.sortBy) ?? 'ticketNumber';
  const sortOrder = searchParams.get(URL_KEYS.sortOrder) ?? 'asc';

  return {
    filters: { search: keyword, status },
    pagination: { page: Number.isFinite(page) && page > 0 ? page - 1 : 0, pageSize },
    sorting: { sortBy, sortOrder },
  };
};

/**
 * Reusable ticket list search + status filter with debounce and URL synchronization.
 * @param {{ debounceMs?: number }} [options]
 */
export function useTicketListSearch({ debounceMs = 400 } = {}) {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useAppSelector(selectTicketsListFilters);
  const pagination = useAppSelector(selectTicketsPagination);
  const sorting = useAppSelector(selectTicketsSorting);

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput, debounceMs);
  const skipDebouncedApply = useRef(false);
  const skipUrlRead = useRef(false);
  const hasHydrated = useRef(false);

  const syncUrlFromState = useCallback(
    (nextFilters, nextPagination, nextSorting) => {
      skipUrlRead.current = true;
      setSearchParams(buildUrlParams(nextFilters, nextPagination, nextSorting), { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (!hasHydrated.current) {
      const fromUrl = readStateFromParams(searchParams, pagination.pageSize);
      dispatch(setListFilters(fromUrl.filters));
      dispatch(setPagination(fromUrl.pagination));
      dispatch(setSorting(fromUrl.sorting));
      setSearchInput(fromUrl.filters.search);
      hasHydrated.current = true;
      return;
    }

    if (skipUrlRead.current) {
      skipUrlRead.current = false;
      return;
    }

    const fromUrl = readStateFromParams(searchParams, pagination.pageSize);
    dispatch(setListFilters(fromUrl.filters));
    dispatch(setPagination(fromUrl.pagination));
    dispatch(setSorting(fromUrl.sorting));
    setSearchInput(fromUrl.filters.search);
  }, [searchParams, dispatch, pagination.pageSize]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const applyListState = useCallback(
    (nextFilters, nextPagination = { page: 0, pageSize: pagination.pageSize }) => {
      dispatch(setListFilters(nextFilters));
      dispatch(setPagination(nextPagination));
      syncUrlFromState(nextFilters, nextPagination, sorting);
    },
    [dispatch, pagination.pageSize, sorting, syncUrlFromState],
  );

  useEffect(() => {
    if (skipDebouncedApply.current) {
      skipDebouncedApply.current = false;
      return;
    }

    const trimmed = debouncedSearch.trim();
    const current = filters.search?.trim() ?? '';

    if (trimmed === current) {
      return;
    }

    applyListState({ ...filters, search: trimmed }, { page: 0, pageSize: pagination.pageSize });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitSearch = useCallback(() => {
    skipDebouncedApply.current = true;
    applyListState({ ...filters, search: searchInput.trim() }, { page: 0, pageSize: pagination.pageSize });
  }, [searchInput, filters, applyListState, pagination.pageSize]);

  const setStatusFilter = useCallback(
    (status) => {
      skipDebouncedApply.current = true;
      applyListState({ ...filters, status }, { page: 0, pageSize: pagination.pageSize });
    },
    [filters, applyListState, pagination.pageSize],
  );

  const clearFilters = useCallback(() => {
    skipDebouncedApply.current = true;
    setSearchInput('');
    dispatch(resetListFilters());
    dispatch(resetPagination());
    syncUrlFromState(
      { search: '', status: '', priority: '' },
      { page: 0, pageSize: pagination.pageSize },
      sorting,
    );
  }, [dispatch, pagination.pageSize, sorting, syncUrlFromState]);

  const removeSearchFilter = useCallback(() => {
    skipDebouncedApply.current = true;
    setSearchInput('');
    applyListState({ ...filters, search: '' }, { page: 0, pageSize: pagination.pageSize });
  }, [filters, applyListState, pagination.pageSize]);

  const removeStatusFilter = useCallback(() => {
    applyListState({ ...filters, status: '' }, { page: 0, pageSize: pagination.pageSize });
  }, [filters, applyListState, pagination.pageSize]);

  const setPage = useCallback(
    (page) => {
      const nextPagination = { ...pagination, page };
      dispatch(setPagination(nextPagination));
      syncUrlFromState(filters, nextPagination, sorting);
    },
    [dispatch, filters, pagination, sorting, syncUrlFromState],
  );

  const setPageSize = useCallback(
    (pageSize) => {
      const nextPagination = { page: 0, pageSize };
      dispatch(setPagination(nextPagination));
      syncUrlFromState(filters, nextPagination, sorting);
    },
    [dispatch, filters, sorting, syncUrlFromState],
  );

  const setSort = useCallback(
    (sortBy, sortOrder) => {
      const nextSorting = { sortBy, sortOrder };
      dispatch(setSorting(nextSorting));
      syncUrlFromState(filters, pagination, nextSorting);
    },
    [dispatch, filters, pagination, syncUrlFromState],
  );

  return {
    searchInput,
    setSearchInput,
    submitSearch,
    setStatusFilter,
    clearFilters,
    removeSearchFilter,
    removeStatusFilter,
    setPage,
    setPageSize,
    setSort,
    filters,
    pagination,
    sorting,
  };
}
