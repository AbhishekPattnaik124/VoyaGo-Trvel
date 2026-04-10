const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusRoute',
        required: true
    }
});

module.exports = mongoose.model('Bus', busSchema);