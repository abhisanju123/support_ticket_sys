import Typography from '@mui/material/Typography';
import { useMemo } from 'react';

import { TicketForm, TicketFormReadOnlySection } from '../../../components/business/tickets/form/TicketForm.jsx';
import { useGetUsersQuery } from '../../users/api/usersApi.js';
import {
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from '../constants/ticket.constants.js';
import { formatTicketDate, formatTicketId, getTicketRouteId, resolveTicketUserId } from '../utils/ticketFormatters.js';
import {
  createEditTicketFormSchema,
  resetFormState,
  useValidatedForm,
} from '../../../utils/validation/index.js';

const priorityOptions = TICKET_PRIORITIES.map((priority) => ({
  value: priority,
  label: TICKET_PRIORITY_LABELS[priority],
}));

const buildDefaultValues = (ticket) => ({
  title: ticket.title ?? '',
  description: ticket.description ?? '',
  priority: ticket.priority ?? 'medium',
  createdBy: resolveTicketUserId(ticket.createdBy),
  assignedTo: resolveTicketUserId(ticket.assignedTo),
});

const EDIT_REQUIRED_FIELDS = ['title', 'description', 'priority'];

export function EditTicketForm({ ticket, onSubmit, onCancel, isSubmitting = false }) {
  const ticketId = getTicketRouteId(ticket);
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const validUserIds = useMemo(() => users.map((user) => user._id), [users]);
  const schema = useMemo(() => createEditTicketFormSchema(validUserIds), [validUserIds]);
  const initialValues = useMemo(() => buildDefaultValues(ticket), [ticketId]);

  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema,
    defaultValues: initialValues,
    onSubmit,
    requiredFields: EDIT_REQUIRED_FIELDS,
  });

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const values = watch();

  const readOnlySection = (
    <TicketFormReadOnlySection>
      <Typography variant="body2">Ticket ID: {formatTicketId(ticket)}</Typography>
      <Typography variant="body2">
        Status: {TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}
      </Typography>
      <Typography variant="body2">
        Created By: {ticket.createdBy?.name ?? ticket.createdBy?.email ?? ticket.createdBy ?? '—'}
      </Typography>
      <Typography variant="body2">Created: {formatTicketDate(ticket.createdAt)}</Typography>
    </TicketFormReadOnlySection>
  );

  return (
    <TicketForm
      key={ticketId}
      mode="edit"
      register={register}
      errors={errors}
      values={values}
      globalError={globalError}
      onDismissGlobalError={clearGlobalError}
      onFieldChange={(field, value) => setValue(field, value, { shouldValidate: true })}
      priorityOptions={priorityOptions}
      users={users}
      usersLoading={usersLoading}
      readOnlySection={readOnlySection}
      onSubmit={submitHandler}
      onCancel={onCancel}
      onReset={() => resetFormState(form, initialValues, clearGlobalError)}
      isSubmitting={isSubmitting}
      isFormComplete={isFormComplete}
    />
  );
}
