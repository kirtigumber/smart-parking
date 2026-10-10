import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { 
  User, 
  Mail, 
  Phone, 
  Car, 
  LogOut, 
  Edit3, 
  CalendarCheck, 
  Clock, 
  ShieldCheck, 
  Check, 
  Plus
} from 'lucide-react';

const ProfilePage = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { bookings } = useParking();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alex Morgan',
    email: currentUser?.email || 'alex.morgan@smartpark.io',
    phone: currentUser?.phone || '+1 (555) 234-5678',
    vehicleNumber: currentUser?.vehicleNumber || 'HR00XX0000',
    vehicleModel: currentUser?.vehicleModel || 'Tesla Model 3 / Blue Sedan'
  });

  const userBookings = bookings.filter(b => b.vehicleNumber === currentUser?.vehicleNumber || b.userEmail === currentUser?.email);
  const activeBookings = userBookings.filter(b => b.status === 'Confirmed');

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '860px' }}>
        
        {/* Page Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#3b82f6', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <User size={16} />
              <span>Driver Account</span>
            </div>
            <h1 className="page-title">Driver Profile</h1>
            <p className="page-subtitle">
              Manage your personal credentials, registered vehicle plates, and connected smart parking preferences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="danger"
              icon={LogOut}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: '2.5rem 2rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Avatar */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2.25rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
              border: '3px solid #0f182c'
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>

            {/* Main info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
                  {currentUser?.name || 'Driver User'}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: currentUser?.role === 'admin' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: currentUser?.role === 'admin' ? '#22d3ee' : '#60a5fa',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {currentUser?.role === 'admin' ? 'Chief Admin' : 'Verified Driver'}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Member since {currentUser?.memberSince || 'January 2026'} • RFID & QR Verified
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <Mail size={15} color="#3b82f6" />
                <span>Email Address</span>
              </div>
              <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                {currentUser?.email}
              </strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <Phone size={15} color="#06b6d4" />
                <span>Phone Number</span>
              </div>
              <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                {currentUser?.phone || '+1 (555) 234-5678'}
              </strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <Car size={15} color="#10b981" />
                <span>Primary Vehicle Plate</span>
              </div>
              <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10b981', fontSize: '1rem' }}>
                {currentUser?.vehicleNumber}
              </strong>
            </div>
          </div>
        </div>

        {/* Vehicle & Usage Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Registered Vehicle Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                Registered Vehicles
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                Active Plate
              </span>
            </div>

            <div style={{
              background: 'rgba(15, 24, 44, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Car size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', color: '#f8fafc' }}>
                  {currentUser?.vehicleNumber}
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {currentUser?.vehicleModel || 'Electric Sedan / Fast Pass Enabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Summary Stats */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Parking Activity Summary
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Active Reservations</span>
                <strong style={{ fontSize: '1.75rem', color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>
                  {activeBookings.length}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Total Past Sessions</span>
                <strong style={{ fontSize: '1.75rem', color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>
                  {userBookings.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Details"
      >
        <form onSubmit={handleEditSubmit}>
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />

          <Input
            label="Vehicle License Number"
            value={formData.vehicleNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value.toUpperCase() }))}
            helperText="Used at the gate scanner barrier"
            required
          />

          <Input
            label="Vehicle Model / Color"
            value={formData.vehicleModel}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
          />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button
              variant="secondary"
              style={{ flex: 1 }}
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={{ flex: 1 }}
              icon={Check}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProfilePage;
