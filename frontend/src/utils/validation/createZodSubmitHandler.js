/**
 * Creates a React Hook Form submit handler with Zod validation.
 * @template T
 * @param {import('zod').ZodType<T>} schema
 * @param {import('react-hook-form').UseFormReturn<any>} form
 * @param {(values: T) => Promise<void> | void} onValid
 * @param {{ onInvalid?: () => void }} [options]
 */
export const createZodSubmitHandler = (schema, form, onValid, options = {}) =>
  form.handleSubmit(async (values) => {
    form.clearErrors();

    const result = schema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === 'string') {
          form.setError(field, { type: 'validation', message: issue.message });
        }
      });

      options.onInvalid?.();
      return;
    }

    await onValid(result.data);
  });
