import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  if (!message) return null;

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '10px',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      margin: '1rem 0'
    }} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} color="#ef4444" />
        <span style={{ color: '#fca5a5', fontSize: '0.9rem', fontWeight: 500 }}>
          {message}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            color: '#ef4444',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'underline'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
