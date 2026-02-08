import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Assessment.css';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      text: "How often do you feel exhausted at the end of a workday?",
      options: [
        { text: "Never", value: 1 },
        { text: "Rarely", value: 2 },
        { text: "Sometimes", value: 3 },
        { text: "Often", value: 4 },
        { text: "Always", value: 5 }
      ]
    },
    {
      id: 2,
      text: "Do you find it difficult to disconnect from work?",
      options: [
        { text: "Never", value: 1 },
        { text: "Rarely", value: 2 },
        { text: "Sometimes", value: 3 },
        { text: "Often", value: 4 },
        { text: "Always", value: 5 }
      ]
    },
    {
      id: 3,
      text: "How would you rate your overall stress level?",
      options: [
        { text: "Very Low", value: 1 },
        { text: "Low", value: 2 },
        { text: "Moderate", value: 3 },
        { text: "High", value: 4 },
        { text: "Very High", value: 5 }
      ]
    },
    {
      id: 4,
      text: "Do you experience trouble sleeping due to work-related stress?",
      options: [
        { text: "Never", value: 1 },
        { text: "Rarely", value: 2 },
        { text: "Sometimes", value: 3 },
        { text: "Often", value: 4 },
        { text: "Always", value: 5 }
      ]
    },
    {
      id: 5,
      text: "How often do you feel emotionally drained?",
      options: [
        { text: "Never", value: 1 },
        { text: "Rarely", value: 2 },
        { text: "Sometimes", value: 3 },
        { text: "Often", value: 4 },
        { text: "Always", value: 5 }
      ]
    },
    {
      id: 6,
      text: "Do you have difficulty concentrating on tasks?",
      options: [
        { text: "Never", value: 1 },
        { text: "Rarely", value: 2 },
        { text: "Sometimes", value: 3 },
        { text: "Often", value: 4 },
        { text: "Always", value: 5 }
      ]
    },
    {
      id: 7,
      text: "How satisfied are you with your work-life balance?",
      options: [
        { text: "Very Satisfied", value: 1 },
        { text: "Satisfied", value: 2 },
        { text: "Neutral", value: 3 },
        { text: "Dissatisfied", value: 4 },
        { text: "Very Dissatisfied", value: 5 }
      ]
    },
    {
      id: 8,
      text: "Do you feel cynical about your work?",
      options: [
        { text: "Never", value: 1 },
        { text: "Rarely", value: 2 },
        { text: "Sometimes", value: 3 },
        { text: "Often", value: 4 },
        { text: "Always", value: 5 }
      ]
    },
    {
      id: 9,
      text: "How would you rate your physical health?",
      options: [
        { text: "Excellent", value: 1 },
        { text: "Good", value: 2 },
        { text: "Fair", value: 3 },
        { text: "Poor", value: 4 },
        { text: "Very Poor", value: 5 }
      ]
    },
    {
      id: 10,
      text: "Do you have adequate support systems (friends, family, colleagues)?",
      options: [
        { text: "Strongly Agree", value: 1 },
        { text: "Agree", value: 2 },
        { text: "Neutral", value: 3 },
        { text: "Disagree", value: 4 },
        { text: "Strongly Disagree", value: 5 }
      ]
    }
  ];

  const handleAnswer = (value) => {
    const newScores = [...scores, value];
    setScores(newScores);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateBurnoutLevel = () => {
    const average = scores.reduce((a, b) => a + b) / scores.length;
    return Math.round(average * 100) / 100;
  };

  const getBurnoutCategory = (level) => {
    if (level < 1.5) return { category: "Low Burnout", color: "#4caf50" };
    if (level < 2.5) return { category: "Moderate Burnout", color: "#ffc107" };
    if (level < 3.5) return { category: "High Burnout", color: "#ff9800" };
    return { category: "Critical Burnout", color: "#f44336" };
  };

  if (showResults) {
    const burnoutLevel = calculateBurnoutLevel();
    const { category, color } = getBurnoutCategory(burnoutLevel);

    return (
      <div className="assessment-container">
        <nav className="navbar">
          <Link to="/" className="logo">CalmHer</Link>
          <div className="nav-links">
            <Link to="/schedule" className="nav-link">Schedule</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </div>
        </nav>

        <div className="results-container">
          <div className="results-card">
            <h2>Your Assessment Results</h2>

            <div className="result-score" style={{ borderColor: color }}>
              <div className="score-value" style={{ color }}>
                {burnoutLevel.toFixed(1)}
              </div>
              <div className="score-label">Burnout Level</div>
            </div>

            <div className="result-category" style={{ backgroundColor: `${color}20`, borderLeft: `4px solid ${color}` }}>
              <h3 style={{ color }}>
                {category}
              </h3>
              <p>
                {burnoutLevel < 1.5 && "You're doing well! Continue maintaining your healthy habits."}
                {burnoutLevel >= 1.5 && burnoutLevel < 2.5 && "You're experiencing some stress. Consider incorporating wellness activities into your routine."}
                {burnoutLevel >= 2.5 && burnoutLevel < 3.5 && "You're experiencing significant stress. It's important to prioritize self-care and recovery."}
                {burnoutLevel >= 3.5 && "You may be experiencing critical burnout. Please consider seeking professional support."}
              </p>
            </div>

            <div className="recommendations">
              <h3>Personalized Recommendations</h3>
              {burnoutLevel < 1.5 && (
                <ul>
                  <li>✓ Maintain your current wellness routine</li>
                  <li>✓ Continue regular exercise and good sleep habits</li>
                  <li>✓ Stay connected with your support network</li>
                </ul>
              )}
              {burnoutLevel >= 1.5 && burnoutLevel < 2.5 && (
                <ul>
                  <li>📅 Schedule regular meditation sessions</li>
                  <li>📝 Start journaling to process emotions</li>
                  <li>🧘 Practice mindfulness exercises daily</li>
                  <li>⏰ Set better work-life boundaries</li>
                </ul>
              )}
              {burnoutLevel >= 2.5 && burnoutLevel < 3.5 && (
                <ul>
                  <li>🚨 Priority: Schedule recovery time daily</li>
                  <li>🧘 Intensive meditation and relaxation</li>
                  <li>👥 Increase time with supportive people</li>
                  <li>⚡ Reduce workload or delegate tasks</li>
                  <li>🏥 Consider professional counseling</li>
                </ul>
              )}
              {burnoutLevel >= 3.5 && (
                <ul>
                  <li>🚨 URGENT: Please speak with a professional therapist</li>
                  <li>🏥 Consider medical evaluation</li>
                  <li>🔴 Take significant time off if possible</li>
                  <li>💬 Call a mental health helpline</li>
                </ul>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate('/schedule')}
              >
                Create Wellness Schedule
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/therapist-finder')}
              >
                Find a Therapist
              </button>
            </div>

            <button
              className="btn-retake"
              onClick={() => {
                setCurrentQuestion(0);
                setScores([]);
                setShowResults(false);
              }}
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-container">
      <nav className="navbar">
        <Link to="/" className="logo">CalmHer</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
        </div>
      </nav>

      <div className="quiz-container">
        <div className="quiz-card">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <h2>{questions[currentQuestion].text}</h2>

          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(option.value)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
