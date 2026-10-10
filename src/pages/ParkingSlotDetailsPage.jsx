import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import SlotGrid from '../components/parking/SlotGrid';
import Button from '../components/common/Button';
import { ArrowLeft, MapPin, Clock, IndianRupee, Shield, Zap, Info } from 'lucide-react';

const ParkingSlotDetailsPage = () => {
  const { id } = useParams();
  const { getLocationById, getSlotsForLocation, wsConnected } = useParking();
  const navigate = useNavigate();

  const location = getLocationById(id);
  const slots = getSlotsForLocation(id || 'loc-1');

  if (!location) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#f8fafc' }}>
            Parking Location Not Found
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            The parking facility you requested does not exist or has been relocated.
          </p>
          <Link to="/parking">
            <Button variant="primary">Back to Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const reservedCount = slots.filter(s => s.status === 'reserved').length;
  const totalCount = slots.length || location.totalSlots || 24;
  const occupancyPercent = Math.round(((occupiedCount + reservedCount) / totalCount) * 100);

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Back Link & Live Telemetry Pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link 
            to="/parking" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: '#94a3b8', 
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={16} />
            <span>Back to All Locations</span>
          </Link>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: wsConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${wsConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: wsConnected ? '#10b981' : '#ef4444'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: wsConnected ? '#10b981' : '#ef4444' }} />
            <span>{wsConnected ? 'Live Sensor Feed (WebSocket Active)' : 'Sensor Telemetry Reconnecting...'}</span>
          </div>
        </div>

        {/* Location Header Details Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
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
                {location.category}
              </span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                {location.name}
              </h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                <MapPin size={16} color="#3b82f6" />
                <span>{location.location}</span>
                <span style={{ color: '#64748b' }}>•</span>
                <span style={{ color: '#06b6d4' }}>{location.distance}</span>
              </p>
            </div>

            {/* Quick stats badges: Total, Available, Occupied, Reserved, Occupancy % */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                textAlign: 'center',
                minWidth: '85px'
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL</span>
                <strong style={{ fontSize: '1.35rem', color: '#f8fafc', fontFamily: 'JetBrains Mono, monospace' }}>
                  {totalCount}
                </strong>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                textAlign: 'center',
                minWidth: '85px'
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>AVAILABLE</span>
                <strong style={{ fontSize: '1.35rem', color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>
                  {availableCount}
                </strong>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                textAlign: 'center',
                minWidth: '85px'
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>OCCUPIED</span>
                <strong style={{ fontSize: '1.35rem', color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
                  {occupiedCount}
                </strong>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                textAlign: 'center',
                minWidth: '85px'
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>RESERVED</span>
                <strong style={{ fontSize: '1.35rem', color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>
                  {reservedCount}
                </strong>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                textAlign: 'center',
                minWidth: '85px'
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#06b6d4', fontWeight: 600 }}>OCCUPANCY</span>
                <strong style={{ fontSize: '1.35rem', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace' }}>
                  {occupancyPercent}%
                </strong>
              </div>
            </div>
          </div>

          {/* Location details row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.875rem',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="#06b6d4" />
              <span>Hours: <strong style={{ color: '#f8fafc' }}>{location.operatingHours}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IndianRupee size={16} color="#60a5fa" />
              <span>Base Rate: <strong style={{ color: '#60a5fa' }}>₹{Number(location.hourlyRate || 5).toFixed(2)}/hr</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="#10b981" />
              <span>Security: <strong style={{ color: '#f8fafc' }}>CCTV Monitored & Guarded</strong></span>
            </div>
            {location.features && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} color="#f59e0b" />
                <span>Amenities: <strong style={{ color: '#f8fafc' }}>{location.features.join(', ')}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Parking Slot Grid Section */}
        <SlotGrid 
          slots={slots} 
          locationId={location.id} 
          hourlyRate={location.hourlyRate}
        />

      </div>
    </div>
  );
};

export default ParkingSlotDetailsPage;
