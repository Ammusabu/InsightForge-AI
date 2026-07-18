from fastapi import APIRouter

from app.common.dataset_reader import get_dataset_dataframe

router = APIRouter(
    prefix="/filters",
    tags=["Filters"],
)


@router.get("/{dataset_id}")
def get_filters(dataset_id: str):

    df = get_dataset_dataframe(dataset_id)
    print(df.columns.tolist())

    if df is None:
        return {
            "categories": [],
            "countries": [],
        }

    # Convert all column names to lowercase
    column_map = {
        col.lower(): col
        for col in df.columns
    }

    filters = {
        "categories": [],
        "countries": [],
    }

    # Category
    if "category" in column_map:
        column = column_map["category"]

        filters["categories"] = sorted(
            df[column]
            .dropna()
            .astype(str)
            .unique()
            .tolist()
        )

    # Country
    if "country" in column_map:
        column = column_map["country"]

        filters["countries"] = sorted(
            df[column]
            .dropna()
            .astype(str)
            .unique()
            .tolist()
        )

    return filters