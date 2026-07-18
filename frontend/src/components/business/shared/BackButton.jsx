import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

export function BackButton({ onClick, label = 'Back' }) {
  return (
    <Button onClick={onClick} startIcon={<ArrowBackIcon />} variant="text">
      {label}
    </Button>
  );
}
