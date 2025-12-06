const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db')
const { userErrorHandler, urlnotfound } = require('./middleware/authMiddleware');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const aiRoutes = require('./routes/aiRoutes');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware pour parser le JSON
app.use(express.json());

// CORS minimal pour le frontend Vite
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// connexion à la base de données
connectDB();

// Initial route pour tester l'API
app.get('/', (req, res) => {
    res.send('Bienvenue sur la page d\'accueil de mon API de SmartRide!')
})

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des trajets
app.use('/api/trajets', trajetRoutes);

// Routes pour l'agent IA (support client)
app.use('/api/ai', aiRoutes);

// Middleware de gestion d'erreurs
app.use(urlnotfound);
app.use(userErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
