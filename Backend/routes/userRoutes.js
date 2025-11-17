const express = require('express');
const UserRoutes = express.Router();
const { createUser, getUsers } = require('../controllers/userController');

// Route pour créer un utilisateur
UserRoutes.post('/add', createUser);

// Route pour récupérer tous les utilisateurs
UserRoutes.get('/all', getUsers);

module.exports = UserRoutes;