import React from 'react';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  actionLabel,
  onAction,
  icon = '📭',
}) => {
  return (
    <div className="empty-state" role="status" aria-label={message}>
      <div className="empty-icon">{icon}</div>
      <h3>{message}</h3>
      {actionLabel && onAction && (
        <button onClick={onAction} className="empty-action-button">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
