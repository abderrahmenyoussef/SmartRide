const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db')
const app = express();
const PORT = process.env.PORT || 3000;

// connexion à la base de données
connectDB();

// Initial route pour tester l'API
app.get('/', (req, res) => {
    res.send('Bienvenue sur la page d\'accueil de mon API de SmartRide!')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});