import { ActionButtons } from '../../shared/ActionButtons.jsx';

export function FormActions({
  mode = 'create',
  onCancel,
  onReset,
  isSubmitting = false,
  isFormComplete = true,
  submitLabel,
  showReset = true,
}) {
  const defaultSubmitLabel = mode === 'edit' ? 'Save Changes' : 'Create Ticket';
  const loadingLabel = mode === 'edit' ? 'Saving…' : 'Creating…';

  return (
    <ActionButtons
      onCancel={onCancel}
      onReset={onReset}
      submitLabel={isSubmitting ? loadingLabel : submitLabel ?? defaultSubmitLabel}
      isSubmitting={isSubmitting}
      isFormComplete={isFormComplete}
      showReset={showReset && Boolean(onReset)}
      resetAsIcon
    />
  );
}
