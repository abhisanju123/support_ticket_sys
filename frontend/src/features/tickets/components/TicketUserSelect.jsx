import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useTicketUserOptions } from '../hooks/useTicketUserOptions.js';

/**
 * @param {{
 *   label: string;
 *   name: string;
 *   value: string;
 *   onChange: (event: import('react').ChangeEvent<HTMLInputElement>) => void;
 *   error?: boolean;
 *   helperText?: string;
 *   required?: boolean;
 *   allowEmpty?: boolean;
 * }} props
 */
export function TicketUserSelect({
  label,
  name,
  value,
  onChange,
  error = false,
  helperText = '',
  required = false,
  allowEmpty = false,
}) {
  const { users, isLoading, isError } = useTicketUserOptions();

  if (isLoading) {
    return (
      <TextField
        fullWidth
        label={label}
        value=""
        disabled
        helperText="Loading users..."
      />
    );
  }

  if (isError || users.length === 0) {
    return (
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        helperText={
          helperText ||
          'No users found. Run "npm run seed" in backend, then refresh this page.'
        }
      />
    );
  }

  return (
    <TextField
      select
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      helperText={helperText || 'Select an employee from the system'}
    >
      {allowEmpty ? <MenuItem value="">Unassigned</MenuItem> : null}
      {!required && !allowEmpty ? <MenuItem value="">Select user</MenuItem> : null}
      {users.map((user) => (
        <MenuItem key={user._id} value={user._id}>
          {user.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
