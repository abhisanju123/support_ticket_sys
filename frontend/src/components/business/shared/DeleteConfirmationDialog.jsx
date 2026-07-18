import { ConfirmDialog } from './ConfirmDialog.jsx';

export function DeleteConfirmationDialog({
  open,
  itemName = 'this item',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      open={open}
      title="Confirm deletion"
      message={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}
