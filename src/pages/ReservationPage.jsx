import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const ReservationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { locations, getSlotsForLocation, createReservation } = useParking();
  const { currentUser } = useAuth();

  const initialLocId = searchParams.get('locationId') || locations[0]?.id || 'loc-1';
  const initialSlot = searchParams.get('slot') || 'P12';

  const [selectedLocationId, setSelectedLocationId] = useState(initialLocId);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(initialSlot);
  const [date, setDate] = useState('2026-09-22');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [vehicleNumber, setVehicleNumber] = useState(currentUser?.vehicleNumber || 'HR00XX0000');
  const [driverName, setDriverName] = useState(currentUser?.name || 'Alex Morgan');
  const [driverEmail, setDriverEmail] = useState(currentUser?.email || 'alex.morgan@smartpark.io');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected location details
  const selectedLocation = locations.find(l => l.id === selectedLocationId) || locations[0];
  const availableSlots = getSlotsForLocation(selectedLocationId).filter(s => s.status === 'available');

  // Sync slot if location changes
  useEffect(() => {
    const locSlots = getSlotsForLocation(selectedLocationId);
    const hasCurrentSlot = locSlots.some(s => s.slotNumber === selectedSlotNumber && s.status === 'available');
    if (!hasCurrentSlot && locSlots.some(s => s.status === 'available')) {
      const firstAvailable = locSlots.find(s => s.status === 'available');
      if (firstAvailable) setSelectedSlotNumber(firstAvailable.slotNumber);
    }
  }, [selectedLocationId]);

  // Calculate estimated duration in hours
  const calculateHours = () => {
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diffHours = (endH + endM / 60) - (startH + startM / 60);
      if (diffHours <= 0) diffHours = 1; // minimum 1 hour
      return Math.max(1, Math.round(diffHours * 10) / 10);
    } catch {
      return 2;
    }
  };

  const hours = calculateHours();
  const hourlyRate = selectedLocation?.hourlyRate || 5.00;
  const estimatedCost = (hours * hourlyRate).toFixed(2);

  // Format 12-hour time strings
  const format12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const validate = () => {
    const errs = {};
    if (!selectedLocationId) errs.location = 'Please select a parking location.';
    if (!selectedSlotNumber) errs.slot = 'Please select an available parking slot.';
    if (!date) errs.date = 'Reservation date is required.';
    if (!startTime) errs.startTime = 'Start time is required.';
    if (!endTime) errs.endTime = 'End time is required.';
    if (!vehicleNumber.trim()) errs.vehicleNumber = 'Vehicle plate number is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Format readable date
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const start12 = format12Hour(startTime);
    const end12 = format12Hour(endTime);

    try {
      const newBooking = await createReservation({
        locationId: selectedLocationId,
        slotNumber: selectedSlotNumber,
        date: formattedDate || '22 September 2026',
        startTime: start12,
        endTime: end12,
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
        hours,
        userName: driverName,
        userEmail: driverEmail
      });

      navigate(`/booking/${newBooking.id}`);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create reservation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            to={selectedLocation ? `/parking/${selectedLocation.id}` : '/parking'}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: '#94a3b8', 
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Slot Selection</span>
          </Link>
        </div>

        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">Reserve Parking Slot</h1>
          <p className="page-subtitle">
            Confirm your reservation details and vehicle registration to generate your digital gate pass.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={handleConfirmReservation} noValidate>
              
              {/* Location Selector */}
              <div className="form-group">
                <label className="form-label">
                  Parking Location <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id} style={{ background: '#0f182c', color: '#fff' }}>
                      {loc.name} – {loc.location} (₹{loc.hourlyRate.toFixed(2)}/hr)
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Selector */}
              <div className="form-group">
                <label className="form-label">
                  Selected Slot <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <select
                    value={selectedSlotNumber}
                    onChange={(e) => setSelectedSlotNumber(e.target.value)}
                    className="form-input"
                    style={{ cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}
                  >
                    {/* Include currently selected slot even if state transitioned */}
                    {selectedSlotNumber && !availableSlots.some(s => s.slotNumber === selectedSlotNumber) && (
                      <option value={selectedSlotNumber} style={{ background: '#0f182c', color: '#fff' }}>
                        {selectedSlotNumber} (Selected Space)
                      </option>
                    )}
                    {availableSlots.map(s => (
                      <option key={s.id} value={s.slotNumber} style={{ background: '#0f182c', color: '#fff' }}>
                        {s.slotNumber} – 🟢 Available ({s.floor || 'Level 1'} - {s.type})
                      </option>
                    ))}
                  </select>
                  <Link to={`/parking/${selectedLocationId}`}>
                    <Button variant="secondary" size="md">
                      View Grid
                    </Button>
                  </Link>
                </div>
                {errors.slot && <p className="form-error">{errors.slot}</p>}
              </div>

              {/* Date */}
              <Input
                label="Reservation Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
                icon={Calendar}
                required
              />

              {/* Start & End Times */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <Input
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  error={errors.startTime}
                  icon={Clock}
                  required
                />

                <Input
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  error={errors.endTime}
                  icon={Clock}
                  required
                />
              </div>

              {/* Vehicle Number */}
              <Input
                label="Vehicle License Plate"
                placeholder="e.g. HR00XX0000"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                error={errors.vehicleNumber}
                helperText="Must match vehicle entering the gate sensor barrier."
                icon={Car}
                required
              />

              {/* Driver Contact info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <Input
                  label="Driver Name"
                  placeholder="Driver Full Name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                />

                <Input
                  label="Confirmation Email"
                  type="email"
                  placeholder="name@example.com"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                  icon={CheckCircle}
                >
                  {isSubmitting ? 'Confirming Reservation...' : 'Confirm Reservation'}
                </Button>

                {errors.submit && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}>
                    ⚠️ {errors.submit}
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Right Column: Cost & Booking Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid #3b82f6' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
                Reservation Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Parking Facility:</span>
                  <strong style={{ color: '#f8fafc', textAlign: 'right' }}>{selectedLocation?.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Allocated Slot:</span>
                  <strong style={{ color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem' }}>
                    {selectedSlotNumber}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Estimated Duration:</span>
                  <strong style={{ color: '#f8fafc' }}>{hours} hour(s)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Rate / Hour:</span>
                  <span style={{ color: '#f8fafc' }}>₹{hourlyRate.toFixed(2)}/hr</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Entry Permit Type:</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Touchless QR Pass</span>
                </div>
              </div>

              {/* Total Price Callout */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Total Estimated Fee
                  </span>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Includes taxes & barrier access</p>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>
                  ₹{estimatedCost}
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Zero reservation fee • Free cancellation up to 15 mins prior</span>
              </div>
            </div>

            {/* Smart notice */}
            <div className="card" style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Sparkles size={20} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  <strong>IoT Automatic Barrier:</strong> Your QR code pass will be ready immediately on the next screen and automatically saved to your <strong style={{ color: '#f8fafc' }}>My Bookings</strong> dashboard.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ReservationPage;
