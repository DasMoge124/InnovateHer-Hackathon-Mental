import React, { useState } from "react";
import "./Chatbot.css";

const positiveAffirmations = [
  "You are enough 💖",
  "Take a deep breath 🌸",
  "Every step counts 🌱",
  "You are doing great ✨",
  "Peace begins within 🌼",
  "It's okay to rest 🕊️",
  "You are resilient 💪",
  "Kindness starts with you 💕"
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm here to support you 🌸", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: "That's wonderful to hear! 🌟 Keep going!", sender: "bot" }
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      {/* Floating affirmations */}
      <div className="affirmations">
        {positiveAffirmations.map((text, i) => (
          <span key={i} className="affirmation">{text}</span>
        ))}
      </div>

      <div className="chat-header">
        <h2>CalmHer Chat 🌷</h2>
        <p>Your safe space to share and reflect</p>
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.sender === "bot" ? "bot" : "user"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type something supportive..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
