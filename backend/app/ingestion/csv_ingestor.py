from pathlib import Path
import shutil

import pandas as pd
from fastapi import HTTPException, UploadFile

# Project root (InsightForge-AI)
PROJECT_ROOT = Path(__file__).resolve().parents[3]

RAW_DATASET_DIR = PROJECT_ROOT / "datasets" / "raw"
RAW_DATASET_DIR.mkdir(parents=True, exist_ok=True)


def upload_csv(file: UploadFile) -> dict:
    """
    Validate, save, and inspect an uploaded CSV file.
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

    file_path = RAW_DATASET_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    dataframe = pd.read_csv(file_path)

    return {
        "filename": file.filename,
        "saved_path": str(file_path.relative_to(PROJECT_ROOT)),
        "rows": len(dataframe),
        "columns": len(dataframe.columns),
        "column_names": dataframe.columns.tolist(),
        "size_kb": round(file_path.stat().st_size / 1024, 2),
    }