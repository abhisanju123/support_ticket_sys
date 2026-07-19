import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { PageTitle } from '../../shared/PageTitle.jsx';

import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../../../utils/validation/common.schema.js';
import { FormErrorAlert } from '../../shared/FormErrorAlert.jsx';

import { AssignedUserDropdown } from './AssignedUserDropdown.jsx';
import { CreatedByDropdown } from './CreatedByDropdown.jsx';
import { DescriptionField } from './DescriptionField.jsx';
import { FormActions } from './FormActions.jsx';
import { FormSection } from './FormSection.jsx';
import { PriorityDropdown } from './PriorityDropdown.jsx';
import { TitleField } from './TitleField.jsx';


export function TicketForm({
  mode = 'create',
  headerTitle,
  headerDescription,
  register,
  errors = {},
  values = {},
  onFieldChange,
  priorityOptions = [],
  users = [],
  assignableUsers = users,
  usersLoading = false,
  showReporterPicker = true,
  readOnlySection = null,
  onCancel,
  onReset,
  onSubmit,
  isSubmitting = false,
  isFormComplete = true,
  submitLabel,
  globalError = null,
  onDismissGlobalError,
}) {
  const isCreate = mode === 'create';

  const createHeader = isCreate && headerTitle ? (
    <Box className="stack-spacing">
      <PageTitle>{headerTitle}</PageTitle>
      {headerDescription ? (
        <Typography variant="body1" color="text.secondary">
          {headerDescription}
        </Typography>
      ) : null}
    </Box>
  ) : null;

  return (
    <Box className="stack-spacing">
      {readOnlySection}
      {createHeader}

      <Box
        component="form"
        onSubmit={onSubmit}
        className={`app-form ${isCreate ? 'app-panel' : 'surface-card shadow-elevated card-spacing'}`}
        noValidate
      >
        <FormErrorAlert message={globalError} onClose={onDismissGlobalError} />

        {isCreate ? (
          <Grid container spacing={3} alignItems="stretch">
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
              <FormSection
                title="Ticket details"
                description="What happened and what needs to be resolved?"
                sx={{ width: '100%' }}
              >
                <Box className="app-form-fields">
                  <TitleField
                    register={register?.('title')}
                    error={errors.title}
                    value={values.title}
                    maxLength={TITLE_MAX_LENGTH}
                  />
                  <DescriptionField
                    register={register?.('description')}
                    error={errors.description}
                    value={values.description}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                  />
                </Box>
              </FormSection>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
              <FormSection
                title="Priority & assignment"
                description="Set urgency and ownership."
                sx={{ width: '100%' }}
              >
                <Box className="app-form-fields">
                  <PriorityDropdown
                    value={values.priority ?? ''}
                    onChange={(event) => onFieldChange?.('priority', event.target.value)}
                    options={priorityOptions}
                    error={errors.priority}
                    disabled={isSubmitting}
                    showPlaceholder
                  />

                  <CreatedByDropdown
                    value={values.createdBy ?? ''}
                    onChange={(event) => onFieldChange?.('createdBy', event.target.value)}
                    users={users}
                    isLoading={usersLoading}
                    error={errors.createdBy}
                    helperText={
                      showReporterPicker
                        ? 'Reporter for this ticket'
                        : 'You are the reporter for tickets you create'
                    }
                    disabled={!showReporterPicker}
                    required
                  />

                  <AssignedUserDropdown
                    value={values.assignedTo ?? ''}
                    onChange={(event) => onFieldChange?.('assignedTo', event.target.value)}
                    users={assignableUsers}
                    isLoading={usersLoading}
                    error={errors.assignedTo}
                    helperText="Select a support agent or admin"
                    required
                  />
                </Box>
              </FormSection>
            </Grid>
          </Grid>
        ) : (
          <Box className="app-form-fields">
            <TitleField
              register={register?.('title')}
              error={errors.title}
              value={values.title}
            />
            <DescriptionField
              register={register?.('description')}
              error={errors.description}
              value={values.description}
            />
            <PriorityDropdown
              value={values.priority ?? ''}
              onChange={(event) => onFieldChange?.('priority', event.target.value)}
              options={priorityOptions}
              error={errors.priority}
            />
            <CreatedByDropdown
              value={values.createdBy ?? ''}
              users={users}
              isLoading={usersLoading}
              disabled
              required={false}
              helperText="Reporter cannot be changed after creation"
            />
            <AssignedUserDropdown
              value={values.assignedTo ?? ''}
              onChange={(event) => onFieldChange?.('assignedTo', event.target.value)}
              users={assignableUsers}
              isLoading={usersLoading}
              allowEmpty
              error={errors.assignedTo}
              helperText="Optional — support agent or admin only"
            />
          </Box>
        )}

        <Divider />

        <FormActions
          mode={mode}
          onCancel={onCancel}
          onReset={onReset}
          isSubmitting={isSubmitting}
          isFormComplete={isFormComplete}
          submitLabel={submitLabel}
          showReset={Boolean(onReset)}
        />
      </Box>
    </Box>
  );
}

export function TicketFormReadOnlySection({ children, title = 'Read only' }) {
  return (
    <Box className="surface-card shadow-elevated card-spacing stack-spacing">
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      {children}
    </Box>
  );
}
