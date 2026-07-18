from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = PROJECT_ROOT / "datasets" / "raw"


def load_dataset(filename: str) -> pd.DataFrame:
    csv_path = RAW_DIR / filename
    return pd.read_csv(csv_path)


def detect_numeric_columns(df: pd.DataFrame):
    return df.select_dtypes(include="number").columns.tolist()


def detect_categorical_columns(df: pd.DataFrame):
    return df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()


import warnings

def detect_datetime_columns(df: pd.DataFrame):
    """
    Detect actual datetime columns.
    Ignore numeric columns.
    """

    datetime_columns = []

    for column in df.columns:

        if pd.api.types.is_numeric_dtype(df[column]):
            continue

        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")

                parsed = pd.to_datetime(
                    df[column],
                    errors="coerce",
                )

            success_rate = parsed.notna().sum() / len(df)

            if success_rate >= 0.8:
                datetime_columns.append(column)

        except Exception:
            pass

    return datetime_columns


def dataset_overview(df: pd.DataFrame):
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_mb": float(
            round(
                df.memory_usage(deep=True).sum()
                / 1024
                / 1024,
                2,
            )
        ),
        "numeric_columns": detect_numeric_columns(df),
        "categorical_columns": detect_categorical_columns(df),
        "datetime_columns": detect_datetime_columns(df),
    }