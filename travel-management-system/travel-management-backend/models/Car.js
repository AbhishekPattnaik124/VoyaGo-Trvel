const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    type: { // e.g., 'Sedan', 'SUV', 'Electric'
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    pricePerDay: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    images: {
        type: [String], // Array of image URLs
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true, // Ensures each car has a unique license plate
    },
    availableCount: {
        type: Number,
        default: 1,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model('Car', carSchema);