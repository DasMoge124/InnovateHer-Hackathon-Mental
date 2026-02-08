import React from 'react';
import './CalmHer.css';

const CalmHer = () => {
  return (
    <div className="container">
      <div className="content-section">

        <div className="hero-content">
          <h2 className="title">CalmHer</h2>
          <h3 className="hero-title">
            Find Your<br />Inner Peace
          </h3>
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