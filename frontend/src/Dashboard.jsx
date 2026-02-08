import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {
    name: 'User',
    email: 'user@example.com',
    createdAt: new Date().toISOString()
  });

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      title: 'Weekly Wellness',
      date: '2026-02-07',
      events: 5,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Recovery Plan',
      date: '2026-01-28',
      events: 8,
      status: 'Completed'
    }
  ]);

  const [burnoutHistory, setBurnoutHistory] = useState([
    { date: '2026-02-07', level: 3.5, category: 'High' },
    { date: '2026-01-31', level: 3.8, category: 'High' },
    { date: '2026-01-24', level: 4.1, category: 'Critical' }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <Link to="/" className="logo">CalmHer</Link>
        <div className="nav-links">
          <Link to="/schedule" className="nav-link">Generate Schedule</Link>
          <Link to="/assessment" className="nav-link">Reassess</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="user-card">
            <div className="user-avatar">👤</div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>

          <nav className="sidebar-nav">
            <a href="#overview" className="nav-item active">📊 Overview</a>
            <a href="#schedules" className="nav-item">📅 Schedules</a>
            <a href="#assessments" className="nav-item">📝 Assessments</a>
            <a href="#progress" className="nav-item">📈 Progress</a>
            <a href="#settings" className="nav-item">⚙️ Settings</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h1>Welcome back, {user.name}! 👋</h1>
            <p>Here's your wellness journey at a glance</p>
          </section>

          {/* Stats Cards */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Active Schedules</h3>
                <p className="stat-number">{schedules.filter(s => s.status === 'Active').length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Total Events</h3>
                <p className="stat-number">{schedules.reduce((sum, s) => sum + s.events, 0)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Completions</h3>
                <p className="stat-number">{schedules.filter(s => s.status === 'Completed').length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Latest Burnout</h3>
                <p className="stat-number">{burnoutHistory[0]?.level || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Recent Schedules */}
          <section className="section" id="schedules">
            <div className="section-header">
              <h2>Recent Schedules</h2>
              <Link to="/schedule" className="section-action">+ Create New</Link>
            </div>

            <div className="schedules-list">
              {schedules.length > 0 ? (
                schedules.map(schedule => (
                  <div key={schedule.id} className="schedule-item">
                    <div className="schedule-info">
                      <h3>{schedule.title}</h3>
                      <p className="date">📅 {new Date(schedule.date).toLocaleDateString()}</p>
                      <span className="event-count">{schedule.events} events</span>
                    </div>
                    <div className={`schedule-status ${schedule.status.toLowerCase()}`}>
                      {schedule.status}
                    </div>
                    <button className="view-btn">View</button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No schedules yet. Create your first wellness schedule!</p>
                  <Link to="/schedule" className="btn-create">Create Schedule</Link>
                </div>
              )}
            </div>
          </section>

          {/* Burnout History */}
          <section className="section" id="assessments">
            <div className="section-header">
              <h2>Assessment History</h2>
              <Link to="/assessment" className="section-action">+ Take Assessment</Link>
            </div>

            <div className="assessment-history">
              {burnoutHistory.length > 0 ? (
                burnoutHistory.map((assessment, index) => (
                  <div key={index} className="assessment-item">
                    <div className="assessment-date">
                      {new Date(assessment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="assessment-bar">
                      <div
                        className="assessment-fill"
                        style={{
                          width: `${(assessment.level / 5) * 100}%`,
                          backgroundColor:
                            assessment.level <= 1.5 ? '#4caf50' :
                            assessment.level <= 2.5 ? '#ffc107' :
                            assessment.level <= 3.5 ? '#ff9800' :
                            '#f44336'
                        }}
                      />
                    </div>
                    <div className="assessment-level">
                      <span className="level-number">{assessment.level.toFixed(1)}</span>
                      <span className="level-category">{assessment.category}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No assessments yet. Start by taking our wellness assessment!</p>
                  <Link to="/assessment" className="btn-create">Take Assessment</Link>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-actions">
              <Link to="/schedule" className="action-card">
                <div className="action-icon">📅</div>
                <div className="action-text">
                  <h4>Generate Schedule</h4>
                  <p>Create a personalized wellness schedule</p>
                </div>
              </Link>

              <Link to="/assessment" className="action-card">
                <div className="action-icon">🎯</div>
                <div className="action-text">
                  <h4>Reassess Your Status</h4>
                  <p>Check your current burnout level</p>
                </div>
              </Link>

              <Link to="/therapist-finder" className="action-card">
                <div className="action-icon">👨‍⚕️</div>
                <div className="action-text">
                  <h4>Find a Therapist</h4>
                  <p>Connect with mental health professionals</p>
                </div>
              </Link>

              <a href="#resources" className="action-card">
                <div className="action-icon">📚</div>
                <div className="action-text">
                  <h4>Resources</h4>
                  <p>Browse wellness articles and guides</p>
                </div>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
