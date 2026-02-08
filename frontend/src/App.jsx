import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./Calmher"
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Assessment from "./Pages/Assessment";
import TherapistFinder from "./Pages/Therapist_finder";
import MentalPlanner from "./Pages/Mental_Planner";
import TherapistRegistration from "./Pages/TherapistRegistration";
import Navbar from "./Navbar";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assessment" element={<Assessment/>} />
        <Route path="/therapist-finder" element={<TherapistFinder/>} />
        <Route path="/mental-planner" element={<MentalPlanner/>} />
        <Route path="/therapist-registration" element={<TherapistRegistration/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App