from fastapi import APIRouter

from app.analytics.chart_service import get_monthly_data
from app.core.responses import success_response

router = APIRouter(
    prefix="/charts",
    tags=["Charts"],
)


@router.get("/line")
def line_chart():

    return success_response(
        message="Chart data",
        data=get_monthly_data(),
    )