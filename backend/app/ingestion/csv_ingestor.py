from pathlib import Path
import shutil

import pandas as pd
from fastapi import HTTPException, UploadFile

from app.analytics.pipeline import process_dataset
from app.common.dataset_registry import generate_dataset_id

PROJECT_ROOT = Path(__file__).resolve().parents[3]

RAW_DATASET_DIR = PROJECT_ROOT / "datasets" / "raw"
RAW_DATASET_DIR.mkdir(parents=True, exist_ok=True)


def upload_csv(file: UploadFile) -> dict:
    """
    Upload a CSV dataset and trigger the analytics pipeline.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed.",
        )

    # Save raw dataset
    file_path = RAW_DATASET_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read dataset
    dataframe = pd.read_csv(file_path)

    # Generate dataset ID
    dataset_id = generate_dataset_id()

    # Run analytics pipeline
    analytics_result = process_dataset(
        dataframe=dataframe,
        dataset_id=dataset_id,
        filename=file.filename,
    )

    return {
        "dataset_id": dataset_id,
        "filename": file.filename,
        "raw_dataset": str(file_path.relative_to(PROJECT_ROOT)),
        **analytics_result,
    }