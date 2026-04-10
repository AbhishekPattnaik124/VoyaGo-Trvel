const express = require('express');
const router = express.Router();

// Corrected paths to the models
const Bus = require('../models/bus.js');
const BusBooking = require('../models/busbooking.js');

// Import the email sending service
const { sendBusBookingEmail } = require('../utils/emailSender.js');

// POST a new booking with email integration
router.post('/book', async (req, res) => {
    const { busId, seatNumber, userEmail, operator, busNumber } = req.body;
    try {
        // Attempt to find real bus details, but don't fail if mock ID used
        let busDetails = null;
        try {
            busDetails = await Bus.findById(busId);
        } catch (e) {
            // Ignore CastError etc for mock IDs
        }

        const bookingId = 'ATX-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        // Create a new booking
        const newBooking = new BusBooking({
            bus: busDetails ? busId : undefined, // Keep undefined if not a real MongoDB ID
            seatNumber: seatNumber || 0,
            user: userEmail,
            email: userEmail,
            bookingId,
            status: 'Confirmed',
            operator: operator || (busDetails && busDetails.operator),
            busNumber: busNumber || (busDetails && busDetails.busNumber)
        });
        await newBooking.save();

        // Call the email service
        const mockRoute = { source: 'Unknown', destination: 'Unknown' };
        const displayBusInfo = busDetails || { operator: operator || 'Premium Bus', busNumber: busNumber || 'ATX-BUS' };
        sendBusBookingEmail(userEmail, displayBusInfo, mockRoute, newBooking);

        res.status(201).json(newBooking);

    } catch (err) {
        console.error("Booking error:", err);
        res.status(400).json({ message: err.message });
    }
});

// GET all bus bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await BusBooking.find().populate('bus');
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a bus booking
router.delete('/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const deletedBooking = await BusBooking.findByIdAndDelete(bookingId);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json({ message: 'Booking cancelled successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
