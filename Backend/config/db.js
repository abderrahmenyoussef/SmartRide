const mangoose = require('mongoose');

const connectDB = async () => {
    try {
        await mangoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB');}
    catch (error) {
        console.error('Erreur de connexion à MongoDB :', error.message);
        process.exit(1);
    }  } 

module.exports = connectDB;    