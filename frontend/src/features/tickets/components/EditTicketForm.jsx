import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';

import { TicketForm, TicketFormReadOnlySection } from '../../../components/business/tickets/form/TicketForm.jsx';
import { useGetUsersQuery } from '../../users/api/usersApi.js';
import {
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from '../constants/ticket.constants.js';
import { formatTicketDate, formatTicketId } from '../utils/ticketFormatters.js';
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
  assignedTo: ticket.assignedTo?._id ?? ticket.assignedTo ?? '',
});

const EDIT_REQUIRED_FIELDS = ['title', 'description', 'priority'];

export function EditTicketForm({ ticket, onSubmit, onCancel, isSubmitting = false }) {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const validUserIds = useMemo(() => users.map((user) => user._id), [users]);
  const schema = useMemo(() => createEditTicketFormSchema(validUserIds), [validUserIds]);
  const defaultValues = useMemo(() => buildDefaultValues(ticket), [ticket]);

  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema,
    defaultValues,
    onSubmit,
    requiredFields: EDIT_REQUIRED_FIELDS,
  });

  const {
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const values = watch();

  useEffect(() => {
    reset(buildDefaultValues(ticket));
    clearGlobalError();
  }, [ticket, reset, clearGlobalError]);

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
      onReset={() => resetFormState(form, defaultValues, clearGlobalError)}
      isSubmitting={isSubmitting}
      isFormComplete={isFormComplete}
    />
  );
}
