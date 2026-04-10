const mongoose = require('mongoose');

const flightBookingSchema = new mongoose.Schema({
    passengerName: { type: String, required: true },
    email: { type: String, required: true },
    flightNumber: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String },
    price: { type: Number },
    bookingId: { type: String, unique: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' },
    bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FlightBooking', flightBookingSchema);
