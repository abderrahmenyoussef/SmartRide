const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Liste des tokens révoqués (blacklist)
const revokedTokens = new Set();

// Fonction pour générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Fonction pour enregistrer un nouvel utilisateur
const register = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // Vérifier que tous les champs sont présents
    if (!username || !email || !password || !role) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs');
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
        res.status(400);
        throw new Error('Cet utilisateur existe déjà');
    }

    // Créer l'utilisateur
    const user = await User.create({
        username,
        email,
        password,
        role
    });

    if (user) {
        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            token: generateToken(user._id),
            userId: user._id,
            username: user.username,
            role: user.role
        });
    } else {
        res.status(400);
        throw new Error('Données utilisateur invalides');
    }
});

// Fonction pour authentifier un utilisateur
const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    // Vérifier que les champs sont présents
    if (!identifier || !password) {
        res.status(400);
        throw new Error('Veuillez fournir un email/username et un mot de passe');
    }

    // Chercher l'utilisateur par email OU username et inclure le password
    const user = await User.findOne({ 
        $or: [{ email: identifier }, { username: identifier }] 
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            message: 'Connexion réussie',
            token: generateToken(user._id),
            userId: user._id,
            username: user.username,
            role: user.role
        });
    } else {
        res.status(401);
        throw new Error('Identifiant ou mot de passe invalide');
    }
});

// Fonction pour vérifier le token JWT
const verify = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'Token valide',
        user: {
            userId: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Fonction pour déconnecter un utilisateur
const logout = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    
    // Ajouter le token à la blacklist
    revokedTokens.add(token);
    
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

module.exports = { register, login, verify, logout, revokedTokens };