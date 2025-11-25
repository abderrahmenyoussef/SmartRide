const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { revokedTokens } = require('../controllers/authController');

// Middleware pour protéger les routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupérer le token depuis le header
            token = req.headers.authorization.split(' ')[1];

            // Vérifier si le token est révoqué
            if (revokedTokens.has(token)) {
                res.status(401);
                throw new Error('Token révoqué, veuillez vous reconnecter');
            }

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupérer l'utilisateur depuis la DB 
            req.user = await User.findById(decoded.id);

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Non autorisé, token invalide');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Non autorisé, pas de token');
    }
});

const urlnotfound = (req, res, next) => {
    const error = new Error(`URL Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const userErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message;

    // Gestion des erreurs classiques de Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Les données fournies sont invalides ou incomplètes';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID invalide';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Email ou Username dupliqué';
    } 
    res.status(statusCode);
    res.json({
        message: "Erreur détectée avec le Middleware",
        error: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { protect, urlnotfound, userErrorHandler };