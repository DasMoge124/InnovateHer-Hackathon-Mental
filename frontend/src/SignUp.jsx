import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // TODO: Replace with actual backend registration
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString()
      }));

      navigate('/assessment');
    } catch (err) {
      setError('Sign up failed. Please try again.');
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
          <Link to="/login" className="nav-link">Sign In</Link>
        </div>
      </nav>

      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join CalmHer and start your wellness journey</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign in here</Link>
              </p>
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
              <h3>Begin Your Journey</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
