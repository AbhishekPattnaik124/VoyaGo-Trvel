import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
import { FaUserAlt, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';
import Captcha from './Captcha';

const API_BASE = import.meta.env.VITE_API_URL || 'https://voyago-trvel-2.onrender.com';

function Register() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      setError('Please solve the security check to continue.');
      return;
    }
    if (userDetails.password !== userDetails.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (userDetails.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userDetails.username,
          email: userDetails.email,
          password: userDetails.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setSuccess('🎉 Account created! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Password strength indicator
  const pwStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Too short', color: '#ff6b81' };
    if (pw.length < 8) return { label: 'Weak', color: '#fdcb6e' };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: 'Strong', color: '#00b894' };
    return { label: 'Fair', color: '#74b9ff' };
  };
  const strength = pwStrength(userDetails.password);

  return (
    <div className="auth-container">
      <div className="wrapper">

        {/* VoyaGo Brand Bar */}
        <div className="auth-brand-bar">
          <div className="auth-brand-icon">V</div>
          <span className="auth-brand-name">VoyaGo™</span>
        </div>

        <form onSubmit={handleRegisterSubmit}>
          <h1>Join VoyaGo</h1>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={userDetails.username}
              onChange={handleInputChange}
              autoComplete="username"
              required
              minLength={3}
              maxLength={30}
            />
            <FaUserAlt className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={userDetails.email}
              onChange={handleInputChange}
              autoComplete="email"
              required
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Create a password (min. 6 chars)"
              value={userDetails.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
              minLength={6}
            />
            <FaLock className="icon" />
          </div>

          {/* Password strength bar */}
          {userDetails.password && strength && (
            <div style={{ marginTop: '-0.75rem', marginBottom: '0.75rem', padding: '0 0.2rem' }}>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: strength.label === 'Too short' ? '20%' : strength.label === 'Weak' ? '40%' : strength.label === 'Fair' ? '65%' : '100%',
                  background: strength.color,
                  borderRadius: '100px',
                  transition: 'all 0.4s ease',
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: strength.color, marginTop: '4px', fontWeight: 600 }}>
                {strength.label}
              </div>
            </div>
          )}

          <div className="input-box">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={userDetails.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
            />
            {userDetails.confirmPassword && userDetails.password === userDetails.confirmPassword
              ? <FaCheck className="icon" style={{ color: '#00b894' }} />
              : <FaLock className="icon" />
            }
          </div>

          <Captcha onValidate={setIsCaptchaValid} />

          <button type="submit" disabled={loading} style={{ marginTop: '1.25rem' }}>
            {loading ? '⏳ Creating your account...' : '🚀 Create My VoyaGo Account'}
          </button>

          <div className="register-link">
            <p>Already a VoyaGo traveler? <Link to="/">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
