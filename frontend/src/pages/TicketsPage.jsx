import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  DeleteConfirmationDialog,
  EmptyState,
  ErrorState,
  NoResults,
  PageContainer,
  PageHeader,
  Panel,
} from '../components/business';
import { EmptyTicketsIllustration } from '../components/common';
import { ROUTE_PATHS } from '../constants';
import { usePermissions } from '../features/auth/hooks/usePermissions.js';
import { useAppDispatch } from '../hooks';
import { showNotification } from '../store/notification/notificationSlice.js';
import { getApiErrorMessage, getApiErrorNotificationMessage } from '../utils';
import { TicketListTable } from '../features/tickets/components/TicketListTable.jsx';
import { TicketToolbar } from '../components/business/tickets/list/TicketToolbar.jsx';
import {
  TICKET_FILTER_STATUSES,
  TICKET_STATUS_LABELS,
} from '../features/tickets/constants/ticket.constants.js';
import { useDeleteTicketMutation } from '../features/tickets';
import { getTicketRouteId } from '../features/tickets/utils/ticketFormatters.js';
import { useTicketListQuery } from '../features/tickets/hooks/useTicketListQuery.js';
import { useTicketListSearch } from '../features/tickets/hooks/useTicketListSearch.js';

const statusOptions = TICKET_FILTER_STATUSES.map((status) => ({
  value: status,
  label: TICKET_STATUS_LABELS[status],
}));

export function TicketsPage() {
  const dispatch = useAppDispatch();
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const { canCreateTicket, canDeleteTicket } = usePermissions();
  const {
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
  } = useTicketListSearch();

  const { data: tickets = [], isLoading, isError, error, refetch, isFetching } = useTicketListQuery();

  const hasActiveFilters = Boolean(filters.search?.trim() || filters.status);
  const hasMore = tickets.length === pagination.pageSize;
  const totalCount = hasMore
    ? (pagination.page + 1) * pagination.pageSize + 1
    : pagination.page * pagination.pageSize + tickets.length;

  const activeFilters = [];

  if (filters.search?.trim()) {
    activeFilters.push({
      id: 'search',
      label: `Search: ${filters.search.trim()}`,
      onRemove: removeSearchFilter,
    });
  }

  if (filters.status) {
    activeFilters.push({
      id: 'status',
      status: filters.status,
      label: `Status: ${TICKET_STATUS_LABELS[filters.status] ?? filters.status}`,
      onRemove: removeStatusFilter,
    });
  }

  const handleSort = (sortKey) => {
    const isAsc = sorting.sortBy === sortKey && sorting.sortOrder === 'asc';
    setSort(sortKey, isAsc ? 'desc' : 'asc');
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) {
      return;
    }

    try {
      await deleteTicket(getTicketRouteId(ticketToDelete)).unwrap();
      dispatch(
        showNotification({
          message: 'Ticket deleted successfully.',
          severity: 'success',
        }),
      );
      setTicketToDelete(null);
    } catch (deleteError) {
      dispatch(
        showNotification({
          message: getApiErrorNotificationMessage(deleteError),
          severity: 'error',
        }),
      );
    }
  };

  const showSkeleton = isLoading && tickets.length === 0;
  const showTable = tickets.length > 0 || showSkeleton || (hasActiveFilters && isFetching);
  const showEmpty = !isLoading && tickets.length === 0 && !hasActiveFilters;
  const showNoResults = !isLoading && tickets.length === 0 && hasActiveFilters && !isFetching;

  if (isError) {
    return (
      <ErrorState
        title="Unable to load tickets"
        description={getApiErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Tickets"
        description="Browse, search, and manage support tickets."
        actions={
          canCreateTicket() ? (
            <Button
              component={RouterLink}
              to={ROUTE_PATHS.CREATE_TICKET}
              variant="contained"
              startIcon={<AddIcon />}
              className="app-btn--submit interactive-press"
            >
              Create Ticket
            </Button>
          ) : null
        }
      />

      <Panel className="stack-spacing">
        <TicketToolbar
          embedded
          searchValue={searchInput}
          onSearchChange={(event) => setSearchInput(event.target.value)}
          onSearchSubmit={submitSearch}
          statusValue={filters.status}
          statusOptions={statusOptions}
          onStatusChange={(event) => setStatusFilter(event.target.value)}
          activeFilters={activeFilters}
          onClear={activeFilters.length > 0 ? clearFilters : undefined}
          onRefresh={refetch}
          isRefreshing={isFetching}
        />

        {showTable ? (
          <>
            <Divider />
            <TicketListTable
              embedded
              tickets={tickets}
              totalCount={totalCount}
              sortBy={sorting.sortBy}
              sortOrder={sorting.sortOrder}
              onSort={handleSort}
              page={pagination.page}
              pageSize={pagination.pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onDelete={canDeleteTicket() ? setTicketToDelete : undefined}
              isLoading={isFetching}
              showSkeleton={showSkeleton}
            />
          </>
        ) : null}

        {showNoResults ? <NoResults query={filters.search} onClear={clearFilters} /> : null}

        {showEmpty ? (
          <EmptyState
            title="No tickets yet"
            description="Create the first support ticket to get started."
            illustration={<EmptyTicketsIllustration />}
            action={
              canCreateTicket() ? (
                <Button
                  component={RouterLink}
                  to={ROUTE_PATHS.CREATE_TICKET}
                  variant="contained"
                  className="app-btn--submit interactive-press"
                >
                  Create Ticket
                </Button>
              ) : null
            }
          />
        ) : null}
      </Panel>

      <DeleteConfirmationDialog
        open={Boolean(ticketToDelete)}
        itemName={ticketToDelete ? `"${ticketToDelete.title}"` : 'this ticket'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTicketToDelete(null)}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
}
