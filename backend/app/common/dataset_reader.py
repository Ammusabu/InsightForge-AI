import json
from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[3]

PROFILE_DIR = PROJECT_ROOT / "datasets" / "profiles"
RAW_DIR = PROJECT_ROOT / "datasets" / "raw"


def get_dataset(dataset_id: str):

    print("Dataset ID:", dataset_id)

    profile_path = PROFILE_DIR / f"{dataset_id}.json"
    print("Profile Path:", profile_path)

    if not profile_path.exists():
        print("❌ Profile not found")
        return None

    with open(profile_path, "r", encoding="utf-8") as file:
        profile = json.load(file)

    print("Profile:", profile)

    filename = profile.get("filename")
    print("Filename:", filename)

    if not filename:
        print("❌ Filename missing")
        return None

    csv_path = RAW_DIR / filename
    print("CSV Path:", csv_path)

    if not csv_path.exists():
        print("❌ CSV not found")
        return None

    print("✅ Dataset loaded successfully")

    dataframe = pd.read_csv(csv_path)

    return {
        "dataset_id": dataset_id,
        "filename": filename,
        "profile": profile,
        "columns": dataframe.columns.tolist(),
        "preview": dataframe.head(10).to_dict(orient="records"),
    }

def get_dataset_dataframe(dataset_id: str):
    profile_path = PROFILE_DIR / f"{dataset_id}.json"

    if not profile_path.exists():
        return None

    with open(profile_path, "r", encoding="utf-8") as file:
        profile = json.load(file)

    filename = profile.get("filename")

    if not filename:
        return None

    csv_path = RAW_DIR / filename

    if not csv_path.exists():
        return None

    return pd.read_csv(csv_path)