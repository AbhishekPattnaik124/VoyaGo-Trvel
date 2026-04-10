const express = require('express');
const router = express.Router();

// Corrected paths to the models
const BusRoute = require('../models/busbooking.js');
const Bus = require('../models/bus.js');

// GET all bus routes
router.get('/', async (req, res) => {
    try {
        const routes = await BusRoute.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all buses for a specific route
router.get('/:routeId/buses', async (req, res) => {
    try {
        const buses = await Bus.find({ route: req.params.routeId });
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;