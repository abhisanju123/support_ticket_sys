import { useEffect, useMemo } from 'react';

import { TicketForm } from '../../../components/business/tickets/form/TicketForm.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { usePermissions } from '../../auth/hooks/usePermissions.js';
import { useGetUsersQuery } from '../../users/api/usersApi.js';
import { TICKET_PRIORITIES, TICKET_PRIORITY_LABELS } from '../constants/ticket.constants.js';
import {
  createCreateTicketFormSchema,
  resetFormState,
  useValidatedForm,
} from '../../../utils/validation/index.js';

const priorityOptions = TICKET_PRIORITIES.map((priority) => ({
  value: priority,
  label: TICKET_PRIORITY_LABELS[priority],
}));

const defaultValues = {
  title: '',
  description: '',
  priority: '',
  createdBy: '',
  assignedTo: '',
};

export function CreateTicketForm({ onSubmit, onCancel, isSubmitting = false }) {
  const { user } = useAuth();
  const { mustCreateTicketAsSelf } = usePermissions();
  const lockReporter = mustCreateTicketAsSelf();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const validUserIds = useMemo(() => users.map((entry) => entry._id), [users]);
  const schema = useMemo(() => createCreateTicketFormSchema(validUserIds), [validUserIds]);

  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema,
    defaultValues,
    onSubmit,
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
    if (usersLoading || users.length === 0) {
      return;
    }

    if (lockReporter && user?._id) {
      setValue('createdBy', user._id, { shouldValidate: true });
      return;
    }

    if (values.createdBy) {
      return;
    }

    const matchedUser = users.find(
      (entry) => entry._id === user?._id || entry.email === user?.email,
    );

    if (matchedUser) {
      setValue('createdBy', matchedUser._id, { shouldValidate: true });
    }
  }, [users, usersLoading, user, values.createdBy, setValue, lockReporter]);

  return (
    <TicketForm
      mode="create"
      headerTitle="Create Ticket"
      headerDescription="Log a new support request with priority, reporter, and assignee."
      register={register}
      errors={errors}
      values={values}
      globalError={globalError}
      onDismissGlobalError={clearGlobalError}
      onFieldChange={(field, value) => setValue(field, value, { shouldValidate: true })}
      priorityOptions={priorityOptions}
      users={users}
      usersLoading={usersLoading}
      showReporterPicker={!lockReporter}
      onSubmit={submitHandler}
      onCancel={onCancel}
      onReset={() => resetFormState(form, defaultValues, clearGlobalError)}
      isSubmitting={isSubmitting}
      isFormComplete={isFormComplete}
    />
  );
}
