from pathlib import Path
from typing import Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import math

# Coordonnées des villes (lat, lon)
CITIES = {
    "Tunis": (36.8065, 10.1815),
    "Sousse": (35.8256, 10.6360),
    "Sfax": (34.7406, 10.7603),
    "Bizerte": (37.2746, 9.8739),
    "Hammamet": (36.4073, 10.6220),
    "Monastir": (35.7643, 10.8113),
    "Gabes": (33.8815, 10.0982),
    "Nabeul": (36.4518, 10.7350),
    "Kairouan": (35.6781, 10.0963),
    "Sidi Bouzid": (35.0405, 9.4855),
    "Tozeur": (33.9188, 8.1220),
    "Gafsa": (34.4250, 8.7842),
    "Kebili": (33.7067, 8.9717),
    "Mahdia": (35.5047, 11.0622),
    "Beja": (36.7333, 9.1833),
    "Jendouba": (36.5011, 8.7802),
    "Msaken": (35.7330, 10.5833),
}


def haversine(coord1, coord2):
    r = 6371  # km
    lat1, lon1 = map(math.radians, coord1)
    lat2, lon2 = map(math.radians, coord2)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


class PriceRequest(BaseModel):
    depart: str = Field(..., description="Ville de départ")
    destination: str = Field(..., description="Ville d'arrivée")
    heure_depart: int = Field(..., ge=0, le=23, description="Heure de départ (0-23)")
    places_disponibles: int = Field(..., ge=1, le=6, description="Places disponibles (1-6)")

    @validator("depart", "destination")
    def normalize_city(cls, v):
        v = v.strip()
        if v not in CITIES:
            raise ValueError(f"Ville inconnue: {v}. Villes supportées: {', '.join(CITIES.keys())}")
        return v

    @validator("destination")
    def not_same_city(cls, v, values):
        if "depart" in values and v == values["depart"]:
            raise ValueError("La destination doit être différente du départ")
        return v


class PriceResponse(BaseModel):
    prix: float
    depart: str
    destination: str
    distance_km: float
    heure_depart: int
    places_disponibles: int


def load_model():
    model_path = Path(__file__).resolve().parent.parent / "models" / "price_model.pkl"
    if not model_path.exists():
        raise FileNotFoundError(f"Modèle introuvable: {model_path}")
    return joblib.load(model_path)


app = FastAPI(title="SmartRide Price Predictor", version="1.0.0")

# CORS pour appels frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = load_model()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=float)
def predict_price(payload: PriceRequest):
    # Calcul de la distance à partir des coordonnées
    distance_km = haversine(CITIES[payload.depart], CITIES[payload.destination])

    sample = pd.DataFrame(
        [
            {
                "depart": payload.depart,
                "destination": payload.destination,
                "distance_km": distance_km,
                "heure_depart": payload.heure_depart,
                "places_disponibles": payload.places_disponibles,
            }
        ]
    )

    try:
        pred = model.predict(sample)[0]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur de prédiction: {exc}") from exc

    # Arrondir au .0 ou .5 le plus proche
    raw = float(pred)
    rounded = round(raw * 2) / 2  # arrondi au demi
    return float(f"{rounded:.1f}")
