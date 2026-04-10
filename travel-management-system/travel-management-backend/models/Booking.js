// models/Booking.js
const mongoose = require('mongoose');

// Simplified schema for the flight data
const flightDataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    airline: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    duration: { type: String },
}, { _id: false });

// Passenger and contact schemas remain the same as they are generic
const passengerSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'], required: true },
    travelerType: { type: String, enum: ['ADULT', 'CHILD', 'INFANT'], required: true },
}, { _id: false });

const contactSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
    bookingReference: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // The simplified flight data to be stored with the booking
    flightData: {
        type: flightDataSchema,
        required: true
    },
    passengers: [passengerSchema],
    contact: { type: contactSchema, required: true },
    finalPrice: {
        type: Number, // Changed to a Number as we are no longer constrained by Amadeus's string type
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD' // Default to USD or another currency
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PENDING'
    },
    bookingStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED'],
        default: 'PENDING'
    }
}, { timestamps: true });

// Pre-save hook to generate a unique booking reference
bookingSchema.pre('save', async function(next) {
    if (this.isNew && !this.bookingReference) {
        let reference = '';
        let isUnique = false;
        while (!isUnique) {
            reference = Math.random().toString(36).substring(2, 10).toUpperCase();
            const existingBooking = await mongoose.models.Booking.findOne({ bookingReference: reference });
            if (!existingBooking) {
                isUnique = true;
            }
        }
        this.bookingReference = reference;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);