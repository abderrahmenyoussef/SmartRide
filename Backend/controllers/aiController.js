const asyncHandler = require('express-async-handler');
const Trajet = require('../models/Trajet');
const User = require('../models/User');
const { sendMessage } = require('../services/openRouterClient');

// Endpoint principal pour la conversation
const chat = asyncHandler(async (req, res) => {
  // Utilisateur identifié via middleware `protect`
  const user = req.user || null;
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400);
    throw new Error('Le champ `message` est requis et doit être une chaîne de caractères');
  }

  // Rassembler des informations utiles depuis la DB
  const now = new Date();

  // Nombre de trajets disponibles (date future + places restantes)
  const availableAgg = await Trajet.aggregate([
    { $addFields: { placesRestantes: { $subtract: ["$placesDisponibles", "$placesReservees"] } } },
    { $match: { dateDepart: { $gte: now }, placesRestantes: { $gt: 0 } } },
    { $count: 'count' }
  ]);
  const availableCount = (availableAgg[0] && availableAgg[0].count) || 0;

  // Plage de prix
  const priceAgg = await Trajet.aggregate([
    { $match: { dateDepart: { $gte: now } } },
    { $group: { _id: null, min: { $min: '$prix' }, max: { $max: '$prix' } } }
  ]);
  const minPrice = priceAgg[0] ? priceAgg[0].min : null;
  const maxPrice = priceAgg[0] ? priceAgg[0].max : null;

  // Exemples de prochains trajets (jusqu'à 5)
  const examples = await Trajet.find({ dateDepart: { $gte: now } })
    .sort({ dateDepart: 1 })
    .limit(5)
    .select('depart destination dateDepart prix placesDisponibles placesReservees conducteurNom');

  // Contexte utilisateur (si présent)
  let userInfoText = 'User not authenticated.';
  if (user) {
    userInfoText = `Utilisateur: ${user.username || 'N/A'} (id: ${user._id}), rôle: ${user.role || 'N/A'}`;
  }

  // Construire le prompt/context pour le modèle
  const systemPrompt = `You are SmartRide customer support assistant. Answer concisely in French. Be helpful, friendly and polite.`; 

  let contextText = `Contexte: ${userInfoText}\nNombre de trajets disponibles (futurs avec places): ${availableCount}`;
  if (minPrice !== null && maxPrice !== null) {
    contextText += `\nPlage de prix actuelle: ${minPrice} - ${maxPrice}`;
  }
  if (examples && examples.length > 0) {
    contextText += `\nExemples de prochains trajets:\n`;
    examples.forEach((t, i) => {
      const placesRestantes = (t.placesDisponibles || 0) - (t.placesReservees || 0);
      contextText += `${i+1}. ${t.depart} → ${t.destination}, le ${t.dateDepart.toISOString()}, prix: ${t.prix}, conducteur: ${t.conducteurNom || 'N/A'}, places restantes: ${placesRestantes}\n`;
    });
  }

  const userMessage = `${contextText}\n\nQuestion utilisateur: ${message}`;

  // Messages formatés pour OpenRouter chat completions
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  // Appel au client OpenRouter
  const assistantReply = await sendMessage(messages, { max_tokens: 600, temperature: 0.2 });

  res.json({ success: true, reply: assistantReply });
});

module.exports = { chat };
