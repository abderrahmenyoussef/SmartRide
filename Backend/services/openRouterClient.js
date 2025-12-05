const axios = require('axios');

const OPENROUTER_URL = process.env.OPENROUTER_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;

if (!OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY is not set. The OpenRouter client will fail without it.');
}

if (!OPENROUTER_URL) {
  console.warn('OPENROUTER_URL is not set. The OpenRouter client will fail without it.');
}

if (!OPENROUTER_MODEL) {
  console.warn('OPENROUTER_MODEL is not set. The OpenRouter client will fail without it.');
}

async function sendMessage(messages = [], options = {}) {
  // Validate configuration before making request
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY non configurée. Veuillez ajouter votre clé dans le fichier .env');
  }
  
  if (!OPENROUTER_URL) {
    throw new Error('OPENROUTER_URL non configurée. Vérifiez votre fichier .env');
  }
  
  if (!OPENROUTER_MODEL) {
    throw new Error('OPENROUTER_MODEL non configuré. Vérifiez votre fichier .env');
  }

  try {
    const url = `${OPENROUTER_URL.replace(/\/+$/,'')}/chat/completions`;

    const payload = {
      model: OPENROUTER_MODEL,
      messages,
      ...options
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`
    };

    const resp = await axios.post(url, payload, { headers, timeout: 30000 });

    // Try to extract assistant text from common response shapes
    const data = resp.data;
    if (!data) return null;

    // OpenRouter usually returns choices[0].message.content
    const choice = data.choices && data.choices[0];
    if (choice && choice.message && choice.message.content) {
      return choice.message.content;
    }

    // Fallback: check choices[0].text
    if (choice && choice.text) {
      return choice.text;
    }

    // If responses are in data.output_text or similar
    if (data.output_text) return data.output_text;

    return JSON.stringify(data);
  } catch (error) {
    // Better error logging with details
    if (error.code === 'ENOTFOUND') {
      console.error('OpenRouter client error: DNS lookup failed for', OPENROUTER_URL);
      console.error('Vérifiez que OPENROUTER_URL est correcte dans votre .env');
      throw new Error(`Impossible de joindre OpenRouter (DNS error). Vérifiez OPENROUTER_URL: ${OPENROUTER_URL}`);
    }
    
    if (error.response) {
      console.error('OpenRouter API error:', error.response.status, error.response.data);
      // Handle rate limit specially if present
      if (error.response.status === 429) {
        const rateLimitError = new Error(`Le modèle ${OPENROUTER_MODEL} est temporairement limité ou saturé (429). Réessayez dans quelques instants. Détails: ${error.response.data?.error?.message || JSON.stringify(error.response.data)}`);
        rateLimitError.statusCode = 429;
        throw rateLimitError;
      }
      const apiError = new Error(`Erreur OpenRouter (${error.response.status}) avec le modèle ${error.response.data?.model || OPENROUTER_MODEL}: ${JSON.stringify(error.response.data)}`);
      apiError.statusCode = error.response.status;
      throw apiError;
    }
    
    console.error('OpenRouter client error:', error.message || error);
    throw new Error(`Erreur lors de la requête vers OpenRouter: ${error.message}`);
  }
}

module.exports = { sendMessage };