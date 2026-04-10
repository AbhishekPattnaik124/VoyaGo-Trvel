// D:\travel-website\travel-management-backend\routes\trainRoutes.js

const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const reservationRoutes = require('./reservationRoutes'); // Import the reservation routes

// Connect the reservation routes as a sub-route
router.use('/reservations', reservationRoutes);

// GET /api/trains - Get all trains or search for trains
router.get('/', async (req, res) => {
  const { from, to, date, classes } = req.query;

  try {
    let query = {};
    if (from) {
      query.fromStation = { $regex: from, $options: 'i' };
    }
    if (to) {
      query.toStation = { $regex: to, $options: 'i' };
    }
    // Add logic to filter by classes if a query parameter is provided
    if (classes) {
      // The $in operator finds documents where the 'classes' array contains at least one of the specified values.
      // This allows you to search for multiple classes at once (e.g., ?classes=SL,3A).
      // We split the comma-separated string from the query into an array.
      const classesArray = classes.split(',').map(cls => cls.trim());
      query.classes = { $in: classesArray };
    }

    const trains = await Train.find(query);

    if (trains.length === 0) {
      return res.status(404).json({ message: 'No trains found for your criteria.' });
    }

    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/trains - Add a new train (for dummy data/admin)
router.post('/', async (req, res) => {
  try {
    const newTrain = new Train(req.body);
    await newTrain.save();
    res.status(201).json(newTrain);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Train with this number already exists.' });
    }
    res.status(400).json({ message: 'Error adding train', error: error.message });
  }
});

module.exports = router;