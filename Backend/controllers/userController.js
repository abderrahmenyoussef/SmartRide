const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// fonction pour créer un nouvel utilisateur
const createUser = asyncHandler(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        const error = new Error('Corps de la requête vide ou manquant');
        error.statusCode = 400;
        throw error;
    }

    const { username, email, password, role } = req.body;

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
});

// fonction pour récupérer tous les utilisateurs
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (users.length === 0) {
        return res.status(200).json({ message: 'Aucun utilisateur trouvé' });
    }
    res.status(200).json({
        message: "Liste des utilisateurs",
        nb_users: users.length,
        users: users
    });
});

module.exports = { createUser, getUsers };