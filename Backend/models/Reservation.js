const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    passagerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    passagerNom: { 
        type: String, 
        required: true 
    },
    places: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    dateReservation: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = ReservationSchema;
