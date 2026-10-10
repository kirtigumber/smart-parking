import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Car, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '540px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Car size={40} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          Parking Zone Not Found
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem' }}>
          The road you took led to a cul-de-sac. Let's get you back to the main parking route.
        </p>
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Smart Park Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
