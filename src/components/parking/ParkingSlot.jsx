import React from 'react';
import { Car, Zap, Accessibility, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ParkingSlot = ({
  slot,
  isSelected = false,
  onSelect
}) => {
  const { slotNumber, status, type, vehicle, floor } = slot;
  const isAvailable = status === 'available';

  // Determine styling according to status
  let borderColor = 'rgba(255, 255, 255, 0.1)';
  let bgColor = 'rgba(15, 24, 44, 0.6)';
  let textColor = '#cbd5e1';
  let statusEmoji = '🟢';
  let statusLabel = 'Available';

  if (status === 'available') {
    borderColor = isSelected ? '#3b82f6' : 'rgba(16, 185, 129, 0.4)';
    bgColor = isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.08)';
    textColor = '#10b981';
    statusEmoji = '🟢';
    statusLabel = 'Available';
  } else if (status === 'occupied') {
    borderColor = 'rgba(239, 68, 68, 0.35)';
    bgColor = 'rgba(239, 68, 68, 0.08)';
    textColor = '#ef4444';
    statusEmoji = '🔴';
    statusLabel = 'Occupied';
  } else if (status === 'reserved') {
    borderColor = 'rgba(245, 158, 11, 0.4)';
    bgColor = 'rgba(245, 158, 11, 0.08)';
    textColor = '#f59e0b';
    statusEmoji = '🟡';
    statusLabel = 'Reserved';
  } else if (status === 'maintenance') {
    borderColor = 'rgba(100, 116, 139, 0.3)';
    bgColor = 'rgba(100, 116, 139, 0.08)';
    textColor = '#64748b';
    statusEmoji = '⚫';
    statusLabel = 'Maintenance';
  }

  const handleClick = () => {
    if (isAvailable && onSelect) {
      onSelect(slot);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        borderRadius: '12px',
        border: `2px solid ${isSelected ? '#3b82f6' : borderColor}`,
        background: bgColor,
        padding: '1rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        minHeight: '120px',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'translateY(-4px) scale(1.03)' : 'none',
        boxShadow: isSelected 
          ? '0 0 20px rgba(59, 130, 246, 0.45)' 
          : isAvailable 
            ? '0 2px 8px rgba(0,0,0,0.2)' 
            : 'none',
        opacity: status === 'maintenance' ? 0.6 : 1
      }}
      title={`${slotNumber} - ${statusLabel}${vehicle ? ` (${vehicle})` : ''}`}
    >
      {/* Top row: Slot Code + Status Dot */}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontFamily: 'JetBrains Mono, monospace', 
          fontWeight: 800, 
          fontSize: '1rem',
          color: isSelected ? '#60a5fa' : '#f8fafc' 
        }}>
          {slotNumber}
        </span>
        <span style={{ fontSize: '0.85rem' }} title={statusLabel}>
          {statusEmoji}
        </span>
      </div>

      {/* Middle icon / car representation */}
      <div style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status === 'occupied' ? (
          <div style={{ textAlign: 'center', color: '#ef4444' }}>
            <Car size={32} strokeWidth={1.75} />
            <span style={{ 
              display: 'block', 
              fontSize: '0.65rem', 
              fontFamily: 'JetBrains Mono, monospace',
              color: '#f87171',
              marginTop: '2px' 
            }}>
              {vehicle || 'PARKED'}
            </span>
          </div>
        ) : status === 'reserved' ? (
          <div style={{ textAlign: 'center', color: '#f59e0b' }}>
            <Car size={32} strokeWidth={1.75} style={{ opacity: 0.8 }} />
            <span style={{ 
              display: 'block', 
              fontSize: '0.65rem', 
              color: '#fbbf24',
              marginTop: '2px' 
            }}>
              HOLD
            </span>
          </div>
        ) : status === 'maintenance' ? (
          <div style={{ color: '#64748b' }}>
            <ShieldAlert size={28} />
          </div>
        ) : (
          <div style={{
            width: '36px',
            height: '48px',
            border: '2px dashed rgba(16, 185, 129, 0.4)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            {isSelected ? (
              <CheckCircle2 size={24} color="#3b82f6" />
            ) : type === 'ev' ? (
              <Zap size={18} />
            ) : type === 'accessible' ? (
              <Accessibility size={18} />
            ) : (
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>FREE</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom tag: slot type / action hint */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        {type === 'ev' && (
          <span style={{
            fontSize: '0.65rem',
            color: '#06b6d4',
            background: 'rgba(6, 182, 212, 0.15)',
            padding: '1px 6px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            ⚡ EV
          </span>
        )}
        {type === 'accessible' && (
          <span style={{
            fontSize: '0.65rem',
            color: '#a855f7',
            background: 'rgba(168, 85, 247, 0.15)',
            padding: '1px 6px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            ♿ Access
          </span>
        )}
        {type === 'compact' && (
          <span style={{
            fontSize: '0.65rem',
            color: '#94a3b8',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1px 6px',
            borderRadius: '4px'
          }}>
            Compact
          </span>
        )}
        {type === 'regular' && (
          <span style={{
            fontSize: '0.65rem',
            color: isAvailable ? '#10b981' : '#64748b'
          }}>
            {isAvailable ? 'Click to Book' : statusLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default ParkingSlot;
