import React, { useState } from "react";
import "./MentalPlanner.css";

const MentalPlanner = () => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    burnoutLevel: 3,
    preferences: "",
  });

  const [icsFile, setIcsFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle ICS upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".ics")) {
      setIcsFile(file);
      setError("");
    } else {
      setError("Please upload a valid .ics calendar file.");
    }
  };

  // Submit form to backend
  const generateSchedule = async () => {
    if (!icsFile) {
      setError("Please upload your calendar file first.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError("Please select start and end dates.");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadUrl("");

    try {
      const formData = new FormData();
      formData.append("start_date", form.startDate);
      formData.append("end_date", form.endDate);
      formData.append("burnout_level", form.burnoutLevel);
      formData.append("preferences", form.preferences);
      formData.append("calendar_file", icsFile);

      const response = await fetch(
        "http://localhost:8005/mental-planner/generate-schedule-ics",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to generate schedule");
      }

      // Get generated .ics file as blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mental-planner-container">
      <h1>Mental Well-being Planner</h1>
      <p>
        Upload your calendar, specify your burnout level and preferences, and
        generate a personalized wellness schedule.
      </p>

      <div className="planner-form">
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Burnout Level (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            name="burnoutLevel"
            value={form.burnoutLevel}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Preferences (e.g., "No classes on Monday, 2 meditation sessions per day, only night activities")</label>
          <textarea
            name="preferences"
            value={form.preferences}
            onChange={handleChange}
            placeholder="Describe your preferences for activities, times, days, and intensity..."
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Upload your calendar (.ics)</label>
          <input type="file" accept=".ics" onChange={handleFileChange} />
          {icsFile && <p>Selected file: {icsFile.name}</p>}
        </div>

        <button onClick={generateSchedule} disabled={loading}>
          {loading ? "Generating..." : "Generate Schedule"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="mental_wellbeing_schedule.ics" className="download-btn">
            Download New Calendar
          </a>
        )}
      </div>
    </div>
  );
};

export default MentalPlanner;
