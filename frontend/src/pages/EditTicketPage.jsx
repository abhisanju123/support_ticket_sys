import { useNavigate, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';

import {
  EmptyState,
  ErrorState,
  LoadingSpinner,
  PageContainer,
  PageHeader,
} from '../components/business';
import { buildTicketDetailsPath } from '../constants';
import { EditTicketForm } from '../features/tickets/components/EditTicketForm.jsx';
import { usePermissions } from '../features/auth/hooks/usePermissions.js';
import { useGetTicketByIdQuery, useUpdateTicketMutation } from '../features/tickets';
import { useAppDispatch } from '../hooks';
import { showNotification } from '../store/notification/notificationSlice.js';
import { getApiErrorMessage, isFetchBaseQueryError } from '../utils';
import { NotFoundState } from '../components/common';

export function EditTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: ticket, isLoading, isError, error } = useGetTicketByIdQuery(ticketId);
  const [updateTicket, { isLoading: isSaving }] = useUpdateTicketMutation();
  const { canEditTicket } = usePermissions();

  if (isLoading) {
    return <LoadingSpinner message="Loading ticket..." />;
  }

  if (isError) {
    if (isFetchBaseQueryError(error) && error.status === 404) {
      return <NotFoundState title="Ticket not found" />;
    }

    return (
      <ErrorState
        title="Unable to load ticket"
        description={getApiErrorMessage(error)}
      />
    );
  }

  if (!ticket) {
    return <EmptyState title="Ticket unavailable" description="This ticket could not be loaded." />;
  }

  if (!canEditTicket(ticket)) {
    return (
      <PageContainer>
        <PageHeader
          title="Edit Ticket"
          description="Closed and cancelled tickets are read-only and cannot be modified."
        />
        <EmptyState
          title="This ticket cannot be edited"
          description="You do not have permission to edit this ticket, or it is closed or cancelled."
          action={
            <Button
              variant="contained"
              onClick={() => navigate(buildTicketDetailsPath(ticketId))}
              className="interactive-press"
            >
              Back to ticket details
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const handleSubmit = async (values) => {
    await updateTicket({
      id: ticketId,
      title: values.title,
      description: values.description,
      priority: values.priority,
      assignedTo: values.assignedTo || null,
    }).unwrap();

    dispatch(
      showNotification({
        message: 'Ticket updated successfully.',
        severity: 'success',
      }),
    );

    navigate(buildTicketDetailsPath(ticketId));
  };

  return (
    <PageContainer>
      <PageHeader
        title="Edit Ticket"
        description="Update editable ticket fields. Status changes are managed on the details page."
      />

      <EditTicketForm
        key={ticketId}
        ticket={ticket}
        onSubmit={handleSubmit}
        onCancel={() => navigate(buildTicketDetailsPath(ticketId))}
        isSubmitting={isSaving}
      />
    </PageContainer>
  );
}
