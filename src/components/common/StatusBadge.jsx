import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let badgeClass = 'badge-available';
  let label = status;
  let symbol = '🟢';

  switch (normalized) {
    case 'available':
      badgeClass = 'badge-available';
      symbol = '🟢';
      label = 'Available';
      break;
    case 'occupied':
      badgeClass = 'badge-occupied';
      symbol = '🔴';
      label = 'Occupied';
      break;
    case 'reserved':
      badgeClass = 'badge-reserved';
      symbol = '🟡';
      label = 'Reserved';
      break;
    case 'maintenance':
      badgeClass = 'badge-maintenance';
      symbol = '⚫';
      label = 'Maintenance';
      break;
    case 'confirmed':
      badgeClass = 'badge-available';
      symbol = '✓';
      label = 'Confirmed';
      break;
    case 'completed':
      badgeClass = 'badge-secondary';
      symbol = '✓';
      label = 'Completed';
      break;
    case 'cancelled':
      badgeClass = 'badge-occupied';
      symbol = '✕';
      label = 'Cancelled';
      break;
    default:
      badgeClass = 'badge-secondary';
      symbol = '•';
      label = status;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`.trim()}>
      <span className="badge-dot"></span>
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
