const mongoose = require('mongoose');
const ReservationSchema = require('./Reservation');

const TrajetSchema = new mongoose.Schema({
    depart: { 
        type: String, 
        required: true 
    },
    destination: { 
        type: String, 
        required: true 
    },
    conducteurId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    conducteurNom: { 
        type: String 
    },
    dateDepart: { 
        type: Date, 
        required: true 
    },
    placesDisponibles: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    placesReservees: { 
        type: Number, 
        default: 0 
    },
    prix: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    dateCreation: { 
        type: Date, 
        default: Date.now 
    },
    reservations: [ReservationSchema]
},
{
    timestamps: true,
    collection: "trajets"
});

module.exports = mongoose.model('Trajet', TrajetSchema);
