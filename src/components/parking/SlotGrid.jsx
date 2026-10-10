import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingSlot from './ParkingSlot';
import Button from '../common/Button';
import { ArrowRight, Layers, Sparkles, AlertCircle } from 'lucide-react';

const SlotGrid = ({ slots = [], locationId, hourlyRate = 5.00 }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeFloor, setActiveFloor] = useState('All');
  const navigate = useNavigate();

  // Available floors
  const floors = ['All', ...new Set(slots.map(s => s.floor).filter(Boolean))];

  // Filtered slots by floor
  const displayedSlots = activeFloor === 'All' 
    ? slots 
    : slots.filter(s => s.floor === activeFloor);

  // Status counts
  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const reservedCount = slots.filter(s => s.status === 'reserved').length;
  const maintenanceCount = slots.filter(s => s.status === 'maintenance').length;

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleProceedReservation = () => {
    if (!selectedSlot) return;
    navigate(`/reservation?locationId=${locationId}&slot=${selectedSlot.slotNumber}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Legend & Summary Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}>
          {/* Status Legend */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Occupancy Legend
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>🟢</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>Available</span>
                <span style={{ color: '#10b981', fontSize: '0.8rem' }}>({availableCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>🔴</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>Occupied</span>
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>({occupiedCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>🟡</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>Reserved</span>
                <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>({reservedCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>⚫</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>Maintenance</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({maintenanceCount})</span>
              </div>
            </div>
          </div>

          {/* Floor Switcher */}
          {floors.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} color="#94a3b8" />
              <span style={{ fontSize: '0.825rem', color: '#94a3b8', fontWeight: 600 }}>Level:</span>
              <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '3px' }}>
                {floors.map(floor => (
                  <button
                    key={floor}
                    onClick={() => setActiveFloor(floor)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      background: activeFloor === floor ? '#3b82f6' : 'transparent',
                      color: activeFloor === floor ? '#fff' : '#94a3b8',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Slot Floating / Banner Callout */}
      {selectedSlot ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '14px',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {selectedSlot.slotNumber}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
                  Slot {selectedSlot.slotNumber} Selected
                </h4>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontWeight: 600
                }}>
                  🟢 Available
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {selectedSlot.floor || 'Level 1'} • Type: <strong style={{ color: '#f8fafc', textTransform: 'capitalize' }}>{selectedSlot.type}</strong> • Base Rate: <strong style={{ color: '#60a5fa' }}>₹{hourlyRate.toFixed(2)}/hr</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button variant="outline" size="sm" onClick={() => setSelectedSlot(null)}>
              Deselect
            </Button>
            <Button variant="primary" size="md" onClick={handleProceedReservation}>
              <span>Continue to Reservation</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          color: '#94a3b8',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} color="#3b82f6" />
          <span>Click on any <strong style={{ color: '#10b981' }}>🟢 Available</strong> slot in the visual grid below to select it and proceed with your reservation.</span>
        </div>
      )}

      {/* Visual Parking Slot Grid Layout */}
      <div style={{
        background: '#0a101f',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        position: 'relative'
      }}>
        {/* Driveway / Lane Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          padding: '0.4rem',
          borderBottom: '2px dashed rgba(255, 255, 255, 0.1)',
          color: '#64748b',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          ↑ VEHICLE ENTRANCE & CIRCULATION LANE ↑
        </div>

        {/* Dynamic Responsive Slot Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '1rem'
        }}>
          {displayedSlots.map(slot => (
            <ParkingSlot
              key={slot.id}
              slot={slot}
              isSelected={selectedSlot?.slotNumber === slot.slotNumber}
              onSelect={handleSlotSelect}
            />
          ))}
        </div>

        {/* Driveway Exit Lane */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          padding: '0.4rem',
          borderTop: '2px dashed rgba(255, 255, 255, 0.1)',
          color: '#64748b',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          ↓ SPEED LIMIT 10 MPH • EXIT RAMP ↓
        </div>
      </div>

    </div>
  );
};

export default SlotGrid;
