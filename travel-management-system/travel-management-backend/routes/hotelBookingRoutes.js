const express = require('express');
const router = express.Router();
const HotelBooking = require('../models/HotelBooking');
const Hotel = require('../models/Hotel'); 
const { sendHotelBookingEmail } = require('../utils/emailSender');

// POST /api/hotel-bookings - Create a new hotel booking
router.post('/', async (req, res) => {
    try {
        const { 
            hotelId, 
            guestName, 
            guestEmail, 
            checkInDate, 
            checkOutDate, 
            numberOfRooms, 
            numberOfGuests 
        } = req.body;

        // --- Basic Validation ---
        if (!hotelId || !guestName || !guestEmail || !checkInDate || !checkOutDate || !numberOfRooms || !numberOfGuests) {
            return res.status(400).json({ message: 'Missing required booking data.' });
        }

        // Fetch the full hotel document using the hotelId
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found.' });
        }
        
        // Calculate the number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
        if (nights <= 0) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
        }
        
        // Calculate the total price based on price per night, rooms, and number of nights
        const totalPrice = hotel.pricePerNight * numberOfRooms * nights;

        // Create a unique booking reference
        const bookingReference = `HBK-${Date.now()}`;

        const newBooking = new HotelBooking({
            hotel: hotel._id, 
            guestName,
            guestEmail,
            checkInDate,
            checkOutDate,
            numberOfRooms,
            numberOfGuests,
            bookingReference,
            totalPrice, 
        });

        const savedBooking = await newBooking.save();

        // Send confirmation email 📧
        const bookingDetails = {
            guestName,
            hotelName: hotel.name, 
            location: hotel.location,
            checkInDate,
            checkOutDate,
            bookingReference,
            numberOfRooms,
            numberOfGuests,
            totalPrice,
        };
        
        await sendHotelBookingEmail(guestEmail, bookingDetails);

        res.status(201).json({
            message: 'Hotel booking confirmed and email sent!',
            booking: savedBooking
        });
    } catch (error) {
        console.error("Error creating hotel booking:", error);
        res.status(500).json({ message: 'Failed to create hotel booking.', details: error.message });
    }
});

// GET /api/hotel-bookings - Get all hotel bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await HotelBooking.find().populate('hotel');
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error getting hotel bookings:", error);
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
});

// DELETE /api/hotel-bookings/:id - Cancel a booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await HotelBooking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        await HotelBooking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Hotel booking cancelled successfully' });
    } catch (error) {
        console.error("Error cancelling hotel booking:", error);
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
});

module.exports = router;