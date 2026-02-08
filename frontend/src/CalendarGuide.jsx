import React from 'react';
import { Link } from 'react-router-dom';
import './CalendarGuide.css';

const CalendarGuide = () => {
  return (
    <div className="calendar-guide">
      <nav className="navbar">
        <Link to="/" className="logo">CalmHer</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/schedule" className="nav-link">Schedule Generator</Link>
        </div>
      </nav>

      <div className="guide-container">
        <div className="guide-content">
          <h1>📅 How to Upload Your Google Calendar</h1>
          <p className="guide-intro">
            Follow these steps to export your Google Calendar and upload it to CalmHer
          </p>

          {/* Step-by-step guide */}
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Open Google Calendar</h3>
                <p>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">calendar.google.com</a> and sign in with your Google account.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Open Settings</h3>
                <p>Click the <strong>Settings icon ⚙️</strong> in the top right corner, then select <strong>"Settings"</strong> from the dropdown menu.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Select Your Calendar</h3>
                <p>In the left sidebar under "Settings for my calendars", find and click on the calendar you want to export (usually "Calendar" or your calendar name).</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Find Export Option</h3>
                <p>Scroll down the page until you find the <strong>"Export calendar"</strong> option. Click that button.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Download the File</h3>
                <p>A <strong>.ics file</strong> (iCalendar format) will automatically download to your computer. The file name will be something like <code>calendar.ics</code> or <code>YourCalendarName.ics</code>.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">6</div>
              <div className="step-content">
                <h3>Upload to CalmHer</h3>
                <p>
                  Go to the <Link to="/schedule">Schedule Generator</Link>, find the <strong>"Upload Calendar"</strong> section, and click <strong>"📅 Choose ICS or JSON file"</strong>. Select the .ics file you just downloaded.
                </p>
              </div>
            </div>
          </div>

          {/* Video alternative */}
          <div className="video-section">
            <h2>📹 Watch Video Tutorial</h2>
            <p>
              After exporting, your calendar events will be loaded and CalmHer will schedule your wellness activities around your existing meetings and commitments.
            </p>
          </div>

          {/* File format info */}
          <div className="info-section">
            <h2>📄 File Formats Accepted</h2>
            <div className="format-cards">
              <div className="format-card">
                <h3>ICS Format (Recommended)</h3>
                <p>The standard calendar file format (.ics)</p>
                <ul>
                  <li>✓ Direct export from Google Calendar</li>
                  <li>✓ Compatible with most calendars</li>
                  <li>✓ Can be imported into Google Calendar</li>
                </ul>
              </div>

              <div className="format-card">
                <h3>JSON Format</h3>
                <p>For advanced users or API exports</p>
                <ul>
                  <li>✓ Manual event creation</li>
                  <li>✓ Custom format</li>
                  <li>✓ Easier to edit</li>
                </ul>
              </div>
            </div>

            <h3>JSON Format Example:</h3>
            <pre className="code-block">{`[
  {
    "title": "Team Meeting",
    "start": "2026-02-09T10:00",
    "end": "2026-02-09T11:00"
  },
  {
    "title": "Lunch Break",
    "start": "2026-02-09T12:00",
    "end": "2026-02-09T13:00"
  }
]`}</pre>
          </div>

          {/* Troubleshooting */}
          <div className="troubleshooting">
            <h2>❓ Troubleshooting</h2>

            <div className="faq-item">
              <h4>❌ I don't see the "Export calendar" option</h4>
              <p>
                Make sure you're in Settings, and you're looking at "Settings for my calendars" in the left sidebar. It should appear when you click on a specific calendar name.
              </p>
            </div>

            <div className="faq-item">
              <h4>❌ The file didn't upload properly</h4>
              <p>
                Make sure the file has a <code>.ics</code> extension. Also check that your browser allows file uploads. Try refreshing the page and uploading again.
              </p>
            </div>

            <div className="faq-item">
              <h4>❌ My events aren't showing up</h4>
              <p>
                Some older event data might not export properly. Try:
              </p>
              <ul>
                <li>Exporting again and checking the file size isn't 0 bytes</li>
                <li>Checking that events have both start and end times</li>
                <li>Uploading to a text editor to verify the contents</li>
              </ul>
            </div>

            <div className="faq-item">
              <h4>❓ Can I upload multiple calendars?</h4>
              <p>
                Currently, you can upload one calendar file at a time. If you need to combine multiple calendars, export each one and merge the .ics files manually.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-section">
            <h2>Ready to Generate Your Schedule?</h2>
            <p>Now that you know how to export your calendar, let's create your personalized wellness schedule!</p>
            <Link to="/schedule" className="cta-button">
              Go to Schedule Generator →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGuide;
