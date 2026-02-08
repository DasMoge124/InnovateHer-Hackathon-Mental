import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Home from "./Calmher"
import ScheduleGenerator from "./ScheduleGenerator"
import CalendarGuide from "./CalendarGuide"
import Login from "./Login"
import SignUp from "./SignUp"
import Assessment from "./Assessment"
import TherapistFinder from "./TherapistFinder"
import Dashboard from "./Dashboard"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<ScheduleGenerator />} />
        <Route path="/calendar-guide" element={<CalendarGuide />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/therapist-finder" element={<TherapistFinder />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
