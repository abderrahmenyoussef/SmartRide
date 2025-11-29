const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db')
const { userErrorHandler, urlnotfound } = require('./middleware/authMiddleware');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Middleware pour parser le JSON
app.use(express.json());

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