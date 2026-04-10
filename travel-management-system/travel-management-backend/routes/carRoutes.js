const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET /api/cars/search - Search for available cars
router.get('/search', async (req, res) => {
    try {
        const { pickupLocation, type, seats } = req.query;
        let query = {};

        if (pickupLocation) {
            query.location = { $regex: pickupLocation, $options: 'i' }; // Case-insensitive search
        }
        if (type) {
            query.type = type;
        }
        if (seats) {
            query.seats = { $gte: parseInt(seats) }; // Find cars with at least the requested number of seats
        }

        // Only show cars with availableCount > 0
        query.availableCount = { $gt: 0 };

        const cars = await Car.find(query);
        res.json(cars);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while searching for cars.' });
    }
});

// POST /api/cars - Create a new car (for your "Create Dummy Car" button)
router.post('/', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json({ message: 'Car created successfully!', car: newCar });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ message: 'A car with this license plate already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating car.' });
    }
});

module.exports = router;