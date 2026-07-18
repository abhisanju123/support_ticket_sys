import TextField from '@mui/material/TextField';

export function TitleField({
  register,
  error,
  helperText,
  disabled = false,
  maxLength,
  value = '',
  placeholder = 'Brief summary of the issue',
}) {
  const counter =
    maxLength != null ? `${String(value).length}/${maxLength}` : null;

  return (
    <TextField
      label="Title"
      placeholder={placeholder}
      fullWidth
      required
      disabled={disabled}
      inputProps={maxLength ? { maxLength } : undefined}
      {...register}
      error={Boolean(error)}
      helperText={error?.message ?? helperText ?? counter}
    />
  );
}