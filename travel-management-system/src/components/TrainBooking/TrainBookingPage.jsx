// src/components/TrainBooking/TrainBookingPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Train, ArrowRight, Calendar, Users, DollarSign, Clock, MapPin, Search, Plus, X, User, Mail, CheckCircle, Ticket, MinusCircle, PlusCircle
} from 'lucide-react';
import axios from 'axios';
import PaymentModal from '../PaymentModal';
import LiveTrackingMap from '../LiveTrackingMap';
import '../SharedPremium.css'; // Use unified premium styles

const TrainBookingPage = () => {
  // State variables for the search form
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  // State variables for displaying results and managing UI flow
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [addTrainMessage, setAddTrainMessage] = useState('');
  const [bookedTrain, setBookedTrain] = useState(null);

  // State variables for the booking form inputs
  const [fullName, setFullName] = useState(localStorage.getItem('userName') || '');
  const email = localStorage.getItem('userEmail') || 'user@example.com';
  const [showPayment, setShowPayment] = useState(false);

  // Base URL for your backend API
  const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

  /**
   * Handles the form submission for searching trains.
   * Sends a GET request to the backend API with search criteria.
   */
  const handleSearchTrains = async (e) => {
    e.preventDefault();
    setAddTrainMessage(''); // Clear any previous messages
    setLoading(true);

    try {
      await new Promise(res => setTimeout(res, 800)); // Simulate loading for realistic UX
      const response = await axios.get(`${API_BASE_URL}/trains`, {
        params: {
          from: fromStation,
          to: toStation,
          date: departureDate,
          passengers: passengers
        }
      });
      setTrains(response.data);
      if (response.data.length === 0) {
        setAddTrainMessage('No trains found for your selected criteria.');
      } else {
        setAddTrainMessage('');
      }
    } catch (error) {
      console.error('Error searching trains:', error);
      if (error.response && error.response.status === 404) {
        setAddTrainMessage('No trains found for your selected criteria.');
      } else {
        setAddTrainMessage(`Error searching trains: ${error.message}. Please try again.`);
      }
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sets the selected train and displays the booking form.
   * @param {object} train - The train object selected by the user.
   */
  const handleBookNow = (train) => {
    setSelectedTrain(train);
    setShowBookingForm(true);
    setFullName(localStorage.getItem('userName') || '');
  };

  /**
   * Handles the form submission for confirming a booking.
   * Sends a POST request to the backend API to create a new reservation.
   */
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setAddTrainMessage('');

    if (!selectedTrain) {
      setAddTrainMessage('No train selected for booking.');
      return;
    }

    // ⭐ CORRECTED: Build the data object to match the backend's expected schema
    const bookingDetails = {
      trainName: selectedTrain.trainName,
      trainNumber: selectedTrain.trainNumber,
      fromStation: selectedTrain.fromStation,
      toStation: selectedTrain.toStation,
      departureTime: selectedTrain.departureTime,
      totalPrice: selectedTrain.fare * passengers,
      passengerName: fullName,
      email: email,
    };

    // Instead of booking directly, show payment modal
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    setShowPayment(false);
    
    const bookingDetails = {
      trainName: selectedTrain.trainName,
      trainNumber: selectedTrain.trainNumber,
      fromStation: selectedTrain.fromStation,
      toStation: selectedTrain.toStation,
      departureTime: selectedTrain.departureTime,
      totalPrice: selectedTrain.fare * passengers,
      passengerName: fullName,
      email: email,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/trains/reservations`, bookingDetails);
      
      console.log('Booking successful:', response.data);
      setAddTrainMessage(`Booking confirmed! PNR: ${response.data.reservation.pnrNumber}. Confirmation email sent.`);

      // Clear the form and state after a successful booking
      setFromStation('');
      setToStation('');
      setDepartureDate('');
      setPassengers(1);
      setTrains([]);
      setShowBookingForm(false);
      setBookedTrain(selectedTrain);
      setSelectedTrain(null);
    } catch (error) {
      console.error('Error confirming booking:', error.response?.data?.message || error.message);
      setAddTrainMessage(`Error confirming booking: ${error.response?.data?.message || 'Please check console for details.'}`);
    }
  };

  /**
   * Corrected function to add a new dummy train to the database.
   * Generates a unique trainNumber using a timestamp to prevent duplicate key errors.
   */
  const handleAddDummyTrain = async () => {
    setAddTrainMessage('');

    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const uniqueTrainNumber = `TRN${timestamp}-${randomNum}`;
    
    const newTrain = {
      trainNumber: uniqueTrainNumber,
      trainName: `Dummy Express ${Math.floor(Math.random() * 100)}`,
      fromStation: "Bhubaneswar",
      toStation: randomNum % 2 === 0 ? "Cuttack" : "Puri",
      departureTime: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrivalTime: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      travelDuration: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
      fare: 100 + Math.floor(Math.random() * 500),
      availableSeats: 50 + Math.floor(Math.random() * 100),
      totalSeats: 150 + Math.floor(Math.random() * 100),
      classes: ['SL', '2S', 'AC3'],
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/trains`, newTrain);
      console.log('Dummy train added:', response.data);
      setAddTrainMessage(`Successfully added dummy train: ${response.data.trainName} (${response.data.trainNumber})`);
    } catch (error) {
      console.error('Error adding dummy train:', error.response?.data || error.message);
      setAddTrainMessage(`Error adding dummy train: ${error.response?.data?.message || 'Please check server logs.'}`);
    }
  };

  return (
    <div className="premium-container">
      <Link to="/home" className="back-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Home
      </Link>

      <h2 className="premium-title float-anim"><span className="gradient-text">Train</span> Booking</h2>

      {addTrainMessage && (
        <p style={{color: addTrainMessage.includes('Error') || addTrainMessage.includes('No train') ? '#ff7675' : '#00d2d3', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">
          {addTrainMessage}
        </p>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearchTrains} className="glass-panel" style={{padding: '30px', marginBottom: '40px'}}>
        <div className="premium-form-grid">
          <div className="premium-input-group">
            <label className="premium-label">From Station</label>
            <input
              type="text"
              className="premium-input"
              placeholder="Departure"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              required
            />
          </div>

          <div className="premium-input-group">
            <label className="premium-label">To Station</label>
            <input
              type="text"
              className="premium-input"
              placeholder="Arrival"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              required
            />
          </div>

          <div className="premium-input-group">
            <label className="premium-label">Date</label>
            <input
              type="date"
              className="premium-input"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>

          <div className="premium-input-group">
            <label className="premium-label">Passengers</label>
            <input 
              type="number" 
              className="premium-input" 
              value={passengers} 
              onChange={e => setPassengers(Math.max(1, parseInt(e.target.value) || 1))} 
              min="1" 
              required 
            />
          </div>
        </div>

        <button type="submit" className="premium-btn" style={{width: '100%', marginTop: '20px'}}>
          {loading ? 'Searching Trains...' : 'Search Trains'}
        </button>
      </form>

      {/* Display search results if trains are found and the booking form is not active */}
      <div className="premium-card-grid">
        {loading ? (
             <>
                 <div className="skeleton-card" />
                 <div className="skeleton-card" style={{animationDelay: '0.2s'}} />
                 <div className="skeleton-card" style={{animationDelay: '0.4s'}} />
             </>
        ) : trains.length > 0 && !showBookingForm ? (
            trains.map((train, idx) => (
              <div key={train._id} className="glass-panel premium-item-card animate-fade-in-up" style={{animationDelay: `${idx * 0.15}s`}}>
                <div className="premium-item-header">
                  <div>
                      <h3 style={{margin: 0, fontSize: '1.2rem'}}>{train.trainName}</h3>
                      <span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{train.trainNumber}</span>
                  </div>
                  <span className="premium-price">${train.fare}</span>
                </div>
                <div className="premium-detail-row">
                    <span>{train.fromStation} &rarr; {train.toStation}</span>
                    <span style={{color: train.availableSeats > 0 ? '#00d2d3' : '#ff7675'}}>{train.availableSeats} Seats</span>
                </div>
                <div className="premium-detail-row" style={{marginTop: '10px', marginBottom: '20px'}}>
                    <strong>Dep:</strong> {train.departureTime}
                    <strong style={{marginLeft: '10px'}}>Arr:</strong> {train.arrivalTime}
                </div>
                <button className="premium-btn" onClick={() => handleBookNow(train)}>Book Now</button>
              </div>
            ))
        ) : trains.length === 0 && !loading && (fromStation || toStation || departureDate) ? (
            <p style={{textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)'}}>No trains found for your selected criteria.</p>
        ) : null}

        {/* Display the booking form when a train is selected */}
        {showBookingForm && selectedTrain && (
          <div className="glass-panel premium-item-card animate-fade-in-up" style={{gridColumn: '1 / -1', background: 'rgba(108, 92, 231, 0.1)'}}>
            <h3 className="gradient-text" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Confirm Booking for {selectedTrain.trainName}</h3>
            <p style={{marginBottom: '5px'}}><strong>Route:</strong> {selectedTrain.fromStation} to {selectedTrain.toStation}</p>
            <p style={{marginBottom: '5px'}}><strong>Time:</strong> {selectedTrain.departureTime} on {new Date(departureDate).toLocaleDateString('en-GB')}</p>
            <p style={{marginBottom: '5px'}}><strong>Passengers:</strong> {passengers}</p>
            <p style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', marginTop: '10px'}}>Total Price: ${selectedTrain.fare * passengers}</p>

            <form onSubmit={handleConfirmBooking} className="premium-form-grid">
              <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Your Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
              />
              <button type="submit" className="premium-btn">Proceed to Payment</button>
              <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setShowBookingForm(false)}>Cancel</button>
            </form>
          </div>
        )}
      </div>

      {showPayment && selectedTrain && (
        <PaymentModal
          amount={selectedTrain.fare * passengers}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {bookedTrain && (
        <div className="booking-form-container" style={{marginTop: '30px', width: '100%'}}>
          <h2><Train className="icon" /> Live Train Tracking: {bookedTrain.trainNumber}</h2>
          <LiveTrackingMap type="train" startCoords={[20.2961, 85.8245]} endCoords={[28.6139, 77.2090]} height="400px" />
        </div>
      )}
    </div>
  );
};

export default TrainBookingPage;