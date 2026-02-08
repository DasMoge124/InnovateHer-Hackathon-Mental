import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseICSFile, jsonToICS } from './utils/icsToJson';
import './ScheduleGenerator.css';

const ScheduleGenerator = () => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    preferences: '',
    burnout_level: 3,
    calendar_events: [],
  });

  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'burnout_level' ? parseFloat(value) : value
    }));
  };

  // Handle calendar file upload
  const handleCalendarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          
          if (file.name.endsWith('.ics')) {
            // Parse ICS file
            const events = parseICSFile(content);
            setFormData(prev => ({
              ...prev,
              calendar_events: events
            }));
          } else if (file.name.endsWith('.json')) {
            // Parse JSON file
            const events = JSON.parse(content);
            setFormData(prev => ({
              ...prev,
              calendar_events: events
            }));
          } else {
            // Try to parse as JSON first, then ICS
            try {
              const events = JSON.parse(content);
              setFormData(prev => ({
                ...prev,
                calendar_events: events
              }));
            } catch {
              const events = parseICSFile(content);
              setFormData(prev => ({
                ...prev,
                calendar_events: events
              }));
            }
          }
        } catch (err) {
          setError('Error parsing calendar file. Please make sure it\'s a valid ICS or JSON file.');
          console.error(err);
        }
      };
      reader.readAsText(file);
    }
  };

  // Generate schedule
  const handleGenerateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSchedule(null);

    try {
      const response = await fetch('http://localhost:5000/api/generate-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate schedule');
      }

      const data = await response.json();
      setSchedule(data.schedule);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download schedule as JSON
  const handleDownloadJSON = () => {
    if (!schedule) return;
    const dataStr = JSON.stringify(schedule, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wellness-schedule.json';
    link.click();
  };

  // Download schedule as ICS (calendar file)
  const handleDownloadICS = () => {
    if (!schedule || !schedule.events) return;

    const icsContent = jsonToICS(schedule.events, 'CalmHer Wellness Schedule');
    const dataBlob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wellness-schedule.ics';
    link.click();
  };

  return (
    <div className="schedule-generator">
      <nav className="navbar">
        <h1 className="logo">CalmHer</h1>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/login" className="nav-link">Login</a>
        </div>
      </nav>

      <div className="generator-container">
        <div className="generator-form">
          <h2>Create Your Wellness Schedule</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleGenerateSchedule}>
            {/* Date Range */}
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Calendar Upload */}
            <div className="form-group">
              <div className="label-with-help">
                <label>Upload Calendar (optional)</label>
                <button
                  type="button"
                  className="help-btn"
                  onClick={() => setShowHelp(!showHelp)}
                  title="How to export from Google Calendar"
                >
                  ?
                </button>
              </div>

              {showHelp && (
                <div className="help-box">
                  <h4>How to Export Google Calendar:</h4>
                  <ol>
                    <li>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">calendar.google.com</a></li>
                    <li>Click ⚙️ <strong>Settings</strong></li>
                    <li>Click on your calendar name (left sidebar)</li>
                    <li>Scroll down and click <strong>"Export calendar"</strong></li>
                    <li>Download the <strong>.ics file</strong></li>
                    <li>Upload it here 👇</li>
                  </ol>
                </div>
              )}

              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".ics,.json"
                  onChange={handleCalendarUpload}
                  id="calendar-file"
                />
                <label htmlFor="calendar-file" className="file-label">
                  📅 Choose ICS or JSON file
                </label>
              </div>
              {formData.calendar_events.length > 0 && (
                <p className="success-text">✓ {formData.calendar_events.length} event(s) loaded</p>
              )}
            </div>

            {/* Burnout Level */}
            <div className="form-group">
              <label>Burnout Level</label>
              <div className="burnout-slider">
                <input
                  type="range"
                  name="burnout_level"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.burnout_level}
                  onChange={handleInputChange}
                  className="slider"
                />
                <div className="burnout-labels">
                  <span>1 - Low</span>
                  <span>2 - Moderate</span>
                  <span>3 - High</span>
                  <span>4 - Critical</span>
                  <span>5 - Extreme</span>
                </div>
                <div className="burnout-value">Current: {formData.burnout_level.toFixed(1)}</div>
              </div>
            </div>

            {/* Preferences */}
            <div className="form-group">
              <label>Your Preferences</label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleInputChange}
                placeholder="e.g., 'I prefer morning sessions. No events after 8pm. I want meditation and journaling. Avoid Mondays if possible.'"
                rows="6"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Generating Schedule...' : 'Generate My Schedule'}
            </button>
          </form>
        </div>

        {/* Schedule Results */}
        {schedule && (
          <div className="schedule-results">
            <h2>Your Wellness Schedule</h2>

            <div className="schedule-summary">
              <h3>Summary</h3>
              <p><strong>Burnout Level:</strong> {schedule.schedule_summary.burnout_level}</p>
              <p><strong>Category:</strong> {schedule.schedule_summary.interpreted_burnout_category}</p>
              <p><strong>Date Range:</strong> {schedule.schedule_summary.date_range.start} to {schedule.schedule_summary.date_range.end}</p>
              <p><strong>Events Created:</strong> {schedule.schedule_summary.total_events_created}</p>
              {schedule.schedule_summary.reason && (
                <p><strong>Note:</strong> {schedule.schedule_summary.reason}</p>
              )}
            </div>

            <div className="schedule-events">
              <h3>Events</h3>
              {schedule.events && schedule.events.length > 0 ? (
                <div className="events-list">
                  {schedule.events.map((event, index) => (
                    <div key={index} className="event-card">
                      <div className="event-header">
                        <h4>{event.title}</h4>
                        <span className="event-type">{event.type}</span>
                      </div>
                      <p className="event-time">
                        {event.start} to {event.end}
                      </p>
                      <p className="event-notes">{event.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No events generated. Check your preferences and try again.</p>
              )}
            </div>

            <div className="download-buttons">
              <button onClick={handleDownloadJSON} className="download-btn">
                📥 Download as JSON
              </button>
              <button onClick={handleDownloadICS} className="download-btn ics">
                📅 Download as Calendar (.ics)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleGenerator;
