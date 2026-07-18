import { UserSelectField } from './UserSelectField.jsx';

export function CreatedByDropdown({
  label = 'Created By',
  name = 'createdBy',
  value,
  onChange,
  users = [],
  error,
  helperText = 'Select an employee from the system',
  disabled = false,
  isLoading = false,
  required = true,
}) {
  return (
    <UserSelectField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      users={users}
      error={error}
      helperText={helperText}
      disabled={disabled}
      isLoading={isLoading}
      required={required}
      allowEmpty={!required}
    />
  );
}
