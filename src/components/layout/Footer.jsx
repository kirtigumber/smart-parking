import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Wifi, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#050a14',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '4rem 0 2rem',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Car size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Smart<span style={{ color: '#06b6d4' }}>Park</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Intelligent Parking Reservation and Real-Time Occupancy Management System. Transforming urban mobility with frictionless reservation and dynamic space allocation.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span>Sensors & IoT Feeds: Online</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="#3b82f6" /> Home
                </Link>
              </li>
              <li>
                <Link to="/parking" style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="#3b82f6" /> Find Parking Lots
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="#3b82f6" /> My Reservations
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="#3b82f6" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Parking Status Legend */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Occupancy Legend
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ color: '#cbd5e1' }}>Available – Ready to book</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ color: '#cbd5e1' }}>Occupied – Vehicle parked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ color: '#cbd5e1' }}>Reserved – Awaiting driver arrival</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#64748b' }} />
                <span style={{ color: '#cbd5e1' }}>Maintenance – Offline / servicing</span>
              </div>
            </div>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Project Scope
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              College Major Project: Engineering design & front-end prototype for Smart City IoT infrastructure.
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.8rem',
              color: '#94a3b8'
            }}>
              <p>⚡ Phase 1: Interactive Frontend</p>
              <p>🚀 Modern React & CSS Architecture</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#64748b',
          fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} Smart Park System. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
