import pandas as pd


def generate_correlation(df: pd.DataFrame):
    numeric_df = df.select_dtypes(include="number")

    if numeric_df.shape[1] < 2:
        return []

    correlation = numeric_df.corr().round(2)

    return {
        "columns": correlation.columns.tolist(),
        "matrix": correlation.values.tolist(),
    }