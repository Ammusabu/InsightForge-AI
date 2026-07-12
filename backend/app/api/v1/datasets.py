from fastapi import APIRouter

from app.common.dataset_store import list_datasets
from app.core.responses import success_response

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"],
)


@router.get("")
def get_datasets():
    return success_response(
        message="Datasets fetched successfully.",
        data=list_datasets(),
    )