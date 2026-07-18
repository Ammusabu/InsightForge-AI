from fastapi import APIRouter

from app.common.dataset_store import list_datasets
from app.core.responses import success_response

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def dashboard_summary():
    datasets = list_datasets()

    total_rows = sum(
        dataset["profile"]["rows"]
        for dataset in datasets
    )

    total_columns = sum(
        dataset["profile"]["columns"]
        for dataset in datasets
    )

    return success_response(
        message="Dashboard summary",
        data={
            "datasets": len(datasets),
            "rows": total_rows,
            "columns": total_columns,
        },
    )