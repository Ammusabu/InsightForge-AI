from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ai.chat_engine import ask_dataset
from app.reports.report_generator import generate_report
from app.analytics.analytics_engine import load_dataset
from app.common.dataset_reader import get_dataset
from app.core.responses import success_response

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"],
)


class ChatRequest(BaseModel):
    dataset_id: str
    question: str


class ReportRequest(BaseModel):
    dataset_id: str


@router.post("/")
def chat(request: ChatRequest):

    dataset = get_dataset(request.dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(dataset["filename"])

    answer = ask_dataset(
        dataframe,
        request.question,
    )

    return success_response(
        message="Answer generated.",
        data={
            "answer": answer,
        },
    )


@router.post("/report")
def report(request: ReportRequest):

    dataset = get_dataset(
        request.dataset_id
    )

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(
        dataset["filename"]
    )

    report = generate_report(
        dataframe
    )

    return success_response(
        message="Report generated.",
        data={
            "report": report,
        },
    )