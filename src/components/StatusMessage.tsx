import React from 'react';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'warning' | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
  if (!type || !message) return null;

  return (
    <div className={`status-message ${type}`}>
      {message}
    </div>
  );
};

export default StatusMessage;
