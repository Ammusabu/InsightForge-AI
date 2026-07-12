import pandas as pd


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Basic cleaning pipeline.
    """

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Remove rows where every value is missing
    df = df.dropna(how="all")

    # Remove leading/trailing spaces from column names
    df.columns = df.columns.str.strip()

    return df