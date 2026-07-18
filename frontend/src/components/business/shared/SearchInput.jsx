import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export function SearchInput({
  label = 'Search',
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  disabled = false,
  size = 'small',
}) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onSubmit?.();
        }
      }}
      disabled={disabled}
      size={size}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label="Search"
                edge="end"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSubmit?.()}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
