import { useState, useCallback, useRef } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

interface UseFormReturn<T> extends FormState<T> {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmitOverride?: (values: T) => Promise<void> | void) => (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  reset: () => void;
  isValid: boolean;
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: ZodSchema,
  onSubmit?: (values: T) => Promise<void> | void
): UseFormReturn<T> {
  const initialRef = useRef(initialValues);

  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const valuesRef = useRef<T>(initialValues);
  valuesRef.current = formState.values;

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const validate = useCallback(
    (values: T): Record<string, string> => {
      if (!validationSchema) return {};
      try {
        validationSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            if (!fieldErrors[path]) fieldErrors[path] = issue.message;
          });
          return fieldErrors;
        }
        return {};
      }
    },
    [validationSchema]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setFormState((prev) => {
        const newValues = { ...prev.values, [name]: newValue };
        // FIX: only revalidate a field after the user has already touched it.
        // Without this, errors appear while typing the very first character.
        const newErrors = prev.touched[name]
          ? validate(newValues)
          : prev.errors;
        return { ...prev, values: newValues, errors: newErrors };
      });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setFormState((prev) => {
        // Validate on blur so the error appears when the user leaves the field
        const errors = validate(prev.values);
        return {
          ...prev,
          touched: { ...prev.touched, [name]: true },
          errors,
        };
      });
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (onSubmitOverride?: (values: T) => Promise<void> | void) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        const currentValues = valuesRef.current;
        const errors = validate(currentValues);

        // Mark every field as touched so all errors are visible on submit
        const allTouched = Object.keys(currentValues).reduce<Record<string, boolean>>(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );

        setFormState((prev) => ({ ...prev, errors, touched: allTouched }));

        if (Object.keys(errors).length > 0) return;

        const callback = onSubmitOverride ?? onSubmitRef.current;
        if (!callback) return;

        setFormState((prev) => ({ ...prev, isSubmitting: true }));
        try {
          await callback(currentValues);
        } finally {
          setFormState((prev) => ({ ...prev, isSubmitting: false }));
        }
      },
    [validate]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setFormState((prev) => {
        const newValues = { ...prev.values, [field]: value };
        const newErrors = prev.touched[field as string]
          ? validate(newValues)
          : prev.errors;
        return { ...prev, values: newValues, errors: newErrors };
      });
    },
    [validate]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field as string]: error },
    }));
  }, []);

  const reset = useCallback(() => {
    setFormState({
      values: initialRef.current,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, []);

  const isValid = Object.keys(formState.errors).length === 0;

  return {
    ...formState,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
    isValid,
  };
}
