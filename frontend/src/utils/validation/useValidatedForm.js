import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { createZodSubmitHandler } from './createZodSubmitHandler.js';
import { areRequiredFieldsFilled } from './formCompletion.js';
import { handleFormApiError } from './handleFormApiError.js';
import { useFormGlobalError } from './useFormGlobalError.js';

/**
 * Wires React Hook Form + Zod + API error handling for business forms.
 * @template T
 * @param {{
 *   schema: import('zod').ZodType<T>;
 *   defaultValues: Record<string, unknown>;
 *   onSubmit: (values: T) => Promise<void>;
 *   onSuccess?: (values: T, form: import('react-hook-form').UseFormReturn<any>) => void;
 *   requiredFields?: string[];
 * }} options
 */
export function useValidatedForm({ schema, defaultValues, onSubmit, onSuccess, requiredFields }) {
  const fieldsToRequire = useMemo(
    () => requiredFields ?? Object.keys(defaultValues),
    [requiredFields, defaultValues],
  );

  const form = useForm({ defaultValues, mode: 'onTouched' });
  const values = form.watch();
  const { globalError, setGlobalError, clearGlobalError } = useFormGlobalError();

  const isFormComplete = useMemo(
    () => areRequiredFieldsFilled(values, fieldsToRequire),
    [values, fieldsToRequire],
  );

  const submitHandler = useMemo(
    () =>
      createZodSubmitHandler(
        schema,
        form,
        async (values) => {
          clearGlobalError();

          try {
            await onSubmit(values);
            onSuccess?.(values, form);
          } catch (submitError) {
            handleFormApiError(submitError, {
              setError: form.setError,
              setGlobalError,
            });
          }
        },
        { onInvalid: clearGlobalError },
      ),
    [schema, form, onSubmit, onSuccess, clearGlobalError, setGlobalError],
  );

  return {
    form,
    submitHandler,
    globalError,
    clearGlobalError,
    isFormComplete,
  };
}
