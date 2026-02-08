import React, { useState } from 'react';
import './TherapistFinder.css';

const TherapistFinder = () => {
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    insuranceAccepted: '',
    sessionType: '',
    gender: '',
    language: ''
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Sample therapist data (in real app, this would come from a database)
  const therapists = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      credentials: "PhD, Licensed Clinical Psychologist",
      specialty: "Anxiety & Depression",
      location: "West Lafayette, IN",
      insurance: ["Blue Cross", "Aetna", "UnitedHealth"],
      sessionType: ["In-Person", "Virtual"],
      gender: "Female",
      languages: ["English", "Spanish"],
      yearsExperience: 12,
      rating: 4.9,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      credentials: "PsyD, Licensed Marriage & Family Therapist",
      specialty: "Relationship Counseling",
      location: "Indianapolis, IN",
      insurance: ["Cigna", "Humana"],
      sessionType: ["Virtual"],
      gender: "Male",
      languages: ["English", "Mandarin"],
      yearsExperience: 8,
      rating: 4.8,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Dr. Amanda Rodriguez",
      credentials: "LCSW, Licensed Clinical Social Worker",
      specialty: "Trauma & PTSD",
      location: "Chicago, IL",
      insurance: ["Medicare", "Medicaid", "Blue Cross"],
      sessionType: ["In-Person", "Virtual"],
      gender: "Female",
      languages: ["English", "Spanish", "Portuguese"],
      yearsExperience: 15,
      rating: 5.0,
      image: "https://via.placeholder.com/150"
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      insuranceAccepted: '',
      sessionType: '',
      gender: '',
      language: ''
    });
  };

  const filteredTherapists = therapists.filter(therapist => {
    if (filters.specialty && !therapist.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) {
      return false;
    }
    if (filters.location && !therapist.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.insuranceAccepted && !therapist.insurance.some(ins => 
      ins.toLowerCase().includes(filters.insuranceAccepted.toLowerCase()))) {
      return false;
    }
    if (filters.sessionType && !therapist.sessionType.includes(filters.sessionType)) {
      return false;
    }
    if (filters.gender && therapist.gender !== filters.gender) {
      return false;
    }
    if (filters.language && !therapist.languages.some(lang => 
      lang.toLowerCase().includes(filters.language.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <div className="therapist-finder-container">
      <div className="therapist-finder-header">
        <h1 className="finder-title">Find Your Therapist</h1>
        <p className="finder-subtitle">Connect with licensed mental health professionals</p>
        <button 
          className="register-therapist-button"
          onClick={() => setShowRegisterModal(true)}
        >
          Register as a Therapist
        </button>
      </div>

      <div className="finder-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h2 className="filters-title">Filters</h2>
            <button className="clear-filters" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Specialty</label>
            <select 
              name="specialty" 
              value={filters.specialty}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Specialties</option>
              <option value="Anxiety">Anxiety & Depression</option>
              <option value="Relationship">Relationship Counseling</option>
              <option value="Trauma">Trauma & PTSD</option>
              <option value="Family">Family Therapy</option>
              <option value="Addiction">Addiction & Substance Abuse</option>
              <option value="Eating">Eating Disorders</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Location</label>
            <input 
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City, State or ZIP"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Insurance Accepted</label>
            <input 
              type="text"
              name="insuranceAccepted"
              value={filters.insuranceAccepted}
              onChange={handleFilterChange}
              placeholder="Insurance provider"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Session Type</label>
            <select 
              name="sessionType" 
              value={filters.sessionType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Gender</label>
            <select 
              name="gender" 
              value={filters.gender}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Any Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Language</label>
            <input 
              type="text"
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              placeholder="Language spoken"
              className="filter-input"
            />
          </div>
        </div>

        {/* Therapist Results */}
        <div className="therapist-results">
          <div className="results-header">
            <h2 className="results-count">
              {filteredTherapists.length} Therapist{filteredTherapists.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          <div className="therapist-grid">
            {filteredTherapists.map(therapist => (
              <div key={therapist.id} className="therapist-card">
                <div className="therapist-image-container">
                  <img 
                    src={therapist.image} 
                    alt={therapist.name}
                    className="therapist-image"
                  />
                  <div className="therapist-rating">
                    ⭐ {therapist.rating}
                  </div>
                </div>

                <div className="therapist-info">
                  <h3 className="therapist-name">{therapist.name}</h3>
                  <p className="therapist-credentials">{therapist.credentials}</p>
                  
                  <div className="therapist-detail">
                    <span className="detail-icon">🎯</span>
                    <span className="detail-text">{therapist.specialty}</span>
                  </div>

                  <div className="therapist-detail">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{therapist.location}</span>
                  </div>

                  <div className="therapist-detail">
                    <span className="detail-icon">💼</span>
                    <span className="detail-text">{therapist.yearsExperience} years experience</span>
                  </div>

                  <div className="therapist-detail">
                    <span className="detail-icon">💬</span>
                    <span className="detail-text">{therapist.languages.join(', ')}</span>
                  </div>

                  <div className="therapist-badges">
                    {therapist.sessionType.map(type => (
                      <span key={type} className="badge">{type}</span>
                    ))}
                  </div>

                  <div className="insurance-info">
                    <p className="insurance-label">Insurance:</p>
                    <p className="insurance-list">{therapist.insurance.join(', ')}</p>
                  </div>

                  <div className="therapist-actions">
                    <button className="contact-button">Contact</button>
                    <button className="profile-button">View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTherapists.length === 0 && (
            <div className="no-results">
              <p className="no-results-text">No therapists found matching your criteria.</p>
              <p className="no-results-subtext">Try adjusting your filters or <button onClick={clearFilters} className="link-button">clear all filters</button>.</p>
            </div>
          )}
        </div>
      </div>

      {/* Register Modal Overlay */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRegisterModal(false)}>×</button>
            <h2 className="modal-title">Register as a Therapist</h2>
            <p className="modal-text">
              To ensure the highest quality care for our users, we require all therapists to complete a verification process.
            </p>
            <a href="/therapist-registration" className="modal-link-button">
              Start Registration Process
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistFinder;