import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Activity,
  Users,
  Compass
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import Button from '../components/common/Button';
import ParkingCard from '../components/parking/ParkingCard';

const HomePage = () => {
  const { locations } = useParking();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Highlight top 3 locations for the preview
  const previewLocations = locations.slice(0, 3);

  // Quick search submit
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/parking${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem',
        overflow: 'hidden'
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0
        }} />

        <div className="container" style={{ textAlign: 'center', maxWidth: '880px', position: 'relative', zIndex: 1 }}>
          
          {/* Smart Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
          }}>
            <span className="pulse-indicator" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Next-Gen Smart City IoT Infrastructure</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Smart Parking.<br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Simple & Efficient.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.2rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem'
          }}>
            Say goodbye to endless circling. Find available spaces in real-time, reserve your designated slot in advance, and navigate smoothly with touchless QR entry.
          </p>

          {/* Search & Action Bar */}
          <form 
            onSubmit={handleSearch}
            style={{
              background: 'rgba(15, 24, 44, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '0.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.6)',
              maxWidth: '640px',
              margin: '0 auto 2rem'
            }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 0.85rem', gap: '0.65rem' }}>
              <MapPin size={20} color="#3b82f6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by area, mall, airport or street..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" icon={Search}>
              <span>Find Parking</span>
            </Button>
          </form>

          {/* Quick links */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
            <span>Popular:</span>
            <Link to="/parking" style={{ color: '#94a3b8', textDecoration: 'underline' }}>City Mall</Link>
            <Link to="/parking" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Airport Terminal 2</Link>
            <Link to="/parking" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Metro Hub</Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          STATISTICS SECTION
          ========================================================================= */}
      <section style={{
        background: 'rgba(15, 24, 44, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '3rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ color: '#3b82f6', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <Car size={32} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'JetBrains Mono, monospace' }}>
                100+
              </div>
              <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem' }}>
                Parking Slots
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Sensor Monitored</span>
            </div>

            <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ color: '#06b6d4', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <Users size={32} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'JetBrains Mono, monospace' }}>
                50+
              </div>
              <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem' }}>
                Active Users
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Daily Reserved Drivers</span>
            </div>

            <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <Clock size={32} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'JetBrains Mono, monospace' }}>
                24/7
              </div>
              <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem' }}>
                Availability
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Uninterrupted Access</span>
            </div>

            <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ color: '#10b981', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <Activity size={32} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'JetBrains Mono, monospace' }}>
                Real-Time
              </div>
              <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem' }}>
                Updates
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Live Ultrasonic Feeds</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          REAL-TIME AVAILABILITY PREVIEW
          ========================================================================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                <span className="pulse-indicator" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>Live Availability Feed</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                Explore Featured Parking Zones
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Occupancy updates automatically calculated through simulated IoT telemetry.
              </p>
            </div>

            <Link to="/parking">
              <Button variant="outline" icon={ArrowRight}>
                View All {locations.length} Locations
              </Button>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {previewLocations.map(location => (
              <ParkingCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS SECTION
          ========================================================================= */}
      <section style={{
        background: '#0a101f',
        padding: '5rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Frictionless Process
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0' }}>
              How Smart Park Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Reserve your spot in four intuitive steps before you even turn the ignition.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            position: 'relative'
          }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.65rem' }}>
                Find Location
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Browse verified smart parking facilities nearby, compare real-time availability and hourly pricing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.65rem' }}>
                Pick Visual Slot
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                View the interactive parking slot grid with live status indicators (🟢 Available, 🔴 Occupied) and pick your preferred bay.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.65rem' }}>
                Instant Reservation
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Enter your schedule and vehicle license number to lock in your guaranteed reservation instantly.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.65rem' }}>
                Scan QR & Park
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Receive your digital parking pass with QR verification. Flash it at the barrier gate for automated touchless access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY FEATURES SECTION
          ========================================================================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cutting-Edge Technology
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0' }}>
              Intelligent City Management
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Built with modern specifications to alleviate traffic congestion and maximize municipal space efficiency.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.5rem' }}>
                Real-Time Slot Sensor Grid
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Visualizes individual parking stalls in real-time with color-coded status badges: Available (🟢), Occupied (🔴), Reserved (🟡), and Maintenance (⚫).
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Smartphone size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.5rem' }}>
                Digital QR Ticket Pass
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Generates a digital parking pass with an integrated QR code placeholder for automated barrier gate check-in and checkout.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.5rem' }}>
                Centralized Admin Control
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Comprehensive administrator portal providing occupancy KPI statistics, parking facility management, manual slot overrides, and ticket verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION
          ========================================================================= */}
      <section style={{
        padding: '4rem 0 6rem'
      }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              Ready to Secure Your Parking Space?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Join thousands of drivers who avoid parking delays. Experience seamless urban mobility today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/parking">
                <Button variant="primary" size="lg" icon={Car}>
                  Find Available Slots Now
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Create Driver Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
