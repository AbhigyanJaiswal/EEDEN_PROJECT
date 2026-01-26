import React from 'react';

interface ErrorStateProps {
  message: string;
  code?: string;
  retry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, code, retry }) => {
  return (
    <div
      role="alert"
      className="error-state"
      aria-label={`Error: ${message}`}
    >
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {code && <p className="error-code">Error Code: {code}</p>}
      {retry && (
        <button onClick={retry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};
