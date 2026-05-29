import React, { memo } from 'react';
import { useForm } from '../../hooks/useForm';
import { loginSchema, type LoginFormData } from '../../utils/validation/schemas';
import { useAuthStore } from '../../context/authStore';
import { ErrorState } from '../shared/errors/ErrorState';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = memo(({ onSuccess }) => {
  const { login, error } = useAuthStore();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<LoginFormData>(
    { email: '', password: '' },
    loginSchema,
    async (values) => {
      try {
        setSubmitError(null);
        await login(values.email, values.password);
        onSuccess?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setSubmitError(message);
      }
    }
  );

  return (
    <form onSubmit={form.handleSubmit()} noValidate aria-label="Login form">
      {(submitError || error) && (
        <ErrorState message={submitError || error || 'Login failed'} />
      )}

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="email"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          aria-invalid={!!form.errors.email}
          aria-describedby={form.errors.email ? 'email-error' : undefined}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: `1px solid ${form.errors.email ? '#c00' : '#ccc'}`,
            fontSize: '1rem',
          }}
          required
        />
        {form.errors.email && (
          <span id="email-error" className="error" style={{ color: '#c00', fontSize: '0.875rem' }}>
            {form.errors.email}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="password"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          aria-invalid={!!form.errors.password}
          aria-describedby={form.errors.password ? 'password-error' : undefined}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: `1px solid ${form.errors.password ? '#c00' : '#ccc'}`,
            fontSize: '1rem',
          }}
          required
        />
        {form.errors.password && (
          <span id="password-error" className="error" style={{ color: '#c00', fontSize: '0.875rem' }}>
            {form.errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: form.isSubmitting ? 'not-allowed' : 'pointer',
          opacity: form.isSubmitting ? 0.7 : 1,
        }}
        aria-busy={form.isSubmitting}
      >
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';
