import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { FormErrorAlert } from '../../../components/business/shared/FormErrorAlert.jsx';
import { TicketTableStatusLabel } from '../../../components/business/tickets/list/TicketTableStatusLabel.jsx';
import { StatusConfirmationDialog } from '../../../components/business/tickets/status/StatusConfirmationDialog.jsx';
import { StatusDropdown } from '../../../components/business/tickets/status/StatusDropdown.jsx';
import { StatusTimeline } from '../../../components/business/tickets/status/StatusTimeline.jsx';

export function TicketStatusControl({
  currentStatus,
  currentStatusLabel,
  statusOptions = [],
  workflowSteps = [],
  onStatusChange,
  isUpdating = false,
  statusError = null,
  onDismissStatusError,
}) {
  const [nextStatus, setNextStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedOption = statusOptions.find((option) => option.value === nextStatus);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nextStatus || isUpdating) {
      return;
    }

    onDismissStatusError?.();
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await onStatusChange(nextStatus);
      setNextStatus('');
      setIsDialogOpen(false);
    } catch {
      setIsDialogOpen(false);
    }
  };

  return (
    <Box component="section" className="surface-card shadow-elevated card-spacing stack-spacing">
      <Typography variant="h6" component="h3">
        Status
      </Typography>

      {workflowSteps.length > 0 ? (
        <StatusTimeline steps={workflowSteps} currentStatus={currentStatus} />
      ) : null}

      <Box className="inline-spacing" sx={{ flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Current:
        </Typography>
        <TicketTableStatusLabel label={currentStatusLabel} status={currentStatus} />
      </Box>

      <FormErrorAlert message={statusError} onClose={onDismissStatusError} />

      {statusOptions.length > 0 ? (
        <Box component="form" onSubmit={handleSubmit} className="inline-spacing" sx={{ flexWrap: 'wrap' }}>
          <StatusDropdown
            value={nextStatus}
            options={statusOptions}
            onChange={(event) => {
              onDismissStatusError?.();
              setNextStatus(event.target.value);
            }}
            disabled={isUpdating}
          />
          <Button type="submit" variant="contained" disabled={!nextStatus || isUpdating}>
            {isUpdating ? 'Updating…' : 'Update Status'}
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No further status transitions are available for this ticket.
        </Typography>
      )}

      <StatusConfirmationDialog
        open={isDialogOpen}
        currentLabel={currentStatusLabel}
        nextLabel={selectedOption?.label ?? nextStatus}
        onConfirm={handleConfirm}
        onCancel={() => setIsDialogOpen(false)}
        isLoading={isUpdating}
      />
    </Box>
  );
}
