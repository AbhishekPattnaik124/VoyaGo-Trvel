import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import Flights from './components/Flights';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Hotel_booking from './components/Hotel-booking/Hotel_booking';
import CarRentalPage from './components/Car-rental/CarRentalPage';
import TrainBookingPage from './components/TrainBooking/TrainBookingPage';
import BusBooking from './busbooking/busbooking';
import WorldTour from './components/WorldTour';
import TourBooking from './components/TourBooking';
import AdminDashboard from './components/AdminDashboard';
import AIAssistant from './components/AIAssistant';
import TripPlanner from './components/TripPlanner';
import ReviewsRatings from './components/ReviewsRatings';
import MyBookings from './components/MyBookings';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { FaAndroid } from 'react-icons/fa';

/**
 * VoyaGo™ — Root Application
 * VoyaGo Technologies Pvt. Ltd.
 * Patent-pending AI Travel Management Platform
 */
function App() {
  return (
    <Router>
      {/* Global AI Travel Concierge — appears on all authenticated pages */}
      <AIAssistant />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes — requires valid JWT */}
        <Route path="/home"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/flights"      element={<ProtectedRoute><Flights /></ProtectedRoute>} />
        <Route path="/hotels"       element={<ProtectedRoute><Hotel_booking /></ProtectedRoute>} />
        <Route path="/cars"         element={<ProtectedRoute><CarRentalPage /></ProtectedRoute>} />
        <Route path="/trains"       element={<ProtectedRoute><TrainBookingPage /></ProtectedRoute>} />
        <Route path="/buses"        element={<ProtectedRoute><BusBooking /></ProtectedRoute>} />
        <Route path="/world-tour"   element={<ProtectedRoute><WorldTour /></ProtectedRoute>} />
        <Route path="/tour-booking" element={<ProtectedRoute><TourBooking /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/trip-planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
        <Route path="/reviews"      element={<ProtectedRoute><ReviewsRatings /></ProtectedRoute>} />
        <Route path="/my-bookings"  element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* 404 Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>

      {/* VoyaGo™ Floating Mobile App Download Button */}
      <a
        href="/travel-app.apk"
        download="VoyaGo.apk"
        className="download-apk-btn"
        title="Download VoyaGo Mobile App"
        aria-label="Download VoyaGo Android App"
      >
        <FaAndroid />
        <span>Get App</span>
      </a>
    </Router>
  );
}

export default App;
