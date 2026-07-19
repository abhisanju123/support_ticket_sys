import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { editCommentFormSchema } from '../../../utils/validation/index.js';
import { CommentHeader } from './CommentHeader.jsx';

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
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'action.hover',
      }}
    >
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
