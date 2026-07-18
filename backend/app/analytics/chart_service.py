from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_DATASET_DIR = PROJECT_ROOT / "datasets" / "raw"


def get_monthly_data():
    """
    Returns monthly data for the latest uploaded dataset.
    """

    csv_files = sorted(
        RAW_DATASET_DIR.glob("*.csv"),
        key=lambda x: x.stat().st_mtime,
        reverse=True,
    )

    if not csv_files:
        return []

    dataframe = pd.read_csv(csv_files[0])

    numeric_columns = dataframe.select_dtypes(
        include="number"
    ).columns

    if len(numeric_columns) == 0:
        return []

    column = numeric_columns[0]

    values = dataframe[column].head(12).tolist()

    months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    return [
        {
            "month": months[i],
            "value": values[i],
        }
        for i in range(min(len(values), 12))
    ]