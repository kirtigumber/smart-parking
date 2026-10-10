// ============================================================================
// SMART PARK - COMPREHENSIVE MOCK DATASET
// Realistic mock entities for Locations, Slots, Bookings, Users, and Analytics
// ============================================================================

export const MOCK_STATISTICS = [
  { label: 'Total Parking Slots', value: '100+', icon: 'Car', change: '+12% this week' },
  { label: 'Active Users', value: '50+', icon: 'Users', change: '+24% this month' },
  { label: 'System Availability', value: '24/7', icon: 'Clock', change: '99.98% Uptime' },
  { label: 'Occupancy Refresh', value: 'Real-Time', icon: 'Activity', change: '< 2s latency' }
];

export const MOCK_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'City Mall Parking',
    location: 'Main Road, Sector 18',
    category: 'Shopping Mall',
    totalSlots: 100,
    availableSlots: 35,
    occupiedSlots: 65,
    hourlyRate: 5.00,
    distance: '0.8 km away',
    operatingHours: '08:00 AM - 11:30 PM',
    rating: 4.8,
    features: ['EV Charging', 'CCTV 24/7', 'Valet Option', 'Elevator Access', 'Covered Roof'],
    description: 'Premier multi-level parking facility connected directly to City Mall with high-speed automated barrier gates and fast EV charging docks.'
  },
  {
    id: 'loc-2',
    name: 'Metro Hub Station',
    location: 'Railway Plaza, Transit Loop',
    category: 'Public Transit',
    totalSlots: 150,
    availableSlots: 42,
    occupiedSlots: 108,
    hourlyRate: 3.50,
    distance: '1.4 km away',
    operatingHours: '24 Hours Open',
    rating: 4.6,
    features: ['Smart Gate', 'Bicycle Racks', 'CCTV 24/7', 'Direct Terminal Link'],
    description: 'Direct metro commuter hub parking designed for daily subway commuters with automated touchless license plate recognition.'
  },
  {
    id: 'loc-3',
    name: 'CyberTech Grand Plaza',
    location: 'Silicon Boulevard, Tech Zone',
    category: 'Business Park',
    totalSlots: 80,
    availableSlots: 20,
    occupiedSlots: 60,
    hourlyRate: 6.00,
    distance: '2.5 km away',
    operatingHours: '06:00 AM - 10:00 PM',
    rating: 4.9,
    features: ['Fast EV DC Fast', 'App Pay Only', 'Security Escort', 'Climate Controlled'],
    description: 'Ultra-modern subterranean tech park facility equipped with AI occupancy camera sensors and dedicated luxury vehicle bays.'
  },
  {
    id: 'loc-4',
    name: 'Apex Healthcare Center',
    location: 'Medical Enclave, Cross Road 4',
    category: 'Hospital / Healthcare',
    totalSlots: 60,
    availableSlots: 15,
    occupiedSlots: 45,
    hourlyRate: 4.00,
    distance: '3.1 km away',
    operatingHours: '24 Hours Open',
    rating: 4.7,
    features: ['Handicap Priority', 'Ambulance Lane Free', '24/7 Attendants', 'Emergency Assistance'],
    description: 'Accessible and secure medical center parking with designated patient transfer zones and immediate emergency room walkway.'
  },
  {
    id: 'loc-5',
    name: 'Grand Horizon Airport (T2)',
    location: 'Airport Expressway, Terminal 2',
    category: 'Airport Parking',
    totalSlots: 200,
    availableSlots: 75,
    occupiedSlots: 125,
    hourlyRate: 8.00,
    distance: '7.8 km away',
    operatingHours: '24 Hours Open',
    rating: 4.8,
    features: ['Free Terminal Shuttle', 'Long-term Stay', 'Luggage Assistance', 'Valet Pickup'],
    description: 'Long-term and short-term airport terminal parking with free frequent shuttles and 24-hour round-the-clock perimeter patrols.'
  },
  {
    id: 'loc-6',
    name: 'Downtown Civic Square',
    location: 'High Street Heritage District',
    category: 'City Center',
    totalSlots: 50,
    availableSlots: 12,
    occupiedSlots: 38,
    hourlyRate: 4.50,
    distance: '0.4 km away',
    operatingHours: '07:00 AM - Midnight',
    rating: 4.5,
    features: ['CCTV Monitored', 'Street Level', 'Pedestrian Walkway'],
    description: 'Central downtown surface lot located within 2 minutes of prominent dining, theaters, and retail avenues.'
  }
];

