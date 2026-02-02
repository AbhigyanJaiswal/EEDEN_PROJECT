import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon,
}) => {
  return (
    <div
      className="empty-state"
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        color: '#666',
      }}
    >
      {icon && <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>}
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ marginBottom: '1.5rem' }}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
