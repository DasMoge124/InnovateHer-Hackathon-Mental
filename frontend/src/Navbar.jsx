import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // triggers scroll effect
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`nav-container ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          CalmHer
        </Link>

        <nav className="nav-links-list">
          <Link to="/login" className="nav-item">
            Login
          </Link>
          <Link to="/signup" className="nav-item">
            Sign Up
          </Link>
          <Link to="/assessment" className="nav-item">
            Assessment
          </Link>
          <Link to="/therapist-finder" className="nav-item">
            Therapist-Finder
          </Link>
          <Link to="/mental-planner" className="nav-item">
            Mental Planner
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;