// Realistic Slot Grid Layout for City Mall Parking (and dynamically generated for other locations)
export const INITIAL_SLOTS = {
  'loc-1': [
    { id: 's1', slotNumber: 'P01', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's2', slotNumber: 'P02', status: 'occupied', floor: 'Level 1', type: 'regular', vehicle: 'DL04AB1234' },
    { id: 's3', slotNumber: 'P03', status: 'available', floor: 'Level 1', type: 'ev', vehicle: null },
    { id: 's4', slotNumber: 'P04', status: 'reserved', floor: 'Level 1', type: 'regular', vehicle: 'MH02XY9999' },
    { id: 's5', slotNumber: 'P05', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's6', slotNumber: 'P06', status: 'available', floor: 'Level 1', type: 'compact', vehicle: null },
    { id: 's7', slotNumber: 'P07', status: 'occupied', floor: 'Level 1', type: 'regular', vehicle: 'UP16CD5678' },
    { id: 's8', slotNumber: 'P08', status: 'available', floor: 'Level 1', type: 'accessible', vehicle: null },
    { id: 's9', slotNumber: 'P09', status: 'reserved', floor: 'Level 1', type: 'regular', vehicle: 'KA01EF4321' },
    { id: 's10', slotNumber: 'P10', status: 'occupied', floor: 'Level 1', type: 'regular', vehicle: 'TS09GH8765' },
    { id: 's11', slotNumber: 'P11', status: 'available', floor: 'Level 1', type: 'ev', vehicle: null },
    { id: 's12', slotNumber: 'P12', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's13', slotNumber: 'P13', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's14', slotNumber: 'P14', status: 'occupied', floor: 'Level 1', type: 'regular', vehicle: 'HR26JK7654' },
    { id: 's15', slotNumber: 'P15', status: 'maintenance', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's16', slotNumber: 'P16', status: 'available', floor: 'Level 1', type: 'compact', vehicle: null },
    { id: 's17', slotNumber: 'P17', status: 'occupied', floor: 'Level 1', type: 'regular', vehicle: 'GJ01LM3456' },
    { id: 's18', slotNumber: 'P18', status: 'available', floor: 'Level 1', type: 'accessible', vehicle: null },
    { id: 's19', slotNumber: 'P19', status: 'reserved', floor: 'Level 1', type: 'ev', vehicle: 'TN07PQ9012' },
    { id: 's20', slotNumber: 'P20', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's21', slotNumber: 'P21', status: 'maintenance', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's22', slotNumber: 'P22', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null },
    { id: 's23', slotNumber: 'P23', status: 'occupied', floor: 'Level 1', type: 'regular', vehicle: 'RJ14RS7890' },
    { id: 's24', slotNumber: 'P24', status: 'available', floor: 'Level 1', type: 'regular', vehicle: null }
  ]
};

// Generates fallback slots for locations that don't have hardcoded configurations
export const generateSlotsForLocation = (locId, count = 24) => {
  if (INITIAL_SLOTS[locId]) return INITIAL_SLOTS[locId];
  
  const statuses = ['available', 'occupied', 'available', 'occupied', 'reserved', 'available', 'available', 'maintenance'];
  const types = ['regular', 'regular', 'ev', 'compact', 'accessible'];
  const slots = [];

  for (let i = 1; i <= count; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const status = statuses[i % statuses.length];
    slots.push({
      id: `${locId}-s${i}`,
      slotNumber: `P${num}`,
      status,
      floor: i <= 12 ? 'Level 1' : 'Level 2',
      type: types[i % types.length],
      vehicle: status === 'occupied' ? `VEH-${1000 + i}` : null
    });
  }
  return slots;
};

