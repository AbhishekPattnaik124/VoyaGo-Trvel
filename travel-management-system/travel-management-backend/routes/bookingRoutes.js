const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Import your Mongoose Booking model

// POST /api/bookings
// This route is for creating a new booking. It receives flight and passenger details
// from the frontend and saves them to the database.
router.post('/', async (req, res) => {
    try {
        // Extract data from the request body
        const { flightData, passengers, contact, finalPrice, currency } = req.body;

        // Create a new booking instance using the Booking model
        const newBooking = new Booking({
            flightData,
            passengers,
            contact,
            finalPrice,
            currency,
            // A booking reference is generated automatically by the model's pre-save hook
            // You can also set a default status here
            bookingStatus: 'CONFIRMED' 
        });

        // Save the booking to the database
        const savedBooking = await newBooking.save();

        // Send a success response back to the client
        res.status(201).json({
            message: 'Booking successfully created!',
            booking: savedBooking
        });

    } catch (err) {
        // If an error occurs, send a 500 status code with the error message
        res.status(500).json({ message: err.message });
    }
});