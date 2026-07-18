import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export function PriorityDropdown({
  register,
  value,
  onChange,
  options = [],
  error,
  helperText,
  disabled = false,
  showPlaceholder = false,
}) {
  const fieldProps = register
    ? register
    : {
        value,
        onChange,
      };

  return (
    <TextField
      select
      label="Priority"
      fullWidth
      required
      disabled={disabled}
      {...fieldProps}
      error={Boolean(error)}
      helperText={error?.message ?? helperText}
      slotProps={{
        select: {
          displayEmpty: showPlaceholder,
        },
      }}
    >
      {showPlaceholder ? (
        <MenuItem value="" disabled>
          Select priority
        </MenuItem>
      ) : null}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
