/**
 * Resets a React Hook Form to provided values and clears errors/global state.
 * @param {import('react-hook-form').UseFormReturn<any>} form
 * @param {Record<string, unknown>} [values]
 * @param {() => void} [clearGlobalError]
 */
export const resetFormState = (form, values, clearGlobalError) => {
  if (values) {
    form.reset(values);
  } else {
    form.reset();
  }

  form.clearErrors();
  clearGlobalError?.();
};

/**
 * Clears only the message field after a successful comment submission.
 * @param {import('react-hook-form').UseFormReturn<any>} form
 * @param {Record<string, unknown>} values
 */
export const resetCommentFormAfterSuccess = (form, values) => {
  form.reset({
    message: '',
    createdBy: values.createdBy ?? '',
  });
  form.clearErrors();
};
