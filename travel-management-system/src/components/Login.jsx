import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
import { FaUserAlt, FaLock, FaShieldAlt } from 'react-icons/fa';
import Captcha from './Captcha';

const API_BASE = import.meta.env.VITE_API_URL || 'https://voyago-trvel-2.onrender.com';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginType, setLoginType] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      setError('Please solve the security check to continue.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Master admin bypass (development / owner access)
      if (credentials.username === 'abhishek' && credentials.password === 'abhi') {
        localStorage.setItem('authToken', 'admin-master-token');
        localStorage.setItem('userEmail', 'abhishek@voyago.tech');
        localStorage.setItem('userName', 'abhishek');
        localStorage.setItem('userId', 'master-001');
        localStorage.setItem('role', 'admin');
        navigate(loginType === 'admin' ? '/admin' : '/home');
        return;
      }

      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }

      if (loginType === 'admin' && data.user.email !== 'admin@voyago.tech' && data.user.username !== 'abhishek') {
        throw new Error('Access Denied: You do not have administrative privileges.');
      }

      const role = (data.user.email === 'admin@voyago.tech' || data.user.username === 'abhishek') ? 'admin' : 'user';

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.username);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', role);

      navigate(loginType === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="wrapper">

        {/* VoyaGo Brand Bar */}
        <div className="auth-brand-bar">
          <div className="auth-brand-icon">V</div>
          <span className="auth-brand-name">VoyaGo™</span>
        </div>

        {/* User / Admin Toggle */}
        <div className="auth-type-toggle">
          <button
            type="button"
            className={loginType === 'user' ? 'active' : ''}
            onClick={() => { setLoginType('user'); setError(''); }}
          >
            ✈️ Traveler
          </button>
          <button
            type="button"
            className={loginType === 'admin' ? 'active' : ''}
            onClick={() => { setLoginType('admin'); setError(''); }}
          >
            <FaShieldAlt style={{ marginRight: '6px', fontSize: '0.8rem' }} />
            Admin Portal
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>{loginType === 'admin' ? 'Admin Gateway' : 'Welcome Back'}</h1>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={credentials.username}
              onChange={handleInputChange}
              autoComplete="username"
              required
            />
            <FaUserAlt className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Keep me signed in
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <Captcha onValidate={setIsCaptchaValid} />

          <button type="submit" disabled={loading} style={{ marginTop: '1.25rem' }}>
            {loading ? '🔒 Authenticating...' : loginType === 'admin' ? '🔐 Access Admin Panel' : '✈️ Sign In to VoyaGo'}
          </button>

          <div className="register-link">
            <p>New explorer? <Link to="/register">Create your VoyaGo account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
