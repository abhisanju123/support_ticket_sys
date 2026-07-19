export {
  clearExpandedTicketId,
  commentsUiReducer,
  selectExpandedTicketId,
  setExpandedTicketId,
} from './store/commentsUiSlice.js';

export {
  commentsApi,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useUpdateCommentMutation,
} from './api/commentsApi.js';