from fastapi import APIRouter, HTTPException

from app.common.dataset_reader import get_dataset
from app.analytics.analytics_engine import load_dataset
from app.reports.report_generator import generate_report
from app.core.responses import success_response

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/{dataset_id}")
def report(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found."
        )

    dataframe = load_dataset(
        dataset["filename"]
    )

    report = generate_report(dataframe)

    return success_response(
        message="Report generated successfully.",
        data=report,
    )