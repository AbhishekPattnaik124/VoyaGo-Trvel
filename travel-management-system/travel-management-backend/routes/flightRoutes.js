const express = require('express');
const router = express.Router();
const { sendFlightBookingEmail } = require('../utils/emailSender');
const FlightBooking = require('../models/FlightBooking');

// Route for flight search (Using strictly mock data as requested, entirely free native structure)
router.get('/search', async (req, res) => {
    const { from, to, departureDate, adults } = req.query;

    console.log(`Searching flights from ${from || 'N/A'} to ${to || 'N/A'} on ${departureDate || 'N/A'}... Using Mock Database.`);

    // Dummy data to mimic an API response natively
    const dummyFlightResponse = {
        data: [
            {
                type: 'flight-offer',
                id: '1',
                source: 'NATIVE',
                lastTicketingDate: '2025-09-08',
                itineraries: [
                    {
                        duration: 'PT2H40M',
                        segments: [
                            {
                                departure: { iataCode: from || 'DEL', at: `${departureDate || '2025-09-08'}T08:00:00` },
                                arrival: { iataCode: to || 'BOM', at: `${departureDate || '2025-09-08'}T10:40:00` },
                                carrierCode: '6E', number: '123'
                            }
                        ]
                    }
                ],
                price: { currency: 'USD', total: '150.00', base: '120.00' }
            },
            {
                type: 'flight-offer',
                id: '2',
                source: 'NATIVE',
                lastTicketingDate: '2025-09-08',
                itineraries: [
                    {
                        duration: 'PT3H05M',
                        segments: [
                            {
                                departure: { iataCode: from || 'DEL', at: `${departureDate || '2025-09-08'}T12:00:00` },
                                arrival: { iataCode: to || 'BOM', at: `${departureDate || '2025-09-08'}T15:05:00` },
                                carrierCode: 'UK', number: '456'
                            }
                        ]
                    }
                ],
                price: { currency: 'USD', total: '220.00', base: '180.00' }
            }
        ],
        meta: { count: 2 }
    };

    res.json(dummyFlightResponse);
});

// Route for flight booking
router.post('/book', async (req, res) => {
    try {
        const { passengerName, email, flightNumber, origin, destination, departureTime, price } = req.body;
        
        const bookingId = 'ATX-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const newBooking = new FlightBooking({
            passengerName, email, flightNumber, origin, destination, departureTime, price, bookingId, status: 'Confirmed'
        });
        await newBooking.save();
        
        await sendFlightBookingEmail(email, {
            passengerName, flightNumber, origin, destination, departureTime, price, bookingId, status: 'Confirmed'
        });
        
        res.status(200).json({ message: 'Flight booked successfully and email sent.', booking: newBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to book flight.' });
    }
});

router.get('/bookings', async (req, res) => {
    try {
        const bookings = await FlightBooking.find();
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

router.delete('/bookings/:id', async (req, res) => {
    try {
        await FlightBooking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Flight booking cancelled.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;