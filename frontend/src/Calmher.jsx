import React from 'react';
import './Calmher.css';

const CalmHer = () => {
  return (
    <div className="container">
      <div className="content-section">
        <nav className="navbar">
          <h1 className="logo">CalmHer</h1>
          <div className="nav-links">
            <a href="/login" className="nav-link">Login</a>
            <a href="/signup" className="nav-link">Sign Up</a>
            <a href="/assessment" className="nav-link">Assessment</a>
            <a href="/therapist-finder" className="nav-link">Therapist-Finder</a>
          </div>
        </nav>

        <div className="hero-content">
          <h2 className="hero-title">
            Find Your<br />Inner Peace
          </h2>
          <p className="date">February 7, 2026</p>
        </div>
      </div>

      <div className="image-section">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" 
          alt="Peaceful beach sunset with palm tree"
          className="hero-image"
        />
      </div>
    </div>
  );
};

export default CalmHer;