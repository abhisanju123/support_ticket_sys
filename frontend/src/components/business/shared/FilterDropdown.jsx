import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  disabled = false,
  emptyLabel = 'All',
  size = 'small',
}) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      size={size}
      fullWidth
    >
      <MenuItem value="">{emptyLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
