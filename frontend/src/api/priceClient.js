const PRICE_API_URL = import.meta.env.VITE_PRICE_API_URL || 'http://localhost:8000';

export async function predictPriceApi({ depart, destination, heure_depart, places_disponibles }) {
  const url = `${PRICE_API_URL.replace(/\/+$/, '')}/predict`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ depart, destination, heure_depart, places_disponibles })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || 'Erreur lors de la prédiction');
  }

  const price = await resp.json();
  if (typeof price !== 'number') {
    throw new Error('Réponse inattendue du service de prédiction');
  }
  return price;
}

export { PRICE_API_URL };
