import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#3b82f6',
  trend
}) => {
  return (
    <div className="card" style={{
      position: 'relative',
      overflow: 'hidden',
      borderTop: `3px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span style={{
            fontSize: '0.825rem',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {title}
          </span>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#f8fafc',
            margin: '0.4rem 0 0.2rem',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            {value}
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trend.startsWith('+') ? '#10b981' : trend.startsWith('-') ? '#ef4444' : '#60a5fa',
              marginTop: '0.35rem'
            }}>
              {trend}
            </span>
          )}
        </div>

        {Icon && (
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: `${color}18`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
