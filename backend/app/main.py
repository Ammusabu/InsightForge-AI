from fastapi import FastAPI

from app.api.v1.health import router as health_router
from app.api.v1.upload import router as upload_router
from app.core.config import settings
from app.api.v1.datasets import router as datasets_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.charts import router as charts_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.chat import router as chat_router
from app.forecasting.router import (
    router as forecast_router,
)

from app.api.v1.filters import router as filters_router
from app.api.v1.report import router as report_router
from app.api.v1.processing import router as processing_router
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://insight-forge-ai.vercel.app",
        "https://insight-forge-qkyi3i1w6-ammuttya20-2110s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Home"])
def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "environment": settings.environment,
    }


app.include_router(
    health_router,
    prefix="/api/v1",
)

app.include_router(
    upload_router,
    prefix="/api/v1",
)

app.include_router(
    datasets_router,
    prefix="/api/v1",
)

app.include_router(
    dashboard_router,
    prefix="/api/v1",
)

app.include_router(
    charts_router,
    prefix="/api/v1",
)

app.include_router(
    analytics_router,
    prefix="/api/v1",
)

app.include_router(
    chat_router,
    prefix="/api/v1",
)
app.include_router(
    report_router,
    prefix="/api/v1",
)

app.include_router(
    forecast_router,
    prefix="/api/v1",
)

app.include_router(
    filters_router,
    prefix="/api/v1",
)

app.include_router(
    processing_router,
    prefix="/api/v1",
)