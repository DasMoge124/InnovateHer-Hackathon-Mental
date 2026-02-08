# CalmHer - Mental Wellness Schedule Generator

A web application that generates personalized wellness schedules using Google Gemini AI, taking into account your existing calendar, preferences, and burnout level.

## Features

- 📅 **Upload Calendar**: Import your Google Calendar events as .ics or JSON files
- 🤖 **AI-Powered Scheduling**: Uses Gemini AI to create personalized wellness schedules
- 🎯 **Burnout Awareness**: Adapts recommendations based on burnout level (1-5 scale)
- 📥 **Multiple Download Formats**: Export schedules as JSON or .ics calendar files
- ⚡ **No Authentication Required**: Simple, straightforward interface

## Architecture

### Backend (Python FastAPI)
- `python.py` - Main FastAPI application with schedule generation endpoint
- `config.py` - Configuration for CORS and API keys
- `prompts.py` - Builds detailed Gemini AI prompts
- `requirements.txt` - Python dependencies

### Frontend (React + Vite)
- `ScheduleGenerator.jsx` - Main application interface
- `icsToJson.js` - Utilities for parsing calendar files
- Clean, minimal UI focused on schedule generation

## Setup

### Backend
```bash
cd backend
python3.11 -m venv .venv311
.venv311\Scripts\activate
pip install -r requirements.txt
```

Set your Gemini API key in `.env`:
```
GEMINI_API_KEY=your_key_here
```

Run the server:
```bash
python -m uvicorn python:app --host 127.0.0.1 --port 5000 --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5174`

## How to Use

1. **Export Your Calendar**:
   - Go to Google Calendar (calendar.google.com)
   - Settings → Your Calendar → Export Calendar
   - Download the .ics file

2. **Generate Schedule**:
   - Open the app at http://localhost:5174
   - Fill in start and end dates
   - Upload your calendar file (optional)
   - Set your burnout level (1-5)
   - Write your preferences (e.g., "morning yoga, no evening events")
   - Click "Generate My Schedule"

3. **Download Results**:
   - Download as JSON (raw data)
   - Download as .ics (import into your calendar)

## API Endpoint

**POST** `/api/generate-schedule`
```json
{
  "start_date": "2026-02-10",
  "end_date": "2026-02-14",
  "preferences": "morning yoga, meditation",
  "calendar_events": [...],
  "burnout_level": 3
}
```

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: FastAPI, Python 3.11, Uvicorn
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Calendar**: ICS file parsing, JSON integration

## Author

Built for InnovateHer Hackathon - Mental Health Track
