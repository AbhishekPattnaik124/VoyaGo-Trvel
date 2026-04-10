const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelBookingSchema = new Schema({
    hotel: { 
        type: Schema.Types.ObjectId, 
        ref: 'Hotel', 
        required: true 
    },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfRooms: { type: Number, required: true },
    numberOfGuests: { type: Number, required: true },
    bookingReference: { type: String, required: true, unique: true },
    totalPrice: { type: Number, required: true }, // Required field
}, { timestamps: true });

module.exports = mongoose.model('HotelBooking', HotelBookingSchema);