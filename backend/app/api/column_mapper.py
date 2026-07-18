from dataclasses import dataclass
import re
import pandas as pd


@dataclass
class DatasetSchema:
    visitors: str | None = None
    revenue: str | None = None
    destination: str | None = None
    country: str | None = None
    state: str | None = None
    category: str | None = None
    rating: str | None = None
    latitude: str | None = None
    longitude: str | None = None
    date: str | None = None


ALIASES = {
    "visitors": [
        "visitors",
        "visitor",
        "visitorcount",
        "tourists",
        "touristcount",
        "footfall",
        "numberofvisitors",
        "visitornumbers",
    ],
    "revenue": [
        "revenue",
        "income",
        "sales",
        "amount",
        "earnings",
        "tourismrevenue",
        "totalrevenue",
    ],
    "destination": [
        "destination",
        "place",
        "location",
        "city",
        "touristspot",
        "attraction",
        "site",
    ],
    "country": [
        "country",
        "nation",
        "countryname",
    ],
    "state": [
        "state",
        "province",
        "region",
    ],
    "category": [
        "category",
        "type",
        "segment",
    ],
    "rating": [
        "rating",
        "review",
        "score",
        "stars",
        "reviewscore",
    ],
    "latitude": [
        "latitude",
        "lat",
        "y",
    ],
    "longitude": [
        "longitude",
        "lon",
        "lng",
        "long",
        "x",
    ],
    "date": [
        "date",
        "year",
        "month",
        "time",
        "timestamp",
    ],
}


def normalize(text: str) -> str:
    """
    Convert column names into a comparable format.

    Examples:
    Visitor Count
    Visitor_Count
    visitor-count
    VISITOR COUNT

    -> visitorcount
    """
    return re.sub(r"[^a-z0-9]", "", text.lower())


def detect_schema(df: pd.DataFrame) -> DatasetSchema:
    """
    Automatically detect important tourism columns.

    Returns:
        DatasetSchema
    """

    schema = DatasetSchema()

    for field, aliases in ALIASES.items():

        for column in df.columns:

            normalized_column = normalize(column)

            if normalized_column.startswith(normalize(alias)):
                setattr(schema, field, column)
                break
                

    return schema


def print_schema(schema: DatasetSchema):
    """
    Debug helper.
    """

    print("Detected Dataset Schema")
    print("-" * 40)

    for key, value in schema.__dict__.items():
        print(f"{key:15}: {value}")