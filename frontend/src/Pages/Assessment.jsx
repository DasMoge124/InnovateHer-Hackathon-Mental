import React, { useState } from 'react';
import './Assessment.css';

const Assessment = () => {
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = {
    emotionalExhaustion: [
      { id: 1, text: "I feel emotionally drained or depleted." },
      { id: 2, text: "Small problems feel harder to handle than usual." },
      { id: 3, text: "I need more time to recover after stressful days." }
    ],
    mentalClarity: [
      { id: 4, text: "My thoughts feel cluttered or scattered." },
      { id: 5, text: "I can concentrate and complete tasks effectively.", reverse: true },
      { id: 6, text: "I forget details or lose track due to stress." }
    ],
    physicalFatigue: [
      { id: 7, text: "I wake up tired even after sleeping." },
      { id: 8, text: "My body feels tense, sore, or low on energy." },
      { id: 9, text: "I rely on caffeine or quick fixes to stay alert." }
    ],
    controlSupport: [
      { id: 10, text: "I believe I can manage most challenges.", reverse: true },
      { id: 11, text: "I feel supported by people close to me.", reverse: true },
      { id: 12, text: "I feel like I'm handling everything alone." }
    ]
  };

  const scaleOptions = [
    { value: 1, label: "Never" },
    { value: 2, label: "Rarely" },
    { value: 3, label: "Sometimes" },
    { value: 4, label: "Often" },
    { value: 5, label: "Almost always" }
  ];

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let total = 0;
    let count = 0;

    Object.entries(questions).forEach(([category, categoryQuestions]) => {
      categoryQuestions.forEach(q => {
        if (responses[q.id]) {
          const score = q.reverse ? (6 - responses[q.id]) : responses[q.id];
          total += score;
          count++;
        }
      });
    });

    return count > 0 ? (total / count).toFixed(1) : 0;
  };

  const getInterpretation = (score) => {
    if (score >= 1 && score < 2.5) {
      return {
        level: "Balanced or low stress",
        message: "You're managing well! Continue maintaining your healthy habits and self-care routines."
      };
    } else if (score >= 2.5 && score < 3.5) {
      return {
        level: "Manageable strain — time for small recovery habits",
        message: "You're experiencing some stress. Consider incorporating more rest and stress-relief activities into your routine."
      };
    } else if (score >= 3.5) {
      return {
        level: "Elevated stress/fatigue — may need meaningful rest or support",
        message: "You may be experiencing significant stress. It's important to prioritize self-care and consider seeking professional support."
      };
    }
    return { level: "", message: "" };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const totalQuestions = Object.values(questions).flat().length;
    const answeredQuestions = Object.keys(responses).length;

    if (answeredQuestions < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions before submitting.`);
      return;
    }

    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const averageScore = calculateScore();
  const interpretation = getInterpretation(parseFloat(averageScore));

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header">
          <h1 className="assessment-title">Mental Well-Being Assessment</h1>
          <p className="assessment-subtitle">
            Compact Mental & Emotional Well-Being Check-In
          </p>
        </div>

        <div className="assessment-intro">
          <p className="intro-text">
            <strong>Purpose:</strong> A reflective tool for adult women to gauge current energy, focus, and emotional balance.
          </p>
          <p className="intro-text">
            <strong>Scale:</strong> 1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Almost always
          </p>
          <p className="note-text">
            <em>Note:</em> This is a shortened, compassionate version designed for quick self-reflection. 
            For comprehensive assessment, please consult with a licensed therapist.
          </p>
        </div>

        {showResults && (
          <div className="results-section">
            <h2 className="results-title">Your Results</h2>
            <div className="score-display">
              <div className="score-number">{averageScore}</div>
              <div className="score-label">Average Score</div>
            </div>
            <div className="interpretation">
              <h3 className="interpretation-level">{interpretation.level}</h3>
              <p className="interpretation-message">{interpretation.message}</p>
            </div>
            <button onClick={handleReset} className="reset-button">
              Take Assessment Again
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="assessment-form">
          {/* Emotional Exhaustion */}
          <div className="question-category">
            <h2 className="category-title">Emotional Exhaustion</h2>
            {questions.emotionalExhaustion.map(question => (
              <div key={question.id} className="question-block">
                <p className="question-text">
                  <span className="question-number">{question.id}.</span> {question.text}
                </p>
                <div className="scale-options">
                  {scaleOptions.map(option => (
                    <label key={option.value} className="scale-option">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={responses[question.id] === option.value}
                        onChange={() => handleResponse(question.id, option.value)}
                        required
                      />
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mental Clarity and Focus */}
          <div className="question-category">
            <h2 className="category-title">Mental Clarity and Focus</h2>
            {questions.mentalClarity.map(question => (
              <div key={question.id} className="question-block">
                <p className="question-text">
                  <span className="question-number">{question.id}.</span> {question.text}
                  {question.reverse && <span className="reverse-note"> (reverse-scored)</span>}
                </p>
                <div className="scale-options">
                  {scaleOptions.map(option => (
                    <label key={option.value} className="scale-option">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={responses[question.id] === option.value}
                        onChange={() => handleResponse(question.id, option.value)}
                        required
                      />
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Physical Fatigue */}
          <div className="question-category">
            <h2 className="category-title">Physical Fatigue</h2>
            {questions.physicalFatigue.map(question => (
              <div key={question.id} className="question-block">
                <p className="question-text">
                  <span className="question-number">{question.id}.</span> {question.text}
                </p>
                <div className="scale-options">
                  {scaleOptions.map(option => (
                    <label key={option.value} className="scale-option">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={responses[question.id] === option.value}
                        onChange={() => handleResponse(question.id, option.value)}
                        required
                      />
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sense of Control and Support */}
          <div className="question-category">
            <h2 className="category-title">Sense of Control and Support</h2>
            {questions.controlSupport.map(question => (
              <div key={question.id} className="question-block">
                <p className="question-text">
                  <span className="question-number">{question.id}.</span> {question.text}
                  {question.reverse && <span className="reverse-note"> (reverse-scored)</span>}
                </p>
                <div className="scale-options">
                  {scaleOptions.map(option => (
                    <label key={option.value} className="scale-option">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={responses[question.id] === option.value}
                        onChange={() => handleResponse(question.id, option.value)}
                        required
                      />
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="scoring-info">
            <h3 className="scoring-title">Scoring and Guidance</h3>
            <p className="scoring-note">
              <strong>Reverse scoring:</strong> Flip values for items 5, 10, 11 (1 → 5, 2 → 4, 3 → 3, 4 → 2, 5 → 1).
            </p>
            <div className="scoring-table">
              <div className="scoring-row">
                <div className="score-range">1–2.4</div>
                <div className="score-meaning">Balanced or low stress</div>
              </div>
              <div className="scoring-row">
                <div className="score-range">2.5–3.4</div>
                <div className="score-meaning">Manageable strain — time for small recovery habits</div>
              </div>
              <div className="scoring-row">
                <div className="score-range">3.5–5.0</div>
                <div className="score-meaning">Elevated stress/fatigue — may need meaningful rest or support</div>
              </div>
            </div>
          </div>

          {!showResults && (
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Submit Assessment
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Assessment;