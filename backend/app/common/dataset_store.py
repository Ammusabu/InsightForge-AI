import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]

PROFILE_DIR = PROJECT_ROOT / "datasets" / "profiles"


def list_datasets() -> list:
    datasets = []

    if not PROFILE_DIR.exists():
        return datasets

    for file in PROFILE_DIR.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            profile = json.load(f)

        datasets.append(
            {
                "dataset_id": file.stem,
                "profile": profile,
            }
        )

    return datasets