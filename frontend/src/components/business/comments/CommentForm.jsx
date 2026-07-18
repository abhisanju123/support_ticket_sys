import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { FormErrorAlert } from '../shared/FormErrorAlert.jsx';
import { CreatedByDropdown } from '../tickets/form/CreatedByDropdown.jsx';

import { CommentInput } from './CommentInput.jsx';

export function CommentForm({
  register,
  errors = {},
  values = {},
  onFieldChange,
  users = [],
  usersLoading = false,
  onSubmit,
  isSubmitting = false,
  isFormComplete = true,
  submitLabel = 'Add Comment',
  globalError = null,
  onDismissGlobalError,
}) {
  return (
    <Box component="form" onSubmit={onSubmit} className="app-form" noValidate>
      <FormErrorAlert message={globalError} onClose={onDismissGlobalError} />

      <Box className="app-form-fields">
        <CommentInput register={register?.('message')} error={errors.message} disabled={isSubmitting} />

        <CreatedByDropdown
          label="Comment author"
          name="createdBy"
          value={values.createdBy ?? ''}
          onChange={(event) => onFieldChange?.('createdBy', event.target.value)}
          users={users}
          isLoading={usersLoading}
          error={errors.createdBy}
        />
      </Box>

      <Box className="app-form-actions">
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !isFormComplete}
          className={isSubmitting || !isFormComplete ? 'app-btn--submit' : 'app-btn--submit interactive-press'}
        >
          {isSubmitting ? 'Posting…' : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}
