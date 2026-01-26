import React, { useState, useEffect } from 'react';
import { validate } from '@utils/validation/validator';
import { otpVerificationSchema, OtpVerificationInput } from '@utils/validation/authSchemas';
import { otpAuthApi } from '@utils/api/otpEndpoints';
import { useAuthStore } from '@context/authStore';
import { ErrorState } from '@components/shared/errors/ErrorState';
import { LoadingState } from '@components/shared/errors/LoadingState';

interface OtpVerificationProps {
  email: string;
  mode: 'login' | 'signup';
  onSuccess?: () => void;
  onBack?: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  mode,
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { login } = useAuthStore();

  // Countdown timer for resend button
  useEffect(() => {
    if (!resendDisabled) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: '' }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validation = validate<OtpVerificationInput>(otpVerificationSchema, { email, otp });
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    setIsLoading(true);
    const response = await otpAuthApi.verifyOtp(email, otp);

    if (response.success && response.data) {
      login(
        { id: '1', email, firstName: '', lastName: '' },
        response.data.token
      );
      onSuccess?.();
    } else {
      setApiError(response.error?.message || 'Invalid OTP. Please try again.');
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setApiError(null);
    setResendDisabled(true);

    const response = await otpAuthApi.resendOtp(email);

    if (!response.success) {
      setApiError(response.error?.message || 'Failed to resend OTP');
      setResendDisabled(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Verifying your OTP..." />;
  }

  return (
    <form onSubmit={handleVerify} className="otp-verification-form" noValidate>
      <h2>Verify Your Email</h2>

      <div className="otp-info">
        <p>We've sent a 6-digit OTP to:</p>
        <p className="email-display">{email}</p>
      </div>

      {/* OTP Input */}
      <div className="form-group">
        <label htmlFor="otp">One-Time Password</label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          name="otp"
          value={otp}
          onChange={handleOtpChange}
          disabled={isLoading}
          placeholder="000000"
          maxLength={6}
          aria-describedby={errors.otp || apiError ? 'otp-error' : undefined}
          required
          className="otp-input"
        />
        {(errors.otp || apiError) && (
          <span id="otp-error" className="error-message" role="alert">
            {errors.otp || apiError}
          </span>
        )}
      </div>

      {/* Resend OTP */}
      <div className="resend-section">
        <span className="resend-text">Didn't receive the OTP?</span>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendDisabled || isLoading}
          className="resend-button"
        >
          {resendDisabled ? `Resend in ${timeLeft}s` : 'Resend OTP'}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="otp-actions">
        <button
          type="submit"
          disabled={otp.length !== 6 || isLoading}
          aria-busy={isLoading}
          className="verify-button"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="back-button"
          >
            Back
          </button>
        )}
      </div>
    </form>
  );
};
