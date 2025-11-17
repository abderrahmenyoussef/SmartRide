const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db')
const { userErrorHandler, urlnotfound } = require('./middleware/errorMiddleware');
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/userRoutes');

// Middleware pour parser le JSON
app.use(express.json());

// connexion à la base de données
connectDB();

// Initial route pour tester l'API
app.get('/', (req, res) => {
    res.send('Bienvenue sur la page d\'accueil de mon API de SmartRide!')
})

// Routes utilisateur
app.use('/api/users', userRoutes);

// Middleware de gestion d'erreurs
app.use(urlnotfound);
app.use(userErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});