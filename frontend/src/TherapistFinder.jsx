import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TherapistFinder.css';

const TherapistFinder = () => {
  const [filters, setFilters] = useState({
    specialty: 'all',
    experience: 'all',
    availability: 'all',
    insurance: 'all',
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Mock therapist data
  const therapists = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      specialty: "Burnout & Stress Management",
      experience: 12,
      rating: 4.9,
      reviews: 156,
      availability: "Online",
      insurance: "Multiple",
      bio: "Specializes in helping professionals overcome burnout with evidence-based cognitive behavioral therapy.",
      image: "👩‍⚕️"
    },
    {
      id: 2,
      name: "Dr. James Chen",
      specialty: "Anxiety & Depression",
      experience: 8,
      rating: 4.8,
      reviews: 98,
      availability: "In-Person & Online",
      insurance: "Blue Shield, Aetna",
      bio: "Compassionate therapist focusing on mindfulness-based approaches and trauma-informed care.",
      image: "👨‍⚕️"
    },
    {
      id: 3,
      name: "Lisa Rodriguez, LCSW",
      specialty: "Work-Life Balance",
      experience: 10,
      rating: 4.9,
      reviews: 142,
      availability: "Online",
      insurance: "Multiple",
      bio: "Expert in helping individuals create sustainable work-life balance and set healthy boundaries.",
      image: "👩‍⚕️"
    },
    {
      id: 4,
      name: "Dr. Michael Park",
      specialty: "Burnout & Stress Management",
      experience: 15,
      rating: 4.7,
      reviews: 201,
      availability: "In-Person",
      insurance: "Aetna, UnitedHealth",
      bio: "Experienced psychologist offering personalized treatment plans for occupational stress.",
      image: "👨‍⚕️"
    },
    {
      id: 5,
      name: "Emma Thompson, MFT",
      specialty: "Work Relationships & Teams",
      experience: 7,
      rating: 4.8,
      reviews: 87,
      availability: "Online",
      insurance: "Kaiser Permanente, Blue Shield",
      bio: "Marriage and family therapist specializing in workplace relationships and team dynamics.",
      image: "👩‍⚕️"
    },
    {
      id: 6,
      name: "Dr. Robert Johnson",
      specialty: "Anxiety & Depression",
      experience: 11,
      rating: 4.9,
      reviews: 175,
      availability: "In-Person & Online",
      insurance: "Multiple",
      bio: "Board-certified psychiatrist with expertise in mood disorders and anxiety management.",
      image: "👨‍⚕️"
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = filters.specialty === 'all' || therapist.specialty.includes(filters.specialty);
    const matchesExperience = filters.experience === 'all' || 
                             (filters.experience === '5+' && therapist.experience >= 5) ||
                             (filters.experience === '10+' && therapist.experience >= 10);
    const matchesAvailability = filters.availability === 'all' || therapist.availability.includes(filters.availability);

    return matchesSearch && matchesSpecialty && matchesExperience && matchesAvailability;
  });

  return (
    <div className="therapist-finder">
      <nav className="navbar">
        <Link to="/" className="logo">CalmHer</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/assessment" className="nav-link">Assessment</Link>
          <Link to="/schedule" className="nav-link">Schedule</Link>
        </div>
      </nav>

      <div className="finder-container">
        <div className="finder-header">
          <h1>Find Your Perfect Therapist</h1>
          <p>Connect with licensed mental health professionals specializing in wellness</p>
        </div>

        <div className="finder-content">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h2>Filters</h2>

            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Specialty</label>
              <select name="specialty" value={filters.specialty} onChange={handleFilterChange}>
                <option value="all">All Specialties</option>
                <option value="Burnout">Burnout Management</option>
                <option value="Anxiety">Anxiety & Depression</option>
                <option value="Work-Life">Work-Life Balance</option>
                <option value="Relationships">Work Relationships</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Experience</label>
              <select name="experience" value={filters.experience} onChange={handleFilterChange}>
                <option value="all">Any Experience</option>
                <option value="5+">5+ Years</option>
                <option value="10+">10+ Years</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Availability</label>
              <select name="availability" value={filters.availability} onChange={handleFilterChange}>
                <option value="all">Any Format</option>
                <option value="Online">Online Only</option>
                <option value="In-Person">In-Person Only</option>
              </select>
            </div>

            <button className="reset-btn" onClick={() => {
              setFilters({ specialty: 'all', experience: 'all', availability: 'all', insurance: 'all' });
              setSearchTerm('');
            }}>
              Reset Filters
            </button>
          </aside>

          {/* Therapist List */}
          <main className="therapists-grid">
            <div className="results-header">
              <h2>Found {filteredTherapists.length} Therapist{filteredTherapists.length !== 1 ? 's' : ''}</h2>
            </div>

            {filteredTherapists.length > 0 ? (
              <div className="therapists-list">
                {filteredTherapists.map((therapist) => (
                  <div key={therapist.id} className="therapist-card">
                    <div className="therapist-header">
                      <div className="therapist-avatar">{therapist.image}</div>
                      <div className="therapist-info">
                        <h3>{therapist.name}</h3>
                        <p className="specialty">{therapist.specialty}</p>
                        <div className="rating">
                          <span className="stars">{'⭐'.repeat(Math.round(therapist.rating))}</span>
                          <span className="rating-value">{therapist.rating}</span>
                          <span className="reviews">({therapist.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <p className="bio">{therapist.bio}</p>

                    <div className="therapist-details">
                      <div className="detail">
                        <strong>Experience:</strong> {therapist.experience} years
                      </div>
                      <div className="detail">
                        <strong>Format:</strong> {therapist.availability}
                      </div>
                      <div className="detail">
                        <strong>Insurance:</strong> {therapist.insurance}
                      </div>
                    </div>

                    <button className="contact-btn">Schedule Consultation</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No therapists found matching your criteria. Try adjusting your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TherapistFinder;
