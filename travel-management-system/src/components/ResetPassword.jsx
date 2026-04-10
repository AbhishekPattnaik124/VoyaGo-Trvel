import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If we passed the email via navigation state, auto-fill it
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        "https://voyago-trvel-2.onrender.com/api/reset-password",
        { email, otp, password }
      );
      setMessage(response.data.message || "Password successfully reset!");
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="wrapper">
        <form onSubmit={handleReset}>
          <h1>Reset Password</h1>
          <p style={{ textAlign: "center", marginBottom: "20px", color: "#ddd" }}>
            Check your email for the 6-digit verification code.
          </p>
          
          {error && <div className="error-message">⚠️ {error}</div>}
          {message && <div className="success-message">🎉 {message}</div>}

          <div className="input-box">
            <input 
              type="text" 
              placeholder="6-Digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
              maxLength={6}
            />
          </div>

          <div className="input-box">
            <input 
              type="password" 
              placeholder="New Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
          
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
          
          <div className="register-link" style={{ marginTop: "20px" }}>
             <p><Link to="/">Back to Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
