import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/**
 * Searchable user picker showing names only.
 */
export function UserSelectField({
  label,
  name,
  value = '',
  onChange,
  users = [],
  error,
  helperText,
  disabled = false,
  isLoading = false,
  required = false,
  allowEmpty = false,
  emptyLabel = 'Unassigned',
}) {
  const selectedUser = users.find((user) => String(user._id) === String(value)) ?? null;

  const handleChange = (_event, user) => {
    onChange?.({ target: { name, value: user?._id ?? '' } });
  };

  return (
    <Autocomplete
      fullWidth
      disableClearable={!allowEmpty}
      options={users}
      value={selectedUser}
      onChange={handleChange}
      loading={isLoading}
      disabled={disabled || isLoading}
      getOptionLabel={(user) => user.name}
      isOptionEqualToValue={(option, selected) => String(option._id) === String(selected._id)}
      filterOptions={(options, { inputValue }) => {
        const query = inputValue.trim().toLowerCase();

        if (!query) {
          return options;
        }

        return options.filter((user) => user.name.toLowerCase().includes(query));
      }}
      noOptionsText={isLoading ? 'Loading users…' : 'No users found'}
      slotProps={{
        listbox: {
          sx: { maxHeight: 320 },
        },
      }}
      renderOption={(props, user) => {
        const { key, ...optionProps } = props;

        return (
          <Typography component="li" key={key} {...optionProps} variant="body2" sx={{ py: 1 }}>
            {user.name}
          </Typography>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={Boolean(error)}
          helperText={isLoading ? 'Loading users…' : error?.message ?? helperText}
          placeholder={allowEmpty && !value ? emptyLabel : 'Search by name'}
        />
      )}
    />
  );
}
