import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

interface UseFormReturn<T> extends FormState<T> {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  reset: () => void;
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: ZodSchema,
  onSubmit?: (values: T) => Promise<void> | void
): UseFormReturn<T> {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const validate = useCallback(
    (values: T): Record<string, string> => {
      if (!validationSchema) return {};

      try {
        validationSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          (error as any).issues?.forEach((err: any) => {
            const path = err.path.join('.');
            fieldErrors[path] = err.message;
          });
          return fieldErrors;
        }
        return {};
      }
    },
    [validationSchema]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setFormState((prev) => {
        const newValues = { ...prev.values, [name]: newValue };
        return {
          ...prev,
          values: newValues,
          errors: validate(newValues),
        };
      });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setFormState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [name]: true },
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (onSubmitCallback: (values: T) => Promise<void> | void) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validate(formState.values);
        setFormState((prev) => ({
          ...prev,
          errors,
          touched: Object.keys(prev.values).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          ),
        }));

        if (Object.keys(errors).length > 0) return;

        setFormState((prev) => ({ ...prev, isSubmitting: true }));

        try {
          await (onSubmitCallback ? onSubmitCallback(formState.values) : onSubmit?.(formState.values));
        } finally {
          setFormState((prev) => ({ ...prev, isSubmitting: false }));
        }
      },
    [formState.values, validate, onSubmit]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setFormState((prev) => {
        const newValues = { ...prev.values, [field]: value };
        return {
          ...prev,
          values: newValues,
          errors: validate(newValues),
        };
      });
    },
    [validate]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const reset = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  return {
    ...formState,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
  };
}
