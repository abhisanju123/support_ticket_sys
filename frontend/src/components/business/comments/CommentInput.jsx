import TextField from '@mui/material/TextField';

export function CommentInput({ register, error, helperText, disabled = false, minRows = 3 }) {
  return (
    <TextField
      label="Add comment"
      fullWidth
      required
      multiline
      minRows={minRows}
      disabled={disabled}
      {...register}
      error={Boolean(error)}
      helperText={error?.message ?? helperText}
    />
  );
}
