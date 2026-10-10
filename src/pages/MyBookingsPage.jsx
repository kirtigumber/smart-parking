import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/booking/BookingCard';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { 
  CalendarCheck, 
  Car, 
  MapPin, 
  Search, 
  LayoutGrid, 
  List, 
  Eye, 
  XCircle, 
  QrCode,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const MyBookingsPage = () => {
  const { bookings, cancelReservation, refreshBackendData, loading } = useParking();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Confirmed' | 'Completed' | 'Cancelled'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQrBooking, setSelectedQrBooking] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  // Reload user's bookings from backend every time this page is visited
  useEffect(() => {
    refreshBackendData();
  }, []);

  // Filter bookings for the current user view
  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'All' || booking.status?.toLowerCase() === activeTab.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      booking.id?.toLowerCase().includes(q) ||
      booking.parkingName?.toLowerCase().includes(q) ||
      booking.slot?.toLowerCase().includes(q) ||
      booking.vehicleNumber?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const confirmedCount = bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length;

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelReservation(bookingId);
    } catch (err) {
      console.warn('Cancel failed:', err);
    }
    setCancellingBookingId(null);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Page Header */}
        <div className="page-header" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <CalendarCheck size={16} />
              <span>Smart Pass Registry</span>
            </div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">
              Manage your active reservations, inspect barrier gate QR codes, and review parking session histories.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={refreshBackendData}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Link to="/parking">
              <Button variant="primary" icon={Car}>
                Reserve Another Spot
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls & Tabs */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            {/* Status Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('All')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: activeTab === 'All' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'All' ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                All ({bookings.length})
              </button>

              <button
                onClick={() => setActiveTab('Confirmed')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: activeTab === 'Confirmed' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'Confirmed' ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                Confirmed ({confirmedCount})
              </button>

              <button
                onClick={() => setActiveTab('Completed')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: activeTab === 'Completed' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'Completed' ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                Completed ({completedCount})
              </button>

              <button
                onClick={() => setActiveTab('Cancelled')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: activeTab === 'Cancelled' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'Cancelled' ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>

            {/* View Mode & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter by ID, lot, slot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', padding: '0.45rem 0.75rem 0.45rem 2.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '2px' }}>
                <button
                  onClick={() => setViewMode('cards')}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    color: viewMode === 'cards' ? '#fff' : '#64748b',
                    background: viewMode === 'cards' ? '#3b82f6' : 'transparent'
                  }}
                  title="Card View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    color: viewMode === 'table' ? '#fff' : '#64748b',
                    background: viewMode === 'table' ? '#3b82f6' : 'transparent'
                  }}
                  title="Table View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Results List */}
        {filteredBookings.length > 0 ? (
          viewMode === 'cards' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.75rem'
            }}>
              {filteredBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Parking Location</th>
                    <th>Slot</th>
                    <th>Date & Time</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#60a5fa' }}>
                          {booking.id}
                        </span>
                      </td>
                      <td>
                        <strong style={{ display: 'block', color: '#f8fafc' }}>{booking.parkingName}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{booking.locationAddress}</span>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          fontWeight: 700
                        }}>
                          {booking.slot}
                        </span>
                      </td>
                      <td>
                        <div>{booking.date}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{booking.time}</div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {booking.vehicleNumber}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={booking.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Link to={`/booking/${booking.id}`}>
                            <button
                              className="btn btn-outline btn-sm"
                              title="View Details"
                              style={{ padding: '0.35rem 0.6rem' }}
                            >
                              <Eye size={14} />
                            </button>
                          </Link>

                          {booking.status === 'Confirmed' && (
                            <button
                              className="btn btn-danger btn-sm"
                              title="Cancel Reservation"
                              style={{ padding: '0.35rem 0.6rem' }}
                              onClick={() => setCancellingBookingId(booking.id)}
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '50%',
              border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
            }} />
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading your reservations...</p>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <CalendarCheck size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              No bookings found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {searchQuery
                ? 'No reservations matched your search query.'
                : 'You have no reservations yet. Book a parking slot to get started.'}
            </p>
            <Link to="/parking">
              <Button variant="primary">
                Browse Parking Facilities
              </Button>
            </Link>
          </div>
        )}

      </div>

      {/* Confirmation modal for table view cancel */}
      <Modal
        isOpen={!!cancellingBookingId}
        onClose={() => setCancellingBookingId(null)}
        title="Confirm Cancellation"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Are you sure you want to cancel booking <strong style={{ color: '#fff' }}>{cancellingBookingId}</strong>? The slot will immediately be made available for other users.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => setCancellingBookingId(null)}>
              Keep
            </Button>
            <Button variant="danger" style={{ flex: 1 }} onClick={() => handleCancelBooking(cancellingBookingId)}>
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyBookingsPage;
