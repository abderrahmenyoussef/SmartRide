const asyncHandler = require('express-async-handler');
const Trajet = require('../models/Trajet');
const { v4: uuidv4 } = require('uuid');

// Fonctions du contrôleur pour gérer les trajets
const getTrajets = asyncHandler(async (req, res) => {
    const { depart, destination, dateDepart, placesMin } = req.query;
    
    let filter = {};
    
    // Filtres optionnels
    if (depart) {
        filter.depart = { $regex: depart, $options: 'i' };
    }
    if (destination) {
        filter.destination = { $regex: destination, $options: 'i' };
    }
    if (dateDepart) {
        const date = new Date(dateDepart);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        filter.dateDepart = { $gte: date, $lt: nextDay };
    }
    if (placesMin) {
        filter.placesDisponibles = { $gte: parseInt(placesMin) };
    }
    
    const trajets = await Trajet.find(filter).sort({ dateDepart: 1 });
    
    res.json({
        success: true,
        message: 'Liste des trajets',
        trajets
    });
});

// Fonction pour récupérer un trajet par ID
const getTrajetById = asyncHandler(async (req, res) => {
    const trajet = await Trajet.findById(req.params.id);
    
    if (!trajet) {
        res.status(404);
        throw new Error('Trajet non trouvé');
    }
    
    res.json({
        success: true,
        message: 'Trajet trouvé',
        trajet
    });
});

// Fonction pour récupérer les trajets créés par l'utilisateur connecté
const getMesTrajets = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est conducteur
    if (req.user.role !== 'conducteur') {
        res.status(403);
        throw new Error('Accès refusé : cette fonctionnalité est réservée aux conducteurs');
    }
    
    const trajets = await Trajet.find({ conducteurId: req.user._id }).sort({ dateDepart: -1 });
    
    res.json({
        success: true,
        message: 'Vos trajets',
        trajets
    });
});

// Fonction pour récupérer les réservations de l'utilisateur connecté
const getMesReservations = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est passager
    if (req.user.role !== 'passager') {
        res.status(403);
        throw new Error('Accès refusé : cette fonctionnalité est réservée aux passagers');
    }
    
    const trajets = await Trajet.find({
        'reservations.passagerId': req.user._id
    }).sort({ dateDepart: -1 });
    
    res.json({
        success: true,
        message: 'Vos réservations',
        trajets
    });
});

// Fonction pour créer un nouveau trajet
const createTrajet = asyncHandler(async (req, res) => {
    const { depart, destination, dateDepart, placesDisponibles, prix, description } = req.body;
    
    // Vérifier que tous les champs requis sont présents
    if (!depart || !destination || !dateDepart || !placesDisponibles || !prix) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs obligatoires');
    }
    
    // Créer le trajet
    const trajet = await Trajet.create({
        depart,
        destination,
        conducteurId: req.user._id,
        conducteurNom: req.user.username,
        dateDepart,
        placesDisponibles,
        prix,
        description
    });
    
    res.status(201).json({
        success: true,
        message: 'Trajet créé avec succès',
        trajet
    });
});

// Fonction pour mettre à jour un trajet
const updateTrajet = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est conducteur
    if (req.user.role !== 'conducteur') {
        res.status(403);
        throw new Error('Accès refusé : seuls les conducteurs peuvent modifier des trajets');
    }
    
    const trajet = await Trajet.findById(req.params.id);
    
    if (!trajet) {
        res.status(404);
        throw new Error('Trajet non trouvé');
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (trajet.conducteurId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Non autorisé à modifier ce trajet');
    }
    
    // Mettre à jour les champs
    const { depart, destination, dateDepart, placesDisponibles, prix, description } = req.body;
    
    if (depart) trajet.depart = depart;
    if (destination) trajet.destination = destination;
    if (dateDepart) trajet.dateDepart = dateDepart;
    if (placesDisponibles) trajet.placesDisponibles = placesDisponibles;
    if (prix) trajet.prix = prix;
    if (description !== undefined) trajet.description = description;
    
    const updatedTrajet = await trajet.save();
    
    res.json({
        success: true,
        message: 'Trajet mis à jour avec succès',
        trajet: updatedTrajet
    });
});

// Fonction pour supprimer un trajet
const deleteTrajet = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est conducteur
    if (req.user.role !== 'conducteur') {
        res.status(403);
        throw new Error('Accès refusé : seuls les conducteurs peuvent supprimer des trajets');
    }
    
    const trajet = await Trajet.findById(req.params.id);
    
    if (!trajet) {
        res.status(404);
        throw new Error('Trajet non trouvé');
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (trajet.conducteurId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Non autorisé à supprimer ce trajet');
    }
    
    // Vérifier qu'il n'y a pas de réservations
    if (trajet.reservations && trajet.reservations.length > 0) {
        res.status(400);
        throw new Error('Impossible de supprimer un trajet avec des réservations');
    }
    
    await trajet.deleteOne();
    
    res.json({
        success: true,
        message: 'Trajet supprimé avec succès'
    });
});

