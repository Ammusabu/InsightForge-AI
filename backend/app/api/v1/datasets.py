from fastapi import APIRouter

from app.common.dataset_store import list_datasets
from app.core.responses import success_response
from fastapi import HTTPException
from app.common.dataset_reader import get_dataset

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"],
)
from pathlib import Path
PROJECT_ROOT = Path(__file__).resolve().parents[4]

RAW_DIR = PROJECT_ROOT / "datasets" / "raw"

PROFILE_DIR = PROJECT_ROOT / "datasets" / "profiles"

@router.get("")
def get_datasets():
    return success_response(
        message="Datasets fetched successfully.",
        data=list_datasets(),
    )

@router.get("/{dataset_id}")
def get_dataset_details(dataset_id: str):
    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    return success_response(
        message="Dataset loaded successfully.",
        data=dataset,
    )

@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str):

    dataset = get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    csv_file = RAW_DIR / dataset["filename"]

    profile_file = PROFILE_DIR / f"{dataset_id}.json"

    if csv_file.exists():
        csv_file.unlink()

    if profile_file.exists():
        profile_file.unlink()

    return success_response(
        message="Dataset deleted successfully.",
    )