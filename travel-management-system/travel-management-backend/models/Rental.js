const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    returnLocation: {
        type: String,
        required: true,
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    rentalDate: {
        type: Date,
        default: Date.now,
    },
    bookingId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    }
});

module.exports = mongoose.model('Rental', rentalSchema);