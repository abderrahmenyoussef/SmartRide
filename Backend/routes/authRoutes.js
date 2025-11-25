const express = require('express');
const authRoutes = express.Router();
const { register, login, verify, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Route pour enregistrer un utilisateur
authRoutes.post('/register', register);

// Route pour se connecter
authRoutes.post('/login', login);

// Route pour vérifier le token JWT (protégée)
authRoutes.get('/verify', protect, verify);

// Route pour se déconnecter (protégée)
authRoutes.post('/logout', protect, logout);

module.exports = authRoutes;