// Fonction pour réserver un trajet
const bookTrajet = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est passager
    if (req.user.role !== 'passager') {
        res.status(403);
        throw new Error('Accès refusé : seuls les passagers peuvent réserver des trajets');
    }
    
    const { places } = req.body;
    
    if (!places || places < 1) {
        res.status(400);
        throw new Error('Nombre de places invalide');
    }
    
    const trajet = await Trajet.findById(req.params.id);
    
    if (!trajet) {
        res.status(404);
        throw new Error('Trajet non trouvé');
    }
    
    // Vérifier qu'il n'a pas déjà réservé
    const existingReservation = trajet.reservations.find(
        r => r.passagerId.toString() === req.user._id.toString()
    );
    
    if (existingReservation) {
        res.status(400);
        throw new Error('Vous avez déjà réservé ce trajet');
    }
    
    // Vérifier les places disponibles
    const placesRestantes = trajet.placesDisponibles - trajet.placesReservees;
    if (places > placesRestantes) {
        res.status(400);
        throw new Error(`Seulement ${placesRestantes} place(s) disponible(s)`);
    }
    
    // Créer la réservation
    const reservation = {
        _id: uuidv4(),
        passagerId: req.user._id,
        passagerNom: req.user.username,
        places,
        dateReservation: new Date()
    };
    
    trajet.reservations.push(reservation);
    trajet.placesReservees += places;
    
    await trajet.save();
    
    res.status(201).json({
        success: true,
        message: 'Réservation effectuée avec succès',
        reservation,
        trajet
    });
});

// Fonction pour annuler une réservation
const cancelReservation = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est passager
    if (req.user.role !== 'passager') {
        res.status(403);
        throw new Error('Accès refusé : seuls les passagers peuvent annuler des réservations');
    }
    
    const { trajetId, reservationId } = req.params;
    
    const trajet = await Trajet.findById(trajetId);
    
    if (!trajet) {
        res.status(404);
        throw new Error('Trajet non trouvé');
    }
    
    // Trouver la réservation
    const reservationIndex = trajet.reservations.findIndex(
        r => r._id === reservationId
    );
    
    if (reservationIndex === -1) {
        res.status(404);
        throw new Error('Réservation non trouvée');
    }
    
    const reservation = trajet.reservations[reservationIndex];
    
    // Vérifier que l'utilisateur est le propriétaire de la réservation
    if (reservation.passagerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Non autorisé à annuler cette réservation');
    }
    
    // Supprimer la réservation
    trajet.placesReservees -= reservation.places;
    trajet.reservations.splice(reservationIndex, 1);
    
    await trajet.save();
    
    res.json({
        success: true,
        message: 'Réservation annulée avec succès'
    });
});

// @desc    Modifier une réservation
// @route   PUT /api/trajets/:trajetId/reservations/:reservationId
// @access  Private (passenger only)
const updateReservation = asyncHandler(async (req, res) => {
    // Vérifier que l'utilisateur est passager
    if (req.user.role !== 'passager') {
        res.status(403);
        throw new Error('Accès refusé : seuls les passagers peuvent modifier des réservations');
    }
    
    const { trajetId, reservationId } = req.params;
    const { places } = req.body;
    
    if (!places || places < 1) {
        res.status(400);
        throw new Error('Nombre de places invalide');
    }
    
    const trajet = await Trajet.findById(trajetId);
    
    if (!trajet) {
        res.status(404);
        throw new Error('Trajet non trouvé');
    }
    
    // Trouver la réservation
    const reservationIndex = trajet.reservations.findIndex(
        r => r._id === reservationId
    );
    
    if (reservationIndex === -1) {
        res.status(404);
        throw new Error('Réservation non trouvée');
    }
    
    const reservation = trajet.reservations[reservationIndex];
    
    // Vérifier que l'utilisateur est le propriétaire de la réservation
    if (reservation.passagerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Non autorisé à modifier cette réservation');
    }
    
    // Calculer la différence de places
    const anciennesPlaces = reservation.places;
    const difference = places - anciennesPlaces;
    
    // Vérifier les places disponibles si augmentation
    if (difference > 0) {
        const placesRestantes = trajet.placesDisponibles - trajet.placesReservees;
        if (difference > placesRestantes) {
            res.status(400);
            throw new Error(`Seulement ${placesRestantes} place(s) disponible(s) en plus`);
        }
    }
    
    // Mettre à jour la réservation
    trajet.reservations[reservationIndex].places = places;
    trajet.placesReservees += difference;
    
    await trajet.save();
    
    res.json({
        success: true,
        message: 'Réservation modifiée avec succès',
        reservation: trajet.reservations[reservationIndex],
        trajet
    });
});

module.exports = {
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
};
