import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

export function FormErrorAlert({ message, onClose }) {
  return (
    <Collapse in={Boolean(message)}>
      <Alert severity="error" onClose={onClose} sx={{ mb: 0 }}>
        {message}
      </Alert>
    </Collapse>
  );
}
