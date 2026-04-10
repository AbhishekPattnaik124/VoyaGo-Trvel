// routes/hotelRoutes.js

const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel'); // Make sure your Hotel model is correctly set up

// GET /api/hotels/search - Search for hotels by location
router.get('/search', async (req, res) => {
    try {
        const { location } = req.query;

        // Basic validation for location
        // if (!location) {
        //     return res.status(400).json({ message: 'Missing required search parameters.' });
        // }

        const hotels = await Hotel.find({ location: new RegExp(location, 'i') });

        if (hotels.length === 0) {
            return res.status(404).json({ message: 'No hotels found for your criteria.' });
        }

        res.status(200).json(hotels);
    } catch (error) {
        console.error("Error searching hotels:", error);
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
});

// POST /api/hotels - Add a new dummy hotel
router.post('/', async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json({ message: 'Dummy hotel created!', hotel: savedHotel });
    } catch (error) {
        console.error("Error creating dummy hotel:", error);
        res.status(400).json({ message: 'Failed to create dummy hotel.', details: error.message });
    }
});

module.exports = router;