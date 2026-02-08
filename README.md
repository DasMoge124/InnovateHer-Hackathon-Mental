CalmHer – Mental Health Support Platform 💙
CalmHer is a full-stack mental health support platform built during a hackathon to help users better understand, manage, and care for their mental wellbeing before reaching a crisis point. The platform combines evidence-based mental health assessments, AI-powered planning, a supportive chatbot, and verified therapist discovery into one safe, accessible experience.

⚠️ Disclaimer: CalmHer is not a medical or diagnostic tool. It does not replace professional mental health care. The platform is designed to support self-awareness and guide users toward appropriate resources.

🌟 Key Features
1. Evidence-Based Mental Health Assessment
Short, research-backed assessment designed to gauge burnout, stress, fatigue, self-efficacy, and social support
Helps users understand whether they may benefit from additional support
Results are stored securely for trend tracking over time
Research Sources Used:

Maslach Burnout Inventory (MBI)
Perceived Stress Scale (PSS)
Multidimensional Fatigue Inventory (MFI-20)
General Self-Efficacy Scale (GSE)
Multidimensional Scale of Perceived Social Support (MSPSS)
2. Burnout Scoring & Risk Classification
AI-assisted burnout score generation
Categorizes user risk levels (low / elevated)
Designed to encourage early action rather than crisis-driven help-seeking
3. AI-Powered Mental Wellness Planner
Generates a personalized mental wellbeing schedule

Considers:

User preferences
Burnout level (1–5)
Existing calendar events
Suggests realistic, gentle activities such as journaling, meditation, and breaks

Powered by:

FastAPI
Google Gemini API
4. Supportive AI Chatbot (Safety-First)
Designed specifically for mental health conversations
Detects high-risk language and escalates appropriately
Provides empathetic, non-judgmental responses
Includes crisis-safe responses when needed
Unlike generic chatbots, this assistant prioritizes user safety and emotional tone.

5. Therapist Discovery (Verified Data)
Search for licensed therapists in Indiana

Filter by:

City
Category (Psychiatrist, Psychologist, Counselor, etc.)
Data sourced from the NPI Registry API

Pre-populated and indexed for fast querying

6. Voice Input for Accessibility
Speech-to-text support using ElevenLabs
Allows users to speak instead of typing during assessments
Extracted text is analyzed and securely stored
🧠 Architecture Overview
Frontend (React + Vite)
        ↓
FastAPI Backend
        ↓
MongoDB Atlas
        ↓
AI Services (Gemini + ElevenLabs)
🛠 Tech Stack
Frontend
React
Vite
ESLint
Backend
Python
FastAPI
Pydantic
Database
MongoDB Atlas
PyMongo
Motor (Async MongoDB)
AI & External APIs
Google Gemini API (LLM)
ElevenLabs API (Speech-to-Text)
NPI Registry API (Therapist data)
📂 Backend Code Features Explained
Database Layer (db_help.py)
Singleton MongoDB connection

Indexed collections for performance

Therapist auto-population (100+ per category)

Secure data storage for:

Users
Assessments
Burnout scores
To-do plans
Therapist search results
Core API (main.py)
Handles:

User creation
Assessment storage
Burnout tracking
Todo storage and retrieval
Therapist search and filtering
System statistics
Includes:

Health checks
CORS configuration
MongoDB serialization helpers
Mental Planner (mental_planner/router.py)
Validates burnout level input
Builds structured prompts for Gemini
Parses AI-generated JSON safely
Returns personalized schedules
Endpoints:

POST /mental-planner/generate-schedule
GET /mental-planner/health
Chatbot Module
Risk assessment before response generation
Conversation memory with capped history
Crisis escalation with safe responses
Endpoint:

POST /chat
📑 API Documentation
Once running locally, interactive API docs are available at:

Swagger UI: http://127.0.0.1:8005/docs
ReDoc: http://127.0.0.1:8005/redoc
⚙️ Environment Variables
Create a .env file in the backend directory:

MONGO_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
▶️ Running the Project Locally
Backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8005
Frontend
npm install
npm run dev
👥 Team Contributions
Kevin Du – Frontend UI, homepage, authentication pages
Shubhra Moudgil – Mental health assessment design, AI analysis, ElevenLabs integration
Zara – Research, mental planner, chatbot safety design
Sarah – Database architecture and backend infrastructure
💡 Why CalmHer?
Our research showed that many people—especially women—feel overwhelmed but unsure if their struggles are “serious enough” to seek help. CalmHer bridges this gap by offering early insight, gentle guidance, and safe AI support, empowering users to care for themselves before reaching a breaking point.

🚀 Future Improvements
Multi-state therapist search
User authentication & accounts
Long-term mental health trend visualization
Mobile app support
Expanded language accessibility
💙 Built with care, empathy, and responsibility.

