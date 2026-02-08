# InnovateHer Hackathon - Mental Wellness Backend

Mental wellness scheduling assistant powered by Google Gemini AI.

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and add your Gemini API key:
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 3. Run the Server
```bash
python python.py
```

The server will start at `http://localhost:5000`

Interactive API docs available at `http://localhost:5000/docs`

## API Endpoints

### Generate Wellness Schedule
**POST** `/api/generate-schedule`

Request body:
```json
{
  "start_date": "2026-02-07",
  "end_date": "2026-02-14",
  "preferences": "I prefer morning workouts. No events after 8pm. I want meditation and journaling.",
  "calendar_events": [
    {
      "title": "Team Meeting",
      "start": "2026-02-09T10:00",
      "end": "2026-02-09T11:00"
    }
  ],
  "burnout_level": 3.5
}
```

Response:
```json
{
  "success": true,
  "schedule": {
    "schedule_summary": {
      "burnout_level": 3.5,
      "interpreted_burnout_category": "high",
      "date_range": {
        "start": "2026-02-07",
        "end": "2026-02-14"
      },
      "total_events_created": 5
    },
    "events": [
      {
        "title": "Morning Meditation",
        "type": "meditation",
        "start": "2026-02-07T07:00",
        "end": "2026-02-07T07:15",
        "notes": "Gentle 15-minute breathing practice"
      }
    ]
  }
}
```

### Health Check
**GET** `/api/health`

Returns server status.

## How It Works

1. **User Input**: Frontend sends preferences, date range, existing calendar events, and burnout level
2. **Prompt Building**: Backend constructs a detailed prompt with all user data
3. **AI Processing**: Gemini AI interprets the burnout level and creates a personalized schedule
4. **Output**: Returns a JSON-formatted schedule respecting all preferences and constraints

## Burnout Level Interpretation

- **1.0 – 1.9**: Low burnout → Light, optional, flexible sessions
- **2.0 – 2.9**: Moderate burnout → Balanced, steady routine
- **3.0 – 3.9**: High burnout → Short, gentle, recovery-focused sessions
- **4.0 – 5.0**: Critical burnout → Minimal scheduling; affirmations and rest only

## Supported Wellbeing Activities

- Meditation
- Journaling
- Positive affirmations
- Rest / recovery blocks
- Gentle wellbeing check-ins

## Error Handling

The API returns appropriate HTTP status codes:
- **200**: Success
- **400**: Invalid request (missing fields, invalid burnout level)
- **500**: Server error (API key not configured, Gemini API error)
