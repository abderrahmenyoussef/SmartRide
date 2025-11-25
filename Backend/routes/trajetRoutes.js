const express = require('express');
const trajetRoutes = express.Router();
const {
    getTrajets,
    getTrajetById,
    getMesTrajets,
    getMesReservations,
    createTrajet,
    updateTrajet,
    deleteTrajet,
    bookTrajet,
    updateReservation,
    cancelReservation
} = require('../controllers/trajetController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// Routes publiques - liste des trajets
trajetRoutes.get('/', getTrajets);

// Routes protégées - utilisateur connecté (AVANT /:id pour éviter les conflits)
trajetRoutes.get('/mes-trajets', protect, getMesTrajets);
trajetRoutes.get('/mes-reservations', protect, getMesReservations);

// Routes publiques - trajet par ID
trajetRoutes.get('/:id', getTrajetById);

// Routes protégées - conducteur uniquement
trajetRoutes.post('/', protect, checkRole('conducteur'), createTrajet);

// Routes protégées - propriétaire uniquement
trajetRoutes.put('/:id', protect, updateTrajet);
trajetRoutes.delete('/:id', protect, deleteTrajet);

// Routes protégées - réservations
trajetRoutes.post('/:id/reservations', protect, bookTrajet);
trajetRoutes.put('/:trajetId/reservations/:reservationId', protect, updateReservation);
trajetRoutes.delete('/:trajetId/reservations/:reservationId', protect, cancelReservation);

module.exports = trajetRoutes;
