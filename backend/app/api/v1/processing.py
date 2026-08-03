from fastapi import APIRouter, HTTPException
from app.ingestion.csv_ingestor import get_processing_status
from app.core.responses import success_response

router = APIRouter(
    prefix="/processing",
    tags=["Processing"],
)

@router.get("/{dataset_id}")
def check_processing_status(dataset_id: str):
    status = get_processing_status(dataset_id)
    if status["status"] == "not_found":
        raise HTTPException(status_code=404, detail="Dataset not found")
    return success_response(
        message="Processing status retrieved",
        data=status
    )