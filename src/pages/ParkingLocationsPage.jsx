import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import ParkingCard from '../components/parking/ParkingCard';
import Input from '../components/common/Input';
import { Search, Filter, MapPin, RefreshCw, Car } from 'lucide-react';
import Button from '../components/common/Button';

const ParkingLocationsPage = () => {
  const { locations } = useParking();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['All', 'Shopping Mall', 'Public Transit', 'Business Park', 'Hospital / Healthcare', 'Airport Parking', 'City Center'];

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            loc.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'available') return b.availableSlots - a.availableSlots;
      if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
      return 0; // recommended
    });
  }, [locations, searchQuery, selectedCategory, sortBy]);

  // Aggregate totals
  const totalAvailable = locations.reduce((sum, loc) => sum + loc.availableSlots, 0);
  const totalOccupied = locations.reduce((sum, loc) => sum + loc.occupiedSlots, 0);

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Page Header */}
        <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <Car size={16} />
              <span>Smart City Network</span>
            </div>
            <h1 className="page-title">Parking Locations</h1>
            <p className="page-subtitle">
              Browse connected garages and surface lots. Select any facility to inspect real-time slot occupancy grids.
            </p>
          </div>

          {/* Aggregate summary pill */}
          <div style={{
            background: 'rgba(15, 24, 44, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>City Available</span>
              <strong style={{ fontSize: '1.2rem', color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>
                {totalAvailable} Slots
              </strong>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>City Occupied</span>
              <strong style={{ fontSize: '1.2rem', color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
                {totalOccupied} Slots
              </strong>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by facility name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
                style={{ cursor: 'pointer' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#0f182c', color: '#fff' }}>
                    {cat === 'All' ? 'All Facility Types' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="recommended" style={{ background: '#0f182c', color: '#fff' }}>Sort: Recommended</option>
                <option value="available" style={{ background: '#0f182c', color: '#fff' }}>Sort: Most Available Slots</option>
                <option value="price-low" style={{ background: '#0f182c', color: '#fff' }}>Sort: Price (Low to High)</option>
                <option value="price-high" style={{ background: '#0f182c', color: '#fff' }}>Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: selectedCategory === cat ? '#3b82f6' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === cat ? '#fff' : '#94a3b8',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Parking Location Cards Grid */}
        {filteredLocations.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem'
          }}>
            {filteredLocations.map(location => (
              <ParkingCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <MapPin size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              No parking locations matched your search
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try broadening your search term or selecting "All Facility Types".
            </p>
            <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParkingLocationsPage;
