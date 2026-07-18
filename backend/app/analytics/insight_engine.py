import pandas as pd


def generate_insights(df: pd.DataFrame):

    insights = []

    insights.append(
        f"Dataset contains {len(df)} rows."
    )

    insights.append(
        f"Dataset contains {len(df.columns)} columns."
    )

    missing = int(df.isnull().sum().sum())

    if missing == 0:
        insights.append(
            "No missing values detected."
        )
    else:
        insights.append(
            f"{missing} missing values detected."
        )

    duplicate = int(df.duplicated().sum())

    if duplicate == 0:
        insights.append(
            "No duplicate rows detected."
        )
    else:
        insights.append(
            f"{duplicate} duplicate rows detected."
        )

    numeric = df.select_dtypes(
        include="number"
    ).columns

    insights.append(
        f"{len(numeric)} numeric columns available."
    )

    categorical = df.select_dtypes(
        include="object"
    ).columns

    insights.append(
        f"{len(categorical)} categorical columns available."
    )

    return insights