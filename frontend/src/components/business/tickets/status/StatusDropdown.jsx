import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export function StatusDropdown({
  label = 'Change status',
  value,
  options = [],
  onChange,
  disabled = false,
  placeholder = 'Select next status',
}) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      sx={{ minWidth: 220 }}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
