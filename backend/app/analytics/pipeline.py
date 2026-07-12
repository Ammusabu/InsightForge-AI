from pathlib import Path

import pandas as pd

from app.analytics.cleaner import clean_dataset
from app.analytics.profiler import profile_dataset
from app.analytics.profile_storage import save_profile

PROJECT_ROOT = Path(__file__).resolve().parents[3]


def process_dataset(
    dataframe: pd.DataFrame,
    dataset_id: str,
    filename: str,
) -> dict:
    """
    Execute the analytics pipeline.
    """

    cleaned_dataframe = clean_dataset(dataframe)

    processed_path = (
        PROJECT_ROOT
        / "datasets"
        / "processed"
        / filename
    )

    processed_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    cleaned_dataframe.to_csv(
        processed_path,
        index=False,
    )

    profile = profile_dataset(cleaned_dataframe)

    profile_path = save_profile(
        dataset_id,
        profile,
    )

    return {
        "processed_dataset": str(
            processed_path.relative_to(PROJECT_ROOT)
        ),
        "profile_path": profile_path,
        "profile": profile,
    }