import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LoginForm.css'; // Reusing form styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post("https://voyago-trvel-2.onrender.com/api/forgot-password", { email });
      setMessage(response.data.message || "Password reset link sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Error sending reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>
          <p style={{ textAlign: "center", marginBottom: "20px", color: "#ddd" }}>
            Enter your registered email address and we will send you a secure link to reset your password.
          </p>
          
          {error && <div className="error-message">⚠️ {error}</div>}
          {message && <div className="success-message">✅ {message}</div>}

          <div className="input-box">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="register-link" style={{ marginTop: "20px" }}>
             <p>Remember your password? <Link to="/">Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
