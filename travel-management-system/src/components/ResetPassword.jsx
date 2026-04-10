import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        `https://voyago-trvel-2.onrender.com/api/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message || "Password successfully reset!");
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Error resetting password. The link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="wrapper">
        <form onSubmit={handleReset}>
          <h1>Reset Password</h1>
          
          {error && <div className="error-message">⚠️ {error}</div>}
          {message && <div className="success-message">🎉 {message}</div>}

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
