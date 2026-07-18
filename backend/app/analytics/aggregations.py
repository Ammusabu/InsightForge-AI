import pandas as pd


def get_max(df: pd.DataFrame, value_col: str, label_col: str):
    row = df.loc[df[value_col].idxmax()]
    return {
        "label": row[label_col],
        "value": row[value_col]
    }


def get_min(df: pd.DataFrame, value_col: str, label_col: str):
    row = df.loc[df[value_col].idxmin()]
    return {
        "label": row[label_col],
        "value": row[value_col]
    }


def get_average(df: pd.DataFrame, column: str):
    return float(df[column].mean())


def get_total(df: pd.DataFrame, column: str):
    return float(df[column].sum())


def get_count(df: pd.DataFrame, column: str):
    return int(df[column].nunique())


def top_n(df: pd.DataFrame, value_col: str, n: int = 5):
    return (
        df.nlargest(n, value_col)
        .to_dict(orient="records")
    )


def bottom_n(df: pd.DataFrame, value_col: str, n: int = 5):
    return (
        df.nsmallest(n, value_col)
        .to_dict(orient="records")
    )


def group_sum(df: pd.DataFrame, group_col: str, value_col: str):
    return (
        df.groupby(group_col)[value_col]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )


def group_average(df: pd.DataFrame, group_col: str, value_col: str):
    return (
        df.groupby(group_col)[value_col]
        .mean()
        .reset_index()
        .to_dict(orient="records")
    )