import { useNavigate } from 'react-router-dom';

import { PageContainer } from '../components/business';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { usePermissions } from '../features/auth/hooks/usePermissions.js';
import { CreateTicketForm } from '../features/tickets/components/CreateTicketForm.jsx';
import { useCreateTicketMutation } from '../features/tickets';
import { getTicketRouteId } from '../features/tickets/utils/ticketFormatters.js';
import { buildTicketDetailsPath, ROUTE_PATHS } from '../constants';
import { useAppDispatch } from '../hooks';
import { showNotification } from '../store/notification/notificationSlice.js';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { mustCreateTicketAsSelf } = usePermissions();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const handleSubmit = async (values) => {
    const createdBy = mustCreateTicketAsSelf() ? user._id : values.createdBy;

    const ticket = await createTicket({
      title: values.title,
      description: values.description,
      priority: values.priority,
      createdBy,
      assignedTo: values.assignedTo,
    }).unwrap();

    dispatch(
      showNotification({
        message: 'Ticket created successfully.',
        severity: 'success',
      }),
    );

    navigate(buildTicketDetailsPath(getTicketRouteId(ticket)));
  };

  return (
    <PageContainer>
      <CreateTicketForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTE_PATHS.TICKETS)}
        isSubmitting={isLoading}
      />
    </PageContainer>
  );
}
