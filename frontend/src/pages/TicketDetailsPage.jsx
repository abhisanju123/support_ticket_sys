import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  DeleteConfirmationDialog,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  PageContainer,
} from '../components/business';
import { EmptyTicketsIllustration, NotFoundState } from '../components/common';
import { ROUTE_PATHS } from '../constants';
import { usePermissions } from '../features/auth/hooks/usePermissions.js';
import { useGetCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from '../features/comments';
import { useCachedUsersQuery } from '../features/users/api/usersApi.js';
import { TicketActivityTimeline } from '../features/tickets/components/TicketActivityTimeline.jsx';
import { TicketCommentsSection } from '../features/tickets/components/TicketCommentsSection.jsx';
import { TicketDetailsInfo } from '../features/tickets/components/TicketDetailsInfo.jsx';
import { TicketStatusControl } from '../features/tickets/components/TicketStatusControl.jsx';
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUS_TRANSITIONS,
  TICKET_WORKFLOW_STEPS,
} from '../features/tickets/constants/ticket.constants.js';
import {
  useDeleteTicketMutation,
  useGetTicketByIdQuery,
  useUpdateTicketStatusMutation,
} from '../features/tickets';
import { buildTicketActivity } from '../features/tickets/utils/buildTicketActivity.js';
import { useAppDispatch } from '../hooks';
import { showNotification } from '../store/notification/notificationSlice.js';
import { getApiErrorMessage, getApiErrorNotificationMessage, isFetchBaseQueryError } from '../utils';

export function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [statusError, setStatusError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const { data: ticket, isLoading, isError, error, refetch } = useGetTicketByIdQuery(ticketId);
  const { data: comments = [], isLoading: isCommentsLoading } = useGetCommentsQuery({ ticketId });
  const { data: users = [] } = useCachedUsersQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const { canEditTicket, canDeleteTicket, canChangeTicketStatus, canCommentOnTicket } =
    usePermissions();

  const usersById = useMemo(() => new Map(users.map((user) => [user._id, user])), [users]);

  const activityEvents = useMemo(() => {
    if (!ticket) {
      return [];
    }

    return buildTicketActivity(ticket, comments, usersById);
  }, [ticket, comments, usersById]);

  if (isLoading) {
    return <LoadingSpinner message="Loading ticket details..." />;
  }

  if (isError) {
    if (isFetchBaseQueryError(error) && error.status === 404) {
      return <NotFoundState title="Ticket not found" />;
    }

    return (
      <ErrorState
        title="Unable to load ticket"
        description={getApiErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  if (!ticket) {
    return (
      <EmptyState
        title="Ticket unavailable"
        description="This ticket could not be loaded."
        illustration={<EmptyTicketsIllustration />}
      />
    );
  }

  const statusOptions = canChangeTicketStatus()
    ? (TICKET_STATUS_TRANSITIONS[ticket.status] ?? []).map((status) => ({
        value: status,
        label: TICKET_STATUS_LABELS[status],
      }))
    : [];

  const handleStatusChange = async (status) => {
    setStatusError(null);

    try {
      await updateStatus({ id: ticketId, status }).unwrap();

      dispatch(
        showNotification({
          message: 'Ticket status updated successfully.',
          severity: 'success',
        }),
      );
    } catch (submitError) {
      setStatusError(getApiErrorMessage(submitError));
      throw submitError;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTicket(ticketId).unwrap();
      dispatch(
        showNotification({
          message: 'Ticket deleted successfully.',
          severity: 'success',
        }),
      );
      navigate(ROUTE_PATHS.TICKETS);
    } catch (deleteError) {
      dispatch(
        showNotification({
          message: getApiErrorNotificationMessage(deleteError),
          severity: 'error',
        }),
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddComment = async (values) => {
    await createComment({
      ticketId,
      message: values.message,
      createdBy: values.createdBy,
    }).unwrap();

    dispatch(
      showNotification({
        message: 'Comment added successfully.',
        severity: 'success',
      }),
    );
  };

  const handleEditComment = async (commentId, message) => {
    setUpdatingCommentId(commentId);

    try {
      await updateComment({ ticketId, commentId, message }).unwrap();

      dispatch(
        showNotification({
          message: 'Comment updated successfully.',
          severity: 'success',
        }),
      );
    } catch (editError) {
      dispatch(
        showNotification({
          message: getApiErrorNotificationMessage(editError),
          severity: 'error',
        }),
      );
      throw editError;
    } finally {
      setUpdatingCommentId(null);
    }
  };

  const handleDeleteCommentRequest = (comment) => {
    setCommentToDelete(comment);
  };

  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete?._id) {
      return;
    }

    try {
      await deleteComment({ ticketId, commentId: commentToDelete._id }).unwrap();

      dispatch(
        showNotification({
          message: 'Comment deleted successfully.',
          severity: 'success',
        }),
      );
      setCommentToDelete(null);
    } catch (deleteError) {
      dispatch(
        showNotification({
          message: getApiErrorNotificationMessage(deleteError),
          severity: 'error',
        }),
      );
    }
  };

  return (
    <PageContainer>
      <TicketDetailsInfo
        ticket={ticket}
        onDelete={() => setIsDeleteDialogOpen(true)}
        isDeleting={isDeleting}
        canEdit={canEditTicket(ticket)}
        showDelete={canDeleteTicket()}
      />
      <TicketStatusControl
        currentStatus={ticket.status}
        currentStatusLabel={TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}
        statusOptions={statusOptions}
        workflowSteps={TICKET_WORKFLOW_STEPS}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdatingStatus}
        statusError={statusError}
        onDismissStatusError={() => setStatusError(null)}
        canChangeStatus={canChangeTicketStatus()}
      />

      <TicketActivityTimeline events={activityEvents} />

      {isCommentsLoading ? (
        <LoadingSpinner message="Loading comments..." />
      ) : (
        <TicketCommentsSection
          ticketId={ticketId}
          comments={comments}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteCommentRequest}
          isSubmitting={isCreatingComment}
          isUpdatingComment={isUpdatingComment}
          updatingCommentId={updatingCommentId}
          canComment={canCommentOnTicket(ticket)}
        />
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        itemName={`"${ticket.title}"`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        open={Boolean(commentToDelete)}
        itemName="this comment"
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setCommentToDelete(null)}
        isLoading={isDeletingComment}
      />
    </PageContainer>
  );
}
