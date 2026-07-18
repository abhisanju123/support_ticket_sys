import TextField from '@mui/material/TextField';

export function DescriptionField({
  register,
  error,
  helperText,
  disabled = false,
  minRows = 5,
  maxLength,
  value = '',
  placeholder = 'Describe the issue, steps to reproduce, and expected behavior',
}) {
  const counter =
    maxLength != null ? `${String(value).length}/${maxLength}` : null;

  return (
    <TextField
      label="Description"
      placeholder={placeholder}
      fullWidth
      required
      multiline
      minRows={minRows}
      disabled={disabled}
      inputProps={maxLength ? { maxLength } : undefined}
      {...register}
      error={Boolean(error)}
      helperText={error?.message ?? helperText ?? counter}
    />
  );
}