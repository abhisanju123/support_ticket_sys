import { useMemo } from 'react';

import { useAppSelector } from '../../../hooks';
import { useGetTicketsQuery } from '../api/ticketsApi.js';
import { selectTicketsListFilters, selectTicketsPagination, selectTicketsSorting } from '../store/ticketsUiSlice.js';

export function useTicketListQuery() {
  const filters = useAppSelector(selectTicketsListFilters);
  const pagination = useAppSelector(selectTicketsPagination);
  const sorting = useAppSelector(selectTicketsSorting);

  const queryArgs = useMemo(() => {
    const args = {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
    };

    const keyword = filters.search?.trim();

    if (keyword) {
      args.keyword = keyword;
    }

    if (filters.status) {
      args.status = filters.status;
    }

    return args;
  }, [filters, pagination, sorting]);

  return useGetTicketsQuery(queryArgs);
}
