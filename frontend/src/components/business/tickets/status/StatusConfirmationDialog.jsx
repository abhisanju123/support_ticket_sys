import Typography from '@mui/material/Typography';

import { ConfirmDialog } from '../../shared/ConfirmDialog.jsx';

export function StatusConfirmationDialog({
  open,
  currentLabel,
  nextLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      open={open}
      title="Confirm status change"
      message={
        <Typography variant="body2">
          Change ticket status from <strong>{currentLabel}</strong> to <strong>{nextLabel}</strong>?
        </Typography>
      }
      confirmLabel="Update Status"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}
