import React, { useState } from 'react';
import { validate } from '@utils/validation/validator';
import { emailAuthSchema, EmailAuthInput } from '@utils/validation/authSchemas';
import { otpAuthApi } from '@utils/api/otpEndpoints';
import { ErrorState } from '@components/shared/errors/ErrorState';
import { LoadingState } from '@components/shared/errors/LoadingState';

interface EmailAuthProps {
  onEmailSubmitted?: (email: string, mode: 'login' | 'signup') => void;
}

export const EmailAuth: React.FC<EmailAuthProps> = ({ onEmailSubmitted }) => {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validation = validate<EmailAuthInput>(emailAuthSchema, { email, mode });
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    setIsLoading(true);
    const response = await otpAuthApi.requestOtp(email, mode);

    if (response.success) {
      onEmailSubmitted?.(email, mode);
    } else {
      setApiError(response.error?.message || 'Failed to send OTP');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingState message="Sending OTP to your email..." />;
  }

  if (apiError) {
    return (
      <ErrorState
        message={apiError}
        retry={() => setApiError(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="email-auth-form" noValidate>
      <h2>Welcome to Kartzia Eeden</h2>

      {/* Mode Selection */}
      <div className="mode-selector">
        <button
          type="button"
          className={`mode-button ${mode === 'login' ? 'active' : ''}`}
          onClick={() => handleModeChange('login')}
          aria-pressed={mode === 'login'}
        >
          <span className="mode-label">Login</span>
          <span className="mode-description">Existing user</span>
        </button>
        <button
          type="button"
          className={`mode-button ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => handleModeChange('signup')}
          aria-pressed={mode === 'signup'}
        >
          <span className="mode-label">Sign Up</span>
          <span className="mode-description">New user</span>
        </button>
      </div>

      {/* Email Input */}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="your@email.com"
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Info Text */}
      <div className="auth-info">
        {mode === 'login' ? (
          <p>We'll send you a One-Time Password (OTP) to verify your identity.</p>
        ) : (
          <p>We'll send you an OTP to create your account and verify your email.</p>
        )}
      </div>

      <button type="submit" disabled={isLoading} aria-busy={isLoading} className="send-otp-button">
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
};
