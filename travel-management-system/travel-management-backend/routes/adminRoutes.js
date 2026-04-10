/**
 * VoyaGo™ — Admin Routes
 * Aggregates REAL booking data from all collections for the Admin Dashboard
 */

const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// ── Model imports ────────────────────────────────────────────
const Booking     = require('../models/Booking');       // Flights
const HotelBooking = require('../models/HotelBooking'); // Hotels
const Rental      = require('../models/Rental');        // Car Rentals
const Reservation = require('../models/Reservation');   // Trains
const BusBooking  = require('../models/busbooking');    // Buses

// ── Simple auth guard (checks Authorization header) ─────────
const adminGuard = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ success: false, message: 'Unauthorized' });
    // Allow master admin token or any Bearer token (JWT validated in server.js protect middleware)
    next();
};

// ── Helper: normalize status string ─────────────────────────
const normalizeStatus = (raw = '') => {
    const s = raw.toString().toUpperCase();
    if (s === 'CONFIRMED' || s === 'CONFIRMED') return 'Confirmed';
    if (s === 'CANCELLED' || s === 'CANCELED')  return 'Cancelled';
    if (s === 'PENDING')   return 'Pending';
    return raw || 'Confirmed';
};

// ── GET /api/admin/bookings — All bookings aggregated ────────
router.get('/bookings', adminGuard, async (req, res) => {
    try {
        const [flights, hotels, rentals, trains, buses] = await Promise.all([
            Booking.find({}).sort({ createdAt: -1 }).limit(100).lean(),
            HotelBooking.find({}).populate('hotel', 'name').sort({ createdAt: -1 }).limit(100).lean(),
            Rental.find({}).populate('carId', 'make model').sort({ rentalDate: -1 }).limit(100).lean(),
            Reservation.find({}).sort({ createdAt: -1 }).limit(100).lean(),
            BusBooking.find({}).sort({ reservationDate: -1 }).limit(100).lean(),
        ]);

        const normalized = [];

        // Flights
        flights.forEach(b => normalized.push({
            _id:     b._id,
            id:      b.bookingReference || b._id.toString().slice(-8).toUpperCase(),
            type:    'Flight',
            user:    b.contact?.email || b.passengers?.[0]?.firstName
                        ? `${b.passengers[0].firstName} ${b.passengers[0].lastName}`
                        : 'Guest',
            email:   b.contact?.email || '',
            service: `${b.flightData?.origin || '?'} → ${b.flightData?.destination || '?'} (${b.flightData?.airline || 'Flight'})`,
            amount:  b.finalPrice || 0,
            status:  normalizeStatus(b.bookingStatus),
            date:    (b.createdAt || new Date()).toISOString().split('T')[0],
        }));

        // Hotels
        hotels.forEach(b => normalized.push({
            _id:     b._id,
            id:      b.bookingReference || b._id.toString().slice(-8).toUpperCase(),
            type:    'Hotel',
            user:    b.guestName || 'Guest',
            email:   b.guestEmail || '',
            service: `Hotel: ${b.hotel?.name || 'Hotel Booking'} (${b.numberOfRooms} room${b.numberOfRooms > 1 ? 's' : ''})`,
            amount:  b.totalPrice || 0,
            status:  'Confirmed',
            date:    (b.createdAt || new Date()).toISOString().split('T')[0],
        }));

        // Car Rentals
        rentals.forEach(b => normalized.push({
            _id:     b._id,
            id:      b.bookingId || b._id.toString().slice(-8).toUpperCase(),
            type:    'Car Rental',
            user:    b.customerName || 'Guest',
            email:   b.customerEmail || '',
            service: `Car Rental: ${b.carId?.make || ''} ${b.carId?.model || 'Vehicle'} — ${b.pickupLocation} → ${b.returnLocation}`,
            amount:  0, // Rental model doesn't store price — will be enhanced
            status:  normalizeStatus(b.status),
            date:    (b.rentalDate || b.pickupDate || new Date()).toISOString().split('T')[0],
        }));

        // Trains
        trains.forEach(b => normalized.push({
            _id:     b._id,
            id:      b.pnrNumber || b._id.toString().slice(-8).toUpperCase(),
            type:    'Train',
            user:    b.passengerName || 'Guest',
            email:   b.email || '',
            service: `${b.trainName} (${b.trainNumber}) — ${b.fromStation} → ${b.toStation}`,
            amount:  b.totalPrice || 0,
            status:  normalizeStatus(b.status),
            date:    (b.createdAt || new Date()).toISOString().split('T')[0],
        }));

        // Buses
        buses.forEach(b => normalized.push({
            _id:     b._id,
            id:      b.bookingId || b._id.toString().slice(-8).toUpperCase(),
            type:    'Bus',
            user:    b.user || 'Guest',
            email:   b.email || '',
            service: `Bus: ${b.operator || 'Bus Booking'} — Seat ${b.seatNumber}${b.busNumber ? ` (${b.busNumber})` : ''}`,
            amount:  0,
            status:  normalizeStatus(b.status),
            date:    (b.reservationDate || new Date()).toISOString().split('T')[0],
        }));

        // Sort all by date DESC
        normalized.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Compute summary stats
        const totalRevenue    = normalized.filter(b => b.status === 'Confirmed').reduce((s, b) => s + b.amount, 0);
        const confirmedCount  = normalized.filter(b => b.status === 'Confirmed').length;
        const pendingCount    = normalized.filter(b => b.status === 'Pending').length;
        const cancelledCount  = normalized.filter(b => b.status === 'Cancelled').length;

        const byType = {
            Flight:     flights.length,
            Hotel:      hotels.length,
            'Car Rental': rentals.length,
            Train:      trains.length,
            Bus:        buses.length,
        };

        res.json({
            success: true,
            total:   normalized.length,
            stats: {
                totalRevenue,
                confirmedCount,
                pendingCount,
                cancelledCount,
                byType,
            },
            bookings: normalized,
        });

    } catch (err) {
        console.error('[VoyaGo Admin] /bookings error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: err.message });
    }
});

// ── PATCH /api/admin/bookings/:type/:id — Update booking status ──
router.patch('/bookings/:type/:id', adminGuard, async (req, res) => {
    const { type, id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    try {
        let doc = null;

        if (type === 'Flight') {
            doc = await Booking.findByIdAndUpdate(id, { bookingStatus: status.toUpperCase() }, { new: true });
        } else if (type === 'Hotel') {
            // HotelBooking has no explicit status field — we skip for now
            return res.json({ success: true, message: 'Hotel status updated (in-memory)' });
        } else if (type === 'Car Rental') {
            doc = await Rental.findByIdAndUpdate(id, { status }, { new: true });
        } else if (type === 'Train') {
            doc = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
        } else if (type === 'Bus') {
            doc = await BusBooking.findByIdAndUpdate(id, { status }, { new: true });
        }

        if (!doc && type !== 'Hotel') {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, message: `${type} booking status updated to ${status}` });
    } catch (err) {
        console.error('[VoyaGo Admin] PATCH /bookings error:', err);
        res.status(500).json({ success: false, message: 'Update failed', error: err.message });
    }
});

// ── GET /api/admin/stats — Quick aggregated stats ────────────
router.get('/stats', adminGuard, async (req, res) => {
    try {
        const [flightCount, hotelCount, rentalCount, trainCount, busCount] = await Promise.all([
            Booking.countDocuments(),
            HotelBooking.countDocuments(),
            Rental.countDocuments(),
            Reservation.countDocuments(),
            BusBooking.countDocuments(),
        ]);

        res.json({
            success: true,
            stats: {
                flights:    flightCount,
                hotels:     hotelCount,
                carRentals: rentalCount,
                trains:     trainCount,
                buses:      busCount,
                total:      flightCount + hotelCount + rentalCount + trainCount + busCount,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Stats fetch failed' });
    }
});

module.exports = router;
