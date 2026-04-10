// D:\travel-website\travel-backend\models\Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true, // Flight numbers should be unique
        trim: true
    },
    departureCity: {
        type: String,
        required: true,
        trim: true,
        // Custom setter to convert the input to lowercase before saving
        set: (value) => value.toLowerCase()
    },
    destinationCity: {
        type: String,
        required: true,
        trim: true,
        // Custom setter to convert the input to lowercase before saving
        set: (value) => value.toLowerCase()
    },
    departureDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: false // Optional for one-way flights
    },
    passengers: { // This represents the flight's total capacity
        type: Number,
        required: true,
        min: 0
    },
    class: { // e.g., Economy, Business, First
        type: String,
        enum: ['Economy', 'Business', 'First', 'Premium Economy'],
        default: 'Economy'
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Flight', flightSchema);