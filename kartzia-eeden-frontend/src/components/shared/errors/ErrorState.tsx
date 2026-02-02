import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  icon,
}) => {
  return (
    <div
      className="error-state"
      role="alert"
      aria-live="polite"
      style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#fee',
        borderRadius: '8px',
        border: '1px solid #fcc',
      }}
    >
      {icon && <div className="error-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>}
      <h2 style={{ marginTop: 0, color: '#c00' }}>{title}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          aria-label="Retry button"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
