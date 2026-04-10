const mongoose = require('mongoose');

const busBookingSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: false
    },
    seatNumber: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    reservationDate: {
        type: Date,
        default: Date.now
    },
    bookingId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    email: {
        type: String
    },
    // Fallback info for mock buses
    operator: {
        type: String
    },
    busNumber: {
        type: String
    }
});

module.exports = mongoose.model('BusBooking', busBookingSchema);