import React, { useState } from 'react';
import { validate } from '@utils/validation/validator';
import { signupSchema, SignupInput } from '@utils/validation/schemas';
import { authApi } from '@utils/api/endpoints';
import { useAuthStore } from '@context/authStore';
import { ErrorState } from '@components/shared/errors/ErrorState';

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validation = validate<SignupInput>(signupSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    setIsLoading(true);
    const { confirmPassword, ...signupData } = validation.data!;
    const response = await authApi.signup(signupData);

    if (response.success && response.data) {
      login(
        { id: '1', email: formData.email, firstName: formData.firstName, lastName: formData.lastName },
        response.data.token
      );
      onSuccess?.();
    } else {
      setApiError(response.error?.message || 'Signup failed');
    }
    setIsLoading(false);
  };

  if (apiError) {
    return (
      <ErrorState
        message={apiError}
        retry={() => setApiError(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="signup-form" noValidate>
      <h2>Create Account</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            required
          />
          {errors.firstName && (
            <span id="firstName-error" className="error-message" role="alert">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            required
          />
          {errors.lastName && (
            <span id="lastName-error" className="error-message" role="alert">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          aria-describedby={errors.password ? 'password-error' : undefined}
          required
        />
        {errors.password && (
          <span id="password-error" className="error-message" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          required
        />
        {errors.confirmPassword && (
          <span id="confirmPassword-error" className="error-message" role="alert">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
};
