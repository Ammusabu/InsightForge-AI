from pathlib import Path
import shutil
import json
import threading
from datetime import datetime
import pandas as pd
from fastapi import HTTPException, UploadFile
from app.analytics.pipeline import process_dataset
from app.common.dataset_registry import generate_dataset_id

PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAW_DATASET_DIR = PROJECT_ROOT / "datasets" / "raw"
RAW_DATASET_DIR.mkdir(parents=True, exist_ok=True)

PROCESSING_STATUS_FILE = PROJECT_ROOT / "datasets" / "processing_status.json"

def update_processing_status(dataset_id: str, status: str, progress: int, message: str = ""):
    status_data = {}
    if PROCESSING_STATUS_FILE.exists():
        with open(PROCESSING_STATUS_FILE, 'r') as f:
            status_data = json.load(f)
    
    status_data[dataset_id] = {
        "status": status,
        "progress": progress,
        "message": message,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    with open(PROCESSING_STATUS_FILE, 'w') as f:
        json.dump(status_data, f, indent=2)

def upload_csv(file: UploadFile) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is missing.")
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    file_path = RAW_DATASET_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    dataset_id = generate_dataset_id()
    
    update_processing_status(dataset_id, "processing", 10, "File saved, starting analysis...")
    
    thread = threading.Thread(
        target=process_dataset_async,
        args=(dataset_id, file_path, file.filename)
    )
    thread.daemon = True
    thread.start()
    
    return {
        "dataset_id": dataset_id,
        "filename": file.filename,
        "status": "processing",
        "message": "Dataset upload started. Analysis running in background."
    }

def process_dataset_async(dataset_id: str, file_path: Path, filename: str):
    try:
        update_processing_status(dataset_id, "processing", 30, "Reading dataset...")
        dataframe = pd.read_csv(file_path)
        
        update_processing_status(dataset_id, "processing", 50, "Running analytics pipeline...")
        analytics_result = process_dataset(
            dataframe=dataframe,
            dataset_id=dataset_id,
            filename=filename,
        )
        
        update_processing_status(dataset_id, "processing", 90, "Finalizing results...")
        
        # OPTIONAL: Only save if parquet libraries are available
        try:
            import pyarrow
            cache_file = PROJECT_ROOT / "datasets" / "processed" / f"{dataset_id}.parquet"
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            dataframe.to_parquet(cache_file)
        except ImportError:
            # Skip parquet if not available - the profile already has the data
            pass
        
        update_processing_status(dataset_id, "ready", 100, "Dataset ready for analysis!")
        
    except Exception as e:
        update_processing_status(dataset_id, "error", 0, f"Error: {str(e)}")

def get_processing_status(dataset_id: str):
    if PROCESSING_STATUS_FILE.exists():
        with open(PROCESSING_STATUS_FILE, 'r') as f:
            status_data = json.load(f)
            return status_data.get(dataset_id, {"status": "not_found", "progress": 0})
    return {"status": "not_found", "progress": 0}