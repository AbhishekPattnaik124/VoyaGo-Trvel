const express = require('express');
const router = express.Router();
const { sendTourBookingEmail } = require('../utils/emailSender');
const { body, validationResult } = require('express-validator');

// @route   POST /api/tours/book
// @desc    Book a tour package
router.post('/book', [
    body('customerName', 'Name is required').not().isEmpty(),
    body('customerEmail', 'Please include a valid email').isEmail(),
    body('tourName', 'Tour name is required').not().isEmpty(),
    body('destination', 'Destination is required').not().isEmpty(),
    body('startDate', 'Start Date is required').not().isEmpty(),
    body('endDate', 'End Date is required').not().isEmpty(),
    body('price', 'Price is required').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { customerName, customerEmail, tourName, destination, startDate, endDate, price } = req.body;
        
        const bookingDetails = {
            customerName, tourName, destination, startDate, endDate, price
        };
        
        await sendTourBookingEmail(customerEmail, bookingDetails);

        res.status(200).json({ msg: 'Tour package successfully booked and email sent', booking: bookingDetails });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
