import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with actual backend authentication
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      // Simulate login
      localStorage.setItem('user', JSON.stringify({
        email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      }));

      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <nav className="navbar">
        <Link to="/" className="logo">CalmHer</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </nav>

      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your CalmHer account</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">Sign up here</Link>
              </p>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>
          </div>

          <div className="auth-image">
            <div className="image-placeholder">
              <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="100" r="40" fill="#667eea" opacity="0.3"/>
                <path d="M100 200 Q150 150 200 200" stroke="#667eea" strokeWidth="3" opacity="0.3"/>
                <circle cx="80" cy="120" r="20" fill="#764ba2" opacity="0.2"/>
                <circle cx="220" cy="140" r="25" fill="#764ba2" opacity="0.2"/>
              </svg>
              <h3>Find Your Peace</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
