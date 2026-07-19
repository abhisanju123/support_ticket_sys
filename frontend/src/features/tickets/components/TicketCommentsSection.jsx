import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';

import { CommentForm } from '../../../components/business/comments/CommentForm.jsx';
import { CommentList } from '../../../components/business/comments/CommentList.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { usePermissions } from '../../auth/hooks/usePermissions.js';
import { useCachedUsersQuery } from '../../users/api/usersApi.js';
import {
  formatRelativeTime,
  formatTicketDate,
  resolveCommentAuthor,
} from '../utils/ticketFormatters.js';
import {
  createCommentFormSchema,
  resetCommentFormAfterSuccess,
  useValidatedForm,
} from '../../../utils/validation/index.js';

const defaultValues = {
  message: '',
  createdBy: '',
};

function isCommentEdited(comment) {
  if (!comment?.updatedAt || !comment?.createdAt) {
    return false;
  }

  return new Date(comment.updatedAt).getTime() > new Date(comment.createdAt).getTime();
}

export function TicketCommentsSection({
  comments,
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
  const validUserIds = useMemo(() => users.map((user) => user._id), [users]);
  const usersById = useMemo(() => new Map(users.map((user) => [user._id, user])), [users]);
  const schema = useMemo(() => createCommentFormSchema(validUserIds), [validUserIds]);

  const { form, submitHandler, globalError, clearGlobalError, isFormComplete } = useValidatedForm({
    schema,
    defaultValues,
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
    <CommentList comments={comments} getCommentProps={getCommentProps} />
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
