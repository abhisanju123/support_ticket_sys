import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';

import { CommentForm } from '../../../components/business/comments/CommentForm.jsx';
import { CommentList } from '../../../components/business/comments/CommentList.jsx';
import { useGetUsersQuery } from '../../users/api/usersApi.js';
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

export function TicketCommentsSection({ comments, onAddComment, isSubmitting = false }) {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
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

  return (
    <Box component="section" className="surface-card shadow-elevated card-spacing stack-spacing">
      <Typography variant="h6" component="h3">
        Comments
      </Typography>

      <CommentList
        comments={comments}
        getCommentProps={(comment) => ({
          message: comment.message,
          author: resolveCommentAuthor(comment.createdBy, usersById),
          createdAtLabel: formatRelativeTime(comment.createdAt),
          fullDateLabel: formatTicketDate(comment.createdAt),
        })}
      />

      <CommentForm
        register={register}
        errors={errors}
        values={values}
        globalError={globalError}
        onDismissGlobalError={clearGlobalError}
        onFieldChange={(field, value) => setValue(field, value, { shouldValidate: true })}
        users={users}
        usersLoading={usersLoading}
        onSubmit={submitHandler}
        isSubmitting={isSubmitting}
        isFormComplete={isFormComplete}
      />
    </Box>
  );
}
