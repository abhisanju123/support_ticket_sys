import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';

import { CommentsEmptyIllustration } from '../../common/illustrations/CommentsEmptyIllustration.jsx';
import { FormErrorAlert } from '../shared/FormErrorAlert.jsx';
import { CreatedByDropdown } from '../tickets/form/CreatedByDropdown.jsx';
import { useAuth } from '../../../features/auth/hooks/useAuth.js';
import { usePermissions } from '../../../features/auth/hooks/usePermissions.js';
import { useCachedUsersQuery } from '../../../features/users/api/usersApi.js';
import {
  formatRelativeTime,
  formatTicketDate,
  resolveCommentAuthor,
} from '../../../features/tickets/utils/ticketFormatters.js';
import {
  createCommentFormSchema,
  editCommentFormSchema,
  resetCommentFormAfterSuccess,
  useValidatedForm,
} from '../../../utils/validation/index.js';

export const COMMENTS_PAGE_SIZE = 5;

const defaultFormValues = {
  message: '',
  createdBy: '',
};

function CommentHeader({ author, createdAtLabel, fullDateLabel, isEdited = false }) {
  const timestamp = fullDateLabel ? (
    <Tooltip title={fullDateLabel}>
      <Typography component="span" variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
        {createdAtLabel}
      </Typography>
    </Tooltip>
  ) : (
    <Typography component="span" variant="caption" color="text.secondary">
      {createdAtLabel}
    </Typography>
  );

  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {author ? `${author} · ` : ''}
      {timestamp}
      {isEdited ? ' · edited' : ''}
    </Typography>
  );
}

