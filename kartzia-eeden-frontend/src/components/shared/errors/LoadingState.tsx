import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div
      className="loading-state"
      role="status"
      aria-live="polite"
      aria-label={message}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '200px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          className="spinner"
          style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p style={{ color: '#666' }}>{message}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
