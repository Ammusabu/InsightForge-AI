import pandas as pd


def profile_dataset(df: pd.DataFrame) -> dict:
    """
    Generate a basic profile for a dataset.
    """

    columns = []

    for column in df.columns:
        columns.append(
            {
                "name": column,
                "dtype": str(df[column].dtype),
                "missing": int(df[column].isna().sum()),
                "unique": int(df[column].nunique()),
            }
        )

    return {
        "rows": len(df),
        "columns": len(df.columns),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_mb": round(
            df.memory_usage(deep=True).sum() / (1024 * 1024),
            2,
        ),
        "column_profile": columns,
    }