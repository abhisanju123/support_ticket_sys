import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const PLACEHOLDER_LABEL = 'Select priority';

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
  const registered = register ?? null;
  const isControlled = value !== undefined;

  const fieldProps = isControlled
    ? {
        name: registered?.name ?? 'priority',
        value,
        onChange: onChange ?? registered?.onChange,
        onBlur: registered?.onBlur,
        inputRef: registered?.ref,
      }
    : registered ?? {
        value: '',
        onChange,
      };

  const resolveLabel = (selected) =>
    options.find((option) => option.value === selected)?.label ?? selected;

  const currentValue = isControlled ? value : '';
  const shouldShrinkLabel = Boolean(currentValue) || showPlaceholder;

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
        inputLabel: {
          shrink: shouldShrinkLabel,
        },
        select: {
          displayEmpty: showPlaceholder,
          renderValue: (selected) => {
            if (!selected) {
              if (!showPlaceholder) {
                return '';
              }

              return (
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {PLACEHOLDER_LABEL}
                </Box>
              );
            }

            return resolveLabel(selected);
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
