import argparse
import csv
import math
import os
import random
from datetime import datetime
from pathlib import Path

# Fixed seed for reproducibility
DEFAULT_SEED = 42

# Rough coordinates for Tunisian cities (lat, lon)
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
}


def haversine(coord1, coord2):
    r = 6371  # Earth radius in km
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


def is_rush_hour(hour):
    return 7 <= hour <= 9 or 16 <= hour <= 18


def route_price_hint(depart, destination, distance_km):
    """
    Renvoie un prix cible (min, max) par couple de villes connu.
    Sinon, calcule une plage en fonction de la distance.
    """
    key = tuple(sorted([depart, destination], key=str.lower))
    presets = {
        tuple(sorted(["Tunis", "Sousse"], key=str.lower)): (11, 13),
        tuple(sorted(["Msaken", "Tunis"], key=str.lower)): (12, 13),  # Msaken ~ Sousse hinterland
        tuple(sorted(["Sousse", "Sfax"], key=str.lower)): (17, 18),
        tuple(sorted(["Tunis", "Bizerte"], key=str.lower)): (5, 8),
        tuple(sorted(["Tunis", "Gabes"], key=str.lower)): (30, 35),
        tuple(sorted(["Sousse", "Gabes"], key=str.lower)): (20, 25),
    }
    if key in presets:
        return presets[key]

    # fallback heuristique selon distance
    if distance_km < 80:
        return (5, 8)
    if distance_km < 150:
        return (10, 15)
    if distance_km < 250:
        return (16, 24)
    if distance_km < 400:
        return (25, 35)
    return (30, 45)


def generate_sample():
    cities = list(CITIES.keys())
    depart = random.choice(cities)
    destination = random.choice([c for c in cities if c != depart])
    distance_km = haversine(CITIES[depart], CITIES[destination])
    hour = random.randint(5, 22)
    seats = random.randint(1, 6)

    # Plage de prix cible selon presets ou distance
    p_min, p_max = route_price_hint(depart, destination, distance_km)
    price = random.uniform(p_min, p_max)

    # Rush hour premium
    if is_rush_hour(hour):
        price *= random.uniform(1.05, 1.15)

    # Plus de places => légère réduction
    seat_factor = 1 + (seats - 1) * 0.03
    price /= seat_factor

    # Légère variabilité
    noise = random.uniform(-1.5, 1.5)
    price = max(4.0, price + noise)

    return {
        "depart": depart,
        "destination": destination,
        "distance_km": round(distance_km, 2),
        "heure_depart": hour,
        "places_disponibles": seats,
        "prix": round(price, 2),
    }


def generate_dataset(n_samples, seed=DEFAULT_SEED):
    random.seed(seed)
    return [generate_sample() for _ in range(n_samples)]


def save_csv(rows, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "depart",
                "destination",
                "distance_km",
                "heure_depart",
                "places_disponibles",
                "prix",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate synthetic ride pricing data (seeded, reproducible)."
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=1200,
        help="Number of samples to generate (default: 1200)",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=DEFAULT_SEED,
        help="Random seed (default: 42)",
    )
    parser.add_argument(
        "--out",
        type=str,
        default=None,
        help="Output CSV path (default: data/generated_rides.csv next to this script)",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    base_dir = Path(__file__).resolve().parent
    default_out = base_dir / "data" / "generated_rides.csv"
    out_path = Path(args.out) if args.out else default_out

    rows = generate_dataset(args.samples, seed=args.seed)
    save_csv(rows, str(out_path))
    print(
        f"Generated {len(rows)} samples -> {out_path} (seed={args.seed}) at {datetime.now()}"
    )


if __name__ == "__main__":
    main()
