import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { 
  CheckCircle2, 
  QrCode, 
  CalendarCheck, 
  MapPin, 
  Car, 
  Clock, 
  Printer, 
  Share2, 
  ArrowLeft,
  ShieldCheck,
  Download
} from 'lucide-react';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const { bookings } = useParking();
  const [showQrModal, setShowQrModal] = useState(false);
  const navigate = useNavigate();

  // Find booking or fallback to standard demo booking SP10025
  const booking = bookings.find(b => b.id.toUpperCase() === (id || '').toUpperCase()) || {
    id: id || 'SP10025',
    parkingName: 'City Mall Parking',
    locationAddress: 'Main Road, Sector 18',
    slot: 'P12',
    date: '22 September 2026',
    time: '10:00 AM – 12:00 PM',
    vehicleNumber: 'HR00XX0000',
    status: 'Confirmed',
    amount: 10.00
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        
        {/* Ticket Confirmation Card */}
        <div className="card" style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          borderTop: '5px solid #10b981'
        }}>
          
          {/* Big Checkmark */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <span style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#10b981',
            marginBottom: '0.25rem'
          }}>
            RESERVATION VERIFIED & ACTIVE
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            ✓ Booking Confirmed
          </h1>
          
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your parking stall has been reserved in the smart parking grid. Keep this pass ready upon arrival.
          </p>

          {/* Ticket Information Box */}
          <div style={{
            background: 'rgba(15, 24, 44, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.75rem',
            textAlign: 'left',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            
            {/* Top row: Booking ID */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
              paddingBottom: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>BOOKING ID</span>
                <strong style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '1.3rem',
                  color: '#60a5fa',
                  letterSpacing: '0.05em'
                }}>
                  {booking.id}
                </strong>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                color: '#10b981',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                ● {booking.status}
              </div>
            </div>

            {/* Core details list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Parking:</span>
                <strong style={{ color: '#f8fafc', textAlign: 'right' }}>{booking.parkingName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Allocated Slot:</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  padding: '2px 10px',
                  borderRadius: '6px',
                  color: '#60a5fa',
                  fontWeight: 800,
                  fontSize: '1.1rem'
                }}>
                  {booking.slot}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Date:</span>
                <strong style={{ color: '#f8fafc' }}>{booking.date}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Time:</span>
                <strong style={{ color: '#f8fafc' }}>{booking.time}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Vehicle Plate:</span>
                <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f8fafc' }}>
                  {booking.vehicleNumber}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Total Amount:</span>
                <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>
                  ₹{Number(booking.amount || 10).toFixed(2)}
                </strong>
              </div>

            </div>

            {/* Dummy QR Code Visual Placeholder Box */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: '#070d18',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Real QR Preview */}
                <div style={{
                  background: '#ffffff',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                  {booking.qrCode ? (
                    <img
                      src={booking.qrCode}
                      alt={`QR Pass ${booking.id}`}
                      style={{ width: '54px', height: '54px', display: 'block', borderRadius: '4px' }}
                    />
                  ) : (
                    <QrCode size={40} color="#0f172a" />
                  )}
                </div>
                <div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                    Digital Gate Pass
                    <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '1px 6px', borderRadius: '4px' }}>
                      VERIFIED QR
                    </span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Scan at entrance barrier to trigger automatic gate lift
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowQrModal(true)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                View Full Pass
              </button>
            </div>

          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <Button
              variant="secondary"
              size="lg"
              icon={QrCode}
              onClick={() => setShowQrModal(true)}
            >
              View QR Code
            </Button>

            <Link to="/my-bookings" style={{ width: '100%' }}>
              <Button
                variant="primary"
                size="lg"
                icon={CalendarCheck}
                style={{ width: '100%' }}
              >
                My Bookings
              </Button>
            </Link>
          </div>

          {/* Auxiliary Print & Return links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#94a3b8',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Print Ticket</span>
            </button>

            <Link
              to="/parking"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#94a3b8',
                fontSize: '0.85rem'
              }}
            >
              <Car size={15} />
              <span>Book Another Spot</span>
            </Link>
          </div>

        </div>

      </div>

      {/* QR Code Inspection Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Automated Barrier Pass"
      >
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          
          <div style={{
            display: 'inline-block',
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: '20px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            marginBottom: '1.5rem'
          }}>
            {booking.qrCode ? (
              <img
                src={booking.qrCode}
                alt={`QR Permit ${booking.id}`}
                style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }}
              />
            ) : (
              <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={120} color="#0f172a" />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>
              PASS PERMIT CODE
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#3b82f6'
            }}>
              {booking.id}
            </span>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Allocated Bay: <strong style={{ color: '#fff' }}>{booking.slot}</strong> ({booking.parkingName})
            </p>
          </div>

          <Button variant="primary" style={{ width: '100%' }} onClick={() => setShowQrModal(false)}>
            Close Pass Preview
          </Button>

        </div>
      </Modal>

    </div>
  );
};

export default BookingConfirmationPage;
