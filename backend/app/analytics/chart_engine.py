import pandas as pd


def generate_line_chart(df: pd.DataFrame):
    """
    Generate line chart data from the first numeric column.
    """

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns

    if len(numeric_columns) == 0:
        return []

    column = numeric_columns[0]

    values = df[column].head(20).tolist()

    return [
        {
            "index": index + 1,
            "value": value,
        }
        for index, value in enumerate(values)
    ]


def generate_bar_chart(df: pd.DataFrame):
    """
    Generate bar chart from the first categorical column.
    """

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns

    if len(categorical_columns) == 0:
        return []

    column = categorical_columns[0]

    counts = (
        df[column]
        .value_counts()
        .head(10)
    )

    return [
        {
            "name": name,
            "value": int(value),
        }
        for name, value in counts.items()
    ]