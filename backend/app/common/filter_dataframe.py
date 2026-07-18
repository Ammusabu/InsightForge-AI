import pandas as pd


def apply_filters(
    df: pd.DataFrame,
    category: str | None = None,
    country: str | None = None,
    search: str | None = None,
):

    if category:
        if "Category" in df.columns:
            df = df[df["Category"] == category]

    if country:
        if "Country" in df.columns:
            df = df[df["Country"] == country]

    if search:

        search = search.lower()

        df = df[
            df.astype(str)
            .apply(
                lambda row:
                row.str.lower().str.contains(search).any(),
                axis=1,
            )
        ]

    return df