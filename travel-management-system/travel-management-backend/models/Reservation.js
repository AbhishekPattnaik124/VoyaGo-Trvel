// D:\travel-website\travel-management-backend\models\Reservation.js

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  pnrNumber: {
    type: String,
    required: true,
    unique: true
  },
  trainNumber: {
    type: String,
    required: true
  },
  trainName: {
    type: String,
    required: true
  },
  fromStation: {
    type: String,
    required: true
  },
  toStation: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  passengerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Confirmed'
  }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;