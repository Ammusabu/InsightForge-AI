import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]

PROFILE_DIR = PROJECT_ROOT / "datasets" / "profiles"
PROFILE_DIR.mkdir(parents=True, exist_ok=True)


def save_profile(
    dataset_id: str,
    filename: str,
    profile: dict,
) -> str:
    """
    Save dataset profile as JSON.
    """

    profile["filename"] = filename

    profile_path = PROFILE_DIR / f"{dataset_id}.json"

    with open(profile_path, "w", encoding="utf-8") as file:
        json.dump(profile, file, indent=4)

    return str(profile_path.relative_to(PROJECT_ROOT))