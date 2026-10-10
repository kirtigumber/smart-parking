import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  CalendarCheck, 
  User, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { backendConnected, wsConnected } = useParking();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 13, 24, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.85rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={closeMobile}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
            color: '#fff'
          }}>
            <Car size={24} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Smart<span style={{ color: '#06b6d4' }}>Park</span>
            </span>
            <span style={{ 
              display: 'block', 
              fontSize: '0.65rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              color: '#94a3b8',
              lineHeight: 1
            }}>
              Intelligent Reservation
            </span>
          </div>
        </Link>

        {/* Live Connection Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-menu">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.7rem', fontWeight: 600,
            color: backendConnected ? '#10b981' : '#ef4444',
            background: backendConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            borderRadius: '12px', padding: '2px 7px'
          }}>
            {backendConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
            API
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.7rem', fontWeight: 600,
            color: wsConnected ? '#06b6d4' : '#64748b',
            background: wsConnected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(100, 116, 139, 0.1)',
            border: `1px solid ${wsConnected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(100, 116, 139, 0.2)'}`,
            borderRadius: '12px', padding: '2px 7px'
          }}>
            <span className="pulse-indicator" style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: wsConnected ? '#06b6d4' : '#64748b',
              display: 'inline-block'
            }} />
            WS
          </span>
        </div>
        <div style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-menu">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? '#3b82f6' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'color 0.15s',
              textDecoration: 'none'
            })}
          >
            Home
          </NavLink>

          <NavLink 
            to="/parking" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? '#3b82f6' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color 0.15s',
              textDecoration: 'none'
            })}
          >
            <MapPin size={16} />
            <span>Find Parking</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink 
              to="/my-bookings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                color: isActive ? '#3b82f6' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.15s',
                textDecoration: 'none'
              })}
            >
              <CalendarCheck size={16} />
              <span>My Bookings</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                color: isActive ? '#06b6d4' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.15s',
                textDecoration: 'none'
              })}
            >
              <ShieldCheck size={16} color="#06b6d4" />
              <span>Admin Dashboard</span>
            </NavLink>
          )}
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-menu">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Role badge */}
              {isAdmin && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#22d3ee',
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '20px',
                  padding: '2px 10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  Admin
                </span>
              )}
              <Link 
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isAdmin ? '#06b6d4' : '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span>{currentUser?.name?.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            padding: '0.5rem'
          }}
          className="mobile-toggle"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0a101f',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={closeMobile} style={{ color: '#f8fafc', fontWeight: 600, padding: '0.5rem 0', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/parking" onClick={closeMobile} style={{ color: '#f8fafc', fontWeight: 600, padding: '0.5rem 0', textDecoration: 'none' }}>
            Find Parking
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" onClick={closeMobile} style={{ color: '#f8fafc', fontWeight: 600, padding: '0.5rem 0', textDecoration: 'none' }}>
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={closeMobile} style={{ color: '#06b6d4', fontWeight: 600, padding: '0.5rem 0', textDecoration: 'none' }}>
              Admin Dashboard
            </Link>
          )}

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/profile" onClick={closeMobile} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <User size={16} />
                <span>My Profile ({currentUser?.name?.split(' ')[0]})</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" onClick={closeMobile} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" onClick={closeMobile} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
