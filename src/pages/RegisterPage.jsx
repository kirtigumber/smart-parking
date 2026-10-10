import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Car, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
    if (!formData.vehicleNumber.trim()) errs.vehicleNumber = 'Vehicle license plate number is required.';
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setAuthError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Create Driver Account
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Register once to unlock fast parking reservations, instant passes, and barrier gate entry.
            </p>
          </div>

          {authError && <ErrorMessage message={authError} />}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name"
              name="fullName"
              placeholder="e.g. Alex Morgan"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon={User}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={Mail}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                icon={Phone}
                required
              />
            </div>

            <Input
              label="Vehicle License Number"
              name="vehicleNumber"
              placeholder="e.g. HR00XX0000 / DL04AB1234"
              value={formData.vehicleNumber}
              onChange={handleChange}
              error={errors.vehicleNumber}
              helperText="Used for automated gate recognition and parking permit verification."
              icon={Car}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
                required
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Button
                type="submit"
                variant="primary"
                style={{ width: '100%' }}
                disabled={isLoading}
                icon={UserPlus}
              >
                {isLoading ? 'Creating Account...' : 'Register Account'}
              </Button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