// Initial Seed Bookings
export const INITIAL_BOOKINGS = [
  {
    id: 'SP10025',
    parkingId: 'loc-1',
    parkingName: 'City Mall Parking',
    locationAddress: 'Main Road, Sector 18',
    slot: 'P12',
    date: '22 September 2026',
    time: '10:00 AM – 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    vehicleNumber: 'HR00XX0000',
    status: 'Confirmed', // Confirmed, Completed, Cancelled
    amount: 10.00,
    ratePerHour: 5.00,
    hours: 2,
    createdAt: '2026-09-22T08:30:00.000Z',
    userEmail: 'alex.morgan@smartpark.io',
    userName: 'Alex Morgan'
  },
  {
    id: 'SP10018',
    parkingId: 'loc-2',
    parkingName: 'Metro Hub Station',
    locationAddress: 'Railway Plaza, Transit Loop',
    slot: 'P05',
    date: '20 September 2026',
    time: '09:00 AM – 05:00 PM',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    vehicleNumber: 'HR00XX0000',
    status: 'Completed',
    amount: 28.00,
    ratePerHour: 3.50,
    hours: 8,
    createdAt: '2026-09-20T07:15:00.000Z',
    userEmail: 'alex.morgan@smartpark.io',
    userName: 'Alex Morgan'
  },
  {
    id: 'SP10011',
    parkingId: 'loc-3',
    parkingName: 'CyberTech Grand Plaza',
    locationAddress: 'Silicon Boulevard, Tech Zone',
    slot: 'P08',
    date: '18 September 2026',
    time: '02:00 PM – 04:00 PM',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    vehicleNumber: 'HR00XX0000',
    status: 'Cancelled',
    amount: 12.00,
    ratePerHour: 6.00,
    hours: 2,
    createdAt: '2026-09-18T11:00:00.000Z',
    userEmail: 'alex.morgan@smartpark.io',
    userName: 'Alex Morgan'
  },
  {
    id: 'SP10032',
    parkingId: 'loc-1',
    parkingName: 'City Mall Parking',
    locationAddress: 'Main Road, Sector 18',
    slot: 'P04',
    date: '22 September 2026',
    time: '01:00 PM – 03:00 PM',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    vehicleNumber: 'MH02XY9999',
    status: 'Confirmed',
    amount: 10.00,
    ratePerHour: 5.00,
    hours: 2,
    createdAt: '2026-09-22T09:00:00.000Z',
    userEmail: 'rachel.green@sample.com',
    userName: 'Rachel Green'
  }
];

// Current Mock User
export const INITIAL_USER = {
  id: 'usr-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@smartpark.io',
  phone: '+1 (555) 234-5678',
  vehicleNumber: 'HR00XX0000',
  vehicleModel: 'Tesla Model 3 / Blue Sedan',
  role: 'user', // 'user' or 'admin'
  memberSince: 'January 2026',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

// Admin Mock User
export const ADMIN_USER = {
  id: 'adm-1',
  name: 'Sarah Jenkins (Chief Parking Officer)',
  email: 'admin@smartpark.io',
  phone: '+1 (555) 987-6543',
  vehicleNumber: 'ADMIN-01',
  vehicleModel: 'Electric Patrol Fleet',
  role: 'admin',
  memberSince: 'November 2024',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
};

// All Registered Mock Users for Admin Dashboard
export const INITIAL_REGISTERED_USERS = [
  INITIAL_USER,
  ADMIN_USER,
  {
    id: 'usr-2',
    name: 'David Chen',
    email: 'david.chen@sample.com',
    phone: '+1 (555) 345-6789',
    vehicleNumber: 'DL04AB1234',
    vehicleModel: 'Honda Civic',
    role: 'user',
    memberSince: 'March 2026'
  },
  {
    id: 'usr-3',
    name: 'Rachel Green',
    email: 'rachel.green@sample.com',
    phone: '+1 (555) 456-7890',
    vehicleNumber: 'MH02XY9999',
    vehicleModel: 'Hyundai Ioniq 5',
    role: 'user',
    memberSince: 'April 2026'
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    email: 'marcus.v@sample.com',
    phone: '+1 (555) 567-8901',
    vehicleNumber: 'UP16CD5678',
    vehicleModel: 'Toyota RAV4 Hybrid',
    role: 'user',
    memberSince: 'July 2026'
  }
];
