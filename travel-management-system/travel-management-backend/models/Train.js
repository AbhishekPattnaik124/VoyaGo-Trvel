const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  travelDuration: { type: String },
  fare: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  classes: [String],
});

module.exports = mongoose.model('Train', trainSchema);