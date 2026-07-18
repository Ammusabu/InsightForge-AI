from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.analytics.analytics_engine import load_dataset
from app.common.dataset_reader import get_dataset
from app.core.responses import success_response
from app.forecasting.forecast_engine import forecast_column

router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"],
)


class ForecastRequest(BaseModel):
    dataset_id: str
    column: str
    periods: int


@router.post("/")
def generate_forecast(
    request: ForecastRequest,
):
    dataset = get_dataset(request.dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    dataframe = load_dataset(
        dataset["filename"]
    )

    try:
        forecast = forecast_column(
            dataframe,
            request.column,
            request.periods,
        )

        return success_response(
            message="Forecast generated.",
            data={
                "forecast": forecast,
            },
        )

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )