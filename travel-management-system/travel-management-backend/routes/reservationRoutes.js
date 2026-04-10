// D:\travel-website\travel-management-backend\routes\reservationRoutes.js

const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); 
const { sendReservationEmail } = require('../utils/emailSender'); 

// POST /api/trains/reservations - Create a new reservation
router.post('/', async (req, res) => {
  try {
    // Extract data from the request body, which comes from the booking form
    const { 
      trainName, 
      trainNumber, 
      fromStation, 
      toStation, 
      departureTime, 
      totalPrice, 
      passengerName, 
      email 
    } = req.body;

    // Generate a unique PNR number (example: a simple timestamp)
    const pnrNumber = 'ATX-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create a new reservation document
    const newReservation = new Reservation({
      pnrNumber,
      trainName,
      trainNumber,
      fromStation,
      toStation,
      departureTime,
      totalPrice,
      passengerName,
      email,
      status: 'Confirmed'
    });
    
    // Save the reservation to the database
    const savedReservation = await newReservation.save();

    // Send confirmation email 📧
    const bookingDetails = {
      trainName,
      trainNumber,
      fromStation,
      toStation,
      departureTime,
      pnrNumber,
      passengerName,
      totalPrice,
    };
    
    await sendReservationEmail(email, bookingDetails);

    // Send a success response back to the front end
    res.status(201).json({ 
      message: 'Reservation created successfully and confirmation email sent!', 
      reservation: savedReservation 
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(400).json({ message: 'Error confirming booking. Please check console for details.' });
  }
});

// GET /api/trains/reservations/:pnrNumber - Get a reservation by PNR number
router.get('/:pnrNumber', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ pnrNumber: req.params.pnrNumber });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/trains/reservations - Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE /api/trains/reservations/:id - Cancel a reservation
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;