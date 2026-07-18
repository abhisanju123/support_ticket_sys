import { UserSelectField } from './UserSelectField.jsx';

export function AssignedUserDropdown({
  name = 'assignedTo',
  value,
  onChange,
  users = [],
  error,
  helperText = 'Select who will work on this ticket',
  disabled = false,
  isLoading = false,
  allowEmpty = false,
  required = true,
}) {
  return (
    <UserSelectField
      label="Assigned User"
      name={name}
      value={value}
      onChange={onChange}
      users={users}
      error={error}
      helperText={helperText}
      disabled={disabled}
      isLoading={isLoading}
      allowEmpty={allowEmpty}
      required={required}
      emptyLabel="Unassigned"
    />
  );
}
