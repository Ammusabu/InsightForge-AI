import pandas as pd


def build_dataset_summary(df: pd.DataFrame) -> dict:
    """
    Build a structured summary of the dataset.
    """

    numeric = df.select_dtypes(include="number")
    categorical = df.select_dtypes(include=["object", "category"])

    summary = {
        "rows": len(df),
        "columns": len(df.columns),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
        "numeric_columns": numeric.columns.tolist(),
        "categorical_columns": categorical.columns.tolist(),
        "statistics": {},
        "top_categories": {},
    }

    for column in numeric.columns:
        summary["statistics"][column] = {
            "mean": round(float(df[column].mean()), 2),
            "min": round(float(df[column].min()), 2),
            "max": round(float(df[column].max()), 2),
            "std": round(float(df[column].std()), 2),
        }

    for column in categorical.columns:
        summary["top_categories"][column] = (
            df[column]
            .value_counts()
            .head(5)
            .to_dict()
        )

    return summary