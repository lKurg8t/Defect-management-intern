import React from 'react';

export type StatusPillProps = {
  status?: string;
  children?: React.ReactNode;
  className?: string;
};

export const StatusPill: React.FC<StatusPillProps> = ({ status, children, className = '' }) => {
  const getStatusClass = () => {
    const key = (status || '').toLowerCase();
    switch (key) {
      case 'active':
        return 'status-active';
      case 'in development':
      case 'development':
        return 'status-development';
      case 'completed':
        return 'status-completed';
      case 'critical':
        return 'status-critical';
      case 'high':
        return 'status-high';
      case 'medium':
        return 'status-medium';
      case 'low':
        return 'status-low';
      default:
        return '';
    }
  };

  return (
    <span className={`status-pill ${getStatusClass()} ${className}`.trim()}>{children || status}</span>
  );
};

export type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className = '' }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`progress-bar ${className}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
};
