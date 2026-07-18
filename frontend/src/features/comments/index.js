export {
  clearExpandedTicketId,
  commentsUiReducer,
  selectExpandedTicketId,
  setExpandedTicketId,
} from './store/commentsUiSlice.js';

export {
  commentsApi,
  useCreateCommentMutation,
  useGetCommentsQuery,
} from './api/commentsApi.js';