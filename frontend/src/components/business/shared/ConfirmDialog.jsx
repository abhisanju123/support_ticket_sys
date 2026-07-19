import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions className="app-dialog-actions">
        <Button onClick={onCancel} disabled={isLoading} className="app-btn--cancel">
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          className="app-btn--submit interactive-press"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
