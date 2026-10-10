import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  QrCode, 
  XCircle, 
  Eye, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Modal from '../common/Modal';

const BookingCard = ({ booking, onCancel }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    id,
    parkingName,
    locationAddress,
    slot,
    date,
    time,
    vehicleNumber,
    status,
    amount
  } = booking;

  const isConfirmed = status === 'Confirmed';
  const isCompleted = status === 'Completed';
  const isCancelled = status === 'Cancelled';

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(id);
    }
    setShowCancelModal(false);
  };

  return (
    <>
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        borderLeft: isConfirmed 
          ? '4px solid #10b981' 
          : isCompleted 
            ? '4px solid #3b82f6' 
            : '4px solid #ef4444'
      }}>
        {/* Header: ID, Parking name, Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#06b6d4',
                background: 'rgba(6, 182, 212, 0.12)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {id}
              </span>
              <StatusBadge status={status} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              {parkingName}
            </h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              <MapPin size={14} color="#3b82f6" />
              <span>{locationAddress}</span>
            </p>
          </div>

          {/* Slot Highlight Badge */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
              Reserved Slot
            </span>
            <span style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              color: '#60a5fa' 
            }}>
              {slot}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          <div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <Calendar size={13} /> Date
            </span>
            <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{date}</strong>
          </div>

          <div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <Clock size={13} /> Reserved Time
            </span>
            <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{time}</strong>
          </div>

          <div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <Car size={13} /> Vehicle Plate
            </span>
            <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f8fafc', fontSize: '0.9rem' }}>
              {vehicleNumber}
            </strong>
          </div>

          <div>
            <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              Total Amount
            </span>
            <strong style={{ color: '#10b981', fontSize: '0.9rem' }}>
              ₹{Number(amount || 10).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isConfirmed && (
              <Button
                variant="secondary"
                size="sm"
                icon={QrCode}
                onClick={() => setShowQrModal(true)}
              >
                QR Code
              </Button>
            )}
            <Link to={`/booking/${id}`}>
              <Button variant="outline" size="sm" icon={Eye}>
                View Details
              </Button>
            </Link>
          </div>

          <div>
            {isConfirmed && (
              <Button
                variant="danger"
                size="sm"
                icon={XCircle}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Booking
              </Button>
            )}
            {isCancelled && (
              <span style={{ fontSize: '0.8rem', color: '#ef4444', fontStyle: 'italic' }}>
                Booking cancelled & slot released
              </span>
            )}
            {isCompleted && (
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Completed session
              </span>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Placeholder Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title={`Parking Pass – ${id}`}
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            display: 'inline-block',
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            marginBottom: '1.25rem'
          }}>
            {/* High-tech stylized SVG QR Code Placeholder */}
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Corner position squares */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />

              {/* Data matrix dots */}
              <rect x="38" y="8" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="8" width="8" height="8" fill="#0f172a" />
              <rect x="42" y="20" width="8" height="8" fill="#0f172a" />
              <rect x="54" y="20" width="6" height="6" fill="#0f172a" />
              <rect x="8" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="20" y="42" width="6" height="8" fill="#0f172a" />
              <rect x="36" y="36" width="14" height="14" rx="2" fill="#3b82f6" />
              <rect x="54" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="66" y="42" width="8" height="8" fill="#0f172a" />
              <rect x="78" y="38" width="14" height="8" fill="#0f172a" />
              <rect x="38" y="54" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="52" width="8" height="8" fill="#0f172a" />
              <rect x="68" y="56" width="8" height="8" fill="#0f172a" />
              <rect x="38" y="68" width="8" height="8" fill="#0f172a" />
              <rect x="52" y="70" width="12" height="8" fill="#0f172a" />
              <rect x="72" y="68" width="8" height="12" fill="#0f172a" />
              <rect x="40" y="82" width="10" height="8" fill="#0f172a" />
              <rect x="60" y="82" width="8" height="8" fill="#0f172a" />
              <rect x="76" y="84" width="12" height="8" fill="#0f172a" />
            </svg>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>GATE PASS IDENTIFIER</span>
            <strong style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: '#f8fafc' }}>
              {id}
            </strong>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Hold this QR code against the scanner terminal at <strong style={{ color: '#fff' }}>{parkingName}</strong> barrier gate for automatic entry.
          </p>

          <Button variant="primary" style={{ width: '100%' }} onClick={() => setShowQrModal(false)}>
            Close QR Preview
          </Button>
        </div>
      </Modal>

      {/* Cancel Reservation Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Reservation"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#ef4444'
          }}>
            <AlertTriangle size={28} />
          </div>

          <h4 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Confirm Cancellation?
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Are you sure you want to cancel booking <strong style={{ color: '#fff' }}>{id}</strong> for slot <strong style={{ color: '#60a5fa' }}>{slot}</strong> at {parkingName}? The slot will be immediately released back to other drivers.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              style={{ flex: 1 }}
              onClick={() => setShowCancelModal(false)}
            >
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              style={{ flex: 1 }}
              onClick={handleConfirmCancel}
            >
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;
