from fastapi import APIRouter, File, UploadFile

from app.core.responses import success_response
from app.ingestion import csv_ingestor

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...)
):
    result = csv_ingestor.upload_csv(file)

    return success_response(
        message="Dataset uploaded successfully.",
        data=result,
    )