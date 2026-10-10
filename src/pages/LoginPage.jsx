import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const result = await login(cleanEmail, password);
    setIsLoading(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setAuthError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  // Quick Demo account auto-fillers
  const fillDemoUser = () => {
    setEmail('alex.morgan@smartpark.io');
    setPassword('password123');
    setErrors({});
    setAuthError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@smartpark.io');
    setPassword('admin123');
    setErrors({});
    setAuthError('');
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Sign in to manage your parking bookings and smart passes.
            </p>
          </div>

          {authError && <ErrorMessage message={authError} />}

          {/* Demo account quick fill pills */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '10px',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600, marginBottom: '0.5rem' }}>
              ⚡ QUICK FILL DEMO CREDENTIALS:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={fillDemoUser}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                title="alex.morgan@smartpark.io / password123"
              >
                <User size={13} /> Driver (alex.morgan@smartpark.io)
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                title="admin@smartpark.io / admin123"
              >
                <ShieldCheck size={13} /> Admin (admin@smartpark.io)
              </button>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>
              Passwords: <code>password123</code> (driver) &bull; <code>admin123</code> (admin)
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              error={errors.password}
              icon={Lock}
              required
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#3b82f6' }}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Demo notice: For this prototype, use the quick demo account buttons above.')}
                style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%' }}
              disabled={isLoading}
              icon={LogIn}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
