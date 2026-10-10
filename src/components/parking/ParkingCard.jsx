import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Button from '../common/Button';

const ParkingCard = ({ location }) => {
  const {
    id,
    name,
    location: address,
    totalSlots,
    availableSlots,
    occupiedSlots,
    hourlyRate,
    distance,
    operatingHours,
    rating,
    features,
    category
  } = location;

  // Calculate percentage
  const availablePercentage = Math.round((availableSlots / totalSlots) * 100);
  const occupancyPercentage = 100 - availablePercentage;

  // Determine availability status color
  const isHighAvailability = availablePercentage >= 40;
  const isMediumAvailability = availablePercentage >= 15 && availablePercentage < 40;
  const availabilityColor = isHighAvailability ? '#10b981' : isMediumAvailability ? '#f59e0b' : '#ef4444';

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#06b6d4',
            background: 'rgba(6, 182, 212, 0.12)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            marginBottom: '0.5rem'
          }}>
            {category || 'Smart Garage'}
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
            {name}
          </h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            <MapPin size={15} color="#3b82f6" />
            <span>{address}</span>
          </p>
        </div>

        <div style={{
          textAlign: 'right',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '0.5rem 0.85rem',
          borderRadius: '10px',
          border: '1px solid rgba(59, 130, 246, 0.25)'
        }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60a5fa' }}>
            ₹{hourlyRate.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
            / hour
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.4rem',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '0.8rem 0.5rem',
        borderRadius: '10px',
        margin: '0.75rem 0 1.25rem',
        textAlign: 'center'
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>Total</span>
          <strong style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{totalSlots}</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: '#10b981' }}>Available</span>
          <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{availableSlots}</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: '#ef4444' }}>Occupied</span>
          <strong style={{ fontSize: '1.1rem', color: '#ef4444' }}>{occupiedSlots}</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: '#f59e0b' }}>Reserved</span>
          <strong style={{ fontSize: '1.1rem', color: '#f59e0b' }}>{location.reservedSlots || 0}</strong>
        </div>
      </div>

      {/* Availability & Occupancy Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
          <span style={{ color: '#06b6d4', fontWeight: 600 }}>
            {location.occupancyPercentage !== undefined ? `${location.occupancyPercentage}% Occupied` : `${occupancyPercentage}% Occupied`}
          </span>
          <span style={{ color: availabilityColor, fontWeight: 700 }}>
            {availablePercentage}% Free
          </span>
        </div>
        <div style={{
          height: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{
            width: `${availablePercentage}%`,
            background: availabilityColor,
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Features preview */}
      {features && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', flex: 1 }}>
          {features.slice(0, 3).map((feat, idx) => (
            <span key={idx} style={{
              fontSize: '0.725rem',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Zap size={11} color="#f59e0b" />
              {feat}
            </span>
          ))}
        </div>
      )}

      {/* View Slots Action */}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <Link to={`/parking/${id}`} style={{ width: '100%', display: 'block' }}>
          <Button variant="primary" style={{ width: '100%' }}>
            <span>View Slots</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ParkingCard;