export function CommentEmptyState({
  title = 'No comments yet',
  description = 'Be the first to add one.',
}) {
  return (
    <Box className="flex-center stack-spacing" sx={{ py: 3, textAlign: 'center' }}>
      <CommentsEmptyIllustration width={120} height={100} />
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

export function CommentCard({
  message,
  author,
  createdAtLabel,
  fullDateLabel,
  isEdited = false,
  canEdit = false,
  canDelete = false,
  onSave,
  onDelete,
  isSaving = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState(message);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftMessage(message);
      setError(null);
    }
  }, [message, isEditing]);

  const handleStartEdit = () => {
    setDraftMessage(message);
    setError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftMessage(message);
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const result = editCommentFormSchema.safeParse({ message: draftMessage });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid comment');
      return;
    }

    if (result.data.message === message) {
      setIsEditing(false);
      return;
    }

    try {
      await onSave?.(result.data.message);
      setIsEditing(false);
      setError(null);
    } catch {
      // Parent handles global errors; keep edit mode open.
    }
  };

  const showActions = !isEditing && (canEdit || canDelete);

  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
          mb: isEditing ? 1.5 : 1,
        }}
      >
        <CommentHeader
          author={author}
          createdAtLabel={createdAtLabel}
          fullDateLabel={fullDateLabel}
          isEdited={isEdited}
        />

        {showActions ? (
          <Box className="comment-card__actions" sx={{ display: 'flex', flexShrink: 0 }}>
            {canEdit ? (
              <Tooltip title="Edit comment">
                <span>
                  <IconButton
                    size="small"
                    aria-label="Edit comment"
                    onClick={handleStartEdit}
                    className="comment-card__action-btn interactive-press"
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
            {canDelete ? (
              <Tooltip title="Delete comment">
                <span>
                  <IconButton
                    size="small"
                    aria-label="Delete comment"
                    onClick={onDelete}
                    className="comment-card__action-btn interactive-press"
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
          </Box>
        ) : null}
      </Box>

      {isEditing ? (
        <Box className="stack-spacing">
          <TextField
            label="Edit comment"
            fullWidth
            required
            multiline
            minRows={3}
            value={draftMessage}
            onChange={(event) => {
              setDraftMessage(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            error={Boolean(error)}
            helperText={error}
            disabled={isSaving}
          />
          <Box className="app-form-actions" sx={{ justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="app-btn--cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleSave}
              disabled={isSaving || !draftMessage.trim()}
              className="app-btn--submit interactive-press"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export function CommentList({
  comments = [],
  getCommentProps,
  pageSize = COMMENTS_PAGE_SIZE,
  listKey,
}) {
  const [pagesShown, setPagesShown] = useState(1);

  useEffect(() => {
    setPagesShown(1);
  }, [listKey]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(comments.length / pageSize));
    setPagesShown((current) => Math.min(current, maxPages));
  }, [comments.length, pageSize]);

  if (comments.length === 0) {
    return <CommentEmptyState />;
  }

  const visibleCount = Math.min(pagesShown * pageSize, comments.length);
  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = comments.length > visibleCount;
  const canSeeLess = pagesShown > 1;
  const showPaginationActions = hasMore || canSeeLess;

  return (
    <Box className="comment-list">
      <Box className="stack-spacing">
        {visibleComments.map((comment) => {
          const props = getCommentProps?.(comment) ?? {
            message: comment.message,
            author: comment.createdBy?.name ?? comment.createdBy?.email,
            createdAtLabel: comment.createdAt,
          };

          return <CommentCard key={comment._id ?? comment.id} {...props} />;
        })}
      </Box>

      {showPaginationActions ? (
        <Box className="comment-list__pagination">
          {canSeeLess ? (
            <Button
              type="button"
              variant="contained"
              onClick={() => setPagesShown((current) => Math.max(1, current - 1))}
              className="app-btn--gradient-soft interactive-press"
              aria-label="Show fewer comments"
            >
              See less
            </Button>
          ) : null}
          {hasMore ? (
            <Button
              type="button"
              variant="contained"
              onClick={() => setPagesShown((current) => current + 1)}
              className="app-btn--submit interactive-press"
              aria-label={`Show more comments (${comments.length - visibleCount} remaining)`}
            >
              See more
            </Button>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

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
  showAuthorPicker = true,
}) {
  return (
    <Box component="form" onSubmit={onSubmit} className="app-form" noValidate>
      <FormErrorAlert message={globalError} onClose={onDismissGlobalError} />

      <Box className="app-form-fields">
        <TextField
          label="Add comment"
          fullWidth
          required
          multiline
          minRows={3}
          disabled={isSubmitting}
          {...register?.('message')}
          error={Boolean(errors.message)}
          helperText={errors.message?.message}
        />

        {showAuthorPicker ? (
          <CreatedByDropdown
            label="Comment author"
            name="createdBy"
            value={values.createdBy ?? ''}
            onChange={(event) => onFieldChange?.('createdBy', event.target.value)}
            users={users}
            isLoading={usersLoading}
            error={errors.createdBy}
          />
        ) : null}
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

function isCommentEdited(comment) {
  if (!comment?.updatedAt || !comment?.createdAt) {
    return false;
  }

  return new Date(comment.updatedAt).getTime() > new Date(comment.createdAt).getTime();
}

export function TicketCommentsSection({
  comments,
  ticketId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  isSubmitting = false,
  isUpdatingComment = false,
  updatingCommentId = null,
  canComment = true,
}) {
  const { user } = useAuth();
  const { canEditComment, canDeleteComment } = usePermissions();
  const { data: users = [], isLoading: usersLoading } = useCachedUsersQuery();
  const validUserIds = useMemo(() => users.map((entry) => entry._id), [users]);
  const usersById = useMemo(() => new Map(users.map((entry) => [entry._id, entry])), [users]);
  const schema = useMemo(() => createCommentFormSchema(validUserIds), [validUserIds]);

  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema,
    defaultValues: defaultFormValues,
    onSubmit: onAddComment,
    onSuccess: (values, commentForm) => {
      resetCommentFormAfterSuccess(commentForm, values);
      clearGlobalError();
    },
  });

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const values = watch();

  useEffect(() => {
    if (!user?._id || values.createdBy) {
      return;
    }

    setValue('createdBy', user._id, { shouldValidate: true });
  }, [user, values.createdBy, setValue]);

  const getCommentProps = (comment) => ({
    message: comment.message,
    author: resolveCommentAuthor(comment.createdBy, usersById),
    createdAtLabel: formatRelativeTime(comment.createdAt),
    fullDateLabel: formatTicketDate(comment.createdAt),
    isEdited: isCommentEdited(comment),
    canEdit: canEditComment(comment),
    canDelete: canDeleteComment(comment),
    isSaving: isUpdatingComment && updatingCommentId === comment._id,
    onSave: (message) => onEditComment?.(comment._id, message),
    onDelete: () => onDeleteComment?.(comment),
  });

  const commentList = (
    <CommentList
      key={ticketId}
      comments={comments}
      getCommentProps={getCommentProps}
      listKey={ticketId}
    />
  );

  if (!canComment) {
    return (
      <Box component="section" className="surface-card shadow-elevated card-spacing stack-spacing">
        <Typography variant="h6" component="h3">
          Comments
        </Typography>
        {commentList}
        <Typography variant="body2" color="text.secondary">
          You do not have permission to add comments on this ticket.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="section" className="surface-card shadow-elevated card-spacing stack-spacing">
      <Typography variant="h6" component="h3">
        Comments
      </Typography>

      {commentList}

      <CommentForm
        register={register}
        errors={errors}
        values={values}
        globalError={globalError}
        onDismissGlobalError={clearGlobalError}
        onFieldChange={(field, value) => setValue(field, value, { shouldValidate: true })}
        users={users}
        usersLoading={usersLoading}
        showAuthorPicker={false}
        onSubmit={submitHandler}
        isSubmitting={isSubmitting}
        isFormComplete={isFormComplete}
      />
    </Box>
  );
}
