// ./models/Hotel.js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    pricePerNight: {
        type: Number,
        required: true,
        min: 0,
    },
    amenities: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    availableRooms: {
        type: Number,
        required: true,
        min: 0,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Hotel', HotelSchema);