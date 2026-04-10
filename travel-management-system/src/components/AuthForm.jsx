import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true); // true for Register, false for Login
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://voyago-trvel-1.onrender.com'}/api`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setError('');   // Clear previous errors

    try {
      let response;
      if (isRegister) {
        response = await axios.post(`${API_BASE_URL}/register`, {
          username,
          email,
          password,
        });
        setMessage(response.data.message || 'Registration successful!');
      } else {
        // --- CHANGES FOR LOGIN ---
        response = await axios.post(`${API_BASE_URL}/login`, {
          username, // Send username instead of email for login
          password,
        });
        // For login, you'd typically store the token (e.g., in localStorage)
        // localStorage.setItem('token', response.data.token);
        setMessage(response.data.message || 'Login successful!');
        // You might want to redirect the user or update application state here
        console.log('Login Token:', response.data.token);
      }

      // Clear form fields on success
      setUsername('');
      setEmail('');
      setPassword('');

    } catch (err) {
      console.error('Authentication error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display backend error message
      } else {
        setError('An unexpected error occurred. Please try again.');
        if (err.message && err.message.includes('Unexpected token <')) {
            setError("Server did not return valid JSON. Backend might be down or API URL is wrong. Check console for details.");
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isRegister ? 'Register' : 'Login'}</h2>

      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Username field - always visible now for both Register and Login */}
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {/* Email field - ONLY visible for Register */}
        {isRegister && (
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        )}

        {/* Password field - always visible */}
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p style={styles.toggleText}>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
        <span onClick={() => setIsRegister(!isRegister)} style={styles.toggleLink}>
          {isRegister ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  );
};

// Basic inline styles for demonstration (unchanged)
const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
      backgroundColor: '#282c34',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    },
    title: {
      color: '#61dafb',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    inputGroup: {
      textAlign: 'left',
    },
    label: {
      marginBottom: '5px',
      display: 'block',
      color: '#aaa',
    },
    input: {
      width: 'calc(100% - 20px)',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #444',
      backgroundColor: '#3a3f47',
      color: '#eee',
      fontSize: '1em',
    },
    button: {
      padding: '12px 20px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#61dafb',
      color: '#282c34',
      fontSize: '1.1em',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#4fa3d1',
    },
    message: {
      color: '#4CAF50', // Green for success
      marginBottom: '15px',
      fontSize: '0.9em',
    },
    error: {
      color: '#f44336', // Red for error
      marginBottom: '15px',
      fontSize: '0.9em',
    },
    toggleText: {
        marginTop: '20px',
        fontSize: '0.9em',
    },
    toggleLink: {
        color: '#61dafb',
        cursor: 'pointer',
        textDecoration: 'underline',
    }
  };


export default AuthForm;