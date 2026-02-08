import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import google.generativeai as genai
from datetime import datetime, timedelta
from icalendar import Calendar, Event
import uuid

from config import GEMINI_API_KEY
from .prompts import build_gemini_prompt

router = APIRouter(prefix="/mental-planner", tags=["Mental Planner"])

# Configure Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_ics_content(events: List[dict], existing_events: List[dict] = None) -> str:
    """Generate ICS calendar file content with all events"""
    cal = Calendar()
    cal.add('prodid', '-//CalmHer Mental Planner//EN')
    cal.add('version', '2.0')
    cal.add('calscale', 'GREGORIAN')
    cal.add('method', 'PUBLISH')
    cal.add('x-wr-calname', 'CalmHer Wellness Plan')
    cal.add('x-wr-timezone', 'UTC')
    cal.add('x-wr-caldesc', 'Your personalized wellness schedule with activities and original calendar events')
    
    # Add new wellness events
    for evt in events:
        event = Event()
        event.add('summary', evt['title'])
        event.add('description', evt.get('notes', ''))
        event.add('dtstart', datetime.fromisoformat(evt['start']))
        event.add('dtend', datetime.fromisoformat(evt['end']))
        event.add('uid', f"{uuid.uuid4()}@calmher.local")
        event.add('dtstamp', datetime.now())
        # Add color category for wellness events
        event.add('categories', 'Wellness')
        cal.add_component(event)
    
    # Add original calendar events if provided
    if existing_events:
        for evt in existing_events:
            try:
                event = Event()
                event.add('summary', evt.get('title', 'Event'))
                event.add('description', evt.get('description', ''))
                if 'start' in evt:
                    event.add('dtstart', datetime.fromisoformat(evt['start']))
                if 'end' in evt:
                    event.add('dtend', datetime.fromisoformat(evt['end']))
                event.add('uid', f"{uuid.uuid4()}@calmher.local")
                event.add('dtstamp', datetime.now())
                event.add('categories', 'Original')
                cal.add_component(event)
            except Exception:
                continue
    
    return cal.to_ical().decode('utf-8')

class CalendarEvent(BaseModel):
    title: str
    start: str
    end: str

class ScheduleRequest(BaseModel):
    start_date: str
    end_date: str
    preferences: str
    calendar_events: Optional[List[CalendarEvent]] = []
    burnout_level: float

