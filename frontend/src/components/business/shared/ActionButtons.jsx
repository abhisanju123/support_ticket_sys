import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export function ActionButtons({
  onCancel,
  onReset,
  onSubmit,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  isSubmitting = false,
  isFormComplete = true,
  showReset = false,
  resetAsIcon = true,
}) {
  const isSubmitDisabled = isSubmitting || !isFormComplete;

  return (
    <Box className="app-form-actions">
      {onCancel ? (
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
          className="app-btn--cancel"
        >
          {cancelLabel}
        </Button>
      ) : null}

      <Box className="app-form-submit-group">
        {showReset && onReset && resetAsIcon ? (
          <Tooltip title="Reset form">
            <span>
              <IconButton
                type="button"
                onClick={onReset}
                disabled={isSubmitting}
                aria-label="Reset form"
                size="medium"
                className="interactive-press"
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}

        {submitLabel ? (
          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? 'app-btn--submit' : 'app-btn--submit interactive-press'}
          >
            {submitLabel}
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}
