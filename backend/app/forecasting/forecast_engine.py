import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression


def forecast_column(
    df: pd.DataFrame,
    column: str,
    periods: int,
):
    """
    Forecast future values for a numeric column
    using Linear Regression.
    """

    if column not in df.columns:
        raise ValueError(
            f"{column} not found."
        )

    values = df[column].dropna()

    if not pd.api.types.is_numeric_dtype(values):
        raise ValueError(
            f"{column} is not numeric."
        )

    X = np.arange(len(values)).reshape(-1, 1)
    y = values.values

    model = LinearRegression()
    model.fit(X, y)

    future_X = np.arange(
        len(values),
        len(values) + periods,
    ).reshape(-1, 1)

    prediction = model.predict(future_X)

    return prediction.tolist()