@router.post("/generate-schedule")
async def generate_schedule(request: ScheduleRequest):
    try:
        if not (1 <= request.burnout_level <= 5):
            raise HTTPException(status_code=400, detail="Burnout level must be 1-5")

        # Parse existing calendar events into simple ranges
        existing = []
        for e in request.calendar_events or []:
            try:
                existing.append({
                    "start": e["start"],
                    "end": e["end"]
                })
            except Exception:
                continue

        from datetime import datetime, timedelta

        def daterange(start_date, end_date):
            for n in range(int((end_date - start_date).days) + 1):
                yield start_date + timedelta(n)

        def parse_date(d: str):
            return datetime.strptime(d, "%Y-%m-%d")

        def make_dt(date_obj, hhmm: str):
            return datetime.combine(date_obj, datetime.strptime(hhmm, "%H:%M").time())

        def overlaps(a_start, a_end, b_start, b_end):
            return max(a_start, b_start) < min(a_end, b_end)

        start = parse_date(request.start_date)
        end = parse_date(request.end_date)

        # Interpret burnout
        bl = float(request.burnout_level)
        if bl < 2.0:
            category = "low"
        elif 2.0 <= bl < 3.0:
            category = "moderate"
        elif 3.0 <= bl < 4.0:
            category = "high"
        else:
            category = "critical"

        # Determine schedule density based on category
        # low: 2 events/day + daily affirmation
        # moderate: 1 event/day + affirmation every other day
        # high: 3 events/week
        # critical: 1-2 events/week (rest and affirmations)

        events = []
        affirmation_messages = [
            "Have a great day!",
            "Smile — you are pretty",
            "You are enough",
            "Breathe. You are doing your best"
        ]

        # detect hobby keywords
        hobby_keywords = ["yoga", "painting", "reading", "gardening", "music", "dance", "run", "jog", "cycling"]
        hobbies = []
        prefs = (request.preferences or "").lower()
        for hk in hobby_keywords:
            if hk in prefs:
                hobbies.append(hk)

        # times to try for scheduling (HH:MM)
        morning = "08:00"
        midday = "12:30"
        afternoon = "16:00"
        evening = "19:00"

        for single_date in daterange(start, end):
            day_events = []

            if category == "low":
                slots = [(morning, 20, "meditation"), (evening, 20, "journaling")]
                aff_every = 1
            elif category == "moderate":
                slots = [(morning, 20, "meditation")]
                aff_every = 2
            elif category == "high":
                # schedule only on Mon/Wed/Fri
                weekday = single_date.weekday()
                if weekday in (0, 2, 4):
                    slots = [(morning, 15, "meditation"), (afternoon, 30, "light_exercise"), (evening, 15, "journaling")]
                else:
                    slots = []
                aff_every = 3
            else:  # critical
                weekday = single_date.weekday()
                # choose Tue and Thu for minimal events
                if weekday in (1, 3):
                    slots = [(midday, 15, "rest"), (evening, 10, "affirmations")]
                else:
                    slots = []
                aff_every = 7

            # if user has hobbies, prefer one slot for hobby once every few days
            if hobbies and category in ("low", "moderate"):
                slots.append((afternoon, 45, f"hobby: {hobbies[0]}"))

            # build events for the day avoiding overlaps
            for hhmm, duration_min, etype in slots:
                start_dt = make_dt(single_date, hhmm)
                end_dt = start_dt + timedelta(minutes=duration_min)

                # check against existing calendar events
                conflict = False
                for ex in existing:
                    try:
                        ex_start = datetime.fromisoformat(ex["start"])
                        ex_end = datetime.fromisoformat(ex["end"])
                        if overlaps(start_dt, end_dt, ex_start, ex_end):
                            conflict = True
                            break
                    except Exception:
                        continue

                if conflict:
                    continue

                title = {
                    "meditation": "Meditation",
                    "journaling": "Journaling",
                    "light_exercise": "Light Exercise",
                    "rest": "Rest / Recovery",
                }.get(etype.split(":")[0], etype.title())

                note = "A gentle wellbeing activity"
                if etype.startswith("hobby"):
                    note = f"Time for your hobby: {etype.split(':',1)[1].strip()}"
                if title.lower().find("affirm") != -1 or etype == "affirmations":
                    # positive affirmation event
                    title = "Affirmation"
                    note = affirmation_messages[hash(single_date) % len(affirmation_messages)]

                events.append({
                    "title": title,
                    "type": etype.replace(" ", "_").lower(),
                    "start": start_dt.strftime("%Y-%m-%dT%H:%M"),
                    "end": end_dt.strftime("%Y-%m-%dT%H:%M"),
                    "notes": note
                })

            # add daily affirmation according to frequency
            try:
                day_index = (single_date - start).days
                if day_index % aff_every == 0:
                    aff_dt = make_dt(single_date, morning)
                    events.append({
                        "title": "Affirmation",
                        "type": "affirmation",
                        "start": aff_dt.strftime("%Y-%m-%dT%H:%M"),
                        "end": (aff_dt + timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M"),
                        "notes": affirmation_messages[day_index % len(affirmation_messages)]
                    })
            except Exception:
                pass

        schedule = {
            "schedule_summary": {
                "burnout_level": bl,
                "interpreted_burnout_category": category,
                "date_range": {"start": request.start_date, "end": request.end_date},
                "total_events_created": len(events)
            },
            "events": events
        }

        # Generate ICS file content with new events + original calendar events
        ics_content = generate_ics_content(events, request.calendar_events)

        return {"success": True, "schedule": schedule, "ics_content": ics_content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
