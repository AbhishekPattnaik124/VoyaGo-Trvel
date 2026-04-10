const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Car = require('../models/Car');
const emailSender = require('../utils/emailSender'); // Import the email sender utility

// POST /api/rentals - Create a new car rental
router.post('/', async (req, res) => {
    try {
        const { carId, customerName, customerEmail, pickupDate, returnDate, returnLocation } = req.body;

        const updatedCar = await Car.findOneAndUpdate(
            { _id: carId, availableCount: { $gt: 0 } },
            { $inc: { availableCount: -1 } },
            { new: true }
        );

        if (!updatedCar) {
            return res.status(400).json({ message: 'This car is currently unavailable for booking or does not exist.' });
        }

        const bookingId = 'ATX-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const newRental = new Rental({
            carId,
            customerName,
            customerEmail,
            pickupLocation: updatedCar.location,
            returnLocation,
            pickupDate,
            returnDate,
            bookingId,
            status: 'Confirmed'
        });

        await newRental.save();
        
        // This is a crucial step for the email. We need to get the full car object.
        const populatedRental = await newRental.populate('carId');

        // Send a confirmation email after a successful rental
        if (populatedRental) {
            await emailSender.sendCarRentalConfirmation({
                customerEmail: populatedRental.customerEmail,
                customerName: populatedRental.customerName,
                pickupDate: populatedRental.pickupDate,
                returnDate: populatedRental.returnDate,
                pickupLocation: populatedRental.pickupLocation,
                returnLocation: populatedRental.returnLocation,
                car: populatedRental.carId, // Pass the populated car object to the email sender
                bookingId: populatedRental.bookingId,
                status: populatedRental.status
            });
        }

        res.status(201).json({
            message: 'Car rented successfully!',
            rental: populatedRental,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while creating rental.' });
    }
});

// GET /api/rentals - Get all rentals
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().populate('carId');
        res.json(rentals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching rentals.' });
    }
});

// DELETE /api/rentals/:id - Cancel a rental
router.delete('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ message: 'Rental not found' });
        
        // Restore car availability
        await Car.findByIdAndUpdate(rental.carId, { $inc: { availableCount: 1 } });
        
        await Rental.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Car rental cancelled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while cancelling rental.' });
    }
});

module.exports = router;
