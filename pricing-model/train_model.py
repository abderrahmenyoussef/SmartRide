from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DEFAULT_SEED = 42
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATA = BASE_DIR / "data" / "generated_rides.csv"
DEFAULT_MODEL = BASE_DIR / "models" / "price_model.pkl"
TEST_SIZE = 0.15
VAL_SIZE = 0.15


def load_dataset(csv_path: Path) -> pd.DataFrame:
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset introuvable: {csv_path}")
    df = pd.read_csv(csv_path)
    expected_cols = {
        "depart",
        "destination",
        "distance_km",
        "heure_depart",
        "places_disponibles",
        "prix",
    }
    if not expected_cols.issubset(df.columns):
        raise ValueError(f"Colonnes manquantes. Attendu: {expected_cols}, trouvé: {df.columns}")
    return df


def build_pipeline(random_state: int = DEFAULT_SEED) -> Pipeline:
    cat_cols = ["depart", "destination"]
    num_cols = ["distance_km", "heure_depart", "places_disponibles"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ],
        remainder="passthrough",
    )

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=random_state,
        n_jobs=-1,
        min_samples_leaf=2,
    )

    return Pipeline(steps=[("preprocess", preprocessor), ("model", model)])


def evaluate(model: Pipeline, X, y, split_name: str):
    preds = model.predict(X)
    mae = mean_absolute_error(y, preds)
    mse = mean_squared_error(y, preds)
    rmse = mse ** 0.5
    r2 = r2_score(y, preds)
    print(f"[{split_name}] MAE={mae:.2f} | RMSE={rmse:.2f} | R2={r2:.3f}")


def main():
    df = load_dataset(DEFAULT_DATA)

    X = df[["depart", "destination", "distance_km", "heure_depart", "places_disponibles"]]
    y = df["prix"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=DEFAULT_SEED
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=VAL_SIZE, random_state=DEFAULT_SEED
    )

    pipeline = build_pipeline(random_state=DEFAULT_SEED)
    pipeline.fit(X_train, y_train)

    evaluate(pipeline, X_train, y_train, "train")
    evaluate(pipeline, X_val, y_val, "val")
    evaluate(pipeline, X_test, y_test, "test")

    DEFAULT_MODEL.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, DEFAULT_MODEL)
    print(f"Modèle sauvegardé -> {DEFAULT_MODEL}")


if __name__ == "__main__":
    main()
